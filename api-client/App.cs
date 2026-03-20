#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*
#:package Microsoft.EntityFrameworkCore.Design@10.*

using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=app.db"));
builder.Services.AddHttpClient();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// --- DB init ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

app.MapGet("/api/collections", async (AppDbContext db) =>
{
    var cols = await db.Collections
        .Include(c => c.Requests)
        .OrderBy(c => c.CreatedAt)
        .ToListAsync();

    return cols.Select(c => new
    {
        c.Id,
        c.Name,
        requests = c.Requests.Select(r => new
        {
            r.Id,
            r.Name,
            r.Method,
            r.Url,
            @params = JsonSerializer.Deserialize<object>(r.ParamsJson),
            headers = JsonSerializer.Deserialize<object>(r.HeadersJson),
            r.Body,
            r.BodyType,
            auth = JsonSerializer.Deserialize<object>(r.AuthJson),
        })
    });
});

app.MapPost("/api/collections", async (AppDbContext db, CreateCollectionRequest req) =>
{
    var col = new Collection
    {
        Id = "col_" + Guid.NewGuid().ToString("N")[..8],
        Name = req.Name,
        CreatedAt = DateTimeOffset.UtcNow,
    };
    db.Collections.Add(col);
    await db.SaveChangesAsync();
    return Results.Created($"/api/collections/{col.Id}", new { col.Id, col.Name, requests = Array.Empty<object>() });
});

app.MapPut("/api/collections/{id}", async (string id, AppDbContext db, RenameRequest req) =>
{
    var col = await db.Collections.FindAsync(id);
    if (col is null) return Results.NotFound();
    col.Name = req.Name;
    await db.SaveChangesAsync();
    return Results.Ok(new { col.Id, col.Name });
});

