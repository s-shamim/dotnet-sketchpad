#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

using System.Diagnostics;

var builder = WebApplication.CreateBuilder();
builder.Services.AddTransient<FibonacciCalculator>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/fibonacci/memoized", (int n, FibonacciCalculator calc) =>
{
    if (n < 0 || n > 50)
        return Results.BadRequest("n must be between 0 and 50.");

    var sw = Stopwatch.StartNew();
    var value = calc.CalculateFibonacci(n);
    sw.Stop();

    return Results.Ok(new { value, elapsedMs = sw.Elapsed.TotalMilliseconds });
});

app.MapGet("/api/fibonacci/naive", (int n, FibonacciCalculator calc) =>
{
    if (n < 0 || n > 50)
        return Results.BadRequest("n must be between 0 and 50.");

    var sw = Stopwatch.StartNew();
    var value = calc.CalculateFibonacciWithoutMemoization(n);
    sw.Stop();

    return Results.Ok(new { value, elapsedMs = sw.Elapsed.TotalMilliseconds });
});

app.Run();

// --- Types ---

class FibonacciCalculator
{
    private readonly Dictionary<int, long> _memo = new();

    public long CalculateFibonacci(int n)
    {
        if (n == 0) return 0;
        if (n == 1) return 1;
        if (_memo.TryGetValue(n, out var cached)) return cached;
        var result = CalculateFibonacci(n - 1) + CalculateFibonacci(n - 2);
        _memo[n] = result;
        return result;
    }

    public long CalculateFibonacciWithoutMemoization(int n)
    {
        if (n == 0) return 0;
        if (n == 1) return 1;
        return CalculateFibonacciWithoutMemoization(n - 1) + CalculateFibonacciWithoutMemoization(n - 2);
    }
}
