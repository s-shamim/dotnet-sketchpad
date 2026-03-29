// shared.jsx — Icon, Toggle, Spinner, PageSidebar
// Loaded first; available as globals to editor.jsx and app.jsx

// ---------------------------------------------------------------------------
// Icon — Phosphor ph-light icon helper
// ---------------------------------------------------------------------------
function Icon({ name, size = 14, className = "text-gray-400" }) {
  return (
    <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />
  );
}

// ---------------------------------------------------------------------------
// Toggle — dark mode switch
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// PageSidebar — lists pages, rename inline, delete, new page
// ---------------------------------------------------------------------------
function PageSidebar({ pages, activeId, onSelect, onCreate, onDelete, onRename }) {
  const [editingId, setEditingId]   = React.useState(null);
  const [editTitle, setEditTitle]   = React.useState('');
  const inputRef                    = React.useRef(null);

  function startEdit(page, e) {
    e.stopPropagation();
    setEditingId(page.id);
    setEditTitle(page.title);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commitEdit(id) {
    if (editTitle.trim()) onRename(id, editTitle.trim());
    setEditingId(null);
  }

  function handleKeyDown(e, id) {
    if (e.key === 'Enter')  { e.preventDefault(); commitEdit(id); }
    if (e.key === 'Escape') { setEditingId(null); }
  }

  return (
    <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto sidebar-scroll">
      {pages.map(page => (
        <div
          key={page.id}
          className={`group flex items-center gap-1 rounded-sm px-2 py-1.5 cursor-pointer transition-colors ${
            activeId === page.id
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
          onClick={() => onSelect(page.id)}
        >
          <Icon name="file-text" size={13} className={activeId === page.id ? 'text-gray-600' : 'text-gray-400'} />

          {editingId === page.id ? (
            <input
              ref={inputRef}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={() => commitEdit(page.id)}
              onKeyDown={e => handleKeyDown(e, page.id)}
              onClick={e => e.stopPropagation()}
              className="flex-1 text-sm bg-transparent border-b border-gray-400 outline-none text-gray-800 min-w-0"
            />
          ) : (
            <span className="flex-1 text-sm truncate lowercase select-none">{page.title}</span>
          )}

          {editingId !== page.id && (
            <div className="hidden group-hover:flex items-center gap-1 shrink-0">
              <button
                onClick={e => startEdit(page, e)}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                title="Rename"
              >
                <Icon name="pencil" size={11} className="" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onDelete(page.id); }}
                className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Icon name="trash" size={11} className="" />
              </button>
            </div>
          )}
        </div>
      ))}

      {pages.length === 0 && (
        <p className="text-xs text-gray-300 px-2 py-2 lowercase">no pages yet</p>
      )}

      <button
        onClick={onCreate}
        className="mt-2 flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm transition-colors lowercase"
      >
        <Icon name="plus" size={13} className="" />
        new page
      </button>
    </nav>
  );
}
