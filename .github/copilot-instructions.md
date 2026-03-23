# Copilot Instructions — dotnet-scripts

This repo is a collection of **.NET 10 file-based C# apps** — no `.csproj`, no solution files.

> Detailed rules are split across focused instruction files in `.github/instructions/`:
> - [backend.instructions.md](instructions/backend.instructions.md) — directives, templates, run config, settings, SQLite
> - [ui.instructions.md](instructions/ui.instructions.md) — HTML/JSX stack, multi-file JSX, design system

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
- **Settings** → `appsettings.json` next to `App.cs` (auto-loaded by Web SDK)

---

## Folder Structure Reference

```
📁 dotnet-scripts/
  │
  ├── .github/
  │   ├── copilot-instructions.md
  │   └── instructions/
  │       ├── backend.instructions.md
  │       └── ui.instructions.md
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
  ├── 📁 json-explorer/            ← folder app (has SQLite + UI)
  │   ├── App.cs
  │   ├── app.run.json             ← port 5101
  │   ├── appsettings.json
  │   ├── app.db                   ← SQLite database
  │   └── 📁 wwwroot/
  │       ├── index.html
  │       └── script.jsx
  │
  └── 📁 dev-tools/               ← complex UI (multi-file JSX)
      ├── App.cs
      ├── app.run.json
      └── 📁 wwwroot/
          ├── index.html          ← loads all .jsx files; app.jsx last
          ├── app.jsx             ← shared helpers, primitives, ReactDOM.render
          ├── converters/
          │   ├── JsonYaml.jsx
          │   └── Base64Text.jsx
          └── generators/
              ├── Password.jsx
              └── Uuid.jsx
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