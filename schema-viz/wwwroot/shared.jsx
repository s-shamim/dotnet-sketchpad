// ── Canvas layout constants (used by TableNode + Canvas) ─────────────────────
const TABLE_WIDTH    = 220;
const HEADER_HEIGHT  = 38;
const COL_ROW_HEIGHT = 28;
const FOOTER_HEIGHT  = 32;

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
}

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

// ── Spinner ───────────────────────────────────────────────────────────────────

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

// ── Tabs ──────────────────────────────────────────────────────────────────────

function Tabs({ tabs, active, onChange }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-gray-200 shrink-0">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-xs tracking-wide lowercase transition-colors border-b-2 -mb-px truncate max-w-[140px] ${
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

// ── Modal ─────────────────────────────────────────────────────────────────────

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

// ── ConfirmModal ──────────────────────────────────────────────────────────────

function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'delete' }) {
  return (
    <Modal
      title="confirm"
      onClose={onCancel}
      actions={<>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase">cancel</button>
        <button onClick={onConfirm} className="text-red-400 hover:text-red-600 text-sm px-2 transition-colors lowercase">{confirmLabel}</button>
      </>}
    >
      <p className="text-gray-500 text-sm lowercase">{message}</p>
    </Modal>
  );
}
