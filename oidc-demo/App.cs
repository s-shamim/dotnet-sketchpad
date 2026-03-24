#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Duende.IdentityServer@7.*
#:package Microsoft.AspNetCore.Authentication.JwtBearer@10.*

using Duende.IdentityServer;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Duende.IdentityServer.Stores;
using Duende.IdentityServer.Test;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

// ── Bootstrap ─────────────────────────────────────────────────────────────────

var builder = WebApplication.CreateBuilder(args);

// ── Duende IdentityServer ─────────────────────────────────────────────────────
// Point login/consent/logout at our own static HTML pages in wwwroot.
// No Razor Pages needed — IDS redirects there and JSX talks to /api/ids/* below.
builder.Services.AddIdentityServer(opt =>
{
    opt.IssuerUri                     = "https://localhost:5200";
    opt.UserInteraction.LoginUrl      = "/login.html";
    opt.UserInteraction.LogoutUrl     = "/logout.html";
    opt.UserInteraction.ConsentUrl    = "/consent.html";
    opt.UserInteraction.ErrorUrl      = "/error.html";
    opt.Events.RaiseSuccessEvents     = true;
    opt.Events.RaiseFailureEvents     = true;
    // Disable PAR — the OIDC middleware (OpenIdConnect 10.x) defaults to UseIfAvailable
    // and will use PAR if advertised. Without a full PAR setup the authorize request
    // arrives with only client_id and no other params, causing validation failure.
    opt.Endpoints.EnablePushedAuthorizationEndpoint = false;
})
.AddInMemoryClients(Config.Clients)
.AddInMemoryIdentityResources(Config.IdentityResources)
.AddInMemoryApiScopes(Config.ApiScopes)
.AddInMemoryApiResources(Config.ApiResources)
.AddTestUsers(Config.TestUsers)
.AddDeveloperSigningCredential();

// ── Client-side OIDC + Cookie + JWT Bearer ────────────────────────────────────
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultScheme          = CookieAuthenticationDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie(opt => opt.Cookie.Name = "oidc-demo.session")
.AddOpenIdConnect(opt =>
{
    opt.Authority          = "https://localhost:5200";
    opt.ClientId           = "demo-client";
    opt.ClientSecret       = "super-secret";
    opt.ResponseType       = "code";
    opt.UsePkce            = true;
    opt.SaveTokens         = true;
    opt.MapInboundClaims   = false;   // keep JWT claim names as-is (sub, name, etc.)

    opt.Scope.Clear();
    opt.Scope.Add("openid");
    opt.Scope.Add("profile");
    opt.Scope.Add("api");

    opt.CallbackPath                  = "/signin-oidc";
    opt.SignedOutCallbackPath         = "/signout-callback-oidc";
    opt.GetClaimsFromUserInfoEndpoint = true;

    opt.BackchannelHttpHandler = new HttpClientHandler
    {
        ServerCertificateCustomValidationCallback = (_, _, _, _) => true
    };
})
.AddJwtBearer("Bearer", opt =>
{
    opt.Authority            = "https://localhost:5200";
    opt.Audience             = "api";
    opt.RequireHttpsMetadata = false;
    opt.BackchannelHttpHandler = new HttpClientHandler
    {
        ServerCertificateCustomValidationCallback = (_, _, _, _) => true
    };
});

builder.Services.AddAuthorization();

builder.WebHost.UseKestrel(o =>
    o.ListenLocalhost(5200, lo => lo.UseHttps()));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();   // serves index.html for /
app.UseStaticFiles();
app.UseRouting();
app.UseIdentityServer();
app.UseAuthentication();
app.UseAuthorization();

// ── Protected resource API ────────────────────────────────────────────────────

app.MapGet("/api/me", [Authorize(AuthenticationSchemes = "Bearer")] (ClaimsPrincipal user) =>
    Results.Ok(new
    {
        sub    = user.FindFirst("sub")?.Value,
        name   = user.FindFirst("name")?.Value,
        claims = user.Claims.Select(c => new { c.Type, c.Value })
    }));

// ── Client app routes ─────────────────────────────────────────────────────────

