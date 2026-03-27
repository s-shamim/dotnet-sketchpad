---
applyTo: "**/*.jsx,**/index.html"
---

# UI Instructions — Design System Index

> Minimal, gray-first design system for single-file and multi-file JSX apps.
> Full component implementations, props, ARIA, and code examples live in
> [ui-component-reference.instructions.md](ui-component-reference.instructions.md).
> The canonical living source is `ui-showcase/wwwroot/`.

---

## React 18 — Mount API

Always use `createRoot`. `ReactDOM.render` was removed in React 18.

```jsx
// ✅ Required
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

---

## Every App Defaults (Required)

Every UI app must include **both**:

1. **Theme changer** — `Dropdown` populated with the standard theme set
2. **Dark mode toggle** — `Toggle` bound to light/dark mode

**Standard theme set** (use these 4 in new apps unless more are requested):
`zinc` (default), `arctic`, `stone`, `hc`

The full 16-theme catalog is available in `themes.css` — see the CSS theming section in the reference doc for all names. Always start with the standard set and let the user ask for more.

**Minimal app shell pattern:**

```jsx
function App() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
  const [mode,  setMode]  = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode',  mode);
  }, [theme, mode]);

  return (
    <div className="min-h-screen bg-white">
      {/* theme controls — sidebar, corner panel, or topbar as appropriate */}
      <div className="flex items-center gap-3">
        <Dropdown value={theme} onChange={setTheme} width="w-36"
          options={[
            { value: 'zinc',    label: 'zinc'     },
            { value: 'arctic',  label: 'arctic'   },
            { value: 'stone',   label: 'stone'    },
            { value: 'hc',      label: 'contrast' },
          ]}
        />
        <Toggle checked={mode === 'dark'} onChange={v => setMode(v ? 'dark' : 'light')} label="dark mode" />
      </div>
      {/* app content */}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

---

## index.html

See the **complete boilerplate** in the [reference doc](ui-component-reference.instructions.md).

**Script load order (strict):**
1. Flash-prevention inline script — first, before any CDN
2. React 18 + ReactDOM CDN
3. Babel standalone CDN
4. Tailwind CDN
5. Tailwind config script (immediately after Tailwind CDN)
6. `themes.css` link (after Tailwind config)
7. Inter font links
8. Phosphor icons CSS
9. JSX at end of `<body>` — `shared.jsx` first, section files, `app.jsx` last

All CDN `<script>` tags go in `<head>`, never inside `.jsx` files.
Use `?v=N` cache-busting on JSX `<script>` tags.

---

## File Architecture

| Situation | File | Notes |
|---|---|---|
| Single-file app | `script.jsx` | All components + `createRoot` mount |
| Multi-file — cross-section primitives | `shared.jsx` | `Toggle`, `SidebarNav`, `Spinner` |
| Multi-file — shell + mount | `app.jsx` | `Icon`, `Dropdown`, `SectionTitle`, `DemoBlock`, `App` component, `createRoot` — loaded **last** |

See the [reference doc](ui-component-reference.instructions.md) for the full multi-file load order rules.

---

## Component Registry

Full implementations for every component are in the [reference doc](ui-component-reference.instructions.md).

### App Shell Primitives (`app.jsx`)

| Component | Props | Description |
|---|---|---|
| `Icon` | `name, size=14, className` | Phosphor `ph-light` icon wrapper |
| `SectionTitle` | `children, sub` | Page-level heading (`text-2xl font-light`) |
| `DemoBlock` | `title, children` | Demo section wrapper with uppercase label |
| `Dropdown` | `value, onChange, options, placeholder, width` | Custom select — replaces all native `<select>` |

### Shared Primitives (`shared.jsx`)

| Component | Props | Description |
|---|---|---|
| `Toggle` | `checked, onChange, label` | Switch — outer `<div>`, not `<label>` |
| `SidebarNav` | `items, active, onChange` | Vertical nav menu |
| `Spinner` | `size=16` | Animated loading spinner with ARIA |

### Forms

| Component | Props | Description |
|---|---|---|
| Text input | — | `border-b` underline style |
| `Textarea` | — | `resize-none`, shoulder copy/clear actions |
| `Checkbox` | `checked, onChange, label, disabled` | Native checkbox, `accent-gray-500` |
| `RadioGroup` | `options, value, onChange, name` | Native radios, `accent-gray-500` |
| `SearchInput` | `value, onChange, placeholder, width` | Magnifying glass prefix + clear X button |
| `DatePicker` | `value, onChange` | Full calendar picker — never `<input type="date">` |
| `KVEditor` | `pairs, onChange` | Key/value rows with per-row enable checkbox — pairs need stable `id` field |
| Input states | — | disabled, read-only, focus-visible ring patterns |

### Navigation

| Component | Props | Description |
|---|---|---|
| `Tabs` | `tabs, active, onChange` | Underline tabs — ARIA `role="tablist"` + `aria-selected` |
| `Breadcrumbs` | `crumbs` | `<a>` with href; `<span aria-current="page">` for last item |

### Feedback

| Component | Props | Description |
|---|---|---|
| `Badge` | `label, variant` | Semantic: neutral/info/success/warning/error + HTTP: get/post/put/delete/patch |
| `Alert` | `variant, children, onClose?` | Inline banner with icon — `onClose` optional |
| `Toast` + `useToast` | — | Bottom-right auto-dismiss — one at a time, never stacked |
| `Skeleton` | `lines=3` | Animated `animate-pulse` placeholder |

### Overlays

| Component | Props | Description |
|---|---|---|
| `Modal` | `title, children, onClose, actions, size='md'` | Focus trap, Tab cycle, Esc close, backdrop click close |
| `ConfirmModal` | `message, onConfirm, onCancel, confirmLabel` | Destructive confirmation |
| `Tooltip` | `text, children` | Hover tooltip — uses `--overlay-bg/text` CSS vars |
| `Drawer` | `title, children, onClose` | Right-side panel — same keyboard/focus handling as Modal |

### Data Display

| Component | Props | Description |
|---|---|---|
| `CodeBlock` | `content, language, languages?, onLanguageChange?, maxHeight` | Code viewer with optional language picker + copy |
| `DataTable` | `columns, rows` | Sortable — click header toggles asc/desc; shows `EmptyState` when empty |
| `EmptyState` | `icon, title, sub?, action?` | Centered placeholder for empty lists |
| `Tag` | `label, onRemove?` | Chip/tag — no `onRemove` renders read-only |
| `ProgressBar` | `value, max=100, label?` | `h-1` bar |
| `Pagination` | `page, totalPages, onChange` | Prev / N of M / Next |
| `FilterModal` | `columns, conditions, onApply, onClose` | Condition builder (where/and/or) for tables; needs `applyConditions` + `checkCond` helpers |

### Charts (SVG, no library)

| Component | Props | Description |
|---|---|---|
| `Sparkline` | `data, color, height=32, width=80` | Micro line chart for stat cards |
| Bar chart | inline pattern | Vertical bars, CSS-var colors only |
| Line chart | inline pattern | SVG with area fill, grid lines, data point dots |
| Donut chart | inline pattern | SVG arcs with inner hole + center total label |

All chart colors must use CSS vars (`var(--gray-N)`) — never hardcoded hex.

### Layout

| Pattern | Description |
|---|---|
| `Collapsible` | Accordion — `defaultOpen` prop, caret rotates |
| Labeled divider | `flex-1 h-px bg-gray-100` flanking centered text |
| Card | `border border-gray-100` hover — only for spatial separation |
| Field group | `tracking-widest uppercase` section label + input block |
| Panel | Bordered block with `border-b` header and optional copy action |
| List group | `divide-y divide-gray-100` rows — icon + label + meta + caret |
| Split pane | Left nav `w-36 shrink-0 border-r` + right `flex-1` content |
| Inline group | Prefix/suffix inputs (`focus-within:border-gray-500`), number range |

### Media

| Pattern | Description |
|---|---|
| Carousel | `translateX` slide — no auto-advance, prev/next buttons + dot indicators |
| Image grid | 3-col grid with hover overlay (`bg-gray-900/10`) and lightbox trigger |
| Lightbox | Fixed overlay, Esc + backdrop click close, focus management on open |

### Actions

| Component | Props | Description |
|---|---|---|
| Button group | — | `divide-x` border group, active segment `bg-gray-100 text-gray-700` |
| Split button | — | Primary action + caret dropdown with outside-click close |
| `DangerButton` | `label, confirmLabel, onConfirm` | Gray → armed "are you sure?" → red confirm — never red by default |

### Wizard

| Component / Contract | Props | Description |
|---|---|---|
| `Wizard` | `steps, onComplete` | Step indicators with check icons; `onNext(data)` merges and advances |
| Step component | `onNext, onBack, isFirst, data` | Props injected by Wizard into each step component |

---

## CSS Theming

`themes.css` — 16 themes × 2 modes. Copy from `ui-showcase/wwwroot/themes.css`.

**Standard 4 (default for new apps):** `zinc`, `arctic`, `stone`, `hc`

**All 16 themes by group:**

| Group | Themes |
|---|---|
| Standard | `zinc`, `arctic`, `stone`, `hc` |
| Business | `navy`, `oxblood`, `racing` |
| Vibrant | `fuchsia`, `amber`, `teal`, `crimson` |
| Casual | `peach`, `sky`, `sage`, `lavender`, `sand` |

**Usage:** `data-theme="zinc-light"` / `data-theme="zinc-dark"`.

**CSS variables:**

| Variable | Role |
|---|---|
| `--gray-50` … `--gray-900` | Gray scale — remapped per theme |
| `--color-white` | Surface background (dark maps to dark tone) |
| `--toggle-thumb` | Toggle thumb — use `style={{ backgroundColor: 'var(--toggle-thumb)' }}`, never `bg-white` |
| `--overlay-bg` / `--overlay-text` | Tooltip and overlay surfaces |
| `--accent` / `--accent-fg` | Theme accent pair |

See the [reference doc](ui-component-reference.instructions.md) for full `themes.css` content and React integration code.

---

## Design Language

- **Gray-first** — all UI uses the gray scale. Color only for status semantics and icons.
- **Lowercase** — all UI text is `lowercase`.
- **`rounded-sm` only** — never `rounded-md`, `rounded-lg`, or larger.
- **No filled button backgrounds** — text-only or ghost (bordered) buttons.
- **`font-medium`** only for active sidebar nav items.
- **`font-light`** for `text-2xl`+ headings only.
- **Section labels** — `text-xs tracking-widest uppercase text-gray-400`.
- **`focus-visible:`** not `focus:` — keyboard-only focus rings.
- **Danger** — never red by default; gray → confirm intent → red after arming.

**Status colors** (only permitted color outside gray):

| Semantic | Text | Background | Border |
|---|---|---|---|
| Success | `text-green-600` | `bg-green-50` | `border-green-200` |
| Error | `text-red-500` | `bg-red-50` | `border-red-200` |
| Warning | `text-yellow-600` | `bg-yellow-50` | `border-yellow-200` |
| Info | `text-blue-600` | `bg-blue-50` | `border-blue-200` |

Never use saturated variants (`green-500` bg, `red-700` text, etc.).

---

## What NOT to Do

- `ReactDOM.render(...)` — use `ReactDOM.createRoot(...).render(...)`
- CDN `<script>` tags inside `.jsx` files — only in `index.html`
- `rounded-md` / `rounded-lg` or larger — `rounded-sm` only
- Filled button backgrounds (`bg-blue-500`, etc.)
- Uppercase text except section labels
- `focus:` ring — use `focus-visible:` (keyboard only)
- `bg-white` on toggle thumb — use `style={{ backgroundColor: 'var(--toggle-thumb)' }}`
- `<label>` wrapping `<button>` for Toggle — outer `<div onClick>` + inner `<button>`
- `<input type="date">` — use `DatePicker` calendar component
- Array index as `key` in `KVEditor` — pairs require stable `id` field
- Hardcoded hex colors in charts — use `var(--gray-N)`
- Red destructive buttons without confirmation — use `DangerButton` two-step pattern
- Stacking toasts — one at a time, bottom-right, auto-dismiss
- Decorative icons — only functional meaning
