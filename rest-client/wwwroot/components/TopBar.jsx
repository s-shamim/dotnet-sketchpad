// TopBar.jsx — top shoulder: [+ New ▾], workspace, centered search, env selector, settings, theme, dark/light toggle

window.TopBar = function TopBar({ theme, onThemeChange, mode, onModeChange, activeEnvId, environments, onEnvChange, onNewAction, onSearch }) {
  const [search, setSearch] = React.useState('');
  const [newOpen, setNewOpen] = React.useState(false);
  const newRef = React.useRef(null);

  React.useEffect(() => {
    function handleOutside(e) {
      if (newRef.current && !newRef.current.contains(e.target)) setNewOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const newActions = [
    { value: 'request', label: 'new request' },
    { value: 'collection', label: 'new collection' },
    { value: 'environment', label: 'new environment' },
  ];

  const envOptions = environments.map(e => ({ value: e.id, label: e.name }));

  return (
    <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-200 bg-white flex-shrink-0">
      {/* Settings */}
      <button aria-label="settings" className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-sm flex-shrink-0">
        <Icon name="sliders-horizontal" size={16} className="" />
      </button>

      {/* + New dropdown */}
      <div className="relative flex-shrink-0" ref={newRef}>
        <button
          onClick={() => setNewOpen(o => !o)}
          className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-colors lowercase"
        >
          <Icon name="plus" size={13} className="" /> new
          <Icon name="caret-down" size={11} className="text-gray-400 ml-0.5" />
        </button>
        {newOpen && (
          <div className="absolute top-full left-0 mt-1 w-40 border border-gray-200 bg-white shadow-sm rounded-sm z-30">
            {newActions.map(a => (
              <button
                key={a.value}
                onClick={() => { onNewAction(a.value); setNewOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors lowercase"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Workspace */}
      <Dropdown
        value="default"
        onChange={() => {}}
        options={[{ value: 'default', label: 'workspace' }]}
        width="w-28"
      />

      {/* Centered search */}
      <div className="flex-1 flex justify-center">
        <div className="relative flex items-center w-full max-w-xs">
          <Icon name="magnifying-glass" size={14} className="absolute left-2 text-gray-300 pointer-events-none" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); onSearch && onSearch(e.target.value); }}
            placeholder="search requests..."
            className="w-full border border-gray-200 rounded-sm py-1.5 pl-7 pr-3 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-300"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); onSearch && onSearch(''); }}
              className="absolute right-2 text-gray-300 hover:text-gray-500 transition-colors flex items-center"
            >
              <Icon name="x" size={12} className="" />
            </button>
          )}
        </div>
      </div>

      {/* Env selector */}
      <Dropdown
        value={activeEnvId}
        onChange={onEnvChange}
        options={envOptions}
        placeholder="no environment"
        width="w-36"
      />

      {/* Theme */}
      <Dropdown
        value={theme}
        onChange={onThemeChange}
        options={[
          { value: 'zinc', label: 'zinc' },
          { value: 'arctic', label: 'arctic' },
          { value: 'stone', label: 'stone' },
          { value: 'hc', label: 'contrast' },
        ]}
        width="w-28"
      />

      {/* Dark/light toggle */}
      <button
        onClick={() => onModeChange(mode === 'dark' ? 'light' : 'dark')}
        aria-label={mode === 'dark' ? 'switch to light mode' : 'switch to dark mode'}
        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-sm"
      >
        <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={16} className="" />
      </button>
    </div>
  );
};
