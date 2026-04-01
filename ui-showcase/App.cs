#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

var builder = WebApplication.CreateBuilder();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();

