---
description: "Data display, charts, layout, feedback, overlays, and media components. Use when showing data tables, charts, modals, toast notifications, or building dashboards."
---

# UI Display — Data, Charts, Layout, Feedback, Overlays & Media

> All code comes verbatim from `ui-showcase/wwwroot/` — the canonical living reference.
> For policy-level rules (design constraints, status colors), see `ui.instructions.md`.
> For shell primitives (`Icon`, `Dropdown`, `Toggle`, etc.), see the `ui-shell` skill.
> For focus trap and outside-click patterns used by Overlays, see the `ui-shell` skill (Behavioral Patterns section).

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

> `patch` uses `text-purple-600 bg-purple-50` — permitted exception to the gray-only color rule, specifically for HTTP PATCH method identification.

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

> For the focus trap and outside-click patterns used here, see the `ui-shell` skill (Behavioral Patterns section).

### Modal / Dialog

Focus trap, Tab cycling, Esc close, backdrop click close. `size` prop: `'md'` (default) or `'lg'`. Title renders as `text-sm tracking-widest text-gray-700 uppercase` (section-label style, not a heading).

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

Right-side panel, fixed `w-80` width. Same focus trap + Esc behavior as Modal.

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
        const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true, sensitivity: 'base' });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : rows;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map(col => (
              <th key={col.key} className="text-left py-2 pr-4 font-normal">
                <button
                  onClick={() => handleSort(col.key)}
                  className="flex items-center gap-1 text-xs tracking-widest text-gray-400 uppercase hover:text-gray-600 transition-colors group"
                >
                  {col.label}
                  <span className={`transition-opacity ${sortKey === col.key ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}>
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

Builds conditions `{ id, connector, field, operator, value }`. Renders inside a `Modal` (size `'lg'`). Keep `applyConditions` and `checkCond` outside the component, in the same section file.

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

// Filter logic (place outside component, in the same section file)
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
