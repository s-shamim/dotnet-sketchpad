---
description: "Shell primitives, shared components, typography, and behavioral patterns. Use when creating a new UI app, modifying the app shell, or adding shared interactive behavior."
---

# UI Shell — Primitives, Shared Components, Typography & Behavioral Patterns

> All code comes verbatim from `ui-showcase/wwwroot/` — the canonical living reference.
> For policy-level rules (design constraints, file architecture, script order), see `ui.instructions.md`.

---

## `index.html` — Complete Page Template

```html
<!DOCTYPE html>
<html data-theme="zinc-light">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>app title</title>

  <!-- 1. Flash-prevention — MUST be first script, before any CDN loads -->
  <script>
    (function() {
      var t = localStorage.getItem('ui-theme') || 'zinc';
      var m = localStorage.getItem('ui-mode')  || 'light';
      document.documentElement.setAttribute('data-theme', t + '-' + m);
    })();
  </script>

  <!-- 2. React 18 + ReactDOM -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

  <!-- 3. Babel (JSX transform) -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- 4. Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- 5. Tailwind config — gray scale remapped to CSS vars + Inter font -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          },
          colors: {
            white: 'var(--color-white)',
            gray: {
              50:  'var(--gray-50)',
              100: 'var(--gray-100)',
              200: 'var(--gray-200)',
              300: 'var(--gray-300)',
              400: 'var(--gray-400)',
              500: 'var(--gray-500)',
              600: 'var(--gray-600)',
              700: 'var(--gray-700)',
              800: 'var(--gray-800)',
              900: 'var(--gray-900)',
            }
          }
        }
      }
    }
  </script>

  <!-- 6. Theme CSS vars — must follow Tailwind config -->
  <link rel="stylesheet" href="themes.css" />

  <!-- 7. Inter font -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />

  <!-- 8. Phosphor icons (ph-light weight only) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/light/style.css" />
</head>

<body>
  <div id="root"></div>

  <!-- Single-file app -->
  <script type="text/babel" src="script.jsx?v=1"></script>

  <!-- Multi-file app: shared.jsx first, section files next, app.jsx always last -->
  <!-- <script type="text/babel" src="shared.jsx?v=1"></script> -->
  <!-- <script type="text/babel" src="forms/Forms.jsx?v=1"></script> -->
  <!-- <script type="text/babel" src="app.jsx?v=1"></script> -->
</body>

</html>
```

**Cache-busting:** Always use `?v=N` on JSX `<script>` tags to force Babel re-transpile during development.

---

## App Shell — Theme + Dark Mode (Required in Every App)

Every app must include a theme changer and dark mode toggle. Standard 4 themes: `zinc`, `arctic`, `stone`, `hc`.

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
    <div className="min-h-screen bg-white flex">
      <aside className="w-52 shrink-0 border-r border-gray-100 pt-10 px-5 pb-6 flex flex-col sticky top-0 h-screen">
        {/* Theme controls */}
        <div className="flex flex-col gap-3 mb-6 pb-5 border-b border-gray-100">
          <Dropdown
            value={theme}
            onChange={setTheme}
            width="w-full"
            options={[
              { value: 'zinc',    label: 'zinc'     },
              { value: 'arctic',  label: 'arctic'   },
              { value: 'stone',   label: 'stone'    },
              { value: 'hc',      label: 'contrast' },
            ]}
          />
          <Toggle
            checked={mode === 'dark'}
            onChange={v => setMode(v ? 'dark' : 'light')}
            label="dark mode"
          />
        </div>
        {/* rest of sidebar */}
      </aside>
      <main className="flex-1 px-12 py-10 max-w-3xl">
        {/* content */}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

For simpler single-page apps without a sidebar, place the Dropdown + Toggle in a top bar or a settings corner rather than a full sidebar, but always include both.

---

## App Shell Primitives (defined in `app.jsx`)

### Icon

```jsx
function Icon({ name, size = 14, className = "text-gray-400" }) {
  return (
    <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />
  );
}
```

- Default size: `14px` inline, `16px` for standalone icon buttons
- Default color: `text-gray-400`
- Status icons may use semantic color classes (`text-green-600`, `text-red-500`, etc.)
- Weight: `ph-light` only — never `ph-bold` or `ph-fill`
- Browse names at phosphoricons.com

Common icon names: `house`, `gear`, `bell`, `user`, `magnifying-glass`, `x`, `check`, `plus`, `minus`, `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`, `caret-down`, `caret-up`, `caret-left`, `caret-right`, `copy`, `clipboard`, `pencil`, `trash`, `floppy-disk`, `upload`, `download`, `eye`, `eye-slash`, `lock`, `lock-open`, `key`, `shield`, `warning`, `info`, `question`, `check-circle`, `x-circle`, `dots-three-outline`, `list`, `grid-four`, `rows`, `sidebar`, `folder`, `file`, `file-text`, `image`, `video`, `code`, `terminal`, `database`, `cloud`, `wifi`, `link`, `globe`, `envelope`, `chat`, `phone`, `map-pin`, `calendar`, `clock`, `chart-bar`, `chart-line`, `chart-pie`, `trend-up`, `trend-down`, `arrow-clockwise`, `arrow-counter-clockwise`, `funnel`, `sort-ascending`, `sort-descending`, `star`, `heart`, `bookmark`, `tag`, `flag`, `shuffle`, `dots-six-vertical`, `credit-card`

### SectionTitle

```jsx
function SectionTitle({ children, sub }) {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-light tracking-widest text-gray-800 lowercase">{children}</h1>
      {sub && <p className="text-xs text-gray-400 tracking-widest mt-1 lowercase">{sub}</p>}
    </div>
  );
}
```

Usage: `<SectionTitle sub="input, select, toggle">forms</SectionTitle>`

