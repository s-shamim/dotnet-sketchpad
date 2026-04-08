---
agent: "agent"
description: "Scaffold a new single-file or folder-based app"
---

# New App

Create a new .NET 10 file-based app in this repository.

## Steps

1. **Ask** the user for:
   - App name/description
   - Type: `console` (root-level single file), `web-api` (folder with API only), or `web-ui` (folder with API + wwwroot UI)
   - Whether it needs SQLite/EF Core for data persistence

2. **Determine naming** using the rules from `copilot-instructions.md`:
   - Console app → `PascalCase.cs` at repo root
   - Folder app → `kebab-case/` folder, entry point `App.cs`

3. **Determine port** by scanning all existing `app.run.json` files in the workspace to find the highest port in use, then assign the next one.

4. **Generate files** using the templates from `backend.instructions.md`:
   - Always include `#:property PublishAot=false` at the top
   - For web apps: add `#:sdk Microsoft.NET.Sdk.Web`
   - For SQLite apps: use the `sqlite-efcore` skill for the EF Core pattern
   - For web-ui apps: use the `ui-shell` skill for `index.html`, `themes.css` link, and the app shell with theme/dark mode support

5. **Create all files**:
   - `App.cs` (or `PascalCase.cs` for console)
   - `app.run.json` with the assigned port (folder apps only)
   - `appsettings.json` if using SQLite (folder apps only)
   - `wwwroot/index.html` + `wwwroot/script.jsx` + link to `themes.css` (web-ui only)

6. **Verify** the app compiles by running `dotnet run <path-to-cs-file>`.
