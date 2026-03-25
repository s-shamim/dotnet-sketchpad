#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.Data.Sqlite@9.0.4

using System.Diagnostics;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder();
builder.Services.AddSingleton<BatchState>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// ─── SQLite init ─────────────────────────────────────────────────────────────
var connStr = builder.Configuration.GetConnectionString("Default") ?? "Data Source=tenants.db";

using (var conn = new SqliteConnection(connStr))
{
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = """
        CREATE TABLE IF NOT EXISTS tenants (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id   TEXT    UNIQUE NOT NULL,
            status      TEXT    NOT NULL DEFAULT 'pending',
            status_code INTEGER,
            duration_ms INTEGER,
            error_detail TEXT,
            created_at  TEXT    DEFAULT (datetime('now')),
            updated_at  TEXT    DEFAULT (datetime('now'))
        );
        """;
    cmd.ExecuteNonQuery();

    // Crash recovery: any tenant stuck in 'processing' goes back to 'pending'
    cmd.CommandText = "UPDATE tenants SET status='pending', updated_at=datetime('now') WHERE status='processing'";
    cmd.ExecuteNonQuery();
}

// ─── POST /api/tenants/load ───────────────────────────────────────────────────
app.MapPost("/api/tenants/load", (LoadCsvRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.CsvContent))
        return Results.BadRequest("CSV content is required");

    var tenantIds = ParseCsv(req.CsvContent).ToList();
    int loaded = 0;

    using var conn = new SqliteConnection(connStr);
    conn.Open();
    using var tx = conn.BeginTransaction();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "INSERT OR IGNORE INTO tenants (tenant_id) VALUES (@tid)";
    var param = cmd.Parameters.Add("@tid", SqliteType.Text);

    foreach (var tid in tenantIds)
    {
        param.Value = tid;
        loaded += cmd.ExecuteNonQuery();
    }
    tx.Commit();

    var total = CountTenants(connStr);
    return Results.Ok(new { loaded, skipped = tenantIds.Count - loaded, total });
});

// ─── GET /api/tenants ─────────────────────────────────────────────────────────
app.MapGet("/api/tenants", () =>
{
    var tenants = new List<TenantRow>();
    using var conn = new SqliteConnection(connStr);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT tenant_id, status, status_code, duration_ms, error_detail FROM tenants ORDER BY id";
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        tenants.Add(new TenantRow
        {
            TenantId    = reader.GetString(0),
            Status      = reader.GetString(1),
            StatusCode  = reader.IsDBNull(2) ? null : reader.GetInt32(2),
            DurationMs  = reader.IsDBNull(3) ? null : reader.GetInt32(3),
            ErrorDetail = reader.IsDBNull(4) ? null : reader.GetString(4)
        });
    }

    var summary = new
    {
        pending    = tenants.Count(t => t.Status == "pending"),
        processing = tenants.Count(t => t.Status == "processing"),
        success    = tenants.Count(t => t.Status == "success"),
        error      = tenants.Count(t => t.Status == "error"),
        total      = tenants.Count
    };

    return Results.Ok(new { summary, tenants });
});

// ─── DELETE /api/tenants ──────────────────────────────────────────────────────
app.MapDelete("/api/tenants", (BatchState state) =>
{
    if (state.Status == "running")
        return Results.Conflict("Cannot clear data while a batch is running");

    using var conn = new SqliteConnection(connStr);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "DELETE FROM tenants";
    var deleted = cmd.ExecuteNonQuery();

    state.Reset();
    return Results.Ok(new { deleted });
});

// ─── GET /api/batch/status ────────────────────────────────────────────────────
app.MapGet("/api/batch/status", (BatchState state) =>
    Results.Ok(new { state.Status, state.DummyMode }));

// ─── POST /api/batch/start ────────────────────────────────────────────────────
app.MapPost("/api/batch/start", async (StartBatchRequest req, BatchState state) =>
{
    if (state.Status == "running")
        return Results.BadRequest("A batch is already running");

    if (!req.DummyMode && string.IsNullOrWhiteSpace(req.AuthToken))
        return Results.BadRequest("Auth token is required when not in dummy mode");

    var pending = CountPending(connStr);
    if (pending == 0)
        return Results.BadRequest("No pending tenants to process");

    state.AuthToken = req.AuthToken ?? "";
    state.DelayMs   = req.DelayMs ?? 500;
    state.DummyMode = req.DummyMode;
    state.Status    = "running";
    state.StopRequested = false;
    state.CancellationSource = new CancellationTokenSource();

    var deleteUrl = builder.Configuration["TenantApi:DeleteUrl"] ?? "";
    _ = ProcessBatchAsync(state, connStr, deleteUrl);

    return Results.Ok(new { status = "started" });
});

