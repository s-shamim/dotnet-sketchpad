#!/usr/bin/env dotnet-script
#:package Microsoft.CodeAnalysis.CSharp@4.*
#:package Spectre.Console@0.*

/// <summary>
/// .NET 10 File-Based App — App Documentation Generator
/// Scans a .NET Web API solution (Controller / Business / DAL / Model layers)
/// and emits a structured Markdown knowledge-base file.
///
/// Usage:
///   dotnet run generate-app-doc.cs -- --solution "C:\MySolutions\OrderService" --output "C:\Docs"
///   dotnet run generate-app-doc.cs -- --help
/// </summary>

using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using Spectre.Console;

// ── CLI argument parsing ──────────────────────────────────────────────────────

string? solutionPath = null;
string? outputPath   = null;
string? appName      = null;

for (int i = 0; i < args.Length; i++)
{
    switch (args[i])
    {
        case "--solution": solutionPath = args[++i]; break;
        case "--output":   outputPath   = args[++i]; break;
        case "--name":     appName      = args[++i]; break;
        case "--help":
            AnsiConsole.MarkupLine("""
                [bold yellow]App Doc Generator[/] — .NET 10 file-based app

                [grey]Usage:[/]
                  dotnet run generate-app-doc.cs -- [bold]--solution[/] <path> [bold]--output[/] <path> [[bold]--name[/] <AppName>]

                [grey]Options:[/]
                  [bold]--solution[/]   Root folder of the .NET solution (required)
                  [bold]--output[/]     Folder where the .md file is saved (required)
                  [bold]--name[/]       Override the app name (default: solution folder name)
                  [bold]--help[/]       Show this message
                """);
            return;
    }
}

if (string.IsNullOrWhiteSpace(solutionPath) || string.IsNullOrWhiteSpace(outputPath))
{
    AnsiConsole.MarkupLine("[red]Error:[/] --solution and --output are required. Run with --help for usage.");
    Environment.Exit(1);
}

if (!Directory.Exists(solutionPath))
{
    AnsiConsole.MarkupLine($"[red]Error:[/] Solution path not found: {solutionPath}");
    Environment.Exit(1);
}

Directory.CreateDirectory(outputPath);
appName ??= new DirectoryInfo(solutionPath).Name;

AnsiConsole.MarkupLine($"[bold green]Scanning[/] [cyan]{appName}[/] at [grey]{solutionPath}[/]");

// ── Helpers ───────────────────────────────────────────────────────────────────

static IEnumerable<string> GetCsFiles(string root, params string[] folderHints)
{
    return folderHints
        .SelectMany(hint =>
            Directory.EnumerateFiles(root, "*.cs", SearchOption.AllDirectories)
                     .Where(f => f.Replace('\\', '/').Contains($"/{hint}/",
                                StringComparison.OrdinalIgnoreCase)))
        .Distinct();
}

static string StripComments(string src) =>
    Regex.Replace(src, @"//.*?$|/\*.*?\*/", "", RegexOptions.Multiline | RegexOptions.Singleline);

// Extract public class/interface/enum declarations
static IEnumerable<string> ExtractTypeDeclarations(string src) =>
    Regex.Matches(StripComments(src),
        @"(?:public|internal)\s+(?:static\s+|abstract\s+|sealed\s+)*(?:class|interface|record|enum)\s+(\w+)(?:\s*<[^>]+>)?(?:\s*:\s*[^\{]+)?")
    .Select(m => m.Value.Trim());

// Extract public method signatures (no body)
static IEnumerable<string> ExtractMethodSignatures(string src) =>
    Regex.Matches(StripComments(src),
        @"(?:public|protected)\s+(?:async\s+|static\s+|virtual\s+|override\s+)*(?:Task<?[^>]*>?|\w+(?:<[^>]+>)?)\s+(\w+)\s*\([^)]*\)")
    .Select(m => m.Value.Trim())
    .Distinct();

// Extract [Http*] route attributes
static IEnumerable<(string verb, string route, string action)> ExtractEndpoints(string src)
{
    var results = new List<(string, string, string)>();
    var actionBlocks = Regex.Matches(src,
        @"\[Http(Get|Post|Put|Delete|Patch)(?:\(""([^""]*)""\))?\]\s+(?:\[[^\]]+\]\s+)*public\s+[^\n]+\s+(\w+)\s*\(");
    foreach (Match m in actionBlocks)
    {
        var verb   = m.Groups[1].Value.ToUpper();
        var route  = m.Groups[2].Value is { Length: > 0 } r ? r : "(no sub-route)";
        var action = m.Groups[3].Value;
        results.Add((verb, route, action));
    }
    return results;
}

