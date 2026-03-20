# dotnet-scripts

A personal sandbox repo of **.NET 10 file-based C# apps** — no `.csproj`, no solution files, just `.cs` files and `dotnet run`.

---

## What is a File-Based App?

A .NET 10 feature that lets you run a single `.cs` file directly:

```bash
dotnet run HelloWorld.cs
```

No project setup, no boilerplate. Great for scripts, prototypes, and learning.

---

## Repo Structure

```
📁 dotnet-scripts/
  │
  ├── .github/
  │   └── copilot-instructions.md ← Copilot workspace rules
  │
  ├── .vscode/
  │   └── tasks.json              ← VS Code run task (▷ button)
  │
  ├── HelloWorld.cs               ← simple single-file app
  ├── LinqBasics.cs
  ├── DataTypes.cs
  │
  ├── 📁 web-api-static/          ← folder app (has wwwroot)
  │   ├── App.cs                  ← entry point, always named App.cs
  │   ├── app.run.json            ← launch profile with unique port
  │   ├── appsettings.json
  │   └── 📁 wwwroot/
  │       ├── index.html
  │       └── script.jsx
  │
  └── 📁 json-explorer/           ← folder app (has SQLite + UI)
      ├── App.cs
      ├── app.run.json
      ├── appsettings.json
      ├── app.db                  ← SQLite database
      └── 📁 wwwroot/
          ├── index.html
          └── script.jsx
```

### Rules

| Scenario | Convention |
|---|---|
| Single `.cs` file, no extra files | `PascalCase.cs` at repo root |
| App with `wwwroot`, assets, SQLite, or config | `kebab-case/` folder, entry point always `App.cs` |
| Launch profile | `app.run.json` next to `App.cs`, unique port per app |
| Configuration | `appsettings.json` next to `App.cs` (auto-loaded) |

---

## Running Apps

### Using VS Code

1. Open the `.cs` file you want to run
   - Root-level apps → open `HelloWorld.cs`
   - Folder apps → open `App.cs` inside the folder
2. Click **▷** or press `Ctrl+Shift+B`

> Whatever `.cs` file is **active in the editor** is what gets run.

### Using the Terminal

```bash
# Single-file app
dotnet run HelloWorld.cs

# Folder-based app
dotnet run web-api-static/App.cs
```

---

## VS Code Setup (`.vscode/tasks.json`)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run C# File-Based App",
      "type": "shell",
      "command": "dotnet",
      "args": ["run", "${file}"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "shared",
        "clear": true
      },
      "problemMatcher": "$msCompile"
    }
  ]
}
```

---

## Web Apps

Web API and static file apps use the `Microsoft.NET.Sdk.Web` SDK directive:

```csharp
// App.cs
#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

var builder = WebApplication.CreateBuilder();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();   // serves from ./wwwroot automatically

app.MapGet("/api/hello", () => "Hello!");

app.Run();
```

Static files in `wwwroot/` are served at their relative path — e.g. `wwwroot/index.html` → `http://localhost:5100/`.

---

## Configuration

Folder-based Web apps auto-load `appsettings.json` from the same directory — no manual wiring needed:

```json
{
  "MyApp": {
    "Title": "My App"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=app.db"
  }
}
```

For sensitive values (API keys etc.), use .NET user secrets instead:

```bash
dotnet user-secrets set "ApiKey" "your-value" --file App.cs
```

---

## SQLite with EF Core

Folder apps that need data persistence use EF Core + SQLite with auto migration and seeding at startup:

```csharp
#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*

using Microsoft.EntityFrameworkCore;

class Item
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}

class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Item> Items => Set<Item>();
}

var builder = WebApplication.CreateBuilder();
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=app.db"));

var app = builder.Build();

// Auto migrate + seed on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    if (!db.Items.Any())
    {
        db.Items.Add(new Item { Name = "Seed item" });
        db.SaveChanges();
    }
}

app.MapGet("/api/items", async (AppDbContext db) => await db.Items.ToListAsync());
app.Run();
```

---

## UI Stack (wwwroot)

When a UI is needed, use React + Tailwind via CDN — no build step:

```html
<!-- wwwroot/index.html -->
<!DOCTYPE html>
<html>
<head>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="script.jsx" data-type="module"></script>
</body>
</html>
```

```jsx
// wwwroot/script.jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

---

## NuGet Packages

Use `#:package` directives at the top of the file — no `.csproj` needed:

```csharp
#:package NJsonSchema@11.0.2

using NJsonSchema;
var schema = await JsonSchema.FromSampleJsonAsync("{ \"name\": \"Alice\" }");
Console.WriteLine(schema.ToJson());
```

---

## Requirements

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [VS Code](https://code.visualstudio.com/) with the [C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit) extension