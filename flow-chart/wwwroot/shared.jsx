// shared.jsx — Toggle, Dropdown, Modal, Spinner, ColorSwatch
// Loaded first; all exports are globals used by canvas.jsx, properties.jsx, app.jsx

// ── Icon ──────────────────────────────────────────────────────────────────────
function Icon({ name, size = 14, className = 'text-gray-400' }) {
  return <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />;
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(!checked); }
  }
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
      <button
        type="button" role="switch" aria-checked={checked} tabIndex={0}
        onKeyDown={handleKeyDown} onClick={e => e.stopPropagation()}
        className={`relative w-8 h-4 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1 ${checked ? 'bg-gray-600' : 'bg-gray-200'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}
          style={{ backgroundColor: 'var(--toggle-thumb)' }}
        />
      </button>
      {label && <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors lowercase select-none">{label}</span>}
    </div>
  );
}

// ── Dropdown ──────────────────────────────────────────────────────────────────
function Dropdown({ value, onChange, options, placeholder = 'select...', width = 'w-48' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function onOutside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
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
        <div className="absolute top-full left-0 mt-1 w-full border border-gray-200 bg-white shadow-sm rounded-sm z-50">
          {options.map(opt => {
            const v = opt.value ?? opt;
            const l = opt.label  ?? opt;
            return (
              <button key={v} onClick={() => { onChange(v); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors lowercase ${value === v ? 'text-gray-800 bg-gray-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              >{l}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ size = 16 }) {
  return (
    <span role="status" aria-label="loading"
      style={{ width: size, height: size }}
      className="inline-block border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin"
    />
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, footer }) {
  const overlayRef = React.useRef(null);
  const firstRef   = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onMouseDown={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white border border-gray-200 rounded-sm shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700 lowercase">{title}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-sm" aria-label="close">
            <Icon name="x" size={16} className="" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

// ── ColorSwatch — small color grid picker ─────────────────────────────────────
const SWATCHES = [
  '#f9fafb','#f3f4f6','#e5e7eb','#d1d5db','#9ca3af','#6b7280','#374151','#111827',
  '#fef2f2','#fee2e2','#fca5a5','#ef4444','#dc2626',
  '#fff7ed','#fed7aa','#fb923c','#f97316','#ea580c',
  '#fefce8','#fef08a','#facc15','#eab308',
  '#f0fdf4','#bbf7d0','#4ade80','#16a34a','#15803d',
  '#eff6ff','#bfdbfe','#60a5fa','#2563eb','#1d4ed8',
  '#fdf4ff','#e9d5ff','#c084fc','#9333ea','#7e22ce',
  '#ffffff','#000000',
];

function ColorSwatch({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function onOutside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-6 h-6 rounded-sm border border-gray-300 flex-shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
        style={{ backgroundColor: value || '#f9fafb' }}
        title="pick color"
        aria-label="pick color"
      />
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 shadow-md rounded-sm p-2" style={{ width: 192 }}>
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
            {SWATCHES.map(c => (
              <button key={c}
                onClick={() => { onChange(c); setOpen(false); }}
                className="w-5 h-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                style={{ backgroundColor: c }}
                title={c}
                aria-label={c}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-400 lowercase">hex</span>
            <input
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 border-b border-gray-300 py-0.5 text-xs text-gray-600 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