// ─── POST /api/batch/pause ────────────────────────────────────────────────────
app.MapPost("/api/batch/pause", (BatchState state) =>
{
    if (state.Status != "running")
        return Results.BadRequest("Batch is not running");

    state.Status = "paused";
    state.CancellationSource?.Cancel();
    return Results.Ok(new { state.Status });
});

// ─── POST /api/batch/resume ───────────────────────────────────────────────────
app.MapPost("/api/batch/resume", (BatchState state) =>
{
    if (state.Status != "paused")
        return Results.BadRequest("Batch is not paused");

    state.Status = "running";
    state.StopRequested = false;
    state.CancellationSource = new CancellationTokenSource();

    var deleteUrl = builder.Configuration["TenantApi:DeleteUrl"] ?? "";
    _ = ProcessBatchAsync(state, connStr, deleteUrl);
    return Results.Ok(new { state.Status });
});

// ─── POST /api/batch/stop ─────────────────────────────────────────────────────
app.MapPost("/api/batch/stop", (BatchState state) =>
{
    if (state.Status != "running" && state.Status != "paused")
        return Results.BadRequest("No active batch to stop");

    state.StopRequested = true;
    state.CancellationSource?.Cancel();

    // If already paused, reset processing→pending immediately
    if (state.Status == "paused")
    {
        ResetProcessingToPending(connStr);
        state.Reset();
    }
    else
    {
        state.Status = "stopping";
    }

    return Results.Ok(new { status = state.Status });
});

// ─── POST /api/dummy/delete-tenant ───────────────────────────────────────────
app.MapPost("/api/dummy/delete-tenant", async (DummyDeleteRequest req) =>
{
    var delay = Random.Shared.Next(1000, 5001);
    await Task.Delay(delay);

    // ~10% failure rate
    if (Random.Shared.NextDouble() < 0.10)
        return Results.Problem($"Simulated failure for tenant {req.TenantId}", statusCode: 500);

    return Results.Ok(new { success = true, tenantId = req.TenantId, simulatedDelayMs = delay });
});

// ─── Background processing ────────────────────────────────────────────────────
async Task ProcessBatchAsync(BatchState state, string connectionString, string deleteUrl)
{
    using var client = new HttpClient();

    try
    {
        while (true)
        {
            // Check cancellation before fetching next tenant
            if (state.CancellationSource?.Token.IsCancellationRequested == true)
                break;

            var tenantId = GetNextPending(connectionString);
            if (tenantId is null)
            {
                state.Status = "completed";
                return;
            }

            // Mark as processing
            UpdateTenantStatus(connectionString, tenantId, "processing");

            var stopwatch = Stopwatch.StartNew();
            string resultStatus = "error";
            int? statusCode = null;
            string? errorDetail = null;

            try
            {
                using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(
                    timeoutCts.Token,
                    state.CancellationSource?.Token ?? CancellationToken.None);

                HttpResponseMessage response;

                if (state.DummyMode)
                {
                    // Simulate in-process — no HTTP call needed
                    response = await SimulateDummyDeleteAsync(tenantId);
                }
                else
                {
                    var body = System.Text.Json.JsonSerializer.Serialize(new { tenantId });
                    var content = new StringContent(body, System.Text.Encoding.UTF8, "application/json");
                    var msg = new HttpRequestMessage(HttpMethod.Delete, deleteUrl) { Content = content };
                    msg.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", state.AuthToken);
                    response = await client.SendAsync(msg, linkedCts.Token);
                }

                stopwatch.Stop();
                statusCode = (int)response.StatusCode;
                resultStatus = response.IsSuccessStatusCode ? "success" : "error";

                if (!response.IsSuccessStatusCode)
                    errorDetail = await response.Content.ReadAsStringAsync();
            }
            catch (OperationCanceledException)
            {
                stopwatch.Stop();
                // Put this tenant back to pending — it was never finished
                UpdateTenantStatus(connectionString, tenantId, "pending");
                break;
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                errorDetail = ex.Message;
            }

            // Persist result (only if we didn't revert to pending above)
            SaveTenantResult(connectionString, tenantId, resultStatus, statusCode, (int)stopwatch.ElapsedMilliseconds, errorDetail);

            // Check cancellation again before delay
            if (state.CancellationSource?.Token.IsCancellationRequested == true)
                break;

            // Interruptible delay between tenants
            try
            {
                await Task.Delay(state.DelayMs, state.CancellationSource?.Token ?? CancellationToken.None);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }
    }
    finally
    {
        if (state.StopRequested)
        {
            ResetProcessingToPending(connectionString);
            state.Reset();
        }
        else if (state.Status == "stopping")
        {
            ResetProcessingToPending(connectionString);
            state.Reset();
        }
        else if (state.Status != "completed")
        {
            state.Status = "paused";
        }
    }
}

// ─── Dummy simulation (in-process, no HTTP) ──────────────────────────────────
async Task<HttpResponseMessage> SimulateDummyDeleteAsync(string tenantId)
{
    var delayMs = Random.Shared.Next(1000, 5001);
    await Task.Delay(delayMs);

    if (Random.Shared.NextDouble() < 0.10)
    {
        var failResponse = new HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError);
        failResponse.Content = new StringContent($"Simulated failure for tenant {tenantId}");
        return failResponse;
    }

    var okResponse = new HttpResponseMessage(System.Net.HttpStatusCode.OK);
    okResponse.Content = new StringContent($"{{\"success\":true,\"tenantId\":\"{tenantId}\"}}");
    return okResponse;
}

