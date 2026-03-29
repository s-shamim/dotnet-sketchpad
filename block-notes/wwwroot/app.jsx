// app.jsx — Dropdown, App shell, theme/mode state, ReactDOM.createRoot mount
// Loaded last: depends on shared.jsx (Icon, Toggle, PageSidebar) and editor.jsx (BlockEditor)

// ---------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
function App() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
  const [mode,  setMode]  = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

  const [pages,    setPages]    = React.useState([]);
  const [activeId, setActiveId] = React.useState(null);
  const [pageTitle, setPageTitle] = React.useState('');
  const [editingTitle, setEditingTitle] = React.useState(false);
  const titleRef = React.useRef(null);

  // Theme + mode persistence
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode',  mode);
  }, [theme, mode]);

  // Load pages on mount
  React.useEffect(() => {
    fetch('/api/pages')
      .then(r => r.json())
      .then(data => {
        setPages(data);
        if (data.length > 0) {
          setActiveId(data[0].id);
          setPageTitle(data[0].title);
        }
      });
  }, []);

  // Update page title display when active page changes
  React.useEffect(() => {
    const page = pages.find(p => p.id === activeId);
    if (page) setPageTitle(page.title);
  }, [activeId, pages]);

  // ── Page CRUD ──

  async function createPage() {
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled' }),
    });
    if (!res.ok) return;
    const page = await res.json();
    setPages(prev => [...prev, page]);
    setActiveId(page.id);
    setPageTitle(page.title);
  }

  async function deletePage(id) {
    const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    if (!res.ok) return;
    setPages(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (activeId === id) {
        const next = remaining[0] || null;
        setActiveId(next?.id || null);
        setPageTitle(next?.title || '');
      }
      return remaining;
    });
  }

  async function renamePage(id, title) {
    const res = await fetch(`/api/pages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setPages(prev => prev.map(p => p.id === id ? updated : p));
    if (activeId === id) setPageTitle(updated.title);
  }

  // Inline page title editing in main area
  function commitTitleEdit() {
    setEditingTitle(false);
    const trimmed = pageTitle.trim() || 'Untitled';
    setPageTitle(trimmed);
    if (activeId) renamePage(activeId, trimmed);
  }

  function handleTitleKeyDown(e) {
    if (e.key === 'Enter')  { e.preventDefault(); commitTitleEdit(); }
    if (e.key === 'Escape') { setEditingTitle(false); const page = pages.find(p => p.id === activeId); if (page) setPageTitle(page.title); }
  }

  return (
    <div className="min-h-screen bg-white flex">

      {/* ── Left sidebar ── */}
      <aside className="w-52 shrink-0 border-r border-gray-100 flex flex-col sticky top-0 h-screen overflow-hidden">

        {/* App header */}
        <div className="px-5 pt-6 pb-3">
          <div className="flex items-center gap-2">
            <Icon name="note-pencil" size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 lowercase tracking-wide">block notes</span>
          </div>
        </div>

        {/* Pages list */}
        <div className="flex-1 overflow-hidden px-3 pb-3 flex flex-col">
          <span className="text-[10px] tracking-widest text-gray-300 uppercase px-2 pb-2">pages</span>
          <PageSidebar
            pages={pages}
            activeId={activeId}
            onSelect={id => { setActiveId(id); setEditingTitle(false); }}
            onCreate={createPage}
            onDelete={deletePage}
            onRename={renamePage}
          />
        </div>

        {/* Theme controls at bottom */}
        <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
          <Dropdown
            value={theme}
            onChange={setTheme}
            width="w-full"
            options={[
              { value: 'zinc',   label: 'zinc'     },
              { value: 'arctic', label: 'arctic'   },
              { value: 'stone',  label: 'stone'    },
              { value: 'hc',     label: 'contrast' },
            ]}
          />
          <Toggle
            checked={mode === 'dark'}
            onChange={v => setMode(v ? 'dark' : 'light')}
            label="dark mode"
          />
        </div>
      </aside>

      {/* ── Main editor area ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-12 py-12">
          {activeId ? (
            <>
              {/* Editable page title */}
              <div className="mb-8">
                {editingTitle ? (
                  <input
                    ref={titleRef}
                    value={pageTitle}
                    onChange={e => setPageTitle(e.target.value)}
                    onBlur={commitTitleEdit}
                    onKeyDown={handleTitleKeyDown}
                    className="w-full text-4xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-300 caret-gray-400"
                    placeholder="Untitled"
                    autoFocus
                  />
                ) : (
                  <h1
                    onClick={() => { setEditingTitle(true); setTimeout(() => titleRef.current?.focus(), 0); }}
                    className="text-4xl font-bold text-gray-900 cursor-text hover:opacity-80 transition-opacity break-words"
                  >
                    {pageTitle || <span className="text-gray-300">Untitled</span>}
                  </h1>
                )}
              </div>

              {/* Block editor */}
              <BlockEditor key={activeId} pageId={activeId} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-300">
              <Icon name="note-pencil" size={48} className="text-gray-200" />
              <span className="text-sm lowercase">create a page to get started</span>
              <button
                onClick={createPage}
                className="mt-2 flex items-center gap-2 px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors lowercase"
              >
                <Icon name="plus" size={13} className="" />
                new page
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
