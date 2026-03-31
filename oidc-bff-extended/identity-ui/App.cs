#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

// Identity UI — purely a static file server.
// All interaction logic lives in wwwroot/login.html, logout.html, error.html (React JSX).
// No auth middleware, no IDS packages — this app has no backend responsibilities.

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseKestrel(o =>
    o.ListenLocalhost(5204, lo => lo.UseHttps()));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();