// After OIDC callback succeeds, bounce to index with tokens in query string
app.MapGet("/dashboard", [Authorize] async (HttpContext ctx) =>
{
    var at = await ctx.GetTokenAsync("access_token");
    var it = await ctx.GetTokenAsync("id_token");
    var rt = await ctx.GetTokenAsync("refresh_token");
    return Results.Redirect(
        $"/?at={Uri.EscapeDataString(at ?? "")}" +
        $"&it={Uri.EscapeDataString(it ?? "")}" +
        $"&rt={Uri.EscapeDataString(rt ?? "")}");
});

// Kicks off the OIDC code flow
app.MapGet("/login", () =>
    Results.Challenge(
        new AuthenticationProperties { RedirectUri = "/dashboard" },
        [OpenIdConnectDefaults.AuthenticationScheme]));

// Clears both the client cookie and the IDS session
app.MapGet("/logout", async (HttpContext ctx) =>
{
    await ctx.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    await ctx.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme,
        new AuthenticationProperties { RedirectUri = "/" });
});

// Safe whoami — never 401s, UI polls this on load
app.MapGet("/api/whoami", (HttpContext ctx) =>
{
    var u = ctx.User;
    if (u?.Identity?.IsAuthenticated != true)
        return Results.Ok(new { authenticated = false, name = (string?)null, sub = (string?)null });
    return Results.Ok(new
    {
        authenticated = true,
        name = u.FindFirst("name")?.Value ?? u.Identity?.Name,
        sub  = u.FindFirst("sub")?.Value,
    });
});

// ── IDS interaction API — replaces Razor Pages ────────────────────────────────
// login.html / consent.html are plain static pages that POST here.

// GET — login.html calls this on load to resolve the returnUrl context
// We read the raw query string ourselves to avoid ASP.NET auto-decoding the
// already-encoded returnUrl, which would corrupt the IDS callback parameters.
app.MapGet("/api/ids/login", async (
    HttpContext http,
    IIdentityServerInteractionService interaction) =>
{
    // Read raw value — preserves %2F etc that IDS needs intact
    var returnUrl = http.Request.Query["returnUrl"].FirstOrDefault()
                 ?? http.Request.Query["ReturnUrl"].FirstOrDefault()
                 ?? "/";

    var ctx = await interaction.GetAuthorizationContextAsync(returnUrl);
    return Results.Ok(new
    {
        returnUrl,
        clientName = ctx?.Client?.ClientName ?? ctx?.Client?.ClientId,
        loginHint  = ctx?.LoginHint,
        // debug — remove once flow is working
        contextFound = ctx != null,
    });
});

// POST — validate credentials → sign in to IDS cookie → return redirect URL to JS
app.MapPost("/api/ids/login", async (
    HttpContext http,
    IIdentityServerInteractionService interaction,
    TestUserStore users) =>
{
    var form      = await http.Request.ReadFromJsonAsync<LoginRequest>();
    var returnUrl = form?.ReturnUrl ?? "/";

    if (!users.ValidateCredentials(form?.Username ?? "", form?.Password ?? ""))
        return Results.BadRequest(new { error = "invalid username or password." });

    var user  = users.FindByUsername(form!.Username)!;
    var props = form.RememberMe
        ? new AuthenticationProperties { IsPersistent = true, ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30) }
        : null;

    // Use IdentityServerUser so Duende automatically includes the required
    // auth_time, idp, and amr claims.  Without these, IDS reads the idsrv
    // cookie back as SubjectId=anonymous and redirects to login again.
    var isUser = new IdentityServerUser(user.SubjectId)
    {
        DisplayName      = user.Username,
        AdditionalClaims = user.Claims.ToList(),
    };
    await http.SignInAsync(isUser, props);

    // Validate the returnUrl is a legitimate IDS-issued authorize URL.
    // GetAuthorizationContextAsync expects the raw (still-encoded) returnUrl
    // exactly as IDS originally issued it — do not decode before passing.
    var authCtx = await interaction.GetAuthorizationContextAsync(returnUrl);

    // If context is null the returnUrl didn't come from IDS — fall back to root
    var redirectUrl = authCtx != null ? returnUrl : "/";

    return Results.Ok(new { redirectUrl, contextFound = authCtx != null });
});

