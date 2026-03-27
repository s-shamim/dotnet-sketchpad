---
applyTo: "**/*.jsx,**/index.html"
---

# UI Components — Extended Reference

> Extends the base design system. All components follow the same minimal, lowercase, gray-first language.
> Two intentional exceptions to the no-color rule: **status semantics** (green/red/yellow/blue for info) and **Phosphor icons**.

---

## React 18 — Mount API

`ReactDOM.render` was removed in React 18. Every `script.jsx` and `app.jsx` must use `createRoot`:

```jsx
// ❌ React 17 — throws a warning in React 18
ReactDOM.render(<App />, document.getElementById('root'));

// ✅ React 18
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

---

## `index.html` — Complete Page Template

Copy-paste boilerplate for any new app. Script order is **strict** — deviating breaks theming or the Babel JSX transform.

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
            },
          },
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

  <!-- Multi-file app: section files first, app.jsx always last -->
  <!-- <script type="text/babel" src="forms/Forms.jsx?v=1"></script> -->
  <!-- <script type="text/babel" src="navigation/Navigation.jsx?v=1"></script> -->
  <!-- <script type="text/babel" src="app.jsx?v=1"></script> -->
</body>

</html>
```

**Ordering rules:**
- Flash-prevention script is first — it reads `localStorage` and sets `data-theme` before any paint
- All CDN `<script>` tags belong in `<head>`, never inside `.jsx` files
- Tailwind config script must come immediately after the Tailwind CDN script
- `themes.css` must follow the Tailwind config (it defines the CSS vars Tailwind references)
- In multi-file apps, section JSX files load before `app.jsx`; `app.jsx` is always last (it calls `ReactDOM.createRoot`)
- Use `?v=N` cache-busting on JSX script tags to avoid stale Babel transpile cache during development

---

## Typography & Font

Use **Inter** from Google Fonts. Load in `<head>` after the Tailwind CDN script:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```

Configure Tailwind to apply Inter and remap the `gray` palette to CSS variables (required for theming):

```html
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
            50:  'var(--gray-50)',  100: 'var(--gray-100)', 200: 'var(--gray-200)',
            300: 'var(--gray-300)', 400: 'var(--gray-400)', 500: 'var(--gray-500)',
            600: 'var(--gray-600)', 700: 'var(--gray-700)', 800: 'var(--gray-800)',
            900: 'var(--gray-900)',
          },
        },
      }
    }
  }
</script>
```

Rules:
- Weights used: `300` (light headings), `400` (body — default), `500` (active states only)
- `font-light` on section titles, `font-medium` for active sidebar nav only, everything else unstyled (`400`)

---

## Icons — Phosphor Icons CDN

Phosphor uses a CSS webfont approach — icons are rendered via class names on `<i>` tags. No JS DOM manipulation, no React conflicts.

Add to `index.html` once, in `<head>`:

```html
<!-- Load only the weight you need. Use 'light' for this design system —
     matches the minimal, low-weight aesthetic. Loads ~200KB vs 3MB for all weights. -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/light/style.css"
/>

<!-- If you need status/semantic icons in 'regular' weight too: -->
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css" /> -->
```

Usage in JSX — just an `<i>` tag with classes, fully React-safe:

```jsx
// Thin wrapper for consistency — keeps icon usage uniform across the codebase
function Icon({ name, size = 14, className = "text-gray-400" }) {
  return (
    <i
      className={`ph-light ph-${name} ${className}`}
      style={{ fontSize: size }}
    />
  );
}

