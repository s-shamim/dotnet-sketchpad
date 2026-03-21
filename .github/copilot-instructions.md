# Copilot Instructions — dotnet-scripts

This repo is a collection of **.NET 10 file-based C# apps** — no `.csproj`, no solution files.
Use these rules for every task, suggestion, or code generation in this workspace.

---

## Core Principle

> Default to a C# file-based app for any logic, task, or proof-of-concept.
> Only create a folder when the app genuinely needs more than one file.

---

## Decision: Single File vs Folder

| Situation | Convention |
|---|---|
| Single `.cs` with no extra files | `PascalCase.cs` at repo root |
| Needs `wwwroot`, assets, SQLite, or config | `kebab-case/` folder, entry point always `App.cs` |

---

## Naming Rules

- **Root-level apps** → `PascalCase.cs` — e.g. `JsonToSchema.cs`, `LinqBasics.cs`
- **Folder-based apps** → `kebab-case/` folder name — e.g. `web-api-static/`, `json-explorer/`
- **Entry point inside a folder** → always `App.cs`
- **Launch profile** → `app.run.json` (matches `App.cs`) — placed next to `App.cs`
- **Settings** → `appsettings.json` next to `App.cs` (auto-loaded by Web SDK — see Settings below)

---

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

## UI — HTML / Tailwind / JSX

When a UI is needed, put files in `wwwroot/` using this CDN-based stack (no build step):

### `wwwroot/index.html`

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>app</title>
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

### `wwwroot/script.jsx`

```jsx
function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          app
        </h1>
        {/* content */}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

Rules:
- All CDN `<script>` tags go in `index.html` only — never in `.jsx`
- One `script.jsx` per app; for complex multi-view apps use the multi-file pattern below
- Use Tailwind utility classes only — no custom CSS files unless necessary
- `App.cs` must always include `app.UseDefaultFiles()` and `app.UseStaticFiles()`

---

## Multi-File JSX (Complex UIs)

Use this pattern only when the UI has many distinct views or tool categories (e.g. `dev-tools/`, `anki-ui/`). For simple apps, one `script.jsx` is enough.

### When to split

| Situation | Convention |
|---|---|
| 1–2 views, simple interactions | Single `script.jsx` |
| Many views, tools, or feature categories | Multi-file JSX with `app.jsx` as entry point |

### Key rules

- Entry point is `app.jsx` (not `script.jsx`) — defines shared helpers, UI primitives, and calls `ReactDOM.render`
- Component files use **no `import`/`export`** — Babel standalone loads each file into global scope via `<script>` tags
- Shared primitives defined in `app.jsx` are available to all component files because React only calls function bodies at render time — by then all scripts are loaded
- **Load order in `index.html` matters**: all leaf component files first, `app.jsx` last

### Folder layout

Organize by category under `wwwroot/`:

```
wwwroot/
  index.html         ← loads all .jsx files; app.jsx last
  app.jsx            ← shared helpers, UI primitives, root App, ReactDOM.render
  views/             ← full-page views (tab/route-based apps like anki-ui)
    AddNote.jsx
    AllNotes.jsx
  converters/        ← tool category (multi-tool apps like dev-tools)
    JsonYaml.jsx
  generators/
    Password.jsx
```

### `index.html` — load order

```html
<!-- leaf components first, app last -->
<script type="text/babel" src="views/AllNotes.jsx"></script>
<script type="text/babel" src="views/AddNote.jsx"></script>

<!-- app.jsx last: defines shared helpers + mounts the app -->
<script type="text/babel" src="app.jsx"></script>
```

### `app.jsx` structure

```jsx
// ── Shared helpers (API calls, utilities) ────────────────
async function api(method, path, body = null) { ... }

// ── Shared UI primitives (available to all component files) ──
function Btn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors disabled:opacity-30 lowercase"
    >
      {children}
    </button>
  );
}

