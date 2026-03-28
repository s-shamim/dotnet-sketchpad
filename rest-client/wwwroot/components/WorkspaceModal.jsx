// WorkspaceModal.jsx — workspace switch / create / rename / delete modal

window.WorkspaceModal = function WorkspaceModal({ workspaces, onClose, onSave }) {
  const [localWs, setLocalWs] = React.useState(() => JSON.parse(JSON.stringify(workspaces)));
  const [editingId, setEditingId] = React.useState(null);
  const [editingName, setEditingName] = React.useState('');
  const [confirmDeleteId, setConfirmDeleteId] = React.useState(null);

  function setActive(id) {
    setLocalWs(prev => prev.map(w => ({ ...w, isActive: w.id === id })));
    setConfirmDeleteId(null);
  }

  function startRename(ws, e) {
    e.stopPropagation();
    setEditingId(ws.id);
    setEditingName(ws.name);
  }

  function commitRename() {
    const trimmed = editingName.trim();
    if (trimmed) setLocalWs(prev => prev.map(w => w.id === editingId ? { ...w, name: trimmed } : w));
    setEditingId(null);
    setEditingName('');
  }

  function addWorkspace() {
    const id = 'ws-' + Date.now();
    setLocalWs(prev => [...prev, { id, name: 'new workspace', isActive: false }]);
    setEditingId(id);
    setEditingName('new workspace');
    setConfirmDeleteId(null);
  }

  function deleteWorkspace(id) {
    const remaining = localWs.filter(w => w.id !== id);
    if (remaining.length === 0) return;
    const wasActive = localWs.find(w => w.id === id)?.isActive;
    setLocalWs(wasActive ? remaining.map((w, i) => i === 0 ? { ...w, isActive: true } : w) : remaining);
    setConfirmDeleteId(null);
  }

  return (
    <Modal
      title="workspaces"
      onClose={onClose}
      actions={
        <>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors lowercase">cancel</button>
          <button onClick={() => onSave(localWs)} className="text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase">save</button>
        </>
      }
    >
      <div className="flex flex-col gap-1">
        {localWs.map(ws => (
          <div
            key={ws.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-sm group transition-colors ${ws.isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            {/* Click row to activate */}
            <button
              onClick={() => setActive(ws.id)}
              className="flex items-center gap-2 flex-1 min-w-0 text-left bg-transparent border-0 cursor-pointer p-0"
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${ws.isActive ? 'bg-gray-700' : 'bg-gray-200 group-hover:bg-gray-300'}`} />
              {editingId === ws.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); commitRename(); }
                    else if (e.key === 'Escape') { e.preventDefault(); setEditingId(null); }
                  }}
                  onClick={e => e.stopPropagation()}
                  className="flex-1 bg-white border border-gray-300 rounded-sm px-1.5 py-0.5 text-sm text-gray-700 outline-none focus:border-gray-500 lowercase min-w-[120px]"
                />
              ) : (
                <span className={`text-sm lowercase truncate ${ws.isActive ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                  {ws.name}
                </span>
              )}
            </button>

            {/* Confirm delete */}
            {confirmDeleteId === ws.id ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => deleteWorkspace(ws.id)} className="text-[10px] text-red-500 hover:text-red-700 transition-colors lowercase px-1">delete</button>
                <button onClick={() => setConfirmDeleteId(null)} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors lowercase px-1">cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={e => startRename(ws, e)}
                  className="text-gray-300 hover:text-gray-600 transition-colors flex items-center p-0.5 rounded-sm"
                  aria-label={`rename ${ws.name}`}
                >
                  <Icon name="pencil-simple" size={12} className="" />
                </button>
                {localWs.length > 1 && (
                  <button
                    onClick={() => setConfirmDeleteId(ws.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors flex items-center p-0.5 rounded-sm"
                    aria-label={`delete ${ws.name}`}
                  >
                    <Icon name="x" size={12} className="" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addWorkspace}
          className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase px-3"
        >
          <Icon name="plus" size={12} /> new workspace
        </button>
      </div>
    </Modal>
  );
};
