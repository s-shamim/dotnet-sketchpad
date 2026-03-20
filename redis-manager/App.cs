#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package StackExchange.Redis@2.*

using System.Text.Json;
using System.Text.Json.Nodes;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder();
builder.Services.AddSingleton<RedisManager>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Auto-connect on startup using saved config
var redis = app.Services.GetRequiredService<RedisManager>();
var initHost = app.Configuration["Redis:Host"] ?? "localhost";
var initPort = int.TryParse(app.Configuration["Redis:Port"], out var sp) ? sp : 6379;
await redis.ConnectAsync(initHost, initPort);

var settingsPath = Path.Combine(app.Environment.ContentRootPath, "appsettings.json");

// --- Config ---

app.MapGet("/api/config", (RedisManager rm) =>
    Results.Ok(new { rm.Host, rm.Port }));

app.MapPost("/api/config", async (RedisManager rm, ConfigRequest req) =>
{
    await rm.ConnectAsync(req.Host, req.Port);

    try
    {
        var raw = File.Exists(settingsPath)
            ? await File.ReadAllTextAsync(settingsPath)
            : "{}";
        var json = JsonNode.Parse(raw) ?? new JsonObject();
        json["Redis"] ??= new JsonObject();
        json["Redis"]!["Host"] = JsonValue.Create(req.Host);
        json["Redis"]!["Port"] = JsonValue.Create(req.Port);
        await File.WriteAllTextAsync(settingsPath,
            json.ToJsonString(new JsonSerializerOptions { WriteIndented = true }));
    }
    catch { /* non-fatal */ }

    return Results.Ok(new { isConnected = rm.IsConnected, rm.Host, rm.Port, lastError = rm.LastError });
});

// --- Health ---

app.MapGet("/api/health", async (RedisManager rm) =>
{
    if (!rm.IsConnected)
        return Results.Ok(new { connected = false, latencyMs = (long?)null, error = rm.LastError ?? "not connected" });

    try
    {
        var db = rm.GetDatabase()!;
        var sw = System.Diagnostics.Stopwatch.StartNew();
        await db.PingAsync();
        sw.Stop();
        return Results.Ok(new { connected = true, latencyMs = (long?)sw.ElapsedMilliseconds, error = (string?)null });
    }
    catch (Exception ex)
    {
        return Results.Ok(new { connected = false, latencyMs = (long?)null, error = ex.Message });
    }
});

// --- Keys ---

var keysApi = app.MapGroup("/api/keys");

keysApi.MapGet("/", async (RedisManager rm) =>
{
    if (!rm.IsConnected) return Results.StatusCode(503);
    var server = rm.GetServer();
    if (server is null) return Results.StatusCode(503);

    var list = new List<string>();
    await foreach (var key in server.KeysAsync(pattern: "*"))
        list.Add(key.ToString());
    list.Sort();
    return Results.Ok(list);
});

keysApi.MapPost("/", async (RedisManager rm, KeyValueRequest req) =>
{
    if (!rm.IsConnected) return Results.StatusCode(503);
    var db = rm.GetDatabase();
    if (db is null) return Results.StatusCode(503);
    if (string.IsNullOrWhiteSpace(req.Key)) return Results.BadRequest("key is required");

    await db.StringSetAsync(req.Key, req.Value);
    return Results.Created($"/api/keys/{Uri.EscapeDataString(req.Key)}", new { req.Key, req.Value });
});

keysApi.MapGet("/{key}", async (RedisManager rm, string key) =>
{
    if (!rm.IsConnected) return Results.StatusCode(503);
    var db = rm.GetDatabase();
    if (db is null) return Results.StatusCode(503);

    var value = await db.StringGetAsync(key);
    return value.IsNull
        ? Results.NotFound()
        : Results.Ok(new { key, value = value.ToString() });
});

keysApi.MapPut("/{key}", async (RedisManager rm, string key, ValueRequest req) =>
{
    if (!rm.IsConnected) return Results.StatusCode(503);
    var db = rm.GetDatabase();
    if (db is null) return Results.StatusCode(503);

    await db.StringSetAsync(key, req.Value);
    return Results.Ok(new { key, req.Value });
});

keysApi.MapDelete("/{key}", async (RedisManager rm, string key) =>
{
    if (!rm.IsConnected) return Results.StatusCode(503);
    var db = rm.GetDatabase();
    if (db is null) return Results.StatusCode(503);

    var deleted = await db.KeyDeleteAsync(key);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();

// --- Types ---

class RedisManager
{
    private IConnectionMultiplexer? _mux;

    public string Host { get; private set; } = "localhost";
    public int Port { get; private set; } = 6379;
    public bool IsConnected => _mux?.IsConnected ?? false;
    public string? LastError { get; private set; }

    public async Task ConnectAsync(string host, int port)
    {
        Host = host;
        Port = port;
        LastError = null;
        try
        {
            _mux?.Dispose();
            _mux = await ConnectionMultiplexer.ConnectAsync(new ConfigurationOptions
            {
                EndPoints = { $"{host}:{port}" },
                ConnectTimeout = 3000,
                AbortOnConnectFail = false,
                AllowAdmin = true
            });
        }
        catch (Exception ex)
        {
            _mux = null;
            LastError = ex.Message;
        }
    }

    public IDatabase? GetDatabase() => _mux?.GetDatabase();

    public IServer? GetServer()
    {
        if (_mux is null) return null;
        foreach (var ep in _mux.GetEndPoints())
        {
            var srv = _mux.GetServer(ep);
            if (!srv.IsReplica) return srv;
        }
        return null;
    }
}

record ConfigRequest(string Host, int Port);
record KeyValueRequest(string Key, string Value);
record ValueRequest(string Value);
