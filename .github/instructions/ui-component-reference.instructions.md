---
applyTo: "**/*.jsx,**/index.html"
---

# UI Component Reference

> Full implementation detail for every component in this design system.
> All code comes verbatim from `ui-showcase/wwwroot/` — the canonical living reference.
> See [ui.instructions.md](ui.instructions.md) for the lean index and conventions.

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

**Script load order (strict):**
1. Flash-prevention inline script — first, before any CDN
2. React 18 + ReactDOM
3. Babel standalone
4. Tailwind CDN
5. Tailwind config (immediately after Tailwind CDN)
6. `themes.css` (after Tailwind config — it defines CSS vars Tailwind references)
7. Inter font links
8. Phosphor icons CSS
9. JSX files at end of `<body>` — `shared.jsx` first, section files next, `app.jsx` last

**Cache-busting:** Always use `?v=N` on JSX `<script>` tags to force Babel re-transpile during development.

---

## File Architecture

### Single-file app

Use one `script.jsx` file. Define all components, mount with `ReactDOM.createRoot` at the bottom.

```
wwwroot/
  index.html
  script.jsx     ← all components + createRoot mount
  themes.css
```

### Multi-file app (ui-showcase pattern)

Split into `shared.jsx`, section files, and `app.jsx`. Load order is critical — later files can call functions defined in earlier files as globals.

```
wwwroot/
  index.html      ← loads all JSX in correct order
  themes.css
  shared.jsx      ← Toggle, SidebarNav, Spinner (cross-section primitives)
  app.jsx         ← Icon, SectionTitle, DemoBlock, Dropdown, SECTIONS, App + createRoot
  forms/
    Forms.jsx
  feedback/
    Feedback.jsx
  (etc.)
```

**Why `shared.jsx` exists:**
- `Toggle` is used by the app shell AND FormsSection
- `SidebarNav` is used by the app shell AND NavigationSection
- `Spinner` is used by ButtonsSection AND FeedbackSection
- Anything used across 2+ sections goes in `shared.jsx`, not `app.jsx`

**`app.jsx` owns:** `Icon`, `SectionTitle`, `DemoBlock`, `Dropdown`, `SECTIONS` registry, `App` component, `ReactDOM.createRoot` mount.

---

## App Shell — Theme + Dark Mode (Required in Every App)

Every app must include a theme changer and dark mode toggle. This is the canonical pattern from `app.jsx`:

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

Common icon names: `house`, `gear`, `bell`, `user`, `magnifying-glass`, `x`, `check`, `plus`, `minus`, `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`, `caret-down`, `caret-up`, `caret-left`, `caret-right`, `copy`, `clipboard`, `pencil`, `trash`, `floppy-disk`, `upload`, `download`, `eye`, `eye-slash`, `lock`, `lock-open`, `key`, `shield`, `warning`, `info`, `question`, `check-circle`, `x-circle`, `dots-three-outline`, `list`, `grid-four`, `rows`, `sidebar`, `folder`, `file`, `file-text`, `image`, `video`, `code`, `terminal`, `database`, `cloud`, `wifi`, `link`, `globe`, `envelope`, `chat`, `phone`, `map-pin`, `calendar`, `clock`, `chart-bar`, `chart-line`, `trend-up`, `trend-down`, `arrow-clockwise`, `arrow-counter-clockwise`, `funnel`, `sort-ascending`, `sort-descending`, `star`, `heart`, `bookmark`, `tag`, `flag`, `shuffle`, `dots-six-vertical`, `credit-card`

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

> Outer element is `<div>` not `<label>` — `<label>` wrapping `<button>` breaks click propagation in some browsers.

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
- `font-medium` (500) — active sidebar nav item ONLY

**Gray scale:** `text-gray-900` (headings) → `text-gray-700` (body) → `text-gray-500` (secondary) → `text-gray-400` (muted/labels) → `text-gray-300` (placeholders/disabled)

**Monospace:** `font-mono` for code, IDs, HTTP methods, response codes.

**Text patterns:** `lowercase` on all UI text. `tracking-widest uppercase text-xs text-gray-400` for section group labels. `truncate` for overflow. `break-all` for long strings (URLs, hashes).

---

## Buttons

### Text buttons

```jsx
{/* primary */}
<button className="text-sm text-gray-700 hover:text-gray-900 transition-colors lowercase">primary action</button>

{/* secondary */}
<button className="text-sm text-gray-500 hover:text-gray-700 transition-colors lowercase">secondary action</button>

{/* muted */}
<button className="text-sm text-gray-400 hover:text-gray-600 transition-colors lowercase">muted action</button>

{/* destructive */}
<button className="text-sm text-red-400 hover:text-red-600 transition-colors lowercase">destructive</button>
```

### Ghost buttons (bordered, no fill)

```jsx
{/* default */}
<button className="text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase">default</button>

{/* secondary */}
<button className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 hover:text-gray-700 transition-colors lowercase">secondary</button>

{/* destructive */}
<button className="text-sm text-red-400 border border-red-200 px-3 py-1.5 rounded-sm hover:border-red-400 hover:text-red-600 transition-colors lowercase">destructive</button>
```

### Sizes

```jsx
{/* xs */}    <button className="text-[10px] border border-gray-200 px-2 py-1 rounded-sm ...">xs</button>
{/* small */} <button className="text-xs border border-gray-200 px-2.5 py-1.5 rounded-sm ...">small</button>
{/* medium */}<button className="text-sm border border-gray-200 px-3 py-1.5 rounded-sm ...">medium</button>
{/* large */} <button className="text-base border border-gray-200 px-4 py-2 rounded-sm ...">large</button>
```

