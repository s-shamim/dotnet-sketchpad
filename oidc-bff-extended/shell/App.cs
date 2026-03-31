#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

// Shell — purely a static file server.
// All application logic lives in wwwroot/script.jsx (React SPA).
// Authentication is handled by the BFF (port 5205) — this app has no auth middleware.

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseKestrel(o =>
    o.ListenLocalhost(5201, lo => lo.UseHttps()));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();
