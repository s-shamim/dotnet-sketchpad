---
applyTo: "**/*.jsx,**/index.html"
---

# UI — HTML / Tailwind / JSX

## Stack

CDN-based, no build step. React 18 + Babel standalone + Tailwind CDN.

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

## Design System

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