### Icon buttons

```jsx
{/* icon only — always include aria-label */}
<button aria-label="copy" className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-sm">
  <Icon name="copy" size={16} className="" />
</button>

{/* icon + label */}
<button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase">
  <Icon name="plus" size={14} className="" /> new item
</button>

{/* dashed / add variant */}
<button className="flex items-center gap-2 text-sm text-gray-400 border border-dashed border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 hover:text-gray-600 transition-colors lowercase">
  <Icon name="plus" size={14} className="" /> add
</button>
```

### Loading state

```jsx
const [loading, setLoading] = React.useState(false);

<button
  onClick={() => { setLoading(true); /* ... then setLoading(false) */ }}
  disabled={loading}
  className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 transition-colors lowercase disabled:opacity-60 disabled:cursor-not-allowed"
>
  {loading ? <><Spinner size={12} /> saving...</> : 'save changes'}
</button>
```

### States

```jsx
{/* disabled */}
<button disabled className="text-sm text-gray-300 border border-gray-100 px-3 py-1.5 rounded-sm cursor-not-allowed lowercase">disabled</button>

{/* focus ring — keyboard only */}
<button className="... focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1">tab to focus</button>
```

---

## Forms

### Text Input

```jsx
{/* basic */}
<input
  placeholder="placeholder text..."
  className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 text-sm bg-transparent focus:outline-none focus:border-gray-500"
/>

{/* with validation error */}
const [touched, setTouched] = React.useState(false);
<input
  placeholder="required field..."
  onBlur={() => setTouched(true)}
  className={`w-full border-b py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-transparent ${
    touched ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-gray-500'
  }`}
/>
{touched && <p className="text-xs text-red-500 mt-1 lowercase">this field is required.</p>}
```

### Textarea (with shoulder actions)

```jsx
const [val, setVal] = React.useState('');
const [copied, setCopied] = React.useState(false);

<div>
  <div className="flex items-center justify-end gap-2 mb-1">
    <button
      onClick={() => { navigator.clipboard.writeText(val); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
    >
      <Icon name="copy" size={12} className="" />
      {copied ? 'copied' : 'copy'}
    </button>
    <button
      onClick={() => setVal('')}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
    >
      <Icon name="x" size={12} className="" /> clear
    </button>
  </div>
  <textarea
    rows={4}
    value={val}
    onChange={e => setVal(e.target.value)}
    placeholder="paste or type here..."
    className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 text-sm bg-transparent resize-none focus:outline-none focus:border-gray-500"
  />
</div>
```

### Checkbox