// ─── SQLite helpers ───────────────────────────────────────────────────────────
string? GetNextPending(string cs)
{
    using var conn = new SqliteConnection(cs);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT tenant_id FROM tenants WHERE status='pending' ORDER BY id LIMIT 1";
    return cmd.ExecuteScalar() as string;
}

void UpdateTenantStatus(string cs, string tenantId, string status)
{
    using var conn = new SqliteConnection(cs);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "UPDATE tenants SET status=@s, updated_at=datetime('now') WHERE tenant_id=@tid";
    cmd.Parameters.AddWithValue("@s", status);
    cmd.Parameters.AddWithValue("@tid", tenantId);
    cmd.ExecuteNonQuery();
}

void SaveTenantResult(string cs, string tenantId, string status, int? statusCode, int durationMs, string? errorDetail)
{
    using var conn = new SqliteConnection(cs);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = """
        UPDATE tenants
        SET status=@s, status_code=@sc, duration_ms=@dur, error_detail=@err, updated_at=datetime('now')
        WHERE tenant_id=@tid
        """;
    cmd.Parameters.AddWithValue("@s",   status);
    cmd.Parameters.AddWithValue("@sc",  (object?)statusCode ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@dur", durationMs);
    cmd.Parameters.AddWithValue("@err", (object?)errorDetail ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@tid", tenantId);
    cmd.ExecuteNonQuery();
}

void ResetProcessingToPending(string cs)
{
    using var conn = new SqliteConnection(cs);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "UPDATE tenants SET status='pending', updated_at=datetime('now') WHERE status='processing'";
    cmd.ExecuteNonQuery();
}

int CountPending(string cs)
{
    using var conn = new SqliteConnection(cs);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT COUNT(*) FROM tenants WHERE status='pending'";
    return (int)(long)(cmd.ExecuteScalar() ?? 0L);
}

int CountTenants(string cs)
{
    using var conn = new SqliteConnection(cs);
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT COUNT(*) FROM tenants";
    return (int)(long)(cmd.ExecuteScalar() ?? 0L);
}

IEnumerable<string> ParseCsv(string csvContent)
{
    var lines = csvContent.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
    var hasHeader = lines.FirstOrDefault()?.Equals("tenantId", StringComparison.OrdinalIgnoreCase) ?? false;
    var startIndex = hasHeader ? 1 : 0;
    return lines.Skip(startIndex).Select(l => l.Trim()).Where(l => !string.IsNullOrWhiteSpace(l)).ToList();
}

app.Run();

// ─── Models ───────────────────────────────────────────────────────────────────
#nullable enable

class BatchState
{
    public string Status { get; set; } = "idle"; // idle | running | paused | stopping | completed
    public bool StopRequested { get; set; }
    public bool DummyMode { get; set; }
    public string AuthToken { get; set; } = "";
    public int DelayMs { get; set; } = 500;
    public CancellationTokenSource? CancellationSource { get; set; }

    public void Reset()
    {
        Status = "idle";
        StopRequested = false;
        CancellationSource = null;
    }
}

class TenantRow
{
    public string TenantId { get; set; } = "";
    public string Status { get; set; } = "";
    public int? StatusCode { get; set; }
    public int? DurationMs { get; set; }
    public string? ErrorDetail { get; set; }
}

class LoadCsvRequest   { public string CsvContent { get; set; } = ""; }
class StartBatchRequest
{
    public string? AuthToken { get; set; }
    public int? DelayMs { get; set; }
    public bool DummyMode { get; set; }
}
class DummyDeleteRequest { public string TenantId { get; set; } = ""; }
