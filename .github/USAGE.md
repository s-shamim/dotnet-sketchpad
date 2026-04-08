# USAGE — Copilot Customizations Guide

> How to use the instructions, skills, prompts, and agents in this repo.
> For developers working with Copilot, and for Copilot itself to route tasks correctly.

---

## Quick Start

This repo uses a **layered customization system**:

- **Instructions** (`.instructions.md`) — auto-attached by file glob. Lean policy rules that apply on every relevant edit. You don't invoke these — they just work.
- **Skills** (`SKILL.md`) — on-demand domain knowledge. Copilot loads these when your task matches their description. You can also reference them explicitly: *"use the ui-inputs skill to build this form."*
- **Prompts** (`.prompt.md`) — reusable task templates. Invoke from the prompt picker or reference by name.
- **Agents** (`.agent.md`) — specialized modes with scoped tools. Invoke by name for end-to-end workflows.

---

## Customizations Map

| Type | Name | Trigger | Purpose |
|---|---|---|---|
| Instruction | `backend.instructions.md` | Auto: `**/*.cs` | C# directives, templates, run config, settings, SQLite |
| Instruction | `ui.instructions.md` | Auto: `**/*.jsx`, `**/index.html` | UI policy — design system rules, script order, file architecture |
| Skill | `ui-shell` | On-demand | Shell primitives, shared components, typography, behavioral patterns |
| Skill | `ui-inputs` | On-demand | Buttons, forms, navigation, actions, wizard |
| Skill | `ui-display` | On-demand | Data display, charts, layout, feedback, overlays, media |
| Skill | `theming` | On-demand | CSS theming system — 16 themes, CSS vars, dark mode |
| Skill | `sqlite-efcore` | On-demand | EF Core + SQLite patterns for file-based apps |
| Prompt | `new-app` | Manual | Scaffold a new single-file or folder-based app |
| Prompt | `new-ui-section` | Manual | Add a section to a multi-file UI app |
| Prompt | `add-api-endpoint` | Manual | Add an API endpoint to an existing App.cs |
| Agent | `app-scaffold` | Manual | End-to-end new app creation with convention enforcement |

---

## Workflows

### Create a New App

**Option A — Use the prompt:**
> Invoke the `new-app` prompt. It will ask you for the app type, name, and whether you need SQLite.

**Option B — Use the agent:**
> Invoke the `app-scaffold` agent. It handles everything end-to-end: naming, port allocation (scans existing `app.run.json` files), file generation, and compilation check.

**What happens behind the scenes:**
- `copilot-instructions.md` provides naming rules (PascalCase vs kebab-case)
- `backend.instructions.md` auto-attaches when `.cs` files are created
- `sqlite-efcore` skill is loaded if the app needs data persistence
- `ui-shell` skill is loaded if the app needs a frontend

**Verify:** Run `dotnet run <path-to-cs-file>` to confirm it compiles.

---

### Add a UI Component to an Existing App

1. Open the `.jsx` file you want to modify — `ui.instructions.md` auto-attaches with design policy.
2. Tell Copilot what you need. It will load the right skill:
   - **Form, button, input, checkbox, radio, tabs, wizard** → `ui-inputs` skill
   - **Table, chart, modal, toast, badge, skeleton, carousel** → `ui-display` skill
   - **Shell layout, sidebar, theme selector, shared component** → `ui-shell` skill
3. If Copilot doesn't load the right skill automatically, reference it: *"use the ui-display skill to add a data table here."*

---

### Add an API Endpoint

**Option A — Use the prompt:**
> Invoke the `add-api-endpoint` prompt. It reads the existing `App.cs`, understands the route structure, and adds the endpoint in the right place.

**Option B — Direct edit:**
> Open `App.cs` — `backend.instructions.md` auto-attaches. Tell Copilot what endpoint you need. If it involves new database entities, reference the `sqlite-efcore` skill.

**Key rule:** Models and DTOs go **after** `app.Run()`, never before top-level statements.

---

### Add a New Section to a Multi-File UI App

> Invoke the `new-ui-section` prompt. It handles:
> - Creating the section `.jsx` file in the right location
> - Registering it in the `SECTIONS` array in `app.jsx`
> - Adding the `<script>` tag to `index.html` in the correct load order

---

### Modify Theming

> Reference the `theming` skill: *"use the theming skill to add the full 16-theme catalog to this app."*

The theming skill covers:
- CSS variable definitions and their roles
- Flash-prevention script pattern
- Standard 4-theme vs full 16-theme selector
- `hc` (high contrast) special behavior
- Dark mode shadow overrides
- Toggle thumb CSS variable rule

---

## Skill Routing Hints

> For Copilot: use these keyword mappings to select the right skill automatically.

| Keywords in user request | Skill to load |
|---|---|
| form, input, checkbox, radio, textarea, datepicker, kv editor, validation | `ui-inputs` |
| button, ghost button, icon button, loading state, danger button | `ui-inputs` |
| tabs, breadcrumbs, navigation, wizard, multi-step | `ui-inputs` |
| button group, split button | `ui-inputs` |
| table, data table, sort, filter, pagination, code block | `ui-display` |
| chart, sparkline, bar chart, line chart, donut, svg chart | `ui-display` |
| modal, drawer, tooltip, confirm, overlay | `ui-display` |
| toast, alert, badge, skeleton, progress bar, empty state | `ui-display` |
| card, panel, collapsible, list group, split pane, layout | `ui-display` |
| carousel, image grid, lightbox, media | `ui-display` |
| tag, chip, label | `ui-display` |
| shell, sidebar, app shell, section title, demo block, icon | `ui-shell` |
| toggle, switch, spinner, search input, shared component | `ui-shell` |
| typography, font, text scale, heading, gray scale | `ui-shell` |
| focus trap, outside click, group hover, behavioral pattern | `ui-shell` |
| index.html, page template, script order, file architecture | `ui-shell` |
| theme, dark mode, css var, themes.css, flash prevention | `theming` |
| hc, high contrast, accent, toggle thumb | `theming` |
| sqlite, ef core, database, db context, migration, seed | `sqlite-efcore` |
| entity, model, dbset, connection string | `sqlite-efcore` |

---

## Troubleshooting

### Rules seem to be ignored
- **Check which instructions auto-attached.** Instructions only apply to files matching their `applyTo` glob. If you're editing a `.cs` file, only `backend.instructions.md` is loaded — not UI rules.
- **Skills must be invoked.** Unlike instructions, skills don't auto-attach. If Copilot isn't following component patterns, explicitly reference the skill: *"use the ui-inputs skill."*
- **Context window limits.** If you're in a long conversation, earlier instructions may have scrolled out of context. Start a new chat for complex tasks.

### Wrong component pattern
- The canonical source is always `ui-showcase/wwwroot/`. If a skill's code doesn't match what you see there, the showcase code takes precedence.
- Components use `ph-light` icons only, `rounded-sm` only, `focus-visible:` not `focus:`, and lowercase text everywhere.

### Port conflict
- The `app-scaffold` agent scans all `app.run.json` files automatically.
- For manual setup: search for `applicationUrl` across all `app.run.json` files and pick the next available port after the highest one found.

### App won't compile
- Ensure `#:property PublishAot=false` is the first line (before any `using` or code).
- Ensure models/classes are **after** `app.Run()`, not before.
- Ensure the file is not inside an existing `.csproj` directory tree.