app.MapDelete("/api/collections/{id}", async (string id, AppDbContext db) =>
{
    var col = await db.Collections.Include(c => c.Requests).FirstOrDefaultAsync(c => c.Id == id);
    if (col is null) return Results.NotFound();
    db.CollectionRequests.RemoveRange(col.Requests);
    db.Collections.Remove(col);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ---------------------------------------------------------------------------
// Requests within Collections
// ---------------------------------------------------------------------------

app.MapPost("/api/collections/{collectionId}/requests", async (string collectionId, AppDbContext db, SaveRequestBody req) =>
{
    var col = await db.Collections.FindAsync(collectionId);
    if (col is null) return Results.NotFound();

    var r = new CollectionRequest
    {
        Id = "req_" + Guid.NewGuid().ToString("N")[..8],
        CollectionId = collectionId,
        Name = req.Name,
        Method = req.Method,
        Url = req.Url,
        ParamsJson = JsonSerializer.Serialize(req.Params),
        HeadersJson = JsonSerializer.Serialize(req.Headers),
        Body = req.Body ?? "",
        BodyType = req.BodyType ?? "none",
        AuthJson = JsonSerializer.Serialize(req.Auth),
    };
    db.CollectionRequests.Add(r);
    await db.SaveChangesAsync();

    return Results.Created($"/api/collections/{collectionId}/requests/{r.Id}", new
    {
        r.Id, r.Name, r.Method, r.Url,
        @params = req.Params,
        headers = req.Headers,
        r.Body, r.BodyType,
        auth = req.Auth,
    });
});

app.MapPut("/api/collections/{collectionId}/requests/{requestId}", async (string collectionId, string requestId, AppDbContext db, SaveRequestBody req) =>
{
    var r = await db.CollectionRequests.FirstOrDefaultAsync(r => r.CollectionId == collectionId && r.Id == requestId);
    if (r is null) return Results.NotFound();

    r.Name = req.Name;
    r.Method = req.Method;
    r.Url = req.Url;
    r.ParamsJson = JsonSerializer.Serialize(req.Params);
    r.HeadersJson = JsonSerializer.Serialize(req.Headers);
    r.Body = req.Body ?? "";
    r.BodyType = req.BodyType ?? "none";
    r.AuthJson = JsonSerializer.Serialize(req.Auth);
    await db.SaveChangesAsync();

    return Results.Ok(new { r.Id, r.Name, r.Method, r.Url, @params = req.Params, headers = req.Headers, r.Body, r.BodyType, auth = req.Auth });
});

app.MapDelete("/api/collections/{collectionId}/requests/{requestId}", async (string collectionId, string requestId, AppDbContext db) =>
{
    var r = await db.CollectionRequests.FirstOrDefaultAsync(r => r.CollectionId == collectionId && r.Id == requestId);
    if (r is null) return Results.NotFound();
    db.CollectionRequests.Remove(r);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ---------------------------------------------------------------------------
// Environments
// ---------------------------------------------------------------------------

app.MapGet("/api/environments", async (AppDbContext db) =>
{
    var envs = await db.Environments
        .Include(e => e.Variables)
        .OrderBy(e => e.CreatedAt)
        .ToListAsync();

    return envs.Select(e => new
    {
        e.Id,
        e.Name,
        variables = e.Variables.Select(v => new { v.Key, v.InitialValue, v.CurrentValue }),
    });
});

app.MapPost("/api/environments", async (AppDbContext db, CreateEnvRequest req) =>
{
    var env = new AppEnvironment
    {
        Id = "env_" + Guid.NewGuid().ToString("N")[..8],
        Name = req.Name,
        CreatedAt = DateTimeOffset.UtcNow,
    };
    var vars = (req.Variables ?? []).Select(v => new EnvVariable
    {
        EnvironmentId = env.Id,
        Key = v.Key,
        InitialValue = v.InitialValue ?? "",
        CurrentValue = v.CurrentValue ?? "",
    }).ToList();

    db.Environments.Add(env);
    db.EnvVariables.AddRange(vars);
    await db.SaveChangesAsync();

    return Results.Created($"/api/environments/{env.Id}", new
    {
        env.Id, env.Name,
        variables = vars.Select(v => new { v.Key, v.InitialValue, v.CurrentValue }),
    });
});

app.MapPut("/api/environments/{id}", async (string id, AppDbContext db, UpdateEnvRequest req) =>
{
    var env = await db.Environments.Include(e => e.Variables).FirstOrDefaultAsync(e => e.Id == id);
    if (env is null) return Results.NotFound();

    env.Name = req.Name;

    // Replace variables
    db.EnvVariables.RemoveRange(env.Variables);
    var newVars = (req.Variables ?? []).Select(v => new EnvVariable
    {
        EnvironmentId = id,
        Key = v.Key,
        InitialValue = v.InitialValue ?? "",
        CurrentValue = v.CurrentValue ?? "",
    }).ToList();
    db.EnvVariables.AddRange(newVars);

    await db.SaveChangesAsync();
    return Results.Ok(new { env.Id, env.Name, variables = newVars.Select(v => new { v.Key, v.InitialValue, v.CurrentValue }) });
});

app.MapDelete("/api/environments/{id}", async (string id, AppDbContext db) =>
{
    var env = await db.Environments.Include(e => e.Variables).FirstOrDefaultAsync(e => e.Id == id);
    if (env is null) return Results.NotFound();
    db.EnvVariables.RemoveRange(env.Variables);
    db.Environments.Remove(env);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

app.MapGet("/api/history", async (AppDbContext db) =>
{
    var entries = await db.History.OrderByDescending(h => h.Id).Take(50).ToListAsync();
    return entries.Select(h => new
    {
        h.Id,
        h.Method,
        h.Url,
        h.Status,
        h.StatusText,
        h.Duration,
        time = h.Timestamp.ToLocalTime().ToString("HH:mm:ss"),
        h.Timestamp,
    });
});

app.MapPost("/api/history", async (AppDbContext db, AddHistoryRequest req) =>
{
    var entry = new HistoryEntry
    {
        Method = req.Method,
        Url = req.Url,
        Status = req.Status,
        StatusText = req.StatusText ?? "",
        Duration = req.Duration,
        Timestamp = req.Timestamp,
    };
    db.History.Add(entry);
    await db.SaveChangesAsync();
    return Results.Created($"/api/history/{entry.Id}", entry);
});

app.MapDelete("/api/history", async (AppDbContext db) =>
{
    await db.History.ExecuteDeleteAsync();
    return Results.NoContent();
});

// ---------------------------------------------------------------------------
// Proxy
// ---------------------------------------------------------------------------

app.MapPost("/api/proxy", async (AppDbContext db, IHttpClientFactory httpClientFactory, ProxyRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Url))
        return Results.BadRequest("url is required");

    // Reject obviously non-HTTP(S) schemes as a basic safety guard
    if (!req.Url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) &&
        !req.Url.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        return Results.BadRequest("only http and https urls are supported");

    var client = httpClientFactory.CreateClient();
    var timeoutMs = req.TimeoutMs > 0 ? req.TimeoutMs : 30_000;
    using var cts = new CancellationTokenSource(timeoutMs);

    var message = new HttpRequestMessage(new HttpMethod(req.Method ?? "GET"), req.Url);

    // Forward headers — skip hop-by-hop headers to avoid forwarding issues
    var hopByHop = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        { "connection", "transfer-encoding", "host", "content-length", "keep-alive",
          "proxy-authenticate", "proxy-authorization", "te", "trailer", "upgrade" };

    if (req.Headers is not null)
    {
        foreach (var (k, v) in req.Headers)
        {
            if (hopByHop.Contains(k)) continue;
            if (!message.Headers.TryAddWithoutValidation(k, v))
                message.Content?.Headers.TryAddWithoutValidation(k, v);
        }
    }

    if (!string.IsNullOrEmpty(req.Body) && !string.Equals(req.Method, "GET", StringComparison.OrdinalIgnoreCase) &&
        !string.Equals(req.Method, "HEAD", StringComparison.OrdinalIgnoreCase))
    {
        var contentType = req.Headers?.GetValueOrDefault("Content-Type") ?? "application/json";
        message.Content = new StringContent(req.Body, Encoding.UTF8, contentType);
    }

    var sw = Stopwatch.StartNew();
    try
    {
        var resp = await client.SendAsync(message, cts.Token);
        sw.Stop();

        var body = await resp.Content.ReadAsStringAsync();
        var responseHeaders = new Dictionary<string, string>();
        foreach (var h in resp.Headers)
            responseHeaders[h.Key.ToLower()] = string.Join(", ", h.Value);
        foreach (var h in resp.Content.Headers)
            responseHeaders[h.Key.ToLower()] = string.Join(", ", h.Value);

        return Results.Ok(new
        {
            status = (int)resp.StatusCode,
            statusText = resp.ReasonPhrase ?? resp.StatusCode.ToString(),
            headers = responseHeaders,
            body,
            durationMs = (int)sw.ElapsedMilliseconds,
            sizeBytes = Encoding.UTF8.GetByteCount(body),
        });
    }
    catch (OperationCanceledException)
    {
        return Results.Json(new { error = "request timed out" }, statusCode: 504);
    }
    catch (Exception ex)
    {
        return Results.Json(new { error = ex.Message }, statusCode: 502);
    }
});

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------

app.MapGet("/api/preferences", async (AppDbContext db) =>
{
    var prefs = await db.Preferences.FindAsync(1);
    if (prefs is null)
        return Results.Ok(new { layout = "stacked", sidebarOpen = true, consoleOpen = true, activeEnvironmentId = (string?)null });
    return Results.Ok(new { prefs.Layout, prefs.SidebarOpen, prefs.ConsoleOpen, prefs.ActiveEnvironmentId });
});

app.MapPut("/api/preferences", async (AppDbContext db, PreferencesRequest req) =>
{
    var prefs = await db.Preferences.FindAsync(1);
    if (prefs is null)
    {
        prefs = new Preference { Id = 1 };
        db.Preferences.Add(prefs);
    }
    prefs.Layout = req.Layout ?? "stacked";
    prefs.SidebarOpen = req.SidebarOpen;
    prefs.ConsoleOpen = req.ConsoleOpen;
    prefs.ActiveEnvironmentId = req.ActiveEnvironmentId;
    await db.SaveChangesAsync();
    return Results.Ok(new { prefs.Layout, prefs.SidebarOpen, prefs.ConsoleOpen, prefs.ActiveEnvironmentId });
});

app.Run();

// ===========================================================================
// Models & DTOs
// ===========================================================================

class Collection
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; }
    public List<CollectionRequest> Requests { get; set; } = [];
}

class CollectionRequest
{
    public string Id { get; set; } = "";
    public string CollectionId { get; set; } = "";
    public string Name { get; set; } = "";
    public string Method { get; set; } = "GET";
    public string Url { get; set; } = "";
    public string ParamsJson { get; set; } = "[]";
    public string HeadersJson { get; set; } = "[]";
    public string Body { get; set; } = "";
    public string BodyType { get; set; } = "none";
    public string AuthJson { get; set; } = "{}";
}

class AppEnvironment
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; }
    public List<EnvVariable> Variables { get; set; } = [];
}