```jsx
function Checkbox({ checked, onChange, label, disabled = false }) {
  return (
    <label className={`flex items-center gap-2.5 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        className="accent-gray-500 w-3.5 h-3.5 cursor-pointer"
      />
      {label && <span className="text-sm text-gray-600 lowercase">{label}</span>}
    </label>
  );
}
```

### RadioGroup

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

### DatePicker

Full calendar — not a native `<input type="date">`.

```jsx
function DatePicker({ value, onChange }) {
  const today = new Date();
  const [view, setView] = React.useState({ year: today.getFullYear(), month: today.getMonth() });
  const [open, setOpen] = React.useState(false);
  const ref  = React.useRef(null);

  React.useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const firstDay   = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  function prevMonth() {
    setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  }
  function nextMonth() {
    setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  }
  function select(day) { onChange(new Date(view.year, view.month, day)); setOpen(false); }
  function isSelected(day) {
    return value && value.getFullYear() === view.year && value.getMonth() === view.month && value.getDate() === day;
  }
  function isToday(day) {
    return today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === day;
  }

  const displayLabel = value
    ? `${MONTHS[value.getMonth()]} ${value.getDate()}, ${value.getFullYear()}`
    : 'select a date...';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full border-b border-gray-300 py-2 text-sm text-left hover:border-gray-500 transition-colors focus:outline-none"
      >
        <span className={value ? 'text-gray-700' : 'text-gray-300'}>{displayLabel}</span>
        <Icon name="calendar" size={14} className="text-gray-300" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-sm z-20 p-3 w-56">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="caret-left" size={12} className="" />
            </button>
            <span className="text-xs text-gray-600 lowercase">{MONTHS[view.month]} {view.year}</span>
            <button onClick={nextMonth} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="caret-right" size={12} className="" />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <span key={d} className="text-center text-[10px] text-gray-300 uppercase">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              return (
                <button
                  key={day}
                  onClick={() => select(day)}
                  className={`text-xs py-1 rounded-sm transition-colors ${
                    isSelected(day) ? 'bg-gray-700 text-white'
                    : isToday(day)  ? 'text-gray-700 underline'
                    : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Key-Value Pair Editor (KVEditor)

Pairs must use a stable `id` field, not array index, for React key correctness.

```jsx
function KVEditor({ pairs, onChange }) {
  const nextId = React.useRef(pairs.length + 1);
  const update = (id, field, val) => {
    onChange(pairs.map(p => p.id === id ? { ...p, [field]: val } : p));
  };
  const add = () => {
    nextId.current += 1;
    onChange([...pairs, { id: nextId.current, key: '', value: '', enabled: true }]);
  };
  const remove = (id) => onChange(pairs.filter(p => p.id !== id));

  return (
    <div className="divide-y divide-gray-100">
      {pairs.map(pair => (
        <div key={pair.id} className="flex items-center gap-2 py-2 group">
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={e => update(pair.id, 'enabled', e.target.checked)}
            className="accent-gray-400 w-3.5 h-3.5 cursor-pointer flex-shrink-0"
          />
          <input
            value={pair.key}
            onChange={e => update(pair.id, 'key', e.target.value)}
            placeholder="key"
            className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent"
          />
          <input
            value={pair.value}
            onChange={e => update(pair.id, 'value', e.target.value)}
            placeholder="value"
            className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent"
          />
          <button
            onClick={() => remove(pair.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex items-center"
          >
            <Icon name="x" size={12} className="" />
          </button>
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

Initial data shape: `[{ id: 1, key: 'Authorization', value: 'Bearer token', enabled: true }]`

### Input States

```jsx
{/* disabled */}
<input
  disabled
  defaultValue="disabled input"
  className="w-full border-b border-gray-200 py-2 text-gray-300 text-sm bg-transparent cursor-not-allowed focus:outline-none"
/>

{/* read-only */}
<input
  readOnly
  defaultValue="read-only value"
  className="w-full border-b border-gray-200 py-2 text-gray-400 text-sm bg-transparent cursor-default focus:outline-none"
/>

{/* disabled button */}
<button disabled className="text-sm text-gray-300 border border-gray-100 px-3 py-1.5 rounded-sm cursor-not-allowed lowercase">disabled</button>
```

---

## Navigation

### Tabs

```jsx
function Tabs({ tabs, active, onChange }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-gray-100">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
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
```

ARIA: `role="tablist"` on wrapper, `role="tab"` + `aria-selected` on each button. Tabs shape: `[{ id: 'params', label: 'params' }]`.

### Breadcrumbs

```jsx
function Breadcrumbs({ crumbs }) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-gray-400">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.label}>
          {i > 0 && <Icon name="caret-right" size={10} className="text-gray-300" />}
          {crumb.href
            ? <a href={crumb.href} className="hover:text-gray-600 transition-colors lowercase">{crumb.label}</a>
            : <span aria-current="page" className="text-gray-600 lowercase">{crumb.label}</span>
          }
        </React.Fragment>
      ))}
    </nav>
  );
}
```

Crumbs shape: `[{ label: 'home', href: '#' }, { label: 'current page' }]` — last item has no `href`.

---

## Feedback

### Badge

```jsx
function Badge({ label, variant = 'neutral' }) {
  const styles = {
    neutral: 'text-gray-500 bg-gray-100',
    info:    'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    error:   'text-red-500 bg-red-50',
    get:     'text-green-600 bg-green-50',
    post:    'text-yellow-600 bg-yellow-50',
    put:     'text-blue-600 bg-blue-50',
    delete:  'text-red-500 bg-red-50',
    patch:   'text-purple-600 bg-purple-50',
  };
  return (
    <span className={`inline-block text-xs font-mono px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${styles[variant] ?? styles.neutral}`}>
      {label}
    </span>
  );
}
```

Usage: `<Badge label="200 OK" variant="success" />` `<Badge label="GET" variant="get" />`

### Alert / Banner

```jsx
function Alert({ variant = 'neutral', children, onClose }) {
  const styles = {
    neutral: { border: 'border-gray-200',   bg: 'bg-gray-50',    text: 'text-gray-600',   icon: 'info'         },
    info:    { border: 'border-blue-200',   bg: 'bg-blue-50',    text: 'text-blue-600',   icon: 'info'         },
    success: { border: 'border-green-200',  bg: 'bg-green-50',   text: 'text-green-600',  icon: 'check-circle' },
    warning: { border: 'border-yellow-200', bg: 'bg-yellow-50',  text: 'text-yellow-600', icon: 'warning'      },
    error:   { border: 'border-red-200',    bg: 'bg-red-50',     text: 'text-red-500',    icon: 'x-circle'     },
  };
  const s = styles[variant] ?? styles.neutral;
  return (
    <div className={`flex items-start gap-3 border ${s.border} ${s.bg} px-4 py-3 rounded-sm`}>
      <Icon name={s.icon} size={14} className={`${s.text} mt-0.5 shrink-0`} />
      <span className={`text-sm lowercase flex-1 ${s.text}`}>{children}</span>
      {onClose && (
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors flex items-center shrink-0 self-center">
          <Icon name="x" size={12} className="" />
        </button>
      )}
    </div>
  );
}
```

`onClose` is optional — omit for non-dismissible banners.

### Toast + `useToast` hook

```jsx
function Toast({ message, variant = 'neutral', onClose }) {
  const border = { neutral: 'border-gray-200', info: 'border-blue-200', success: 'border-green-200', error: 'border-red-200', warning: 'border-yellow-200' };
  const text   = { neutral: 'text-gray-600',   info: 'text-blue-600',   success: 'text-green-600',  error: 'text-red-500',   warning: 'text-yellow-600'  };
  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-white border ${border[variant]} px-4 py-3 shadow-sm rounded-sm text-sm z-50`}>
      <span className={`lowercase ${text[variant]}`}>{message}</span>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors flex items-center">
        <Icon name="x" size={12} className="" />
      </button>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = React.useState(null);
  const show = (message, variant = 'neutral', duration = 3000) => {
    setToast({ message, variant, duration });
  };
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
```

Usage:
```jsx
const { show, ToastEl } = useToast();
// In JSX: {ToastEl}
// Trigger: show('saved.', 'success')  show('error occurred.', 'error', 5000)
```

One toast at a time, bottom-right, auto-dismiss. Never stack toasts.

### Skeleton Loader

```jsx
function Skeleton({ lines = 3 }) {
  const widths = [85, 65, 92, 74, 80];
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-100 rounded-sm"
          style={{ width: `${widths[i % widths.length]}%` }}
        />
      ))}
    </div>
  );
}
```

---

## Overlays

### Modal / Dialog

Focus trap, Tab cycling, Esc close, backdrop click close. `size` prop: `'md'` (default) or `'lg'`.

```jsx
function Modal({ title, children, onClose, actions, size = 'md' }) {
  const dialogRef = React.useRef(null);
  const titleId = React.useId();
  const maxW = size === 'lg' ? 'max-w-xl' : 'max-w-md';

  React.useEffect(() => {
    const el = dialogRef.current;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative bg-white w-full ${maxW} mx-4 p-6 shadow-sm rounded-sm`}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 id={titleId} className="text-sm tracking-widest text-gray-700 uppercase">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors flex items-center">
            <Icon name="x" size={12} className="" />
          </button>
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
```

### ConfirmModal

```jsx
function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'delete' }) {
  return (
    <Modal
      title="confirm"
      onClose={onCancel}
      actions={<>
        <button onClick={onCancel}  className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase">cancel</button>
        <button onClick={onConfirm} className="text-red-400 hover:text-red-600 text-sm px-2 transition-colors lowercase">{confirmLabel}</button>
      </>}
    >
      <p className="text-gray-500 text-sm lowercase">{message}</p>
    </Modal>
  );
}
```

### Tooltip

Uses `--overlay-bg` and `--overlay-text` CSS variables so it respects the active theme.

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
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap text-xs px-2 py-1 pointer-events-none rounded-sm lowercase z-50"
          style={{ backgroundColor: 'var(--overlay-bg)', color: 'var(--overlay-text)' }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
```

### Drawer

Right-side panel. Same focus trap + Esc behavior as Modal.

```jsx
function Drawer({ title, children, onClose }) {
  const drawerRef = React.useRef(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const el = drawerRef.current;
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-white w-80 h-full shadow-sm flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 id={titleId} className="text-sm tracking-widest text-gray-700 uppercase">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors flex items-center">
            <Icon name="x" size={14} className="" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}
```

---

## Data Display

### CodeBlock

Language picker optional — pass `languages` + `onLanguageChange` to enable it.

```jsx
function CodeBlock({ content, language = 'json', languages, onLanguageChange, maxHeight = 320 }) {
  const [copied, setCopied] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const langRef = React.useRef(null);

  React.useEffect(() => {
    if (!langOpen) return;
    function onOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [langOpen]);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border border-gray-100 rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-gray-100">
        {languages && onLanguageChange ? (
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(o => !o)}
              className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-gray-600 transition-colors lowercase"
            >
              {language}
              <Icon name="caret-down" size={10} className={`text-gray-300 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full left-0 mt-1 border border-gray-200 bg-white rounded-sm shadow-sm z-20 overflow-hidden">
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => { onLanguageChange(lang); setLangOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors lowercase ${
                      lang === language ? 'text-gray-700 bg-gray-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                  >{lang}</button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs font-mono text-gray-400">{language}</span>
        )}
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
        >
          <Icon name={copied ? 'check' : 'copy'} size={12} className={copied ? 'text-green-600' : ''} />
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre style={{ maxHeight }} className="overflow-auto p-4 text-xs text-gray-700 font-mono leading-relaxed bg-gray-50">
        {content}
      </pre>
    </div>
  );
}
```

### DataTable (sortable)

```jsx
function DataTable({ columns, rows }) {
  const [sortKey, setSortKey] = React.useState(null);
  const [sortDir, setSortDir] = React.useState('asc');

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const r = String(a[sortKey]).localeCompare(String(b[sortKey]), undefined, { numeric: true });
        return sortDir === 'asc' ? r : -r;
      })
    : rows;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map(col => (
              <th key={col.key} className="text-left pb-2 pr-4 font-normal">
                <button
                  onClick={() => handleSort(col.key)}
                  className="flex items-center gap-1 text-xs tracking-wide text-gray-400 hover:text-gray-600 transition-colors lowercase group"
                >
                  {col.label}
                  <span className={`transition-opacity ${sortKey === col.key ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    <Icon name={sortKey === col.key && sortDir === 'desc' ? 'sort-descending' : 'sort-ascending'} size={11} className="" />
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((row, i) => (
            <tr key={i} className="group hover:bg-gray-50 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="py-2.5 pr-4 text-gray-700">{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <EmptyState title="no results." />}
    </div>
  );
}
```

Columns shape: `[{ key: 'name', label: 'name' }]`. Use a stable `key` on rows in real data (not array index).

### EmptyState

```jsx
function EmptyState({ icon = 'folder-open', title = 'nothing here yet.', sub, action }) {
  return (
    <div className="flex flex-col items-center py-10 gap-3 text-center">
      <Icon name={icon} size={28} className="text-gray-200" />
      <p className="text-sm text-gray-400 lowercase">{title}</p>
      {sub && <p className="text-xs text-gray-300 lowercase">{sub}</p>}
      {action && <div className="mt-1">{action}</div>}
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
        <button onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors flex items-center">
          <Icon name="x" size={12} className="" />
        </button>
      )}
    </span>
  );
}
```

`onRemove` optional — omit for read-only tags.

### ProgressBar

```jsx
function ProgressBar({ value, max = 100, label }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-gray-400 lowercase">{label}</span>}
      <div className="w-full h-1 bg-gray-100 rounded-sm">
        <div className="h-full bg-gray-500 transition-all rounded-sm" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 text-right">{pct}%</span>
    </div>
  );
}
```

### Pagination

```jsx
function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-between text-xs text-gray-400 py-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 hover:text-gray-600 transition-colors lowercase disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Icon name="arrow-left" size={12} /> prev
      </button>
      <span>{page} / {totalPages}</span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 hover:text-gray-600 transition-colors lowercase disabled:opacity-30 disabled:cursor-not-allowed"
      >
        next <Icon name="arrow-right" size={12} />
      </button>
    </div>
  );
}
```

### FilterModal (advanced table filtering)

Builds conditions `{ id, connector, field, operator, value }`. Renders inside a `Modal` (size `'lg'`).

```jsx
function FilterModal({ columns, conditions, onApply, onClose }) {
  const OPERATORS = [
    'contains', 'does not contain', 'is', 'is not',
    'starts with', 'ends with', 'is empty', 'is not empty',
  ];
  const [local, setLocal] = React.useState(
    conditions.length > 0
      ? conditions
      : [{ id: 1, connector: 'where', field: columns[0]?.key ?? '', operator: 'contains', value: '' }]
  );
  const nextId = React.useRef(conditions.length > 0 ? Math.max(...conditions.map(c => c.id)) + 1 : 2);

  const addRow = () => {
    const id = nextId.current++;
    setLocal(prev => [...prev, { id, connector: 'and', field: columns[0]?.key ?? '', operator: 'contains', value: '' }]);
  };
  const update = (id, field, val) => setLocal(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  const remove = (id) => setLocal(prev => prev.filter(c => c.id !== id));

  function handleApply() {
    const active = local.filter(c =>
      c.value.trim() !== '' || c.operator === 'is empty' || c.operator === 'is not empty'
    );
    onApply(active);
    onClose();
  }

  return (
    <Modal title="customize table" onClose={onClose} size="lg"
      actions={<>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase">cancel</button>
        <button onClick={handleApply} className="text-sm text-gray-700 hover:text-gray-900 border border-gray-300 px-4 py-1.5 rounded-sm transition-colors lowercase">apply</button>
      </>}
    >
      <p className="text-xs text-gray-400 mb-4 lowercase">select and add conditions</p>
      <div className="flex flex-col gap-2">
        {local.map((cond, i) => (
          <div key={cond.id} className="flex items-center gap-2 min-w-0">
            <Icon name="dots-six-vertical" size={14} className="text-gray-300 shrink-0 cursor-grab" />
            {i === 0
              ? <span className="text-sm text-gray-500 w-20 shrink-0 lowercase">where</span>
              : <Dropdown value={cond.connector} onChange={v => update(cond.id, 'connector', v)} options={['and', 'or']} width="w-20" />
            }
            <Dropdown value={cond.field} onChange={v => update(cond.id, 'field', v)} options={columns.map(c => ({ value: c.key, label: c.label }))} width="w-28" />
            <Dropdown value={cond.operator} onChange={v => update(cond.id, 'operator', v)} options={OPERATORS} width="w-40" />
            {cond.operator !== 'is empty' && cond.operator !== 'is not empty'
              ? <input value={cond.value} onChange={e => update(cond.id, 'value', e.target.value)} placeholder="value..."
                  className="flex-1 min-w-0 border-b border-gray-300 py-1 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                />
              : <span className="flex-1 min-w-0" />
            }
            <button onClick={() => remove(cond.id)} disabled={local.length === 1}
              className="text-gray-300 hover:text-red-400 transition-colors flex items-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed">
              <Icon name="trash" size={13} className="" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addRow} className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase">
        <Icon name="plus" size={12} /> add condition
      </button>
    </Modal>
  );
}

// Filter logic (place outside component)
function applyConditions(rows, conditions) {
  if (!conditions.length) return rows;
  return rows.filter(row => {
    let result = checkCond(row, conditions[0]);
    for (let i = 1; i < conditions.length; i++) {
      const match = checkCond(row, conditions[i]);
      result = conditions[i].connector === 'or' ? result || match : result && match;
    }
    return result;
  });
}
function checkCond(row, cond) {
  const cell = String(row[cond.field] ?? '').toLowerCase();
  const val  = (cond.value ?? '').toLowerCase();
  switch (cond.operator) {
    case 'contains':         return cell.includes(val);
    case 'does not contain': return !cell.includes(val);
    case 'is':               return cell === val;
    case 'is not':           return cell !== val;
    case 'starts with':      return cell.startsWith(val);
    case 'ends with':        return cell.endsWith(val);
    case 'is empty':         return cell === '';
    case 'is not empty':     return cell !== '';
    default:                 return true;
  }
}
```

---

## Charts (SVG, no library)

### Sparkline

```jsx
function Sparkline({ data, color = 'var(--gray-500)', height = 32, width = 80 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const py = v => height - 2 - ((v - min) / ((max - min) || 1)) * (height - 4);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${py(v)}`).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
```

Usage in stat cards:
```jsx
<div className="border border-gray-100 rounded-sm p-3 flex items-center justify-between">
  <div className="flex flex-col gap-1">
    <span className="text-[10px] text-gray-400 uppercase tracking-widest">requests</span>
    <span className="text-xs font-mono text-green-600">+18%</span>
  </div>
  <Sparkline data={[20, 35, 28, 45, 38, 52, 47, 60]} color="var(--gray-500)" />
</div>
```

### Bar Chart (vertical)

```jsx
// data: [{ label: 'jan', value: 42 }, ...]
const barMax = Math.max(...values);

<div className="flex items-end gap-2 h-28">
  {data.map(({ label, value }) => (
    <div key={label} className="flex flex-col items-center gap-1 flex-1">
      <span className="text-[10px] text-gray-400">{value}</span>
      <div
        className="w-full bg-gray-200 rounded-sm transition-all"
        style={{ height: `${(value / barMax) * 72}px` }}
      />
      <span className="text-[10px] text-gray-400 lowercase">{label}</span>
    </div>
  ))}
</div>
```

All colors from CSS vars (`bg-gray-200`). Never hardcode hex colors in charts.

### Line Chart (area fill, SVG)

```jsx
const W = 480, H = 120, PAD = 8;
const lineMax = Math.max(...data), lineMin = Math.min(...data);
const normalize = v => H - PAD - ((v - lineMin) / ((lineMax - lineMin) || 1)) * (H - PAD * 2);
const points = data.map((v, i) => [PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2), normalize(v)]);
const polyline = points.map(([x, y]) => `${x},${y}`).join(' ');
const area = [
  `M ${points[0][0]},${H - PAD}`,
  ...points.map(([x, y]) => `L ${x},${y}`),
  `L ${points[points.length - 1][0]},${H - PAD}`,
  'Z',
].join(' ');

<div className="border border-gray-100 bg-gray-50 rounded-sm p-4">
  <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 120 }}>
    {[0, 0.25, 0.5, 0.75, 1].map(t => (
      <line key={t} x1={PAD} y1={PAD + t * (H - PAD * 2)} x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
        stroke="var(--gray-200)" strokeWidth="0.5" />
    ))}
    <path d={area} fill="var(--gray-200)" fillOpacity="0.5" />
    <polyline points={polyline} fill="none" stroke="var(--gray-600)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="var(--gray-600)" />)}
  </svg>
</div>
```

### Donut Chart (SVG)

```jsx
// segments: [{ label: 'api', value: 45, color: 'var(--gray-700)' }, ...]
const CX = 56, CY = 56, R = 40, INNER = 24;
const total = segments.reduce((s, d) => s + d.value, 0);

const slices = (() => {
  let a = -Math.PI / 2;
  return segments.map(d => {
    const sweep = (d.value / total) * Math.PI * 2;
    const x1 = CX + R * Math.cos(a), y1 = CY + R * Math.sin(a);
    a += sweep;
    const x2 = CX + R * Math.cos(a), y2 = CY + R * Math.sin(a);
    const xi1 = CX + INNER * Math.cos(a - sweep), yi1 = CY + INNER * Math.sin(a - sweep);
    const xi2 = CX + INNER * Math.cos(a), yi2 = CY + INNER * Math.sin(a);
    const large = sweep > Math.PI ? 1 : 0;
    return { ...d, path: `M ${xi1} ${yi1} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${INNER} ${INNER} 0 ${large} 0 ${xi1} ${yi1} Z` };
  });
})();

<svg width={112} height={112}>
  {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
  <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
    style={{ fontSize: 11, fill: 'var(--gray-600)', fontFamily: 'Inter, sans-serif' }}>
    {total}
  </text>
  <text x={CX} y={CY + 14} textAnchor="middle" dominantBaseline="middle"
    style={{ fontSize: 8, fill: 'var(--gray-400)', fontFamily: 'Inter, sans-serif' }}>
    total
  </text>
</svg>
```

Colors for donut slices: `var(--gray-700)`, `var(--gray-400)`, `var(--gray-200)`, `var(--gray-100)` — always CSS vars, never hardcoded hex.

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
        className="w-full flex items-center justify-between py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors lowercase"
      >
        {title}
        <Icon name="caret-down" size={12} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-4 text-sm text-gray-500">{children}</div>}
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

```jsx
<div className="border border-gray-100 rounded-sm p-4 hover:border-gray-300 transition-colors">
  <div className="flex items-start justify-between">
    <p className="text-sm text-gray-700 lowercase">card title</p>
    <span className="text-xs text-gray-400">meta</span>
  </div>
  <p className="text-xs text-gray-400 mt-1 lowercase">supporting detail.</p>
</div>
```

Use cards only when items need clear spatial separation (dashboard tiles, history). Prefer divider-based lists otherwise.

### Field Group (labeled sections)

```jsx
<div className="flex flex-col gap-6">
  <div>
    <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">account</p>
    <div className="flex flex-col gap-4">
      <input placeholder="display name..." className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500" />
      <input placeholder="email address..." className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500" />
    </div>
  </div>
  <div>
    <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">preferences</p>
    <div className="flex flex-col gap-4">
      {/* more inputs */}
    </div>
  </div>
</div>
```

### Panel (bordered content block)

```jsx
{/* info panel with header + body */}
<div className="border border-gray-100 rounded-sm">
  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
    <span className="text-xs text-gray-700 lowercase">panel title</span>
    <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase flex items-center gap-1">
      <Icon name="copy" size={12} className="" /> copy
    </button>
  </div>
  <div className="px-4 py-3">
    <p className="text-xs font-mono text-gray-500">content</p>
  </div>
</div>

{/* stat panel — divide-y rows */}
<div className="border border-gray-100 rounded-sm divide-y divide-gray-100">
  {[{ label: 'plan', value: 'pro' }, { label: 'seats', value: '5 / 10' }].map(row => (
    <div key={row.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
      <span className="text-gray-400 lowercase">{row.label}</span>
      <span className="text-gray-700">{row.value}</span>
    </div>
  ))}
</div>
```

### List Group (bordered item list)

```jsx
<div className="border border-gray-100 rounded-sm divide-y divide-gray-100">
  {items.map(item => (
    <button
      key={item.id}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group text-left"
    >
      <div className="flex items-center gap-3">
        <Icon name={item.icon} size={14} className="text-gray-400 group-hover:text-gray-500 transition-colors" />
        <span className="text-sm text-gray-600 lowercase">{item.label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 lowercase">{item.meta}</span>
        <Icon name="caret-right" size={10} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
      </div>
    </button>
  ))}
</div>
```

### Split Pane Layout

```jsx
<div className="flex border border-gray-100 rounded-sm overflow-hidden">
  {/* left nav pane */}
  <div className="w-36 shrink-0 border-r border-gray-100 flex flex-col divide-y divide-gray-100 bg-gray-50">
    {navItems.map(item => (
      <button
        key={item}
        onClick={() => setActive(item)}
        className={`px-3 py-2.5 text-xs text-left transition-colors lowercase ${
          active === item ? 'text-gray-800 bg-gray-100 font-medium' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {item}
      </button>
    ))}
  </div>
  {/* right content pane */}
  <div className="flex-1 p-5">
    {/* section content */}
  </div>
</div>
```

### Inline Group (prefix / suffix inputs)

```jsx
{/* prefix */}
<div className="flex items-center border-b border-gray-300 focus-within:border-gray-500">
  <span className="text-sm text-gray-400 pr-2 shrink-0">https://</span>
  <input placeholder="your-domain.com" className="flex-1 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none" />
</div>

{/* suffix */}
<div className="flex items-center border-b border-gray-300 focus-within:border-gray-500">
  <input placeholder="amount" className="flex-1 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none" />
  <span className="text-sm text-gray-400 pl-2 shrink-0">USD</span>
</div>

{/* number range */}
<div className="flex items-center gap-2">
  <input placeholder="min" className="w-24 border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500 text-center" />
  <span className="text-xs text-gray-300">—</span>
  <input placeholder="max" className="w-24 border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500 text-center" />
</div>
```

---

## Media

### Carousel / Slider

No auto-advance — user controls only.

```jsx
const [slide, setSlide] = React.useState(0);
const TOTAL = slides.length;
function prev() { setSlide(i => (i - 1 + TOTAL) % TOTAL); }
function next() { setSlide(i => (i + 1) % TOTAL); }

<div className="relative overflow-hidden rounded-sm border border-gray-100">
  {/* slides */}
  <div
    className="flex transition-transform duration-300 ease-in-out"
    style={{ transform: `translateX(-${slide * 100}%)` }}
  >
    {slides.map((s, i) => (
      <div key={i} className="shrink-0 w-full h-40 bg-gray-100 flex items-center justify-center">
        {/* slide content */}
      </div>
    ))}
  </div>
  {/* prev / next */}
  <button aria-label="previous slide" onClick={prev}
    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-gray-200 rounded-sm text-gray-400 hover:text-gray-600 shadow-sm">
    <Icon name="arrow-left" size={12} className="" />
  </button>
  <button aria-label="next slide" onClick={next}
    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-gray-200 rounded-sm text-gray-400 hover:text-gray-600 shadow-sm">
    <Icon name="arrow-right" size={12} className="" />
  </button>
</div>
{/* dot indicators */}
<div className="flex justify-center gap-1.5 mt-3">
  {slides.map((_, i) => (
    <button key={i} onClick={() => setSlide(i)}
      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === slide ? 'bg-gray-500' : 'bg-gray-200'}`} />
  ))}
</div>
```

### Image Grid

```jsx
<div className="grid grid-cols-3 gap-2">
  {images.map(img => (
    <button
      key={img.id}
      onClick={() => setSelected(img)}
      className="aspect-square bg-gray-100 rounded-sm overflow-hidden relative group hover:bg-gray-200 transition-colors border border-gray-100 hover:border-gray-300"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <Icon name="image" size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
        <span className="text-[10px] text-gray-300 group-hover:text-gray-400 lowercase">{img.label}</span>
      </div>
      <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-colors" />
    </button>
  ))}
</div>
```

Use `aspect-square` or `aspect-video` per tile. Image overlay on hover with `bg-gray-900/10`.

### Lightbox

Esc key + backdrop click close. Focus management on open.

```jsx
const lightboxRef = React.useRef(null);

React.useEffect(() => {
  if (!selected) return;
  function onKey(e) { if (e.key === 'Escape') setSelected(null); }
  document.addEventListener('keydown', onKey);
  const el = lightboxRef.current;
  if (el) {
    const focusable = el.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }
  return () => document.removeEventListener('keydown', onKey);
}, [selected]);

{selected && (
  <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setSelected(null)}>
    <div className="absolute inset-0 bg-black/60" />
    <div
      ref={lightboxRef}
      role="dialog"
      aria-modal="true"
      aria-label="image preview"
      className="relative bg-white rounded-sm border border-gray-200 p-6 shadow-sm"
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={() => setSelected(null)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors flex items-center"
      >
        <Icon name="x" size={14} className="" />
      </button>
      {/* image content */}
    </div>
  </div>
)}
```

---

## Actions

### Button Group

```jsx
const [active, setActive] = React.useState('json');

<div className="flex divide-x divide-gray-200 border border-gray-200 rounded-sm w-fit">
  {['json', 'xml', 'raw'].map(opt => (
    <button
      key={opt}
      onClick={() => setActive(opt)}
      className={`px-3 py-1.5 text-xs lowercase transition-colors ${
        active === opt ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {opt}
    </button>
  ))}
</div>
```

### Split Button (primary action + dropdown)

```jsx
const [open, setOpen] = React.useState(false);
const ref = React.useRef(null);

React.useEffect(() => {
  function handleOutside(e) {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  }
  document.addEventListener('mousedown', handleOutside);
  return () => document.removeEventListener('mousedown', handleOutside);
}, []);

<div className="relative w-fit" ref={ref}>
  <div className="flex divide-x divide-gray-200 border border-gray-200 rounded-sm">
    <button
      onClick={primaryAction}
      className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors lowercase"
    >
      send
    </button>
    <button
      onClick={() => setOpen(o => !o)}
      className="px-2 py-1.5 flex items-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
    >
      <Icon name="caret-down" size={12} />
    </button>
  </div>
  {open && (
    <div className="absolute top-full left-0 mt-1 w-40 border border-gray-200 bg-white shadow-sm rounded-sm z-10">
      {['send and save', 'send and copy', 'schedule send'].map(opt => (
        <button
          key={opt}
          className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors lowercase"
          onClick={() => { handleOption(opt); setOpen(false); }}
        >
          {opt}
        </button>
      ))}
    </div>
  )}
</div>
```

### Danger / Destructive Button

Never red by default. Gray → confirm intent → red only after arming.

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

## Wizard / Multi-Step Form

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
            <span className={`flex items-center gap-1 text-xs lowercase transition-colors ${
              i === current ? 'text-gray-700' : i < current ? 'text-gray-400' : 'text-gray-200'
            }`}>
              {i < current && <Icon name="check" size={10} className="text-gray-400" />}
              {step.label}
            </span>
            {i < steps.length - 1 && <Icon name="arrow-right" size={10} className="text-gray-200" />}
          </React.Fragment>
        ))}
      </div>

      {React.createElement(steps[current].component, {
        onNext: next,
        onBack: back,
        isFirst: current === 0,
        data,
      })}
    </div>
  );
}
```

Step component contract:
```jsx
// Each step receives: { onNext, onBack, isFirst, data }
function MyStep({ onNext, onBack, isFirst }) {
  const [value, setValue] = React.useState('');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <input value={value} onChange={e => setValue(e.target.value)}
          placeholder="field..." className="border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent" />
      </div>
      <div className="flex gap-4">
        {!isFirst && <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition-colors lowercase"><Icon name="arrow-left" size={12} /> back</button>}
        <button onClick={() => onNext({ value })} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm transition-colors lowercase">next <Icon name="arrow-right" size={12} /></button>
      </div>
    </div>
  );
}
```

`onNext(stepData)` merges into the accumulated data object and advances. `onComplete(mergedData)` fires after the last step.

---

## CSS Theming System

### Setup

**themes.css** — link after Tailwind config in `index.html`. Defines all CSS variable sets.

**Flash-prevention inline script** — runs before React CDNs, before any paint:

```html
<script>
  (function() {
    var t = localStorage.getItem('ui-theme') || 'zinc';
    var m = localStorage.getItem('ui-mode')  || 'light';
    document.documentElement.setAttribute('data-theme', t + '-' + m);
  })();
</script>
```

**React integration** (in `app.jsx`):

```jsx
const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
const [mode,  setMode]  = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

React.useEffect(() => {
  document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
  localStorage.setItem('ui-theme', theme);
  localStorage.setItem('ui-mode',  mode);
}, [theme, mode]);
```

### CSS Variables

| Variable | Role |
|---|---|
| `--gray-50` … `--gray-900` | Full gray scale — remapped per theme |
| `--color-white` | Surface backgrounds (dark mode maps to a dark tone) |
| `--toggle-thumb` | Toggle thumb color — always use this, never `bg-white` |
| `--overlay-bg` | Tooltip/overlay background (`var(--gray-900)`) |
| `--overlay-text` | Tooltip/overlay text (`var(--gray-50)`) |
| `--accent` | Theme accent (darkest meaningful tone) |
| `--accent-fg` | Foreground on accent background |

### Standard Theme Set (default for new apps)

Use these 4 themes as the default options in new app theme selectors:

| Value | Label | Description |
|---|---|---|
| `zinc` | zinc | Pure neutral (default) |
| `arctic` | arctic | Icy saturated blue |
| `stone` | stone | Warm taupe |
| `hc` | contrast | Maximum separation |

### Full Theme Catalog (all 16)

Grouped by family — available in `themes.css`:

**Standard:** `zinc`, `arctic`, `stone`, `hc`
**Business:** `navy`, `oxblood`, `racing`
**Vibrant:** `fuchsia`, `amber`, `teal`, `crimson`
**Casual:** `peach`, `sky`, `sage`, `lavender`, `sand`

Each has `-light` and `-dark` variant: `data-theme="zinc-light"` / `data-theme="zinc-dark"`.

### `hc` Special Behavior

```css
[data-theme^="hc-"] *,
[data-theme^="hc-"] *::before,
[data-theme^="hc-"] *::after { letter-spacing: 0.01em; }
```

### Toggle Thumb Rule

```jsx
{/* ❌ breaks in dark/colored themes */}
<span className="bg-white" />

{/* ✅ always use the CSS variable */}
<span style={{ backgroundColor: 'var(--toggle-thumb)' }} />
```

### Dark Mode Shadows

```css
[data-theme$="-dark"] .shadow-sm {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.6), 0 1px 2px -1px rgb(0 0 0 / 0.4);
}
```

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

### Status Colors

The only place color is permitted outside gray:

| Semantic | Text | Background | Border |
|---|---|---|---|
| Success | `text-green-600` | `bg-green-50` | `border-green-200` |
| Error | `text-red-500` | `bg-red-50` | `border-red-200` |
| Warning | `text-yellow-600` | `bg-yellow-50` | `border-yellow-200` |
| Info | `text-blue-600` | `bg-blue-50` | `border-blue-200` |
| Neutral | `text-gray-500` | `bg-gray-50` | `border-gray-200` |

Never use saturated variants (`green-500` bg, `red-700` text, etc.).
