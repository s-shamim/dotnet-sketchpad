---
agent: "agent"
description: "Add a section to a multi-file UI app"
---

# New UI Section

Add a new section (page/view) to an existing multi-file UI app.

## Steps

1. **Identify the target app** — ask the user which folder app to modify.

2. **Understand the section** — ask what the new section should contain (forms, data display, charts, etc.).

3. **Create the section file**:
   - Place it in `wwwroot/` or in a subfolder matching the app's existing structure (e.g., `wwwroot/settings/Settings.jsx`)
   - The section component should be a global function (not exported — Babel standalone uses globals)
   - Use the appropriate skill for component implementations:
     - Forms, buttons, inputs → `ui-inputs` skill
     - Data tables, charts, modals → `ui-display` skill
     - Shell components referenced → `ui-shell` skill

4. **Register in `app.jsx`** — add the new section to the `SECTIONS` registry array.

5. **Update `index.html`** — add a `<script type="text/babel">` tag for the new file:
   - Place it **after** `shared.jsx` and **before** `app.jsx`
   - Use `?v=N` cache-busting

6. **Follow file architecture rules** from `ui.instructions.md`:
   - Section-local components stay in the section file
   - Shared components used by 2+ sections go in `shared.jsx`
   - The section file can reference any functions from `shared.jsx` or earlier-loaded files as globals