// Usage — icon names from phosphoricons.com
<Icon name="copy" />
<Icon name="chevron-down" size={12} />
<Icon name="check-circle" className="text-green-600" />
<Icon name="warning" className="text-yellow-600" />
<Icon name="x" size={12} />
```

Rules:
- Default size: `14px` for inline, `16px` for standalone buttons
- Default color: `text-gray-400` — never decorative color
- Status icons may use semantic color (see Status Badges)
- Weight: `ph-light` only — never `ph-bold` or `ph-fill`
- Browse icon names at [phosphoricons.com](https://phosphoricons.com)

---

## Status Colors

The **only** place color is permitted outside gray. Use these classes consistently:

| Semantic | Text | Background (subtle) | Border |
|---|---|---|---|
| Success | `text-green-600` | `bg-green-50` | `border-green-200` |
| Error | `text-red-500` | `bg-red-50` | `border-red-200` |
| Warning | `text-yellow-600` | `bg-yellow-50` | `border-yellow-200` |
| Info | `text-blue-600` | `bg-blue-50` | `border-blue-200` |
| Neutral | `text-gray-500` | `bg-gray-50` | `border-gray-200` |

Never use saturated variants (`green-500` bg, `red-700` text, etc.) — always the muted end.

---

## Shared App Primitives

Defined in `app.jsx` **before** `ReactDOM.createRoot` so all globally loaded section files can call them at render time.

### SectionTitle

Page-level heading for each section. Always the first element inside a section component.

```jsx
function SectionTitle({ children, sub }) {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-light tracking-widest text-gray-800 lowercase">{children}</h1>
      {sub && <p className="text-xs text-gray-400 tracking-widest mt-1 lowercase">{sub}</p>}
    </div>
  );
}