// GET — consent.html calls this on load to get client name + scope list
app.MapGet("/api/ids/consent", async (
    string returnUrl,
    IIdentityServerInteractionService interaction,
    IClientStore clients,
    IResourceStore resources) =>
{
    var ctx = await interaction.GetAuthorizationContextAsync(returnUrl);
    if (ctx is null) return Results.BadRequest(new { error = "invalid return url." });

    var client = await clients.FindEnabledClientByIdAsync(ctx.Client.ClientId);
    var res    = await resources.FindEnabledResourcesByScopeAsync(
                     ctx.ValidatedResources.RawScopeValues);

    var scopes = res.IdentityResources
        .Select(s => new ScopeInfo(s.Name, s.DisplayName ?? s.Name, s.Description, s.Required))
        .Concat(res.ApiScopes
            .Select(s => new ScopeInfo(s.Name, s.DisplayName ?? s.Name, s.Description, false)));

    return Results.Ok(new { returnUrl, clientName = client?.ClientName ?? ctx.Client.ClientId, scopes });
});

// POST — grant or deny → IDS finalises the authorization → JS gets redirect URL
app.MapPost("/api/ids/consent", async (
    HttpContext http,
    IIdentityServerInteractionService interaction) =>
{
    var form = await http.Request.ReadFromJsonAsync<ConsentRequest>();
    var ctx  = await interaction.GetAuthorizationContextAsync(form?.ReturnUrl ?? "");
    if (ctx is null) return Results.BadRequest(new { error = "invalid return url." });

    var response = form?.Allow == true
        ? new ConsentResponse
          {
              ScopesValuesConsented = form.Scopes ?? [],
              RememberConsent       = form.Remember,
          }
        : new ConsentResponse { Error = AuthorizationError.AccessDenied };

    await interaction.GrantConsentAsync(ctx, response);
    return Results.Ok(new { redirectUrl = form!.ReturnUrl });
});

// GET — logout.html calls this to complete the IDS server-side logout
app.MapGet("/api/ids/logout", async (
    string? logoutId,
    HttpContext http,
    IIdentityServerInteractionService interaction) =>
{
    var logoutCtx = logoutId != null
        ? await interaction.GetLogoutContextAsync(logoutId)
        : null;

    // Clear the IDS session cookie
    await http.SignOutAsync(IdentityServerConstants.DefaultCookieAuthenticationScheme);

    // After IDS logout, send the browser to the post-logout redirect URI (usually
    // /signout-callback-oidc so the OIDC middleware can finalise on the client side),
    // or fall back to the home page.
    var redirectUrl = logoutCtx?.PostLogoutRedirectUri ?? "/";
    return Results.Ok(new { redirectUrl });
});

app.Run();

// ── Request / response models ─────────────────────────────────────────────────

record LoginRequest(string Username, string Password, bool RememberMe, string ReturnUrl);
record ConsentRequest(bool Allow, List<string>? Scopes, bool Remember, string ReturnUrl);
record ScopeInfo(string Value, string DisplayName, string? Description, bool Required);
record LogoutRequest(string? LogoutId);

// ── IDS Config ────────────────────────────────────────────────────────────────

static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
    [
        new IdentityResources.OpenId(),
        new IdentityResources.Profile(),
    ];

    public static IEnumerable<ApiScope> ApiScopes =>
    [
        new ApiScope("api", "Demo API"),
    ];

    public static IEnumerable<ApiResource> ApiResources =>
    [
        new ApiResource("api", "Demo API") { Scopes = { "api" } }
    ];

    public static IEnumerable<Client> Clients =>
    [
        new Client
        {
            ClientId      = "demo-client",
            ClientName    = "OIDC Demo Client",
            ClientSecrets = { new Secret("super-secret".Sha256()) },

            AllowedGrantTypes      = GrantTypes.Code,
            RequirePkce            = true,
            RequireConsent         = true,

            RedirectUris           = { "https://localhost:5200/signin-oidc" },
            PostLogoutRedirectUris = { "https://localhost:5200/" },
            FrontChannelLogoutUri  = "https://localhost:5200/signout-oidc",

            AllowedScopes      = { "openid", "profile", "api" },
            AllowOfflineAccess = true,
        }
    ];

    public static List<TestUser> TestUsers =>
    [
        new TestUser
        {
            SubjectId = "user-001",
            Username  = "alice",
            Password  = "alice",
            Claims    =
            [
                new Claim("name",    "Alice Smith"),
                new Claim("email",   "alice@example.com"),
                new Claim("website", "https://alice.example.com"),
            ]
        },
        new TestUser
        {
            SubjectId = "user-002",
            Username  = "bob",
            Password  = "bob",
            Claims    =
            [
                new Claim("name",  "Bob Jones"),
                new Claim("email", "bob@example.com"),
            ]
        }
    ];
}