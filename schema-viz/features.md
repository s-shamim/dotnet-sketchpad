# schema-viz — Feature Reference

A browser-based SQL schema visualizer built on .NET 10 + React 18 (CDN, no build step).
Run: `dotnet run App.cs` — serves on **port 5112**.

---

## Canvas

| Feature | Detail |
|---|---|
| **Drag tables** | Free-position drag of any table card |
| **Space + drag pan** | Hold Space → canvas pans; cursor changes to grab |
| **Middle-mouse pan** | Drag with the scroll wheel button to pan |
| **Ctrl/Cmd + scroll zoom** | Zoom toward the mouse cursor position |
| **Zoom buttons** | `−  100%  +` pill (12 stops, 25%–200%); click % to reset to 100% |
| **Fit to view** | Smoothly scrolls all tables into the visible viewport |
| **Auto-arrange** | Sugiyama layered layout — FK arrows flow left → right; barycentric crossing-minimisation; shortest-path BFS layer assignment for compact columns |
| **FK bezier lines** | Dashed cubic bezier curves connecting FK source → target column; update live during drag |
| **Cardinality labels** | `1` near source end, `N` near target end on every FK line |
| **Dot-grid background** | Subtle reference grid |
| **Click to deselect** | Click empty canvas to clear selection |

---

## Table Cards

| Feature | Detail |
|---|---|
| **Inline rename** | Double-click header to edit table name |
| **Collapse / expand** | Caret button in header hides columns & footer; only header shown |
| **PK badge** | Yellow `PK` on primary-key columns |
| **NN badge** | Gray `NN` on NOT NULL columns |
| **Type display** | Base type shown (`VARCHAR` from `VARCHAR(255)`) |
| **Add column shortcut** | `+ add column` button in card footer |

---

## Sidebar — Import tab

| Feature | Detail |
|---|---|
| **DDL textarea** | Paste `CREATE TABLE` statements (MySQL, SQL Server, SQLite dialects) |
| **Validate** | `POST /api/validate-ddl` — reports errors + warnings (missing FK targets, duplicate names) before import |
| **Parse & Import** | `POST /api/parse-ddl` — parses DDL, adds tables, auto-arranges |
| **Auto-arrange on import** | Imported tables are immediately laid out via the Sugiyama algorithm |
| **Clear DDL** | Clears textarea and validation state |
| **Export SQL** | Generates `CREATE TABLE` DDL from the current canvas state; copy-to-clipboard |
| **Export PNG** | Captures the diagram (cropped to table bounding box, 2× scale); downloads `schema.png` |
| **Canvas count** | Shows number of tables currently on canvas |
| **Clear canvas** | Removes all tables (confirmation modal) |
| **Reset to demo** | Restores the built-in 4-table demo schema (confirmation modal) |

---

## Sidebar — Inspector tab

| Feature | Detail |
|---|---|
| **Auto-switch** | Opens automatically when a table is selected |
| **Rename table** | Inline text input |
| **Edit columns** | Name input, type input, PK checkbox, NOT NULL checkbox, delete button |
| **Add column form** | Name, type, PK, NOT NULL, Add button |
| **FK list** | Shows all FKs as `col → table.col`; hover to reveal delete button |
| **Add FK form** | Three dropdowns: source col → target table → target col |
| **Delete table** | Red button with confirmation modal |

---

## Undo / Redo

| Feature | Detail |
|---|---|
| **Undo** | `Ctrl+Z` / `Cmd+Z`; also ↺ button in header |
| **Redo** | `Ctrl+Y` / `Ctrl+Shift+Z`; also ↻ button in header |
| **Scope** | All schema mutations tracked; drag position commits excluded (too noisy) |

---

## Persistence & Themes

| Feature | Detail |
|---|---|
| **Auto-save** | Schema written to `localStorage` on every change; restored on next page load |
| **Theme selector** | Zinc / Arctic / Stone / Contrast — persisted to `localStorage` |
| **Dark mode** | Toggle; persisted to `localStorage`; flash-prevention script in `<head>` |

---

## Backend (App.cs)

| Endpoint | Detail |
|---|---|
| `POST /api/parse-ddl` | Regex parser — extracts tables, columns (name/type/nullable/PK), inline `PRIMARY KEY`, table-level `PRIMARY KEY(...)`, `FOREIGN KEY ... REFERENCES` |
| `POST /api/validate-ddl` | Returns `{ valid, tableCount, errors[], warnings[] }` — checks for empty result, duplicate table names, FK references to unknown tables |
| `GET /*` | Static file serving from `wwwroot/` |

### DDL dialect support
- Quote styles: backtick `` ` `` (MySQL), `[bracket]` (SQL Server), `"double"` (SQLite/PG)
- `IF NOT EXISTS`, `schema.TableName` prefix
- `CONSTRAINT name FOREIGN KEY ...` prefix stripped
- `UNIQUE`, `INDEX`, `KEY`, `CHECK` constraints silently skipped
- `IDENTITY`, `AUTOINCREMENT`, `DEFAULT`, `ON DELETE` — ignored (not visualised)
- Multi-column FKs — silently skipped (single-column only supported)

---

## Known Limitations

- Multi-column foreign keys not shown as relationship lines
- No minimap for large schemas
- No search / jump-to-table
- Collapse state resets on page reload (not persisted)
