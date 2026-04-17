---
name: ui-inputs
description: "Interactive UI controls: buttons, forms, navigation, actions, and wizard components. Use when building forms, adding user input controls, or creating multi-step workflows."
---

# UI Inputs — Buttons, Forms, Navigation, Actions & Wizard

> All code comes verbatim from `ui-showcase/wwwroot/` — the canonical living reference.
> For policy-level rules (design constraints, status colors), see `ui.instructions.md`.
> For shell primitives (`Icon`, `Dropdown`, `Toggle`, etc.), see the `ui-shell` skill.

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

{/* info */}
<button className="text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-sm hover:border-blue-400 transition-colors lowercase">info</button>
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

### DatePicker

Full calendar — not a native `<input type="date">`. Selected day uses `bg-gray-700 text-white` — a permitted exception to the no-filled-backgrounds rule for data-selection states.

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

Pairs must use a stable `id` field, not array index, for React key correctness. Inputs use `border-gray-200 / focus:border-gray-400` — intentionally lighter than standard text inputs.

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