// ── Root App component ───────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = React.useState('tab1');

  const views = {
    'tab1': <Tab1Component />,
    'tab2': <Tab2Component />,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto pt-20 px-4">
        {/* nav + active view */}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

### Leaf component file (e.g. `views/AddNote.jsx`)

```jsx
// No imports — React and shared helpers/primitives are global
function AddNote({ decks, onMutate }) {
  const [input, setInput] = React.useState('');

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        className="flex-1 border-b border-gray-300 py-2 text-gray-700 focus:outline-none text-sm"
      />
      <Btn onClick={() => { /* Btn is defined in app.jsx */ }}>save</Btn>
    </div>
  );
}
```

Reference implementations: `anki-ui/` (tab-based views) · `dev-tools/` (tool categories).

---

## UI Design System

All UIs in this repo share a consistent visual language. Apply these rules to every `script.jsx`.
The reference implementation is `todo-app/wwwroot/script.jsx`.

### Tone
Clean, minimal, quiet. White background, gray text, no decorative color.
Everything lowercase in labels, headings, and buttons.

### Layout
```jsx
// Always: white page, centered single column, generous top padding
<div className="min-h-screen bg-white">
  <div className="max-w-md mx-auto pt-20 px-4">
    ...
  </div>
</div>
```

### Page Title / Heading
```jsx
// Large, light weight, wide tracking, lowercase
<h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
  my app
</h1>
```

### Section Headings
```jsx
// Smaller, uppercase tracking for sub-sections
<h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">
  section title
</h2>
```

### Text Input
```jsx
// Borderless except bottom border — no box, no rounded corners
<input
  type="text"
  placeholder="placeholder..."
  className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
/>
```

### Buttons
```jsx
// Primary action — text only, no background, subtle hover
<button className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors">
  save
</button>

// Destructive — hidden until hover on parent (use `group` + `group-hover`)
<button className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs transition-all">
  ✕
</button>

// Active/selected state — darken text, no background
<button className={`lowercase transition-colors ${active ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}>
  filter
</button>
```

### Lists / Rows
```jsx
// Divider lines only — no cards, no shadows, no rounded containers
<ul className="divide-y divide-gray-100">
  <li className="flex items-center gap-3 py-3 group">
    ...
  </li>
</ul>
```

### Completed / Muted State
```jsx
// Strikethrough + light gray for done/inactive items
<span className={`text-sm ${done ? 'line-through text-gray-300' : 'text-gray-700'}`}>
  item text
</span>
```

### Checkboxes
```jsx
// Muted gray accent — never blue
<input type="checkbox" className="accent-gray-400 w-4 h-4 cursor-pointer" />
```

### Empty State
```jsx
// Centered, quiet, light gray
<p className="text-center text-gray-300 text-sm py-8">
  nothing here yet.
</p>
```

### Footer / Meta Info
```jsx
// Small, gray, space-between layout
<div className="flex items-center justify-between mt-6 text-xs text-gray-400">
  <span>3 items</span>
  <div className="flex gap-3">
    {/* filter buttons etc */}
  </div>
</div>
```

### Color Palette (Tailwind only)
| Role | Class |
|---|---|
| Page background | `bg-white` |
| Primary text | `text-gray-700` |
| Secondary / meta text | `text-gray-400` |
| Placeholder / muted | `text-gray-300` |
| Borders / dividers | `border-gray-100`, `border-gray-300` |
| Input focus border | `focus:border-gray-500` |
| Hover (text) | `hover:text-gray-700` |
| Destructive hover | `hover:text-red-400` |
| Checkbox accent | `accent-gray-400` |
| Active/selected text | `text-gray-700` (darker than default) |

### What NOT to do in UI
- ❌ No colored backgrounds (`bg-blue-500`, `bg-purple-*` etc.)
- ❌ No rounded buttons (`rounded-lg`, `rounded-full`)
- ❌ No card shadows (`shadow-*`)
- ❌ No bold buttons or filled button backgrounds
- ❌ No PascalCase or Title Case in labels — always `lowercase`
- ❌ No icons libraries — use plain unicode (`✕`, `→`) only if needed

---

## Folder Structure Reference

```
📁 dotnet-scripts/
  │
  ├── .github/
  │   └── copilot-instructions.md
  │
  ├── .vscode/
  │   └── tasks.json
  │
  ├── JsonToSchema.cs              ← root-level single-file app
  ├── LinqBasics.cs
  │
  ├── 📁 web-api-static/           ← folder app (has wwwroot)
  │   ├── App.cs
  │   ├── app.run.json             ← port 5100
  │   ├── appsettings.json
  │   └── 📁 wwwroot/
  │       ├── index.html
  │       └── script.jsx
  │
  └── 📁 json-explorer/            ← folder app (has SQLite + UI)
      ├── App.cs
      ├── app.run.json             ← port 5101
      ├── appsettings.json
      ├── app.db                   ← SQLite database
      └── 📁 wwwroot/
          ├── index.html
          └── script.jsx
```

---

## What NOT to Do

- ❌ Never place class or type declarations before top-level statements — models and DbContext always go **after** `app.Run()`
- ❌ Never create a `.csproj` or `.sln` file
- ❌ Never name the entry point `Program.cs` — use `App.cs` inside folder apps
- ❌ Never use an absolute path for SQLite or any file access
- ❌ Never set `PublishAot=true` — always `false`
- ❌ Never put CDN `<script>` tags in `.jsx` files — they belong in `index.html`
- ❌ Never use a custom `app-name.settings.json` — use standard `appsettings.json`
- ❌ Never commit secrets — use `dotnet user-secrets` for sensitive values
- ❌ Never place file-based apps inside an existing `.csproj` directory tree