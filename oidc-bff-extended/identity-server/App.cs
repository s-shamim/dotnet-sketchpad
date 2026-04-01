#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Duende.IdentityServer@7.*

using Duende.IdentityServer;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Duende.IdentityServer.Test;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Cors;
using System.Security.Claims;

// ── Bootstrap ──────────────────────────────────────────────────────────────────

var builder = WebApplication.CreateBuilder(args);

// ── CORS — allow Identity UI origin with credentials ──────────────────────────
builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p => p
        .WithOrigins("https://identity-ui.localhost:5204")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));

// ── Duende IdentityServer ──────────────────────────────────────────────────────
// Login / logout / error pages live in a separate Identity UI app (5204).
// No Razor Pages needed — all interaction endpoints are served below as minimal APIs.
builder.Services.AddIdentityServer(opt =>
{
    opt.IssuerUri                     = "https://identity.localhost:5203";
    opt.UserInteraction.LoginUrl      = "https://identity-ui.localhost:5204/login.html";
    opt.UserInteraction.LogoutUrl     = "https://identity-ui.localhost:5204/logout.html";
    opt.UserInteraction.ErrorUrl      = "https://identity-ui.localhost:5204/error.html";
    opt.Events.RaiseSuccessEvents     = true;
    opt.Events.RaiseFailureEvents     = true;
    // Disable PAR — the OIDC middleware defaults to UseIfAvailable and will attempt PAR
    // if advertised. Without full PAR wiring the authorize request arrives with only
    // client_id + request_uri and fails validation. Disabling avoids the issue entirely.
    opt.Endpoints.EnablePushedAuthorizationEndpoint = false;
})
.AddInMemoryClients(IdsConfig.Clients)
.AddInMemoryIdentityResources(IdsConfig.IdentityResources)
.AddInMemoryApiScopes(IdsConfig.ApiScopes)
.AddInMemoryApiResources(IdsConfig.ApiResources)
.AddTestUsers(IdsConfig.TestUsers)
.AddDeveloperSigningCredential();

builder.Services.AddAuthorization();

builder.WebHost.UseKestrel(o =>
    o.ListenLocalhost(5203, lo => lo.UseHttps()));

var app = builder.Build();

app.UseCors();
app.UseHttpsRedirection();
app.UseRouting();
app.UseIdentityServer();
app.UseAuthentication();
app.UseAuthorization();

// ── IDS Interaction API — replaces Razor Pages ────────────────────────────────

// GET — login.html calls this on load to resolve the returnUrl/login-hint context.
// Read the raw query string manually to preserve IDS-encoded returnUrl exactly.
app.MapGet("/api/ids/login", [EnableCors] async (
    HttpContext http,
    IIdentityServerInteractionService interaction) =>
{
    var returnUrl = http.Request.Query["returnUrl"].FirstOrDefault()
                 ?? http.Request.Query["ReturnUrl"].FirstOrDefault()
                 ?? "/";

    var ctx = await interaction.GetAuthorizationContextAsync(returnUrl);
    return Results.Ok(new
    {
        returnUrl,
        clientName   = ctx?.Client?.ClientName ?? ctx?.Client?.ClientId,
        loginHint    = ctx?.LoginHint,
        contextFound = ctx != null,
    });
});

// POST — validate credentials, sign in with IDS cookie, return redirect URL to JS.
app.MapPost("/api/ids/login", [EnableCors] async (
    HttpContext http,
    IIdentityServerInteractionService interaction,
    TestUserStore users) =>
{
    var form      = await http.Request.ReadFromJsonAsync<LoginRequest>();
    var returnUrl = form?.ReturnUrl ?? "/";

    if (!users.ValidateCredentials(form?.Username ?? "", form?.Password ?? ""))
        return Results.BadRequest(new { error = "invalid username or password." });

    var user = users.FindByUsername(form!.Username)!;

    // Use IdentityServerUser so Duende automatically includes auth_time, idp, amr claims.
    // Without these, IDS reads the idsrv cookie back as SubjectId=anonymous and
    // redirects to login again.
    var isUser = new IdentityServerUser(user.SubjectId)
    {
        DisplayName      = user.Username,
        AdditionalClaims = user.Claims.ToList(),
    };
    await http.SignInAsync(isUser);

    // Validate the returnUrl is a legitimate IDS-issued authorize URL.
    // Pass the raw (still-encoded) returnUrl — do not decode before passing.
    var authCtx    = await interaction.GetAuthorizationContextAsync(returnUrl);
    var redirectUrl = authCtx != null ? returnUrl : "/";

    return Results.Ok(new { redirectUrl, contextFound = authCtx != null });
});

// GET — logout.html calls this to complete the IDS server-side sign-out.
app.MapGet("/api/ids/logout", [EnableCors] async (
    string? logoutId,
    HttpContext http,
    IIdentityServerInteractionService interaction) =>
{
    var logoutCtx = logoutId != null
        ? await interaction.GetLogoutContextAsync(logoutId)
        : null;

    // Clear the IDS session cookie
    await http.SignOutAsync(IdentityServerConstants.DefaultCookieAuthenticationScheme);

    // Redirect to the IDS-issued post-logout redirect URI (usually the BFF's /bff/post-logout),
    // or fall back to the BFF root.
    var redirectUrl = logoutCtx?.PostLogoutRedirectUri ?? "https://bff.localhost:5205/bff/post-logout";
    return Results.Ok(new { redirectUrl });
});

app.Run();

// ── Request / response records ────────────────────────────────────────────────
// Models MUST come after app.Run() in file-based apps.

record LoginRequest(string Username, string Password, string ReturnUrl);

// ── IDS Configuration ─────────────────────────────────────────────────────────

static class IdsConfig
{
    public static IEnumerable<IdentityResource> IdentityResources =>
    [
        new IdentityResources.OpenId(),
        new IdentityResources.Profile(),
    ];

    public static IEnumerable<ApiScope> ApiScopes =>
    [
        new ApiScope("inventory", "Inventory API"),
    ];

    public static IEnumerable<ApiResource> ApiResources =>
    [
        // The audience claim in issued JWTs will be "inventory-api".
        new ApiResource("inventory-api", "Inventory API") { Scopes = { "inventory" } }
    ];

    public static IEnumerable<Client> Clients =>
    [
        new Client
        {
            ClientId      = "bff-client",
            ClientName    = "BFF Client",
            ClientSecrets = { new Secret("bff-secret".Sha256()) },

            AllowedGrantTypes = GrantTypes.Code,
            RequirePkce       = true,
            RequireConsent    = false,   // no consent screen in this demo

            RedirectUris           = { "https://bff.localhost:5205/bff/signin-oidc" },
            PostLogoutRedirectUris = { "https://bff.localhost:5205/bff/post-logout" },
            FrontChannelLogoutUri  = "https://bff.localhost:5205/bff/frontchannel-logout",

            AllowedScopes    = { "openid", "profile", "inventory" },
            AllowOfflineAccess = false,  // no refresh tokens in this demo
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
                new Claim("name",  "Alice Smith"),
                new Claim("email", "alice@example.com"),
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
        },
    ];
}
