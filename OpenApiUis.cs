#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@9.0.5
#:package Swashbuckle.AspNetCore.SwaggerUI@8.1.2
#:package Swashbuckle.AspNetCore.ReDoc@8.1.2
#:package Scalar.AspNetCore@2.4.3

using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/v1.json", "OpenAPI V1");
});

app.UseReDoc(options =>
{
    options.SpecUrl = "/openapi/v1.json";
});

app.MapScalarApiReference();

app.MapGet("/", () => "Hello, World!");

app.Run();


// dotnet run .\OpenApiUis.cs --urls="http://localhost:8080;https://localhost:5000"

// OpenAPI UI: https://localhost:5000/openapi/v1.json

// http://localhost:5000/swagger
// http://localhost:5000/api-docs
// http://localhost:5000/scalar
