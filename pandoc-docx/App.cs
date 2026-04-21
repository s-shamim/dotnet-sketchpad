#!/usr/bin/env dotnet run
#:sdk Microsoft.NET.Sdk.Web
#:property PublishAot=false
#:property Nullable=enable

using System.Diagnostics;
using System.Text;

var builder = WebApplication.CreateBuilder();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// ── Health check — surface pandoc availability to UI ─────────────────────────
app.MapGet("/api/health", () =>
{
    var (installed, version) = GetPandocVersion();
    return installed
        ? Results.Ok(new { status = "ok", pandoc = version })
        : Results.Json(new { status = "error", message = "pandoc not found" }, statusCode: 503);
});

// ── Convert markdown → docx via pandoc ───────────────────────────────────────
app.MapPost("/api/convert", async (ConvertRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Markdown))
        return Results.BadRequest(new { error = "markdown content is empty." });

    var pandocPath = ResolvePandocPath();
    if (pandocPath is null)
        return Results.Json(new { error = "pandoc is not installed on the server." }, statusCode: 503);

    var tempDir = Path.Combine(Path.GetTempPath(), $"pandoc-docx-{Guid.NewGuid():N}");
    Directory.CreateDirectory(tempDir);

    var inputPath  = Path.Combine(tempDir, "input.md");
    var outputPath = Path.Combine(tempDir, "output.docx");

    try
    {
        await File.WriteAllTextAsync(inputPath, req.Markdown, Encoding.UTF8);

        var args = new StringBuilder();
        args.Append("--from markdown+smart ");
        args.Append("--to docx ");
        args.Append("--standalone ");
        args.Append("--highlight-style=tango ");
        args.Append("--wrap=none ");
        args.Append($"-o \"{outputPath}\" ");
        args.Append($"\"{inputPath}\"");

        var psi = new ProcessStartInfo
        {
            FileName        = pandocPath,
            Arguments       = args.ToString(),
            RedirectStandardError  = true,
            RedirectStandardOutput = true,
            UseShellExecute = false,
            CreateNoWindow  = true,
        };

        using var process = new Process { StartInfo = psi };

        var stderr = new StringBuilder();
        process.ErrorDataReceived += (_, e) =>
        {
            if (e.Data is not null) stderr.AppendLine(e.Data);
        };

        process.Start();
        process.BeginErrorReadLine();
        await process.WaitForExitAsync();

        if (process.ExitCode != 0 || !File.Exists(outputPath))
        {
            var msg = stderr.ToString().Trim();
            return Results.Json(
                new { error = string.IsNullOrEmpty(msg) ? "pandoc conversion failed." : msg },
                statusCode: 500);
        }

        var bytes = await File.ReadAllBytesAsync(outputPath);
        return Results.File(
            bytes,
            contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            fileDownloadName: "document.docx");
    }
    finally
    {
        try { Directory.Delete(tempDir, recursive: true); } catch { }
    }
});

// ── Helpers ──────────────────────────────────────────────────────────────────

static string? ResolvePandocPath()
{
    // Try PATH first
    try
    {
        using var p = Process.Start(new ProcessStartInfo
        {
            FileName = "pandoc",
            Arguments = "--version",
            RedirectStandardOutput = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        });
        if (p is not null) { p.WaitForExit(); if (p.ExitCode == 0) return "pandoc"; }
    }
    catch { }

    // Check common install locations on Windows
    string[] candidates =
    [
        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Pandoc", "pandoc.exe"),
        @"C:\Program Files\Pandoc\pandoc.exe",
        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "scoop", "shims", "pandoc.exe"),
        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "chocolatey", "bin", "pandoc.exe"),
    ];

    return candidates.FirstOrDefault(File.Exists);
}

static (bool Installed, string Version) GetPandocVersion()
{
    var path = ResolvePandocPath();
    if (path is null) return (false, "");

    try
    {
        using var p = Process.Start(new ProcessStartInfo
        {
            FileName = path,
            Arguments = "--version",
            RedirectStandardOutput = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        });
        if (p is null) return (false, "");
        var output = p.StandardOutput.ReadLine() ?? "";
        p.WaitForExit();
        return p.ExitCode == 0 ? (true, output.Trim()) : (false, "");
    }
    catch
    {
        return (false, "");
    }
}

app.Run();

// ── Types ────────────────────────────────────────────────────────────────────

record ConvertRequest(string Markdown);
