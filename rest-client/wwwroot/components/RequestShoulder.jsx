// RequestShoulder.jsx — request name, breadcrumb, save button

window.RequestShoulder = function RequestShoulder({ name, breadcrumb, saved, onRename }) {
  const [editing, setEditing] = React.useState(false);
  const [editName, setEditName] = React.useState('');

  function startEdit() {
    setEditName(name || '');
    setEditing(true);
  }

  function commit() {
    const trimmed = editName.trim();
    if (trimmed && onRename) onRename(trimmed);
    setEditing(false);
  }

  function cancel() {
    setEditing(false);
  }

  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-1.5 min-w-0">
        {/* Breadcrumb: collection > folder > ... */}
        {breadcrumb && breadcrumb.length > 0 && breadcrumb.map((segment, i) => (
          <React.Fragment key={i}>
            <span className="text-xs text-gray-400 truncate lowercase flex-shrink-0">{segment}</span>
            <Icon name="caret-right" size={10} className="text-gray-300 flex-shrink-0" />
          </React.Fragment>
        ))}
        {/* Request name */}
        {editing ? (
          <input
            autoFocus
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); commit(); }
              else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
            }}
            className="text-sm text-gray-700 bg-white border border-gray-300 rounded-sm px-1.5 py-0.5 outline-none focus:border-gray-500 lowercase min-w-[120px]"
          />
        ) : (
          <span
            onDoubleClick={startEdit}
            className="text-sm text-gray-700 truncate lowercase cursor-default"
            title="double-click to rename"
          >
            {name || 'untitled request'}
          </span>
        )}
      </div>
      <button
        className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase flex-shrink-0"
      >
        {saved ? 'save' : 'save as'}
      </button>
    </div>
  );
};
