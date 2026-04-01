#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.Authentication.JwtBearer@10.*

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Concurrent;

// ── Bootstrap ──────────────────────────────────────────────────────────────────

var builder = WebApplication.CreateBuilder(args);

// ── *.localhost DNS fix ───────────────────────────────────────────────────────
// Browsers resolve *.localhost → 127.0.0.1 automatically, but the .NET DNS
// resolver on Windows does not. Used for JWT JWKS backchannel fetch from IDS.
static HttpMessageHandler SubdomainLocalhostHandler() =>
    new SocketsHttpHandler
    {
        SslOptions = new System.Net.Security.SslClientAuthenticationOptions
        {
            RemoteCertificateValidationCallback = (_, _, _, _) => true,
        },
        ConnectCallback = async (ctx, ct) =>
        {
            var host = ctx.DnsEndPoint.Host.EndsWith(".localhost", StringComparison.OrdinalIgnoreCase)
                ? "127.0.0.1" : ctx.DnsEndPoint.Host;
            var socket = new System.Net.Sockets.Socket(
                System.Net.Sockets.AddressFamily.InterNetwork,
                System.Net.Sockets.SocketType.Stream,
                System.Net.Sockets.ProtocolType.Tcp) { NoDelay = true };
            await socket.ConnectAsync(host, ctx.DnsEndPoint.Port, ct);
            return new System.Net.Sockets.NetworkStream(socket, ownsSocket: true);
        }
    };

// ── CORS — BFF makes server-to-server calls, but allow the BFF origin for any
//    potential direct debugging. All actual API traffic comes via BFF (no browser direct).
builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p => p
        .WithOrigins("https://bff.localhost:5205")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));

// ── JWT Bearer — validate tokens issued by Identity Server ────────────────────
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.Authority            = "https://identity.localhost:5203";
        opt.Audience             = "inventory-api";
        opt.RequireHttpsMetadata = false;
        opt.BackchannelHttpHandler = SubdomainLocalhostHandler();
    });

builder.Services.AddAuthorization();

builder.WebHost.UseKestrel(o =>
    o.ListenLocalhost(5202, lo => lo.UseHttps()));

var app = builder.Build();

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// ── In-memory inventory store ─────────────────────────────────────────────────

var inventory = new ConcurrentDictionary<int, InventoryItem>(new[]
{
    KeyValuePair.Create(1, new InventoryItem(1, "Wireless Mouse",     50,  "Electronics", 29.99m)),
    KeyValuePair.Create(2, new InventoryItem(2, "Standing Desk",      12,  "Furniture",   349.00m)),
    KeyValuePair.Create(3, new InventoryItem(3, "USB-C Hub",          75,  "Electronics", 49.99m)),
    KeyValuePair.Create(4, new InventoryItem(4, "Ergonomic Chair",    8,   "Furniture",   499.00m)),
    KeyValuePair.Create(5, new InventoryItem(5, "Whiteboard Markers", 200, "Supplies",    8.99m)),
});
var nextId = 6;

// ── Endpoints ─────────────────────────────────────────────────────────────────

app.MapGet("/api/items", [Authorize] () =>
    Results.Ok(inventory.Values.OrderBy(i => i.Id)));

app.MapGet("/api/items/{id:int}", [Authorize] (int id) =>
    inventory.TryGetValue(id, out var item)
        ? Results.Ok(item)
        : Results.NotFound(new { error = $"item {id} not found." }));

app.MapPost("/api/items", [Authorize] (InventoryItemInput input) =>
{
    var id   = Interlocked.Increment(ref nextId);
    var item = new InventoryItem(id, input.Name, input.Quantity, input.Category, input.Price);
    inventory[id] = item;
    return Results.Created($"/api/items/{id}", item);
});

app.MapPut("/api/items/{id:int}", [Authorize] (int id, InventoryItemInput input) =>
{
    if (!inventory.ContainsKey(id))
        return Results.NotFound(new { error = $"item {id} not found." });
    var updated = new InventoryItem(id, input.Name, input.Quantity, input.Category, input.Price);
    inventory[id] = updated;
    return Results.Ok(updated);
});

app.MapDelete("/api/items/{id:int}", [Authorize] (int id) =>
{
    if (!inventory.TryRemove(id, out _))
        return Results.NotFound(new { error = $"item {id} not found." });
    return Results.NoContent();
});

app.Run();

// ── Models — MUST come after app.Run() in file-based apps ─────────────────────

record InventoryItem(int Id, string Name, int Quantity, string Category, decimal Price);
record InventoryItemInput(string Name, int Quantity, string Category, decimal Price);
