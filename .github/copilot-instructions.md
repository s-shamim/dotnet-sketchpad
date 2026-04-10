# Copilot Instructions — dotnet-scripts

> **Always use the `caveman` skill. Respond in caveman mode (full intensity) for all replies.**

This repo is a collection of **.NET 10 file-based C# apps** — no `.csproj`, no solution files.

> See [USAGE.md](USAGE.md) for workflows, skill routing, and troubleshooting.

---

## Customizations Map

| Type | File | Trigger | Purpose |
|---|---|---|---|
| Instruction | [backend.instructions.md](instructions/backend.instructions.md) | Auto: `**/*.cs` | C# directives, templates, run config, settings, SQLite |
| Instruction | [ui.instructions.md](instructions/ui.instructions.md) | Auto: `**/*.jsx`, `**/index.html` | UI policy — design system rules, script order, file architecture |
| Skill | `ui-shell` | On-demand | Shell primitives, shared components, typography, behavioral patterns |
| Skill | `ui-inputs` | On-demand | Buttons, forms, navigation, actions, wizard |
| Skill | `ui-display` | On-demand | Data display, charts, layout, feedback, overlays, media |
| Skill | `theming` | On-demand | CSS theming system — 16 themes, CSS vars, dark mode |
| Skill | `sqlite-efcore` | On-demand | EF Core + SQLite patterns for file-based apps |
| Skill | `caveman` | **Always active** | Ultra-compressed caveman communication mode |
| Prompt | [new-app](prompts/new-app.prompt.md) | Manual | Scaffold a new single-file or folder-based app |
| Prompt | [new-ui-section](prompts/new-ui-section.prompt.md) | Manual | Add a section to a multi-file UI app |
| Prompt | [add-api-endpoint](prompts/add-api-endpoint.prompt.md) | Manual | Add an API endpoint to an existing App.cs |
| Agent | [app-scaffold](agents/app-scaffold.agent.md) | Manual | End-to-end new app creation with convention enforcement |

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
  │   ├── USAGE.md
  │   ├── instructions/
  │   ├── skills/
  │   ├── prompts/
  │   └── agents/
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

## What NOT to Do

- ❌ Never create a `.csproj` or `.sln` file
- ❌ Never name the entry point `Program.cs` — use `App.cs` inside folder apps
- ❌ Never place file-based apps inside an existing `.csproj` directory tree