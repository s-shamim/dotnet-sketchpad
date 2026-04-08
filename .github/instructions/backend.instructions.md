---
applyTo: "**/*.cs"
---

# Backend — C# File-Based Apps

## Required Directives — Every `.cs` File

Always include at the top, before any `using` or code:

```csharp
#:property PublishAot=false
```

For Web / API apps:

```csharp
#:sdk Microsoft.NET.Sdk.Web
```

For NuGet packages:

```csharp
#:package SomePackage@1.2.3
```

---

## Templates

### Minimal console app

```csharp
#:property PublishAot=false

Console.WriteLine("Hello!");
```

### Minimal Web API app

```csharp
#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

var builder = WebApplication.CreateBuilder();
var app = builder.Build();

app.MapGet("/api/hello", () => "Hello!");

app.Run();
```

### Web API with static files (wwwroot)

```csharp
#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

var builder = WebApplication.CreateBuilder();
var app = builder.Build();

app.UseDefaultFiles();   // serves index.html automatically
app.UseStaticFiles();    // serves from ./wwwroot

app.MapGet("/api/hello", () => "Hello!");

app.Run();
```

---

## Run Configuration (`app.run.json`)

Every folder-based app must have `app.run.json` next to `App.cs`.
Assign a **unique port** per app to avoid conflicts.

```json
{
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "http://localhost:5100",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

**Port allocation** — increment per app starting from `5100`:

| App order | Port |
|---|---|
| 1st app | 5100 |
| 2nd app | 5101 |
| 3rd app | 5102 |

---

## Settings & Configuration

### Web apps — `appsettings.json` (auto-loaded)

`Microsoft.NET.Sdk.Web` automatically includes all `*.json` files, so `appsettings.json`
is picked up with zero wiring. Place it next to `App.cs`:

```json
{
  "MyApp": {
    "Title": "My App",
    "MaxItems": 100
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=app.db"
  }
}
```

Environment overrides follow the standard ASP.NET Core convention:

```
appsettings.json
appsettings.Development.json
appsettings.Production.json
```

Read in code via `IConfiguration` (injected automatically in Web apps):

```csharp
app.MapGet("/config", (IConfiguration config) =>
    config["MyApp:Title"]);
```

### Console apps — manual load

```csharp
#:property PublishAot=false
#:package Microsoft.Extensions.Configuration.Json@10.*

var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true)
    .Build();

Console.WriteLine(config["MyApp:Title"]);
```

### Secrets — sensitive values

Never put secrets in `appsettings.json`. Use .NET user secrets:

```bash
dotnet user-secrets set "ApiKey" "your-secret-value" --file App.cs
```

---

## SQLite with EF Core

Use EF Core + SQLite for any data persistence need in a folder-based app.
Always **auto-migrate and seed at startup** — no manual migration commands needed.

### Packages

```csharp
#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*
#:package Microsoft.EntityFrameworkCore.Design@10.*
```

### Full pattern

> ⚠️ **File structure rule**: In file-based apps, top-level statements (`var`, `app.Run()` etc.)
> must come **before** any type or class declarations. Always put models and DbContext
> at the **bottom** of the file, after `app.Run()`.

```csharp
#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*

using Microsoft.EntityFrameworkCore;

// --- Bootstrap (top-level statements FIRST) ---
var builder = WebApplication.CreateBuilder();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=app.db"));

var app = builder.Build();

// Auto migrate + seed on every startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();           // creates schema if it doesn't exist

    if (!db.Items.Any())                   // seed only when empty
    {
        db.Items.AddRange(
            new Item { Name = "Seed item 1" },
            new Item { Name = "Seed item 2" }
        );
        db.SaveChanges();
    }
}

app.MapGet("/api/items", async (AppDbContext db) => await db.Items.ToListAsync());

app.Run();

// --- Types AFTER app.Run() ---

class Item
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}

class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Item> Items => Set<Item>();
}
```

Rules:
- The `.db` file lives next to `App.cs` — never use an absolute path
- Use `EnsureCreated()` for simple apps (no migration history needed)
- Seed only when the table is empty (`if (!db.Items.Any())`)
- Connection string goes in `appsettings.json` for folder apps, inline for simple scripts

---

## What NOT to Do

- ❌ Never set `PublishAot=true` — always `PublishAot=false`
- ❌ Never place class or type declarations before top-level statements — models and DbContext go **after** `app.Run()`
- ❌ Never use an absolute path for SQLite or any file access — `.db` lives next to `App.cs`
- ❌ Never use a custom `app-name.settings.json` — use standard `appsettings.json`
- ❌ Never commit secrets — use `dotnet user-secrets` for sensitive values
- ❌ Never put CDN `<script>` tags in `.jsx` files — they belong in `index.html`
