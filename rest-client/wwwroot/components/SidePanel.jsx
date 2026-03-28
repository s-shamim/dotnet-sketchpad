// SidePanel.jsx — expandable panel for collections, environments, history

window.SidePanel = function SidePanel({
  activePanel, onClose, collections, environments, activeEnvId,
  onEnvActivate, history, onSelectRequest, onEditEnv, onEditCollection, onNewAction,
}) {
  const [search, setSearch] = React.useState('');
  const [openGroups, setOpenGroups] = React.useState({});

  function toggleGroup(id) {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  }

  // Panel header
  const titles = { collections: 'collections', environments: 'environments', history: 'history' };

  const filteredCollections = collections.map(col => ({
    ...col,
    requests: col.requests.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.method.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(col => col.requests.length > 0 || search === '');

  return (
    <div className="w-60 flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 flex-shrink-0">
        <span className="text-xs tracking-widest text-gray-400 uppercase">{titles[activePanel]}</span>
        <button
          onClick={onClose}
          aria-label="close panel"
          className="text-gray-300 hover:text-gray-500 transition-colors flex items-center"
        >
          <Icon name="x" size={12} className="" />
        </button>
      </div>

      {/* Collections */}
      {activePanel === 'collections' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Search */}
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="relative flex items-center">
              <Icon name="magnifying-glass" size={12} className="absolute left-0 text-gray-300 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="filter..."
                className="w-full border-b border-gray-200 focus:border-gray-400 pb-1 pl-4 text-xs bg-transparent text-gray-700 outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Collection tree */}
          {filteredCollections.map(col => (
            <div key={col.id}>
              <button
                onClick={() => toggleGroup(col.id)}
                className="w-full text-left px-3 py-2 text-[10px] tracking-wider text-gray-400 flex items-center gap-1.5 cursor-pointer bg-transparent border-0 hover:text-gray-600 transition-colors"
              >
                <Icon
                  name="caret-right"
                  size={10}
                  className={`transition-transform ${openGroups[col.id] ? 'rotate-90' : ''}`}
                />
                <Icon name="folder-simple" size={12} className="text-gray-300" />
                <span className="lowercase">{col.name}</span>
              </button>
              {openGroups[col.id] && col.requests.map(req => (
                <button
                  key={req.id}
                  onClick={() => onSelectRequest(req)}
                  className="w-full text-left pl-8 pr-3 py-1.5 text-xs text-gray-500 flex items-center gap-2 cursor-pointer bg-transparent border-0 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Badge label={req.method} variant={req.method.toLowerCase()} />
                  <span className="truncate lowercase">{req.name}</span>
                </button>
              ))}
            </div>
          ))}

          {/* Bottom actions */}
          <div className="mt-auto border-t border-gray-100 flex items-center justify-between px-3 py-2">
            <button
              onClick={() => onNewAction('collection')}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors lowercase"
            >
              <Icon name="plus" size={10} /> new collection
            </button>
            {collections.length > 0 && (
              <button
                onClick={() => onEditCollection(collections[0]?.id)}
                className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors lowercase"
              >
                <Icon name="pencil" size={10} /> edit
              </button>
            )}
          </div>
        </div>
      )}

      {/* Environments */}
      {activePanel === 'environments' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          {environments.map(env => (
            <div key={env.id} className="px-3 py-2 border-b border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-colors">
              <button
                onClick={() => onEnvActivate(env.id)}
                className={`text-xs bg-transparent border-0 cursor-pointer p-0 lowercase transition-colors ${
                  env.id === activeEnvId ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {env.name}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditEnv(env.id)}
                  className="text-[10px] text-gray-300 hover:text-gray-600 transition-colors lowercase"
                >
                  edit
                </button>
                <span className={`w-1.5 h-1.5 rounded-full ${env.id === activeEnvId ? 'bg-gray-500' : 'bg-gray-200'}`} />
              </div>
            </div>
          ))}

          {/* Bottom actions */}
          <div className="mt-auto border-t border-gray-100 px-3 py-2">
            <button
              onClick={() => onNewAction('environment')}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors lowercase"
            >
              <Icon name="plus" size={10} /> add environment
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {activePanel === 'history' && (
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 && (
            <p className="text-center text-gray-300 text-xs py-8 lowercase">no history yet</p>
          )}
          {history.map(item => (
            <button
              key={item.id}
              onClick={() => onSelectRequest(item)}
              className="w-full text-left px-3 py-2 border-b border-gray-100 cursor-pointer bg-transparent border-0 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <Badge label={item.method} variant={item.method.toLowerCase()} />
                <span className={`text-[10px] font-mono ${
                  !item.status || item.status >= 500 ? 'text-red-500' : item.status >= 400 ? 'text-red-400' : item.status >= 300 ? 'text-yellow-600' : 'text-green-600'
                }`}>{item.status || '—'}</span>
                <span className="text-[10px] text-gray-300 ml-auto">{item.time}</span>
              </div>
              <div className="text-[10px] text-gray-400 truncate font-mono">{item.url}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
