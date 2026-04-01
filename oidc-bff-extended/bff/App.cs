#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.Authentication.OpenIdConnect@10.*

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using System.Collections.Concurrent;
using System.Net.Http.Headers;

// ── Bootstrap ──────────────────────────────────────────────────────────────────

var builder = WebApplication.CreateBuilder(args);

// ── *.localhost DNS fix ───────────────────────────────────────────────────────
// Browsers resolve *.localhost → 127.0.0.1 automatically, but the .NET DNS
// resolver on Windows does not. This handler intercepts all backchannel HTTP
// calls (OIDC discovery, token exchange, JWKS fetch) and dials 127.0.0.1
// directly for any *.localhost hostname, bypassing the missing DNS entry.
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

// ── CORS — allow Shell to call BFF endpoints with credentials ─────────────────
builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p => p
        .WithOrigins("https://shell.localhost:5201")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));

// ── Cookie + OpenIdConnect ────────────────────────────────────────────────────
// The Cookie scheme ("bff.oidc") is used ONLY during the OIDC code flow to temporarily
// store the tokens before we extract them in /bff/signin-complete and migrate to our
// own GUID-keyed session store. After that we sign out of bff.oidc entirely.
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultScheme          = CookieAuthenticationDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie("Cookies", opt =>
{
    opt.Cookie.Name     = "bff.oidc";
    opt.Cookie.Path     = "/";
    opt.Cookie.HttpOnly = true;
    opt.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.Always;
})
.AddOpenIdConnect(opt =>
{
    opt.Authority      = "https://identity.localhost:5203";
    opt.ClientId       = "bff-client";
    opt.ClientSecret   = "bff-secret";
    opt.ResponseType   = "code";
    opt.UsePkce        = true;
    opt.SaveTokens     = true;           // required so we can call GetTokenAsync later
    opt.MapInboundClaims = false;        // keep JWT claim names as-is (sub, name, etc.)

    opt.Scope.Clear();
    opt.Scope.Add("openid");
    opt.Scope.Add("profile");
    opt.Scope.Add("inventory");

    opt.CallbackPath         = "/bff/signin-oidc";
    // Use a dedicated path for OIDC middleware-driven signouts (distinct from our custom
    // /bff/post-logout handler to prevent the OIDC middleware from intercepting IDS redirects
    // triggered by our manual endsession flow in /bff/logout).
    opt.SignedOutCallbackPath = "/bff/oidc-signout-cb";

    // After the OIDC callback completes we want to land on /bff/signin-complete
    // rather than the default redirect to "/". Override AccessDeniedPath too.
    opt.Events.OnTicketReceived = ctx =>
    {
        ctx.ReturnUri = "/bff/signin-complete";
        return Task.CompletedTask;
    };

    opt.BackchannelHttpHandler = SubdomainLocalhostHandler();
});

builder.Services.AddAuthorization();

// ── HttpClient for proxying to Inventory API ──────────────────────────────────
builder.Services.AddHttpClient("inventory", c =>
{
    c.BaseAddress = new Uri("https://api.localhost:5202");
}).ConfigurePrimaryHttpMessageHandler(SubdomainLocalhostHandler);

builder.WebHost.UseKestrel(o =>
    o.ListenLocalhost(5205, lo => lo.UseHttps()));

var app = builder.Build();

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// ── In-memory GUID session store ──────────────────────────────────────────────
// Maps session GUID → { AccessToken, Sub, Name, ExpiresAt }.
// No Duende.BFF, no IDistributedCache — intentionally minimal for demo clarity.
var sessions = new ConcurrentDictionary<string, BffSession>();

// ── Helpers ───────────────────────────────────────────────────────────────────

