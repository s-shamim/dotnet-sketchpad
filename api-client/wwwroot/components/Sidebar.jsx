// Sidebar.jsx
// Left panel with three tabs: collections, history, env
window.Sidebar = function Sidebar({ open, collections, history, environments, activeEnvId, onEnvActivate, onOpenEnvModal, onSelectRequest, onAddCollection }) {
  const [tab, setTab] = React.useState('collections');
  const [openGroups, setOpenGroups] = React.useState({});
  const [search, setSearch] = React.useState('');

  function toggleGroup(id) {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const tabs = ['collections', 'history', 'env'];

  const filteredCollections = collections.map(col => ({
    ...col,
    requests: col.requests.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.method.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(col => col.requests.length > 0 || search === '');

  if (!open) return null;

  return (
    <div className="w-48 flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden">
      {/* Tab strip */}
      <div className="flex border-b border-gray-200 flex-shrink-0">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-[10px] tracking-widest lowercase transition-colors bg-transparent border-0 cursor-pointer pb-[6px] ${tab === t ? 'tab-active text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Collections */}
      {tab === 'collections' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-3 py-2 border-b border-gray-200">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="search..."
              className="w-full border-b border-gray-300 focus:border-gray-600 pb-1 text-[11px] bg-transparent text-gray-900 outline-none placeholder-gray-300"
              style={{ fontFamily: 'Geist, sans-serif' }}
            />
          </div>
          {filteredCollections.map(col => (
            <div key={col.id}>
              <button
                onClick={() => toggleGroup(col.id)}
                className="w-full text-left px-3 py-[7px] text-[10px] tracking-wider text-gray-400 flex items-center gap-1 cursor-pointer bg-transparent border-0 hover:text-gray-600"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                <span style={{ fontSize: 7, display: 'inline-block', transition: 'transform 0.15s', transform: openGroups[col.id] ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                {col.name}
              </button>
              {openGroups[col.id] && col.requests.map(req => (
                <button
                  key={req.id}
                  onClick={() => onSelectRequest(req)}
                  className="w-full text-left pl-5 pr-3 py-[5px] text-[11px] text-gray-500 flex items-center gap-2 border-b border-gray-100 cursor-pointer bg-transparent border-0 hover:text-gray-900 hover:bg-gray-100"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  <span className="text-[9px] text-gray-400 w-6 flex-shrink-0 font-mono-geist">{req.method}</span>
                  <span className="truncate">{req.name}</span>
                </button>
              ))}
            </div>
          ))}
          <button className="px-3 py-2 text-[10px] text-gray-400 hover:text-gray-900 border-t border-gray-200 text-left bg-transparent border-0 cursor-pointer mt-auto tracking-wide" onClick={onAddCollection} style={{ fontFamily: 'Geist, sans-serif' }}>
            + new collection
          </button>
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 && (
            <p className="text-center text-gray-300 text-xs py-8">nothing here yet.</p>
          )}
          {history.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelectRequest(item)}
              className="w-full text-left px-3 py-[7px] border-b border-gray-100 cursor-pointer bg-transparent border-0 hover:bg-gray-100"
            >
              <div className="flex items-center gap-2 mb-[2px]">
                <span className="text-[9px] text-gray-400 font-mono-geist">{item.method}</span>
                <span className="text-[9px] text-gray-300" style={{ fontFamily: 'Geist, sans-serif' }}>{item.time}</span>
              </div>
              <div className="text-[10px] text-gray-400 truncate font-mono-geist">{item.url}</div>
            </button>
          ))}
        </div>
      )}

      {/* Environments */}
      {tab === 'env' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          {environments.map(env => (
            <div key={env.id} className="px-3 py-[7px] border-b border-gray-100 flex items-center justify-between hover:bg-gray-100">
              <button
                onClick={() => onEnvActivate(env.id)}
                className={`text-[11px] bg-transparent border-0 cursor-pointer p-0 ${env.id === activeEnvId ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {env.name}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenEnvModal(env.id)}
                  className="text-[9px] text-gray-300 hover:text-gray-700 bg-transparent border-0 cursor-pointer"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  edit
                </button>
                <span className={`w-[5px] h-[5px] rounded-full ${env.id === activeEnvId ? 'bg-gray-500' : 'bg-gray-200'}`} />
              </div>
            </div>
          ))}
          <button
            onClick={() => onOpenEnvModal(null)}
            className="px-3 py-2 text-[10px] text-gray-400 hover:text-gray-900 border-t border-gray-200 text-left bg-transparent border-0 cursor-pointer mt-auto tracking-wide"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            + add environment
          </button>
        </div>
      )}
    </div>
  );
};