// Usage
<SectionTitle sub="input, select, toggle, textarea">forms</SectionTitle>
```

### DemoBlock

Demo wrapper for each named subsection within a section. Renders a `tracking-widest uppercase` label above the demo content.

```jsx
function DemoBlock({ title, children }) {
  return (
    <div className="mb-10">
      <h3 className="text-xs tracking-widest text-gray-400 uppercase mb-4 pb-2 border-b border-gray-100">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// Usage
<DemoBlock title="text input">
  <input placeholder="type here..." className="..." />
</DemoBlock>
```

---

## Form Elements

### Select / Dropdown

Use the shared `Dropdown` component — defined in `app.jsx` and available globally to all section files. It replaces all native `<select>` elements.

Define once in `app.jsx` (before `ReactDOM.createRoot`):

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
                  value === v
                    ? 'text-gray-800 bg-gray-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
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

Usage:

```jsx
const [val, setVal] = React.useState('');
<Dropdown
  value={val}
  onChange={setVal}
  placeholder="select an option"
  width="w-48"
  options={[
    { value: 'get',    label: 'GET'    },
    { value: 'post',   label: 'POST'   },
    { value: 'put',    label: 'PUT'    },
    { value: 'delete', label: 'DELETE' },
  ]}
/>
```

Features: bordered trigger with `rounded-sm`, `caret-down` icon rotates on open, outside-click closes, active option highlighted `bg-gray-100`, keyboard-accessible via `focus-visible` ring.

### Toggle / Switch

```jsx
function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-colors ${
          checked ? 'bg-gray-600' : 'bg-gray-200'
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`} style={{ backgroundColor: 'var(--toggle-thumb)' }} />
      </button>
      {label && (
        <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors lowercase">
          {label}
        </span>
      )}
    </label>
  );
}
```

### Radio Group

```jsx
function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-gray-500 w-3.5 h-3.5 cursor-pointer"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors lowercase">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}
```

### Textarea

```jsx
<textarea
  rows={4}
  placeholder="paste body here..."
  className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 text-sm bg-transparent resize-none focus:outline-none focus:border-gray-500"
/>
```

### Key-Value Pair Editor

Used for headers, query params, env vars — core Postman-style component.

```jsx
function KVEditor({ pairs, onChange }) {
  const update = (i, field, val) => {
    const next = pairs.map((p, idx) => idx === i ? { ...p, [field]: val } : p);
    onChange(next);
  };
  const add = () => onChange([...pairs, { key: '', value: '', enabled: true }]);
  const remove = (i) => onChange(pairs.filter((_, idx) => idx !== i));

  return (
    <div className="divide-y divide-gray-100">
      {pairs.map((pair, i) => (
        <div key={i} className="flex items-center gap-2 py-2 group">
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={e => update(i, 'enabled', e.target.checked)}
            className="accent-gray-400 w-3.5 h-3.5 cursor-pointer flex-shrink-0"
          />
          <input
            value={pair.key}
            onChange={e => update(i, 'key', e.target.value)}
            placeholder="key"
            className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent"
          />
          <input
            value={pair.value}
            onChange={e => update(i, 'value', e.target.value)}
            placeholder="value"
            className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent"
          />
          <button
            onClick={() => remove(i)}
            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex items-center"
          ><Icon name="x" size={12} /></button>
        </div>
      ))}
      <button
        onClick={add}
        className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
      >
        <Icon name="plus" size={12} /> add row
      </button>
    </div>
  );
}
```

### Input States

Consistent patterns for disabled, read-only, and keyboard focus across all interactive elements.

```jsx
{/* Disabled input */}
<input
  disabled
  defaultValue="disabled input"
  className="w-full border-b border-gray-200 py-2 text-gray-300 text-sm bg-transparent cursor-not-allowed focus:outline-none"
/>

{/* Read-only input */}
<input
  readOnly
  defaultValue="read-only value"
  className="w-full border-b border-gray-200 py-2 text-gray-400 text-sm bg-transparent cursor-default focus:outline-none"
/>

{/* Focus ring on interactive elements — keyboard only */}
<button className="... focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1">
  tab here to see focus ring
</button>

{/* Disabled button */}
<button disabled className="... text-gray-300 border-gray-100 cursor-not-allowed">
  disabled button
</button>
```

Rules:
- Disabled inputs: `cursor-not-allowed text-gray-300 border-gray-200`
- Read-only inputs: `cursor-default text-gray-400 border-gray-200`
- Focus rings: always `focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1` — use `focus-visible` (keyboard only), never bare `focus:`
- Disabled buttons: `cursor-not-allowed text-gray-300 border-gray-100`

---

## Navigation

### Tabs

```jsx
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-gray-100">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-xs tracking-wide lowercase transition-colors border-b-2 -mb-px ${
            active === tab.id
              ? 'border-gray-700 text-gray-700'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Usage
const tabs = [
  { id: 'params', label: 'params' },
  { id: 'headers', label: 'headers' },
  { id: 'body', label: 'body' },
];
```

### Breadcrumbs

```jsx
function Breadcrumbs({ crumbs }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-400">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icon name="caret-right" size={10} className="text-gray-300" />}
          {crumb.href
            ? <a href={crumb.href} className="hover:text-gray-600 transition-colors lowercase">{crumb.label}</a>
            : <span className="text-gray-600 lowercase">{crumb.label}</span>
          }
        </React.Fragment>
      ))}
    </nav>
  );
}
```

### Sidebar Nav

```jsx
function SidebarNav({ items, active, onChange }) {
  return (
    <nav className="flex flex-col gap-0.5 w-40 pr-4">
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

---

## Feedback & Status

### Status Badge

For HTTP methods, response codes, states. Color is permitted here.

```jsx
function Badge({ label, variant = 'neutral' }) {
  const styles = {
    neutral: 'text-gray-500 bg-gray-100',
    info:    'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    error:   'text-red-500 bg-red-50',
    warning: 'text-yellow-600 bg-yellow-50',
    // HTTP method variants
    get:     'text-green-600 bg-green-50',
    post:    'text-yellow-600 bg-yellow-50',
    put:     'text-blue-600 bg-blue-50',
    delete:  'text-red-500 bg-red-50',
    patch:   'text-purple-600 bg-purple-50',
  };
  return (
    <span className={`inline-block text-xs font-mono px-1.5 py-0.5 uppercase tracking-wide rounded-sm ${styles[variant] ?? styles.neutral}`}>
      {label}
    </span>
  );
}

// Usage
<Badge label="200 OK" variant="success" />
<Badge label="404" variant="error" />
<Badge label="GET" variant="get" />
```

### Inline Validation Error

```jsx
<p className="text-xs text-red-500 mt-1 lowercase">
  this field is required.
</p>
```

Input with error state:

```jsx
<input
  className={`flex-1 border-b py-2 text-sm text-gray-700 focus:outline-none bg-transparent ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'
  }`}
/>
{hasError && <p className="text-xs text-red-500 mt-1 lowercase">invalid url format.</p>}
```

### Toast / Notification

```jsx
function Toast({ message, variant = 'neutral', onClose }) {
  const border = {
    neutral: 'border-gray-200',
    success: 'border-green-200',
    error:   'border-red-200',
    warning: 'border-yellow-200',
  };
  const text = {
    neutral: 'text-gray-600',
    success: 'text-green-600',
    error:   'text-red-500',
    warning: 'text-yellow-600',
  };
  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-white border ${border[variant]} rounded-sm px-4 py-3 shadow-sm text-sm z-50`}>
      <span className={`lowercase ${text[variant]}`}>{message}</span>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors flex items-center"><Icon name="x" size={12} /></button>
    </div>
  );
}

// Toast manager hook
function useToast() {
  const [toast, setToast] = React.useState(null);
  const show = (message, variant = 'neutral', duration = 3000) => {
    setToast({ message, variant, duration });
  };
  // Effect owns the timer — cleanup runs on unmount or when toast changes,
  // preventing state updates on unmounted components.
  React.useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), toast.duration ?? 3000);
    return () => clearTimeout(id);
  }, [toast]);
  const ToastEl = toast
    ? <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
    : null;
  return { show, ToastEl };
}

// Usage
const { show, ToastEl } = useToast();
// In JSX: {ToastEl}
// Trigger: show('request saved.', 'success')
```

### Loading Spinner

```jsx
function Spinner({ size = 16 }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-block border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin"
    />
  );
}
```

### Skeleton Loader

```jsx
function Skeleton({ lines = 3 }) {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-100 rounded-sm"
          style={{ width: `${70 + (i % 3) * 10}%` }}
        />
      ))}
    </div>
  );
}
```

---

## Overlays

### Modal / Dialog

```jsx
function Modal({ title, children, onClose, actions }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />
      {/* panel */}
      <div className="relative bg-white w-full max-w-md mx-4 p-6 shadow-sm rounded-sm">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-sm tracking-widest text-gray-700 uppercase">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors flex items-center"><Icon name="x" size={12} /></button>
        </div>
        <div className="text-sm text-gray-600">{children}</div>
        {actions && (
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// Confirm variant
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal
      title="confirm"
      onClose={onCancel}
      actions={<>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase">cancel</button>
        <button onClick={onConfirm} className="text-red-400 hover:text-red-600 text-sm px-2 transition-colors lowercase">delete</button>
      </>}
    >
      <p className="text-gray-500 text-sm lowercase">{message}</p>
    </Modal>
  );
}
```

### Tooltip

```jsx
function Tooltip({ text, children }) {
  const [visible, setVisible] = React.useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded-sm pointer-events-none lowercase z-50">
          {text}
        </span>
      )}
    </span>
  );
}
```

---

## Data Display

### Code Block / Response Viewer

For API responses, JSON, HTTP bodies:

```jsx
function CodeBlock({ content, language = 'json', maxHeight = 320 }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative border border-gray-100 bg-gray-50 rounded-sm">
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
      >
        {copied ? 'copied' : 'copy'}
      </button>
      <pre
        style={{ maxHeight }}
        className="overflow-auto p-4 text-xs text-gray-700 font-mono leading-relaxed"
      >
        {content}
      </pre>
    </div>
  );
}
```

### Data Table

```jsx
function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map(col => (
              <th key={col.key} className="text-left py-2 pr-4 text-xs tracking-widest text-gray-400 uppercase font-normal">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className="group hover:bg-gray-50 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="py-2.5 pr-4 text-gray-700">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="text-center text-gray-300 text-sm py-8">no results.</p>
      )}
    </div>
  );
}
```

### Tag / Chip

```jsx
function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 border border-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded-sm lowercase">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors flex items-center"><Icon name="x" size={12} /></button>
      )}
    </span>
  );
}
```

### Progress Bar

```jsx
function ProgressBar({ value, max = 100, label }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-gray-400 lowercase">{label}</span>}
      <div className="w-full h-1 bg-gray-100 rounded-sm">
        <div
          className="h-full bg-gray-500 rounded-sm transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 text-right">{pct}%</span>
    </div>
  );
}
```

---

## Layout

### Collapsible / Accordion

```jsx
function Collapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors lowercase"
      >
        <span>{title}</span>
        <span className={`text-gray-400 transition-transform inline-flex ${open ? 'rotate-180' : ''}`}><Icon name="caret-down" size={12} /></span>
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
}
```

### Labeled Divider

```jsx
<div className="flex items-center gap-3 my-4">
  <div className="flex-1 h-px bg-gray-100" />
  <span className="text-xs text-gray-400 lowercase">or</span>
  <div className="flex-1 h-px bg-gray-100" />
</div>
```

### Card

Minimal use only — prefer divider-based lists. Use cards only when items need clear spatial separation (e.g. dashboard tiles, request history).

```jsx
<div className="border border-gray-100 rounded-sm p-4 hover:border-gray-300 transition-colors group">
  <div className="flex items-start justify-between">
    <p className="text-sm text-gray-700 lowercase">card title</p>
    <span className="text-xs text-gray-400">meta</span>
  </div>
  <p className="text-xs text-gray-400 mt-1 lowercase">supporting detail goes here.</p>
</div>
```

---

## Actions

### Button Group

```jsx
<div className="flex divide-x divide-gray-200 border border-gray-200 rounded-sm w-fit">
  {['json', 'xml', 'raw'].map(opt => (
    <button
      key={opt}
      className={`px-3 py-1.5 text-xs lowercase transition-colors ${
        active === opt ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'
      }`}
      onClick={() => setActive(opt)}
    >
      {opt}
    </button>
  ))}
</div>
```

### Split Button (action + dropdown)

```jsx
<div className="relative w-fit">
  <div className="flex divide-x divide-gray-200 border border-gray-200 rounded-sm">
    <button
      onClick={onPrimary}
      className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors lowercase"
    >
      send
    </button>
    <button
      onClick={() => setDropdownOpen(o => !o)}
      className="px-2 py-1.5 flex items-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
    >
      <Icon name="caret-down" size={12} />
    </button>
  </div>
  {dropdownOpen && (
    <div className="absolute top-full left-0 mt-1 w-40 border border-gray-200 bg-white shadow-sm rounded-sm z-10">
      {['send and save', 'send and copy', 'schedule send'].map(opt => (
        <button
          key={opt}
          className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors lowercase"
          onClick={() => { setLastAction(opt); setDropdownOpen(false); }}
        >
          {opt}
        </button>
      ))}
    </div>
  )}
</div>
```

### Danger / Destructive Pattern

Never a red button by default. Show intent progressively:

```jsx
function DangerButton({ label, confirmLabel, onConfirm }) {
  const [armed, setArmed] = React.useState(false);
  if (!armed) {
    return (
      <button
        onClick={() => setArmed(true)}
        className="text-gray-400 hover:text-red-400 text-sm transition-colors lowercase"
      >
        {label}
      </button>
    );
  }
  return (
    <span className="flex items-center gap-3 text-sm">
      <span className="text-gray-400 lowercase">are you sure?</span>
      <button onClick={onConfirm} className="text-red-400 hover:text-red-600 transition-colors lowercase">{confirmLabel}</button>
      <button onClick={() => setArmed(false)} className="text-gray-300 hover:text-gray-500 transition-colors lowercase">cancel</button>
    </span>
  );
}
```

---

## Multi-Step Form / Wizard

```jsx
function Wizard({ steps, onComplete }) {
  const [current, setCurrent] = React.useState(0);
  const [data, setData] = React.useState({});

  const next = (stepData) => {
    const merged = { ...data, ...stepData };
    setData(merged);
    if (current < steps.length - 1) setCurrent(c => c + 1);
    else onComplete(merged);
  };
  const back = () => setCurrent(c => c - 1);

  return (
    <div>
      {/* step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <span className={`text-xs lowercase transition-colors ${
              i === current ? 'text-gray-700' : i < current ? 'text-gray-400' : 'text-gray-200'
            }`}>
              {step.label}
            </span>
            {i < steps.length - 1 && <Icon name="arrow-right" size={10} className="text-gray-200" />}
          </React.Fragment>
        ))}
      </div>

      {/* active step — data accumulates across steps; pass it so later steps (e.g. confirm) can display collected values */}
      {React.createElement(steps[current].component, { onNext: next, onBack: back, isFirst: current === 0, data })}
    </div>
  );
}

// Step component contract:
function ExampleStep({ onNext, onBack, isFirst }) {
  const [value, setValue] = React.useState('');
  return (
    <div className="flex flex-col gap-6">
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="field..."
        className="border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent"
      />
      <div className="flex gap-4">
        {!isFirst && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition-colors lowercase"><Icon name="arrow-left" size={12} /> back</button>
        )}
        <button onClick={() => onNext({ value })} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm transition-colors lowercase">next <Icon name="arrow-right" size={12} /></button>
      </div>
    </div>
  );
}
```

---

## CSS Theming System

All gray and white values are CSS variables, enabling full theme switching without changing Tailwind classes. The `data-theme` attribute on `<html>` selects the active theme.

### Setup

**`index.html`** — Flash-prevent inline script (runs before React CDNs, prevents theme flash on load):

```html
<!-- Place before React CDN scripts, inside <head> -->
<script>
  (function() {
    var t = localStorage.getItem('ui-theme') || 'zinc';
    var m = localStorage.getItem('ui-mode')  || 'light';
    document.documentElement.setAttribute('data-theme', t + '-' + m);
  })();
</script>
```

**`themes.css`** — Linked from `index.html`, defines all theme variable sets:

```html
<link rel="stylesheet" href="themes.css" />
```

**`themes.css`** structure — full content, all 6 themes:

```css
html, body { margin: 0; padding: 0; }
body { background-color: var(--gray-50); }

/* Dark mode: deepen shadows against dark surfaces */
[data-theme$="-dark"] .shadow-sm {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.6), 0 1px 2px -1px rgb(0 0 0 / 0.4);
}

/* ── Zinc — pure neutral ───────────────────────────────── */
[data-theme="zinc-light"] {
  --gray-50: #fafafa;  --gray-100: #f4f4f5;  --gray-200: #e4e4e7;
  --gray-300: #d4d4d8; --gray-400: #a1a1aa;  --gray-500: #71717a;
  --gray-600: #52525b; --gray-700: #3f3f46;  --gray-800: #27272a;  --gray-900: #18181b;
  --color-white: #ffffff; --toggle-thumb: #ffffff;
}
[data-theme="zinc-dark"] {
  --gray-50: #18181b;  --gray-100: #27272a;  --gray-200: #3f3f46;
  --gray-300: #52525b; --gray-400: #71717a;  --gray-500: #a1a1aa;
  --gray-600: #d4d4d8; --gray-700: #e4e4e7;  --gray-800: #f4f4f5;  --gray-900: #fafafa;
  --color-white: #27272a; --toggle-thumb: #ffffff;
}

/* ── Slate — cool blue-gray ─────────────────────────────── */
[data-theme="slate-light"] {
  --gray-50: #f8fafc;  --gray-100: #f1f5f9;  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1; --gray-400: #94a3b8;  --gray-500: #64748b;
  --gray-600: #475569; --gray-700: #334155;  --gray-800: #1e293b;  --gray-900: #0f172a;
  --color-white: #ffffff; --toggle-thumb: #ffffff;
}
[data-theme="slate-dark"] {
  --gray-50: #0f172a;  --gray-100: #1e293b;  --gray-200: #334155;
  --gray-300: #475569; --gray-400: #64748b;  --gray-500: #94a3b8;
  --gray-600: #cbd5e1; --gray-700: #e2e8f0;  --gray-800: #f1f5f9;  --gray-900: #f8fafc;
  --color-white: #1e293b; --toggle-thumb: #ffffff;
}

/* ── Stone — warm neutral ───────────────────────────────── */
[data-theme="stone-light"] {
  --gray-50: #fafaf9;  --gray-100: #f5f5f4;  --gray-200: #e7e5e4;
  --gray-300: #d6d3d1; --gray-400: #a8a29e;  --gray-500: #78716c;
  --gray-600: #57534e; --gray-700: #44403c;  --gray-800: #292524;  --gray-900: #1c1917;
  --color-white: #ffffff; --toggle-thumb: #ffffff;
}
[data-theme="stone-dark"] {
  --gray-50: #1c1917;  --gray-100: #292524;  --gray-200: #44403c;
  --gray-300: #57534e; --gray-400: #78716c;  --gray-500: #a8a29e;
  --gray-600: #d6d3d1; --gray-700: #e7e5e4;  --gray-800: #f5f5f4;  --gray-900: #fafaf9;
  --color-white: #292524; --toggle-thumb: #ffffff;
}

/* ── High Contrast — max separation ─────────────────────── */
[data-theme="hc-light"] {
  --gray-50: #ffffff;  --gray-100: #f0f0f0;  --gray-200: #cccccc;
  --gray-300: #999999; --gray-400: #666666;  --gray-500: #444444;
  --gray-600: #222222; --gray-700: #111111;  --gray-800: #050505;  --gray-900: #000000;
  --color-white: #ffffff; --toggle-thumb: #ffffff;
}
[data-theme="hc-dark"] {
  --gray-50: #000000;  --gray-100: #0a0a0a;  --gray-200: #1a1a1a;
  --gray-300: #333333; --gray-400: #666666;  --gray-500: #888888;
  --gray-600: #bbbbbb; --gray-700: #dddddd;  --gray-800: #f0f0f0;  --gray-900: #ffffff;
  --color-white: #0a0a0a; --toggle-thumb: #ffffff;
}
/* High contrast: boosted border variable + slight letter-spacing on all text */
[data-theme^="hc-"] { --border-boost: 1px solid var(--gray-400); }
[data-theme^="hc-"] *,
[data-theme^="hc-"] *::before,
[data-theme^="hc-"] *::after { letter-spacing: 0.01em; }

/* ── Vibrant — indigo-based with tinted surfaces ────────── */
[data-theme="vibrant-light"] {
  --gray-50: #f5f3ff;  --gray-100: #ede9fe;  --gray-200: #ddd6fe;
  --gray-300: #c4b5fd; --gray-400: #a78bfa;  --gray-500: #7c3aed;
  --gray-600: #6d28d9; --gray-700: #5b21b6;  --gray-800: #4c1d95;  --gray-900: #2e1065;
  --color-white: #ffffff; --toggle-thumb: #ffffff;
}
[data-theme="vibrant-dark"] {
  --gray-50: #1e1033;  --gray-100: #2e1065;  --gray-200: #3b1789;
  --gray-300: #5b21b6; --gray-400: #7c3aed;  --gray-500: #a78bfa;
  --gray-600: #c4b5fd; --gray-700: #ddd6fe;  --gray-800: #ede9fe;  --gray-900: #f5f3ff;
  --color-white: #2e1065; --toggle-thumb: #ffffff;
}

/* ── Grayscale — pure achromatic ────────────────────────── */
[data-theme="gray-light"] {
  --gray-50: #f9f9f9;  --gray-100: #f2f2f2;  --gray-200: #e0e0e0;
  --gray-300: #c8c8c8; --gray-400: #9e9e9e;  --gray-500: #757575;
  --gray-600: #616161; --gray-700: #424242;  --gray-800: #212121;  --gray-900: #121212;
  --color-white: #ffffff; --toggle-thumb: #ffffff;
}
[data-theme="gray-dark"] {
  --gray-50: #121212;  --gray-100: #1e1e1e;  --gray-200: #2c2c2c;
  --gray-300: #3d3d3d; --gray-400: #5e5e5e;  --gray-500: #858585;
  --gray-600: #ababab; --gray-700: #cfcfcf;  --gray-800: #e8e8e8;  --gray-900: #f5f5f5;
  --color-white: #1e1e1e; --toggle-thumb: #e8e8e8;
}
/* Grayscale: desaturate all status colors — map to gray vars */
[data-theme^="gray-"] .text-green-600   { color: var(--gray-600) !important; }
[data-theme^="gray-"] .bg-green-50      { background-color: var(--gray-100) !important; }
[data-theme^="gray-"] .border-green-200 { border-color: var(--gray-200) !important; }
[data-theme^="gray-"] .text-red-500     { color: var(--gray-500) !important; }
[data-theme^="gray-"] .bg-red-50        { background-color: var(--gray-100) !important; }
[data-theme^="gray-"] .border-red-200   { border-color: var(--gray-200) !important; }
[data-theme^="gray-"] .text-yellow-600  { color: var(--gray-600) !important; }
[data-theme^="gray-"] .bg-yellow-50     { background-color: var(--gray-100) !important; }
[data-theme^="gray-"] .text-blue-600    { color: var(--gray-600) !important; }
[data-theme^="gray-"] .bg-blue-50       { background-color: var(--gray-100) !important; }
[data-theme^="gray-"] .text-purple-600  { color: var(--gray-600) !important; }
[data-theme^="gray-"] .bg-purple-50     { background-color: var(--gray-100) !important; }
```

### CSS Variables

| Variable | Role |
|---|---|
| `--gray-50` … `--gray-900` | Full gray scale — remapped per theme |
| `--color-white` | Surface backgrounds (dark mode maps to a dark tone) |
| `--toggle-thumb` | Toggle switch thumb color |

### Available Themes

| Theme | Description |
|---|---|
| `zinc` | Pure neutral (default) |
| `slate` | Cool blue-gray |
| `stone` | Warm neutral |
| `hc` | High contrast — stark black/white, slight `letter-spacing` nudge |
| `vibrant` | Indigo/violet tinted surfaces |
| `gray` | Pure achromatic with status color overrides |

Each theme has a `-light` and `-dark` variant (`data-theme="zinc-light"` / `"zinc-dark"`).

### React Integration

In `app.jsx`, persist and apply the theme:

```jsx
const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
const [mode,  setMode]  = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

React.useEffect(() => {
  document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
  localStorage.setItem('ui-theme', theme);
  localStorage.setItem('ui-mode',  mode);
}, [theme, mode]);
```

Switch the theme with a `Dropdown`, toggle dark mode with a `Toggle`. Both persist to `localStorage` and survive page reloads with no flash.

### Toggle Thumb

The toggle thumb must adapt to themes. Use the CSS variable, not a static color class:

```jsx
{/* ❌ breaks in dark themes where white thumb becomes invisible */}
<span className={`... bg-white ...`} />

{/* ✅ theme-aware */}
<span className={`...`} style={{ backgroundColor: 'var(--toggle-thumb)' }} />
```

> **`gray-dark` exception:** `--toggle-thumb` is `#e8e8e8` (not `#ffffff`) — the off-white thumb contrasts against the very dark `#1e1e1e` surface in grayscale dark mode. Every other theme (including all other dark variants) uses `#ffffff`.

---

## What NOT to do — Extended Rules

- ❌ No colored borders except status contexts
- ❌ No `rounded-*` beyond `rounded-sm` — `rounded-sm` is the only permitted radius token; larger values (`rounded-md`, `rounded-lg`, etc.) are never used
- ❌ No filled button backgrounds (`bg-blue-500`, `bg-gray-700` etc.) — text-only actions only
- ❌ No uppercase labels except section headings (`tracking-widest uppercase text-xs text-gray-400`)
- ❌ No multicolor badges — one semantic color per badge, always muted variant
- ❌ No toast stacking — one toast at a time, bottom-right, auto-dismiss
- ❌ No icons for decoration — only functional meaning (copy, close, expand, status)
- ❌ Never show destructive actions prominently — always gray first, red only after confirmation intent