// Extract controller-level [Route(...)]
static string ExtractControllerRoute(string src)
{
    var m = Regex.Match(src, @"\[Route\(""([^""]+)""\)\]");
    return m.Success ? m.Groups[1].Value : "unknown";
}

// Extract NuGet packages from .csproj files
static IEnumerable<string> ExtractPackages(string root) =>
    Directory.EnumerateFiles(root, "*.csproj", SearchOption.AllDirectories)
             .SelectMany(f => Regex.Matches(File.ReadAllText(f),
                 @"<PackageReference\s+Include=""([^""]+)""\s+Version=""([^""]+)""")
             .Select(m => $"{m.Groups[1].Value} {m.Groups[2].Value}"))
             .Distinct()
             .OrderBy(p => p);

// Extract appsettings keys (non-sensitive)
static IEnumerable<string> ExtractAppSettingsKeys(string root)
{
    var settingsFile = Directory.EnumerateFiles(root, "appsettings.json", SearchOption.AllDirectories)
                                .FirstOrDefault();
    if (settingsFile is null) return [];
    return Regex.Matches(File.ReadAllText(settingsFile), @"""(\w+)""\s*:")
                .Select(m => m.Groups[1].Value)
                .Where(k => !k.Equals("ConnectionStrings", StringComparison.OrdinalIgnoreCase))
                .Distinct();
}

// ── Scan layers ───────────────────────────────────────────────────────────────

var sb = new StringBuilder();

sb.AppendLine($"# {appName} — Application Knowledge Base");
sb.AppendLine($"> Auto-generated by `generate-app-doc.cs` on {DateTime.Now:yyyy-MM-dd HH:mm}");
sb.AppendLine();

// ── Solution structure ────────────────────────────────────────────────────────
sb.AppendLine("## Solution Structure");
sb.AppendLine();
var projects = Directory.EnumerateFiles(solutionPath, "*.csproj", SearchOption.AllDirectories)
                         .Select(f => Path.GetFileNameWithoutExtension(f))
                         .OrderBy(n => n)
                         .ToList();
foreach (var p in projects)
    sb.AppendLine($"- `{p}`");
sb.AppendLine();

// ── Controllers ───────────────────────────────────────────────────────────────
sb.AppendLine("## Controllers & Endpoints");
sb.AppendLine();

var controllerFiles = GetCsFiles(solutionPath, "Controllers")
    .Where(f => f.EndsWith("Controller.cs", StringComparison.OrdinalIgnoreCase))
    .OrderBy(f => f)
    .ToList();

if (controllerFiles.Count == 0)
{
    sb.AppendLine("_No controller files found._");
}
else
{
    foreach (var file in controllerFiles)
    {
        var src      = File.ReadAllText(file);
        var ctrlName = Path.GetFileNameWithoutExtension(file);
        var baseRoute = ExtractControllerRoute(src);
        var endpoints = ExtractEndpoints(src).ToList();

        sb.AppendLine($"### `{ctrlName}` — base route: `{baseRoute}`");
        sb.AppendLine();
        if (endpoints.Count == 0)
        {
            sb.AppendLine("_No HTTP action methods detected._");
        }
        else
        {
            sb.AppendLine("| Method | Sub-Route | Action |");
            sb.AppendLine("|--------|-----------|--------|");
            foreach (var (verb, route, action) in endpoints)
                sb.AppendLine($"| `{verb}` | `{route}` | `{action}` |");
        }
        sb.AppendLine();

        // also list constructor deps (basic DI scanning)
        var ctorDeps = Regex.Matches(src, @"private\s+readonly\s+([\w<>]+)\s+\w+;")
                            .Select(m => m.Groups[1].Value)
                            .Distinct()
                            .ToList();
        if (ctorDeps.Count > 0)
            sb.AppendLine($"**Injected dependencies:** {string.Join(", ", ctorDeps.Select(d => $"`{d}`"))}");

        sb.AppendLine();
        sb.AppendLine("---");
        sb.AppendLine();
    }
}

// ── Business Layer ────────────────────────────────────────────────────────────
sb.AppendLine("## Business Layer");
sb.AppendLine();

var bizFiles = GetCsFiles(solutionPath, "Business", "BusinessLogic", "Services", "Service")
    .Where(f => !f.Contains("obj", StringComparison.OrdinalIgnoreCase))
    .OrderBy(f => f)
    .ToList();

foreach (var file in bizFiles)
{
    var src      = File.ReadAllText(file);
    var fileName = Path.GetFileNameWithoutExtension(file);
    var types    = ExtractTypeDeclarations(src).ToList();
    var methods  = ExtractMethodSignatures(src).ToList();

    sb.AppendLine($"### `{fileName}`");
    if (types.Count > 0)
    {
        sb.AppendLine();
        sb.AppendLine("**Types:**");
        foreach (var t in types)
            sb.AppendLine($"```csharp\n{t}\n```");
    }
    if (methods.Count > 0)
    {
        sb.AppendLine();
        sb.AppendLine("**Public Methods:**");
        foreach (var m in methods)
            sb.AppendLine($"- `{m}`");
    }
    sb.AppendLine();
}
if (bizFiles.Count == 0)
    sb.AppendLine("_No business layer files found (checked: Business, BusinessLogic, Services folders)._\n");

// ── DAL ───────────────────────────────────────────────────────────────────────
sb.AppendLine("## Data Access Layer (DAL)");
sb.AppendLine();

var dalFiles = GetCsFiles(solutionPath, "DAL", "DataAccess", "Repositories", "Repository", "Data")
    .Where(f => !f.Contains("obj", StringComparison.OrdinalIgnoreCase))
    .OrderBy(f => f)
    .ToList();

foreach (var file in dalFiles)
{
    var src      = File.ReadAllText(file);
    var fileName = Path.GetFileNameWithoutExtension(file);
    var types    = ExtractTypeDeclarations(src).ToList();
    var methods  = ExtractMethodSignatures(src).ToList();

    sb.AppendLine($"### `{fileName}`");
    if (types.Count > 0)
    {
        sb.AppendLine();
        sb.AppendLine("**Types:**");
        foreach (var t in types)
            sb.AppendLine($"```csharp\n{t}\n```");
    }
    if (methods.Count > 0)
    {
        sb.AppendLine();
        sb.AppendLine("**Public Methods:**");
        foreach (var m in methods)
            sb.AppendLine($"- `{m}`");
    }
    sb.AppendLine();

    // detect raw SQL / stored proc calls
    var sqlCalls = Regex.Matches(src, @"(?:""sp_\w+""|ExecuteSqlRaw|FromSqlRaw|CommandText|StoredProcedure)\s*[=(,]?\s*""([^""]+)""")
                        .Select(m => m.Groups[1].Value)
                        .Distinct()
                        .ToList();
    if (sqlCalls.Count > 0)
    {
        sb.AppendLine("**Detected SQL / Stored Proc calls:**");
        foreach (var s in sqlCalls)
            sb.AppendLine($"- `{s}`");
        sb.AppendLine();
    }
}
if (dalFiles.Count == 0)
    sb.AppendLine("_No DAL files found (checked: DAL, DataAccess, Repositories, Data folders)._\n");

