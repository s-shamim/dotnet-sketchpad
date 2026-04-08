---
applyTo: "**/*.jsx,**/index.html"
---

# UI Instructions — Design System Policy

> Lean policy index. Implementation code lives in on-demand skills:
> - `ui-shell` — shell primitives, shared components, typography, behavioral patterns
> - `ui-inputs` — buttons, forms, navigation, actions, wizard
> - `ui-display` — data display, charts, layout, feedback, overlays, media
> - `theming` — CSS theming system, all 16 themes, CSS vars, dark mode
>
> The canonical living reference is `ui-showcase/wwwroot/`.

---

## App Defaults

Every generated UI app **must** include a theme changer and dark mode toggle.

- **Standard 4 themes:** `zinc` (default), `arctic`, `stone`, `hc`
- **React 18:** always `ReactDOM.createRoot(...)` — never `ReactDOM.render(...)`
- Multi-section apps → left-sidebar shell. Simpler apps → top bar or settings corner.

---

## index.html — Script Order

1. Flash-prevention inline script (before any CDN)
2. React 18 + ReactDOM CDN
3. Babel standalone CDN
4. Tailwind CDN
5. Tailwind config script (immediately after Tailwind CDN)
6. `themes.css` link (after Tailwind config)
7. Inter font links
8. Phosphor icons CSS (`ph-light` weight only)
9. JSX at end of `<body>` — `shared.jsx` first, section files, `app.jsx` last

CDN `<script>` tags in `<head>` only, never in `.jsx`. Use `?v=N` cache-busting on JSX scripts.

---

## File Architecture

| Situation | File | Contents |
|---|---|---|
| Single-file app | `script.jsx` | All components + `createRoot` mount |
| Multi-file — cross-section primitives | `shared.jsx` | `Toggle`, `SidebarNav`, `Spinner`, `SearchInput` |
| Multi-file — shell + mount | `app.jsx` | `Icon`, `Dropdown`, `SectionTitle`, `DemoBlock`, `App`, `createRoot` — loaded **last** |

- Primitive used by 2+ sections or by a section + the app shell → `shared.jsx`
- Section-local components stay in their section file
- `app.jsx` owns shell primitives and the final mount

---

## Component Registry

Implementations are in on-demand skills — invoke the right one for your task.

**App Shell** (`app.jsx`) → `ui-shell`: `Icon`, `SectionTitle`, `DemoBlock`, `Dropdown`

**Shared** (`shared.jsx`) → `ui-shell`: `Toggle`, `SidebarNav`, `Spinner`, `SearchInput`

**Forms** → `ui-inputs`: Text input, `Textarea`, `Checkbox`, `RadioGroup`, `DatePicker`, `KVEditor`, Input states

**Buttons** → `ui-inputs`: Text, ghost, icon, sizes, loading state, states

**Navigation** → `ui-inputs`: `Tabs`, `Breadcrumbs`

**Actions** → `ui-inputs`: Button group, Split button, `DangerButton`

**Wizard** → `ui-inputs`: `Wizard`, Step component contract

**Feedback** → `ui-display`: `Badge`, `Alert`, `Toast` + `useToast`, `Skeleton`

**Overlays** → `ui-display`: `Modal`, `ConfirmModal`, `Tooltip`, `Drawer`

**Data Display** → `ui-display`: `CodeBlock`, `DataTable`, `EmptyState`, `Tag`, `ProgressBar`, `Pagination`, `FilterModal`

**Charts** → `ui-display` (SVG, no library): `Sparkline`, Bar chart, Line chart, Donut chart

**Layout** → `ui-display`: `Collapsible`, Labeled divider, Card, Field group, Panel, List group, Split pane, Inline group

**Media** → `ui-display`: Carousel, Image grid, Lightbox

---

## Design Rules

- Gray-first UI — color only for status semantics and documented exceptions
- Lowercase UI text everywhere
- `rounded-sm` only
- No filled button backgrounds by default
- `focus-visible:` not `focus:`
- `font-light` only for `text-2xl`+ headings
- `font-medium` only for active sidebar nav items (paired with `bg-gray-200`)
- Destructive actions: gray first → armed confirmation → red only after arming
- Phosphor icons: `ph-light` weight only — never `ph-bold` or `ph-fill`
- Toggle thumb: always `var(--toggle-thumb)` — never `bg-white`

---

## CSS Variables (quick reference)

| Variable | Role |
|---|---|
| `--gray-50` … `--gray-900` | Full gray scale — remapped per theme |
| `--color-white` | Surface backgrounds (dark mode maps to a dark tone) |
| `--toggle-thumb` | Toggle thumb color |
| `--overlay-bg` | Tooltip/overlay background |
| `--overlay-text` | Tooltip/overlay text |
| `--accent` | Theme accent (darkest meaningful tone) |
| `--accent-fg` | Foreground on accent background |

---

## Status Colors

The only non-gray palette permitted:

| Semantic | Text | Background | Border |
|---|---|---|---|
| Neutral | `text-gray-500` | `bg-gray-50` | `border-gray-200` |
| Success | `text-green-600` | `bg-green-50` | `border-green-200` |
| Error | `text-red-500` | `bg-red-50` | `border-red-200` |
| Warning | `text-yellow-600` | `bg-yellow-50` | `border-yellow-200` |
| Info | `text-blue-600` | `bg-blue-50` | `border-blue-200` |

Never use saturated variants (`green-500` bg, `red-700` text, etc.).
| Info | `text-blue-600` | `bg-blue-50` | `border-blue-200` |

Never use saturated variants (`green-500` bg, `red-700` text, etc.).
The `patch` badge exception (`text-purple-600 bg-purple-50`) and the full theme catalog are in the reference doc.

---

## Critical Don'ts

- `ReactDOM.render(...)` — use `createRoot`
- CDN `<script>` inside `.jsx` files
- Native `<select>` — use `Dropdown`
- `focus:` rings — use `focus-visible:`
- `bg-white` on toggle thumbs — use `var(--toggle-thumb)`
- `<label>` wrapping `<button>` for `Toggle`
- `<input type="date">` — use `DatePicker`
- Array index as key in `KVEditor`
- Hardcoded hex in charts — use CSS vars
- Red destructive buttons without confirmation step
