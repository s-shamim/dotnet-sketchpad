# dotnet-scripts

A personal sandbox repo of **.NET 10 file-based C# apps** — no `.csproj`, no solution files, just `.cs` files and `dotnet run`.

---

## What is a File-Based App?

A .NET 10 feature that lets you run a single `.cs` file directly — no project setup, no boilerplate:

```bash
dotnet run HelloWorld.cs
```

---

## Repo Structure

```
📁 dotnet-scripts/
  │
  ├── .github/
  │   ├── copilot-instructions.md  ← Copilot workspace rules (core)
  │   └── instructions/
  │       ├── backend.instructions.md
  │       └── ui.instructions.md
  │
  ├── .vscode/
  │   └── tasks.json               ← VS Code run task (▷ button)
  │
  ├── HelloWorld.cs                ← simple single-file app
  ├── LinqBasics.cs
  │
  ├── 📁 web-api-static/           ← folder app (has wwwroot)
  │   ├── App.cs                   ← entry point, always named App.cs
  │   ├── app.run.json             ← launch profile with unique port
  │   ├── appsettings.json
  │   └── 📁 wwwroot/
  │       ├── index.html
  │       └── script.jsx
  │
  ├── 📁 json-explorer/            ← folder app (has SQLite + UI)
  │   ├── App.cs
  │   ├── app.run.json
  │   ├── appsettings.json
  │   ├── app.db                   ← SQLite database
  │   └── 📁 wwwroot/
  │
  └── 📁 dev-tools/                ← complex UI (multi-file JSX)
      ├── App.cs
      ├── app.run.json
      └── 📁 wwwroot/
          ├── index.html
          ├── app.jsx              ← shared helpers, primitives, ReactDOM.render
          ├── converters/
          └── generators/
```

### Conventions

| Scenario | Convention |
|---|---|
| Single `.cs`, no extra files | `PascalCase.cs` at repo root |
| Needs `wwwroot`, SQLite, or config | `kebab-case/` folder, entry point always `App.cs` |
| Launch profile | `app.run.json` next to `App.cs`, unique port per app |
| Configuration | `appsettings.json` next to `App.cs` (auto-loaded) |
| Secrets | `dotnet user-secrets` — never in `appsettings.json` |

---

## Running Apps

### VS Code

1. Open the `.cs` file you want to run (`HelloWorld.cs` or a folder's `App.cs`)
2. Click **▷** or press `Ctrl+Shift+B`

> Whatever `.cs` file is **active in the editor** is what gets run.

### Terminal

```bash
dotnet run HelloWorld.cs
dotnet run web-api-static/App.cs
```

---

## Tech at a Glance

| Concern | Approach |
|---|---|
| Web API | `#:sdk Microsoft.NET.Sdk.Web` directive |
| Static UI | `wwwroot/` served via `UseStaticFiles()` |
| UI stack | React 18 + Tailwind + Babel — CDN only, no build step |
| Data | EF Core + SQLite, auto-migrated at startup |
| Packages | `#:package Name@version` directive — no `.csproj` |

---

## Requirements

- .NET 10 SDK
- VS Code with the C# Dev Kit extension