// ── Models ────────────────────────────────────────────────────────────────────
sb.AppendLine("## Models");
sb.AppendLine();

var modelFiles = GetCsFiles(solutionPath, "Models", "Model", "Entities", "DTOs", "DTO")
    .Where(f => !f.Contains("obj", StringComparison.OrdinalIgnoreCase))
    .OrderBy(f => f)
    .ToList();

foreach (var file in modelFiles)
{
    var src      = File.ReadAllText(file);
    var fileName = Path.GetFileNameWithoutExtension(file);
    var props    = Regex.Matches(StripComments(src),
                       @"public\s+(?:required\s+)?(\w+(?:\?|<[^>]+>)?)\s+(\w+)\s*\{\s*get;")
                   .Select(m => $"{m.Groups[2].Value}: `{m.Groups[1].Value}`")
                   .Distinct()
                   .ToList();

    sb.AppendLine($"### `{fileName}`");
    if (props.Count > 0)
    {
        foreach (var p in props)
            sb.AppendLine($"- {p}");
    }
    sb.AppendLine();
}
if (modelFiles.Count == 0)
    sb.AppendLine("_No model files found (checked: Models, Entities, DTOs folders)._\n");

// ── NuGet Dependencies ────────────────────────────────────────────────────────
sb.AppendLine("## NuGet Dependencies");
sb.AppendLine();
var packages = ExtractPackages(solutionPath).ToList();
if (packages.Count > 0)
    foreach (var pkg in packages)
        sb.AppendLine($"- `{pkg}`");
else
    sb.AppendLine("_No .csproj files found or no PackageReference entries detected._");
sb.AppendLine();

// ── AppSettings ───────────────────────────────────────────────────────────────
sb.AppendLine("## Configuration Keys (appsettings.json)");
sb.AppendLine();
var keys = ExtractAppSettingsKeys(solutionPath).ToList();
if (keys.Count > 0)
    foreach (var k in keys)
        sb.AppendLine($"- `{k}`");
else
    sb.AppendLine("_appsettings.json not found or no keys detected._");
sb.AppendLine();

// ── Write output ──────────────────────────────────────────────────────────────

var outFile = Path.Combine(outputPath, $"{appName}.md");
File.WriteAllText(outFile, sb.ToString(), Encoding.UTF8);
AnsiConsole.MarkupLine($"[bold green]✔ App doc written:[/] [cyan]{outFile}[/]");