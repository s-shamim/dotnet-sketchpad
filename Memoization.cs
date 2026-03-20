using System.Diagnostics;

FibonacciCalculator calculator = new FibonacciCalculator();

// Calculate Fibonacci with memoization and measure time taken
var sw = Stopwatch.StartNew();
// var fib10 = calculator.CalculateFibonacci(10);
// sw.Stop();
// Console.WriteLine($"Fibonacci(10) with memoization: {fib10} (took {sw.Elapsed.TotalMilliseconds:N2} ms)");

sw.Restart();
var fib40 = calculator.CalculateFibonacci(50); // This will be fast
sw.Stop();
Console.WriteLine($"Fibonacci(40) with memoization: {fib40} (took {sw.Elapsed.TotalMilliseconds:N2} ms)");

// Calculate Fibonacci without memoization (for comparison - will be much slower for larger inputs)
sw.Restart();
fib40 = calculator.CalculateFibonacciWithoutMemoization(50); // This will be slow
sw.Stop();
Console.WriteLine($"Fibonacci(40) without memoization: {fib40} (tool {calculator.CalculateFibonacciWithoutMemoization(40)} ms)");


public class FibonacciCalculator
{
    private Dictionary<int, long> _memo = new Dictionary<int, long>();

    public long CalculateFibonacci(int n)
    {
        if (n < 0)
        {
            throw new ArgumentException("Input must be a non-negative integer.");
        }

        // Base cases
        if (n == 0) return 0;
        if (n == 1) return 1;

        // Check if the result is already memoized
        if (_memo.ContainsKey(n))
        {
            return _memo[n];
        }

        // If not memoized, calculate and store the result
        long result = CalculateFibonacci(n - 1) + CalculateFibonacci(n - 2);
        _memo[n] = result;
        return result;
    }

    // Example of a non-memoized Fibonacci calculation for comparison
    public long CalculateFibonacciWithoutMemoization(int n)
    {
        if (n < 0)
        {
            throw new ArgumentException("Input must be a non-negative integer.");
        }
        if (n == 0) return 0;
        if (n == 1) return 1;
        return CalculateFibonacciWithoutMemoization(n - 1) + CalculateFibonacciWithoutMemoization(n - 2);
    }
}