// Read the bff-session cookie → look up the session → return null if missing/expired.
BffSession? GetSession(HttpContext ctx)
{
    var guid = ctx.Request.Cookies["bff-session"];
    if (string.IsNullOrWhiteSpace(guid)) return null;
    sessions.TryGetValue(guid, out var session);
    return session;
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

// GET /bff/login — issues OIDC challenge → browser gets redirected to IDS
app.MapGet("/bff/login", () =>
    Results.Challenge(
        new AuthenticationProperties { RedirectUri = "/bff/signin-complete" },
        [OpenIdConnectDefaults.AuthenticationScheme]));

// GET /bff/signin-complete — called after the OIDC middleware processes /bff/signin-oidc.
// At this point the user IS authenticated via the Cookie scheme and tokens are stored
// in the encrypted session cookie (bff.oidc). We extract the access_token, create a
// short GUID session, set a plain HttpOnly cookie, then discard the OIDC Cookie session.
app.MapGet("/bff/signin-complete", async (HttpContext ctx) =>
{
    // Extract tokens from the temporary OIDC Cookie session
    var accessToken = await ctx.GetTokenAsync("access_token");
    var sub         = ctx.User.FindFirst("sub")?.Value         ?? "";
    var name        = ctx.User.FindFirst("name")?.Value
                   ?? ctx.User.FindFirst("preferred_username")?.Value
                   ?? sub;

    // Parse token expiry from the exp claim; fall back to 1 hour from now
    var expClaim  = ctx.User.FindFirst("exp")?.Value;
    var expiresAt = expClaim != null && long.TryParse(expClaim, out var exp)
        ? DateTimeOffset.FromUnixTimeSeconds(exp)
        : DateTimeOffset.UtcNow.AddHours(1);

    if (!string.IsNullOrWhiteSpace(accessToken))
    {
        // Create a new GUID session
        var guid    = Guid.NewGuid().ToString("N");
        var session = new BffSession(accessToken, sub, name, expiresAt);
        sessions[guid] = session;

        // Set the bff-session cookie (HttpOnly + Secure — JS cannot read this)
        ctx.Response.Cookies.Append("bff-session", guid, new CookieOptions
        {
            HttpOnly  = true,
            Secure    = true,
            SameSite  = SameSiteMode.Lax,
            Expires   = expiresAt,
        });
    }

    // Sign out of the temporary OIDC/Cookie scheme — we no longer need it.
    // The browser will receive the new bff-session cookie instead.
    await ctx.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

    // Redirect back to the Shell SPA
    return Results.Redirect("https://shell.localhost:5201");
});

// GET /bff/user — returns authenticated user info from the GUID session (never 401s)
app.MapGet("/bff/user", (HttpContext ctx) =>
{
    var session = GetSession(ctx);
    if (session == null || session.ExpiresAt <= DateTimeOffset.UtcNow)
        return Results.Ok(new { authenticated = false, name = (string?)null, sub = (string?)null });

    return Results.Ok(new { authenticated = true, name = session.Name, sub = session.Sub });
});

// GET /bff/logout — clears GUID session + cookie, then redirects to IDS end-session
app.MapGet("/bff/logout", async (HttpContext ctx) =>
{
    var guid = ctx.Request.Cookies["bff-session"];
    if (!string.IsNullOrWhiteSpace(guid))
    {
        sessions.TryRemove(guid, out _);
        ctx.Response.Cookies.Delete("bff-session");
    }

    // Initiate IDS end-session endpoint so the IDS session cookie is also cleared.
    // The OIDC Cookie scheme is already gone, so we trigger the sign-out by redirecting
    // to IDS /connect/endsession with post_logout_redirect_uri.
    var postLogoutUri = Uri.EscapeDataString("https://bff.localhost:5205/bff/post-logout");
    return Results.Redirect($"https://identity.localhost:5203/connect/endsession?post_logout_redirect_uri={postLogoutUri}");
});

// GET /bff/post-logout — IDS redirects here after server-side sign-out completes.
// Clears any residual session state and sends the user back to the Shell.
app.MapGet("/bff/post-logout", (HttpContext ctx) =>
{
    var guid = ctx.Request.Cookies["bff-session"];
    if (!string.IsNullOrWhiteSpace(guid))
    {
        sessions.TryRemove(guid, out _);
        ctx.Response.Cookies.Delete("bff-session");
    }
    return Results.Redirect("https://shell.localhost:5201");
});

// ── Proxy endpoints — forward requests to Inventory API with Bearer token ─────

// GET /bff/api/items
app.MapGet("/bff/api/items", async (HttpContext ctx, IHttpClientFactory factory) =>
{
    var session = GetSession(ctx);
    if (session == null) return Results.Unauthorized();

    var client = factory.CreateClient("inventory");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", session.AccessToken);

    var response = await client.GetAsync("/api/items");
    var content  = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json", null, (int)response.StatusCode);
});

// POST /bff/api/items
app.MapPost("/bff/api/items", async (HttpContext ctx, IHttpClientFactory factory) =>
{
    var session = GetSession(ctx);
    if (session == null) return Results.Unauthorized();

    var client = factory.CreateClient("inventory");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", session.AccessToken);

    var body     = await new StreamReader(ctx.Request.Body).ReadToEndAsync();
    var content  = new StringContent(body, System.Text.Encoding.UTF8, "application/json");
    var response = await client.PostAsync("/api/items", content);
    var result   = await response.Content.ReadAsStringAsync();
    return Results.Content(result, "application/json", null, (int)response.StatusCode);
});

// PUT /bff/api/items/{id}
app.MapPut("/bff/api/items/{id:int}", async (int id, HttpContext ctx, IHttpClientFactory factory) =>
{
    var session = GetSession(ctx);
    if (session == null) return Results.Unauthorized();

    var client = factory.CreateClient("inventory");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", session.AccessToken);

    var body     = await new StreamReader(ctx.Request.Body).ReadToEndAsync();
    var content  = new StringContent(body, System.Text.Encoding.UTF8, "application/json");
    var response = await client.PutAsync($"/api/items/{id}", content);
    var result   = await response.Content.ReadAsStringAsync();
    return Results.Content(result, "application/json", null, (int)response.StatusCode);
});

// DELETE /bff/api/items/{id}
app.MapDelete("/bff/api/items/{id:int}", async (int id, HttpContext ctx, IHttpClientFactory factory) =>
{
    var session = GetSession(ctx);
    if (session == null) return Results.Unauthorized();

    var client = factory.CreateClient("inventory");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", session.AccessToken);

    var response = await client.DeleteAsync($"/api/items/{id}");
    return response.IsSuccessStatusCode
        ? Results.NoContent()
        : Results.StatusCode((int)response.StatusCode);
});

app.Run();

// ── Models — MUST come after app.Run() in file-based apps ─────────────────────

record BffSession(string AccessToken, string Sub, string Name, DateTimeOffset ExpiresAt);