### DemoBlock

```jsx
function DemoBlock({ title, children }) {
  return (
    <div className="mb-10">
      <h3 className="text-xs tracking-widest text-gray-400 uppercase mb-4 pb-2 border-b border-gray-100">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
```

Usage: `<DemoBlock title="text input">...</DemoBlock>`

### Dropdown

```jsx
function Dropdown({ value, onChange, options, placeholder = 'select...', width = 'w-48' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = options.find(o => (o.value ?? o) === value);
  const label = selected ? (selected.label ?? selected) : placeholder;

  return (
    <div className={`relative ${width}`} ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
      >
        <span className={`lowercase ${!value ? 'text-gray-400' : ''}`}>{label}</span>
        <Icon name="caret-down" size={12} className={`text-gray-400 transition-transform ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full border border-gray-200 bg-white shadow-sm rounded-sm z-20">
          {options.map(opt => {
            const v = opt.value ?? opt;
            const l = opt.label  ?? opt;
            return (
              <button
                key={v}
                onClick={() => { onChange(v); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors lowercase ${
                  value === v ? 'text-gray-800 bg-gray-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

Options can be strings `['a', 'b']` or objects `[{ value: 'a', label: 'Option A' }]`.

---

## Shared Primitives (defined in `shared.jsx`)

### Toggle / Switch

> Outer element is `<div>` not `<label>` — `<label>` wrapping `<button>` breaks click propagation in some browsers. This rule applies **only** to controls containing a `<button>`. `Checkbox` and `RadioGroup` correctly use `<label>` because they wrap native `<input>` elements.

```jsx
function Toggle({ checked, onChange, label }) {
  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  }

  return (
    <div
      className="flex items-center gap-3 cursor-pointer group"
      onClick={() => onChange(!checked)}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={e => e.stopPropagation()}
        className={`relative w-8 h-4 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1 ${
          checked ? 'bg-gray-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
          style={{ backgroundColor: 'var(--toggle-thumb)' }}
        />
      </button>
      {label && (
        <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors lowercase select-none">
          {label}
        </span>
      )}
    </div>
  );
}
```

ARIA: `role="switch"`, `aria-checked`. Keyboard: Space/Enter toggles. Thumb uses `--toggle-thumb` CSS var (not `bg-white`).

### SidebarNav

```jsx
function SidebarNav({ items, active, onChange }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`text-left text-sm px-2 py-1.5 rounded-sm transition-colors lowercase ${
            active === item.id
              ? 'text-gray-900 bg-gray-200 font-medium'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
```

Items shape: `[{ id: 'general', label: 'general' }]`

### Spinner

```jsx
function Spinner({ size = 16 }) {
  return (
    <span
      role="status"
      aria-label="loading"
      style={{ width: size, height: size }}
      className="inline-block border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin"
    />
  );
}
```

### SearchInput

```jsx
function SearchInput({ value, onChange, placeholder = 'search...', width = 'w-full' }) {
  return (
    <div className={`relative flex items-center ${width}`}>
      <Icon name="magnifying-glass" size={14} className="absolute left-0 text-gray-300 pointer-events-none" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-gray-300 py-2 pl-5 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-0 text-gray-300 hover:text-gray-500 transition-colors flex items-center"
        >
          <Icon name="x" size={12} className="" />
        </button>
      )}
    </div>
  );
}
```

---

## Typography

**Type scale** (only use sizes that fit the content):

| Class | Size | Use |
|---|---|---|
| `text-[10px]` | 10px | Labels, annotations |
| `text-xs` | 12px | Metadata, captions, section labels |
| `text-sm` | 14px | Body text (default) |
| `text-base` | 16px | Prominent body |
| `text-lg` | 18px | Sub-headings |
| `text-xl` | 20px | Section headings |
| `text-2xl` | 24px | Page titles (`font-light`) |
| `text-3xl` | 30px | Hero headings (`font-light`) |

**Weights:**
- `font-light` (300) — section titles, `text-2xl`+
- `font-normal` (400) — body text (default — no class needed)
- `font-medium` (500) — active sidebar nav item ONLY (always paired with `bg-gray-200` background)

**Gray scale tones:**

| Class | Typical use |
|---|---|
| `text-gray-900` | Highest contrast — primary content, data values |
| `text-gray-800` | Headings, section titles |
| `text-gray-700` | Body text, labels |
| `text-gray-600` | Secondary text, descriptions |
| `text-gray-500` | Tertiary, captions |
| `text-gray-400` | Placeholders, hints, icons |
| `text-gray-300` | Disabled text, very muted |

**Monospace:** `font-mono` for code, IDs, HTTP methods, response codes.

**Text patterns:** `lowercase` on all UI text. `tracking-widest uppercase text-xs text-gray-400` for section group labels. `truncate` for overflow. `break-all` for long strings (URLs, hashes).

---

## Behavioral Patterns

### Focus Trap (Modal / Drawer)

```jsx
React.useEffect(() => {
  const el = containerRef.current;
  if (!el) return;
  const focusable = Array.from(el.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ));
  if (focusable.length) focusable[0].focus();
  function handleKey(e) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab' || focusable.length === 0) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}, [onClose]);
```

### Outside-Click Close (Dropdown / DatePicker)

```jsx
const ref = React.useRef(null);

React.useEffect(() => {
  function handleOutside(e) {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  }
  document.addEventListener('mousedown', handleOutside);
  return () => document.removeEventListener('mousedown', handleOutside);
}, []);
```

### Group-Hover Reveal (KVEditor remove button, list item actions)

```jsx
{/* parent must have className="group" */}
<div className="group">
  <button className="opacity-0 group-hover:opacity-100 transition-all">
    {/* only visible on row hover */}
  </button>
</div>
```
