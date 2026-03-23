---
applyTo: "**/*.jsx,**/index.html"
---

# UI Components — Extended Reference

> Extends the base design system. All components follow the same minimal, lowercase, gray-first language.
> Two intentional exceptions to the no-color rule: **status semantics** (green/red/yellow) and **Phosphor icons**.

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
| Info / neutral | `text-gray-500` | `bg-gray-50` | `border-gray-200` |

Never use saturated variants (`green-500` bg, `red-700` text, etc.) — always the muted end.

---

## Form Elements

### Select / Dropdown

```jsx
<div className="relative">
  <select className="w-full border-b border-gray-300 py-2 pr-6 text-gray-700 text-sm bg-transparent appearance-none focus:outline-none focus:border-gray-500 cursor-pointer">
    <option value="">select an option</option>
    <option value="get">GET</option>
    <option value="post">POST</option>
  </select>
  {/* chevron */}
  <span className="pointer-events-none absolute right-0 top-2.5 text-gray-400 text-xs">↓</span>
</div>
```

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
        <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`} />
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
            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs transition-all"
          >✕</button>
        </div>
      ))}
      <button
        onClick={add}
        className="mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
      >
        + add row
      </button>
    </div>
  );
}
```

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
          {i > 0 && <span className="text-gray-300">/</span>}
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
    <nav className="flex flex-col gap-0.5 w-48 pr-6">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`text-left text-sm px-2 py-1.5 rounded-sm transition-colors lowercase ${
            active === item.id
              ? 'text-gray-800 bg-gray-100'
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
    <span className={`inline-block text-xs font-mono px-1.5 py-0.5 uppercase tracking-wide ${styles[variant] ?? styles.neutral}`}>
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
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-white border ${border[variant]} px-4 py-3 shadow-sm text-sm z-50`}>
      <span className={`lowercase ${text[variant]}`}>{message}</span>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xs transition-colors">✕</button>
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
          className="h-3 bg-gray-100 rounded-none"
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
      <div className="relative bg-white w-full max-w-md mx-4 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-sm tracking-widest text-gray-700 uppercase">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors text-xs">✕</button>
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
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors">cancel</button>
        <button onClick={onConfirm} className="text-red-400 hover:text-red-600 text-sm px-2 transition-colors">delete</button>
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
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 pointer-events-none lowercase z-50">
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
    <div className="relative border border-gray-100 bg-gray-50">
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
    <span className="inline-flex items-center gap-1 border border-gray-200 text-gray-500 text-xs px-2 py-0.5 lowercase">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors leading-none">✕</button>
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
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full bg-gray-500 transition-all"
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
        <span className={`text-gray-400 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>↓</span>
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
<div className="border border-gray-100 p-4 hover:border-gray-300 transition-colors group">
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
<div className="flex divide-x divide-gray-200 border border-gray-200">
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
<div className="flex divide-x divide-gray-200 border border-gray-200">
  <button
    onClick={onPrimary}
    className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors lowercase"
  >
    send
  </button>
  <button
    onClick={() => setDropdownOpen(o => !o)}
    className="px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
  >
    ↓
  </button>
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
            {i < steps.length - 1 && <span className="text-gray-200 text-xs">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* active step */}
      {React.createElement(steps[current].component, { onNext: next, onBack: back, isFirst: current === 0 })}
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
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm transition-colors lowercase">← back</button>
        )}
        <button onClick={() => onNext({ value })} className="text-gray-600 hover:text-gray-800 text-sm transition-colors lowercase">next →</button>
      </div>
    </div>
  );
}
```

---

## What NOT to do — Extended Rules

- ❌ No colored borders except status contexts
- ❌ No `rounded-*` on cards, modals, badges, or buttons — everything is square
- ❌ No filled button backgrounds (`bg-blue-500`, `bg-gray-700` etc.) — text-only actions only
- ❌ No uppercase labels except section headings (`tracking-widest uppercase text-xs text-gray-400`)
- ❌ No multicolor badges — one semantic color per badge, always muted variant
- ❌ No toast stacking — one toast at a time, bottom-right, auto-dismiss
- ❌ No icons for decoration — only functional meaning (copy, close, expand, status)
- ❌ Never show destructive actions prominently — always gray first, red only after confirmation intent