// ─────────────────────────────────────────────────────────
// Shared components — loaded before all section files so
// every section and the app shell can reference them as globals.
//
// Three primitives live here because they cross section boundaries:
//   Toggle    — used by app.jsx shell (dark mode) AND FormsSection
//   SidebarNav — used by app.jsx shell AND NavigationSection
//   Spinner   — used by FeedbackSection AND ButtonsSection
// ─────────────────────────────────────────────────────────

// ── Toggle / Switch ────────────────────────────────────────
//
// Outer element is a <div> (not <label>) because a <label> wrapping
// a <button> does not forward clicks to the button in all browsers.
// The wrapper's onClick handles both the track click and the label text click.

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
        onClick={e => e.stopPropagation()} // handled by wrapper
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

// ── SidebarNav ─────────────────────────────────────────────

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

// ── Spinner ────────────────────────────────────────────────

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