class EnvVariable
{
    public int Id { get; set; }
    public string EnvironmentId { get; set; } = "";
    public string Key { get; set; } = "";
    public string InitialValue { get; set; } = "";
    public string CurrentValue { get; set; } = "";
}

class HistoryEntry
{
    public int Id { get; set; }
    public string Method { get; set; } = "";
    public string Url { get; set; } = "";
    public int Status { get; set; }
    public string StatusText { get; set; } = "";
    public int Duration { get; set; }
    public DateTimeOffset Timestamp { get; set; }
}

class Preference
{
    public int Id { get; set; }
    public string Layout { get; set; } = "stacked";
    public bool SidebarOpen { get; set; } = true;
    public bool ConsoleOpen { get; set; } = true;
    public string? ActiveEnvironmentId { get; set; }
}

// DTOs
record CreateCollectionRequest(string Name);
record RenameRequest(string Name);
record SaveRequestBody(
    string Name, string Method, string Url,
    object[]? Params, object[]? Headers,
    string? Body, string? BodyType, object? Auth);
record CreateEnvRequest(string Name, EnvVarDto[]? Variables);
record UpdateEnvRequest(string Name, EnvVarDto[]? Variables);
record EnvVarDto(string Key, string? InitialValue, string? CurrentValue);
record AddHistoryRequest(string Method, string Url, int Status, string? StatusText, int Duration, DateTimeOffset Timestamp);
record ProxyRequest(string? Method, string? Url, Dictionary<string, string>? Headers, string? Body, int TimeoutMs);
record PreferencesRequest(string? Layout, bool SidebarOpen, bool ConsoleOpen, string? ActiveEnvironmentId);

class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Collection> Collections => Set<Collection>();
    public DbSet<CollectionRequest> CollectionRequests => Set<CollectionRequest>();
    public DbSet<AppEnvironment> Environments => Set<AppEnvironment>();
    public DbSet<EnvVariable> EnvVariables => Set<EnvVariable>();
    public DbSet<HistoryEntry> History => Set<HistoryEntry>();
    public DbSet<Preference> Preferences => Set<Preference>();
}
