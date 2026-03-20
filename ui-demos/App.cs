#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

var builder = WebApplication.CreateBuilder();
builder.Services.AddHttpClient();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/settings", (IConfiguration config) => new
{
    baseUrl    = config["OpenApi:BaseUrl"]    ?? "",
    swaggerPath = config["OpenApi:SwaggerPath"] ?? "/swagger",
    version    = config["OpenApi:Version"]    ?? "v1"
});

app.MapGet("/api/openapi-proxy", async (string url, IHttpClientFactory factory) =>
{
    if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) ||
        (uri.Scheme != "http" && uri.Scheme != "https"))
    {
        return Results.BadRequest("Invalid URL. Only http and https are allowed.");
    }

    var client = factory.CreateClient();
    try
    {
        var json = await client.GetStringAsync(uri);
        return Results.Content(json, "application/json");
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();
