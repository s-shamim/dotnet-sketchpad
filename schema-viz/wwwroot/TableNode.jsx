// ── TableNode ─────────────────────────────────────────────────────────────────
// Draggable table card. Drag is managed by Canvas (parent) so that FK lines
// track the in-flight position in real time. x/y are already the visual
// position (committed + live drag offset applied by Canvas).
// Layout constants (TABLE_WIDTH, HEADER_HEIGHT, etc.) are in shared.jsx.

function TableNode({ table, x, y, isSelected, onSelect, onDragStart, panMode, onNameChange, onAddColumn }) {
  const [editingName, setEditingName] = React.useState(false);
  const [nameVal, setNameVal] = React.useState(table.name);
  const [collapsed, setCollapsed] = React.useState(false);

  // Keep name input in sync with prop (e.g. sidebar edits)
  React.useEffect(() => {
    if (!editingName) setNameVal(table.name);
  }, [table.name, editingName]);

  function handleHeaderMouseDown(e) {
    if (editingName) return;
    onSelect(table.id);
    onDragStart(table.id, e);
  }

  function commitName() {
    setEditingName(false);
    const trimmed = nameVal.trim();
    if (trimmed && trimmed !== table.name) onNameChange(table.id, trimmed);
    else setNameVal(table.name);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: TABLE_WIDTH,
        zIndex: isSelected ? 10 : 2,
        willChange: 'left, top',
      }}
      className={`bg-white rounded-sm shadow-sm select-none border transition-[box-shadow] ${
        panMode       ? 'pointer-events-none border-gray-200'
        : isSelected  ? 'border-gray-500 shadow-md ring-1 ring-gray-300'
        : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={e => { e.stopPropagation(); onSelect(table.id); }}
    >
      {/* ── Header ── */}
      <div
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={() => { if (!editingName) setEditingName(true); }}
        className="flex items-center gap-2 px-2.5 cursor-grab active:cursor-grabbing"
        style={{
          height: HEADER_HEIGHT,
          background: 'var(--gray-800)',
          borderRadius: '2px 2px 0 0',
        }}
      >
        <Icon name="table" size={11} className="text-gray-400 shrink-0" />
        {editingName ? (
          <input
            autoFocus
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => {
              if (e.key === 'Enter') commitName();
              if (e.key === 'Escape') { setEditingName(false); setNameVal(table.name); }
            }}
            onClick={e => e.stopPropagation()}
            className="flex-1 bg-transparent text-xs text-white focus:outline-none min-w-0 lowercase"
          />
        ) : (
          <span className="text-xs text-white font-medium lowercase truncate flex-1 leading-none">
            {table.name}
          </span>
        )}
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); setCollapsed(c => !c); }}
          className="flex items-center text-gray-400 hover:text-white transition-colors shrink-0 mr-0.5"
          title={collapsed ? 'expand' : 'collapse'}
        >
          <Icon name={collapsed ? 'caret-down' : 'caret-up'} size={11} className="" />
        </button>
        <Icon name="dots-six-vertical" size={12} className="text-gray-500 shrink-0" />
      </div>

      {/* ── Columns ── hidden when collapsed ── */}
      {!collapsed && table.columns.length === 0 && (
        <div
          className="flex items-center justify-center text-[10px] text-gray-300 italic lowercase border-b border-gray-100"
          style={{ height: COL_ROW_HEIGHT }}
        >
          no columns yet
        </div>
      )}
      {!collapsed && table.columns.map(col => (
        <div
          key={col.id}
          className="flex items-center gap-1.5 px-2.5 border-b border-gray-100"
          style={{ height: COL_ROW_HEIGHT }}
        >
          {col.isPK ? (
            <span className="text-[9px] font-mono font-medium text-yellow-600 uppercase shrink-0 w-5">PK</span>
          ) : !col.nullable ? (
            <span className="text-[9px] font-mono text-gray-400 uppercase shrink-0 w-5">NN</span>
          ) : (
            <span className="shrink-0 w-5" />
          )}
          <span className="text-xs text-gray-700 lowercase truncate flex-1 leading-none">{col.name}</span>
          <span className="text-[9px] font-mono text-gray-400 uppercase shrink-0 truncate max-w-[60px]">
            {col.type.split('(')[0]}
          </span>
        </div>
      ))}

      {/* ── Footer ── hidden when collapsed ── */}
      {!collapsed && (
      <div
        className="flex items-center px-2.5"
        style={{ height: FOOTER_HEIGHT }}
      >
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onAddColumn(table.id); }}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors lowercase"
        >
          <Icon name="plus" size={10} className="" /> add column
        </button>
      </div>
      )}
    </div>
  );
}
