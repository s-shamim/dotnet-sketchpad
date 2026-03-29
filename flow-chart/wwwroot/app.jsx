// app.jsx — App shell, reducer, API wiring, createRoot mount
// Depends on: shared.jsx (Icon, Toggle, Dropdown, Modal, Spinner, ColorSwatch)
//             canvas.jsx  (Canvas)
//             properties.jsx (PropertiesPanel)

// ── Diagram state reducer ─────────────────────────────────────────────────────

const INITIAL_CONTENT = { nodes: [], edges: [], groups: [] };

function contentReducer(content, action) {
  const { nodes, edges, groups } = content;

  switch (action.type) {
    case 'LOAD':
      return action.content;

    case 'ADD_NODE':
      return { ...content, nodes: [...nodes, action.node] };

    case 'ADD_EDGE':
      return { ...content, edges: [...edges, action.edge] };

    case 'UPDATE_NODE_LABEL':
      return { ...content, nodes: nodes.map(n => n.id === action.id ? { ...n, label: action.label } : n) };

    case 'UPDATE_EDGE_LABEL':
      return { ...content, edges: edges.map(e => e.id === action.id ? { ...e, label: action.label } : e) };

    case 'UPDATE_NODE_STYLE':
      return {
        ...content,
        nodes: nodes.map(n => n.id === action.id
          ? { ...n, style: { ...(n.style || {}), [action.key]: action.val } }
          : n
        )
      };

    case 'RESIZE_NODE':
      return {
        ...content,
        nodes: nodes.map(n => n.id === action.id ? { ...n, w: action.w, h: action.h } : n)
      };

    case 'MOVE_NODES': {
      const idSet = new Set(action.ids);
      return {
        ...content,
        nodes: nodes.map(n =>
          idSet.has(n.id) ? { ...n, x: n.x + action.dx, y: n.y + action.dy } : n
        )
      };
    }

    case 'MOVE_GROUP': {
      const group = groups.find(g => g.id === action.id);
      if (!group) return content;
      const groupNodeIds = new Set(group.nodeIds || []);
      return {
        ...content,
        nodes: nodes.map(n =>
          groupNodeIds.has(n.id) ? { ...n, x: n.x + action.dx, y: n.y + action.dy } : n
        ),
        groups: groups.map(g =>
          g.id === action.id ? { ...g, x: g.x + action.dx, y: g.y + action.dy } : g
        )
      };
    }

    case 'COMMIT_MOVE':
      return content; // already applied incrementally; just a signal for undo snapshot

    case 'DELETE_SELECTED': {
      const idSet = new Set(action.ids);
      const remainNodes = nodes.filter(n => !idSet.has(n.id));
      const remainEdges = edges.filter(e =>
        !idSet.has(e.id) && !idSet.has(e.fromId) && !idSet.has(e.toId)
      );
      const remainGroups = groups
        .filter(g => !idSet.has(g.id))
        .map(g => ({ ...g, nodeIds: (g.nodeIds || []).filter(nid => !idSet.has(nid)) }));
      return { nodes: remainNodes, edges: remainEdges, groups: remainGroups };
    }

    case 'RESIZE_NODE_FULL':
      return {
        ...content,
        nodes: nodes.map(n => n.id === action.id
          ? { ...n, x: action.x, y: action.y, w: action.w, h: action.h }
          : n
        )
      };

    case 'ADD_GROUP': {
      const { selectedIds } = action;
      if (selectedIds.length < 2) return content;
      const selected = nodes.filter(n => selectedIds.includes(n.id));
      const xs = selected.map(n => n.x), ys = selected.map(n => n.y);
      const x2s = selected.map(n => n.x + n.w), y2s = selected.map(n => n.y + n.h);
      const minX = Math.min(...xs) - 16;
      const minY = Math.min(...ys) - 28;
      const maxX = Math.max(...x2s) + 16;
      const maxY = Math.max(...y2s) + 16;
      const newGroup = {
        id: 'g' + Date.now(),
        label: 'group',
        x: minX, y: minY,
        w: maxX - minX, h: maxY - minY,
        fill: 'rgba(99,102,241,0.06)',
        nodeIds: selectedIds,
      };
      return { ...content, groups: [...groups, newGroup] };
    }

    case 'UPDATE_GROUP_LABEL':
      return { ...content, groups: groups.map(g => g.id === action.id ? { ...g, label: action.label } : g) };

    default:
      return content;
  }
}

// Undo/redo wrapper — wraps contentReducer with history
function historyReducer(state, action) {
  const { past, present, future } = state;

  if (action.type === 'UNDO') {
    if (past.length === 0) return state;
    return { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] };
  }

  if (action.type === 'REDO') {
    if (future.length === 0) return state;
    return { past: [...past, present], present: future[0], future: future.slice(1) };
  }

  // Mutations that don't push history (e.g. incremental drag/resize moves)
  const noHistory = new Set(['MOVE_NODES', 'MOVE_GROUP', 'LOAD', 'RESIZE_NODE_FULL']);

  const next = contentReducer(present, action);
  if (next === present) return state;

  if (noHistory.has(action.type)) {
    return { past, present: next, future };
  }

  return { past: [...past.slice(-49), present], present: next, future: [] };
}

// ── Export helpers ────────────────────────────────────────────────────────────

function exportSvg(svgEl, name) {
  const clone = svgEl.cloneNode(true);
  // Remove dot-grid defs/rect for clean export
  clone.querySelectorAll('pattern#dots').forEach(el => el.remove());
  clone.querySelectorAll('rect[fill="url(#dots)"]').forEach(el => el.remove());
  const serial = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([serial], { type: 'image/svg+xml' });
  triggerDownload(URL.createObjectURL(blob), `${name || 'diagram'}.svg`);
}

function exportPng(svgEl, name) {
  const rect  = svgEl.getBoundingClientRect();
  const clone = svgEl.cloneNode(true);
  clone.setAttribute('width', rect.width);
  clone.setAttribute('height', rect.height);
  const serial = new XMLSerializer().serializeToString(clone);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width  = rect.width  * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(b => triggerDownload(URL.createObjectURL(b), `${name || 'diagram'}.png`));
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(serial)));
}

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function apiFetch(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.status === 204 ? null : res.json();
}

// ── Tool sidebar ──────────────────────────────────────────────────────────────

const TOOLS = [
  { id: 'select',  icon: 'cursor',          label: 'select'  },
  { id: 'rect',    icon: 'rectangle',       label: 'rect'    },
  { id: 'diamond', icon: 'diamond',         label: 'diamond' },
  { id: 'edge',    icon: 'arrow-right',     label: 'edge'    },
  { id: 'group',   icon: 'selection-plus',  label: 'group'   },
];

function ToolSidebar({ activeTool, setActiveTool, onGroup, canGroup }) {
  return (
    <aside className="w-14 shrink-0 border-r border-gray-100 bg-white flex flex-col items-center pt-4 gap-1">
      {TOOLS.map(t => (
        <button
          key={t.id}
          title={t.label}
          aria-label={t.label}
          onClick={() => t.id === 'group' ? onGroup() : setActiveTool(t.id)}
          className={`w-9 h-9 flex items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 ${
            activeTool === t.id && t.id !== 'group'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
          } ${!canGroup && t.id === 'group' ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <Icon name={t.icon} size={18} className="" />
        </button>
      ))}
    </aside>
  );
}

// ── Diagram list panel ────────────────────────────────────────────────────────

function DiagramListPanel({ diagrams, activeDiagramId, onSelect, onCreate, onRename, onDelete, open, onClose }) {
  const [newName, setNewName]       = React.useState('');
  const [renamingId, setRenamingId] = React.useState(null);
  const [renameName, setRenameName] = React.useState('');

  function submitNew(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName('');
  }

  function submitRename(id) {
    if (renameName.trim()) onRename(id, renameName.trim());
    setRenamingId(null);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* backdrop */}
      <div className="flex-1" onClick={onClose} />
      {/* drawer */}
      <div className="w-72 bg-white border-l border-gray-100 shadow-lg h-full flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700 lowercase">diagrams</span>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-sm" aria-label="close">
            <Icon name="x" size={16} className="" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {diagrams.map(d => (
            <div key={d.id}
              className={`group flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors ${activeDiagramId === d.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => { onSelect(d.id); onClose(); }}
            >
              {renamingId === d.id ? (
                <input
                  className="flex-1 border-b border-gray-400 text-sm text-gray-700 bg-transparent focus:outline-none py-0.5"
                  value={renameName}
                  autoFocus
                  onChange={e => setRenameName(e.target.value)}
                  onBlur={() => submitRename(d.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter')  submitRename(d.id);
                    if (e.key === 'Escape') setRenamingId(null);
                    e.stopPropagation();
                  }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 text-sm text-gray-700 truncate lowercase">{d.name}</span>
              )}
              <div className="hidden group-hover:flex items-center gap-1">
                <button
                  aria-label="rename"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={e => { e.stopPropagation(); setRenamingId(d.id); setRenameName(d.name); }}
                >
                  <Icon name="pencil" size={13} className="" />
                </button>
                <button
                  aria-label="delete"
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={e => { e.stopPropagation(); onDelete(d.id); }}
                >
                  <Icon name="trash" size={13} className="" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-gray-100">
          <form onSubmit={submitNew} className="flex gap-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="new diagram..."
              className="flex-1 border-b border-gray-300 py-1.5 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
            />
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-800 transition-colors lowercase">
              add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────

function TopBar({
  diagram, canUndo, canRedo, dispatch, zoom, onZoom,
  onExportSvg, onExportPng, saveStatus,
  theme, setTheme, mode, setMode,
  onOpenDiagrams,
}) {
  const [editingName, setEditingName] = React.useState(false);
  const [nameVal, setNameVal]         = React.useState(diagram?.name || '');

  React.useEffect(() => {
    if (diagram) setNameVal(diagram.name);
  }, [diagram?.name]);

  function submitName() {
    setEditingName(false);
    if (nameVal.trim() && nameVal !== diagram?.name) {
      dispatch({ type: '__RENAME', name: nameVal.trim() });
    }
  }

  const zoomPct = Math.round(zoom * 100);

  return (
    <header className="h-11 shrink-0 border-b border-gray-100 bg-white flex items-center gap-3 px-3">
      {/* diagrams list trigger */}
      <button
        onClick={onOpenDiagrams}
        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-sm"
        aria-label="open diagrams"
        title="diagrams"
      >
        <Icon name="list" size={16} className="" />
      </button>

      <div className="w-px h-5 bg-gray-200" />

      {/* diagram name */}
      {editingName ? (
        <input
          autoFocus
          value={nameVal}
          onChange={e => setNameVal(e.target.value)}
          onBlur={submitName}
          onKeyDown={e => { if (e.key === 'Enter') submitName(); if (e.key === 'Escape') setEditingName(false); }}
          className="text-sm text-gray-700 border-b border-gray-400 bg-transparent focus:outline-none py-0.5 w-40"
        />
      ) : (
        <button onClick={() => setEditingName(true)}
          className="text-sm text-gray-700 lowercase hover:text-gray-900 transition-colors max-w-[160px] truncate"
          title="click to rename"
        >
          {diagram?.name || 'untitled'}
        </button>
      )}

      <div className="w-px h-5 bg-gray-200" />

      {/* undo / redo */}
      <button onClick={() => dispatch({ type: 'UNDO' })} disabled={!canUndo}
        title="undo (ctrl+z)"
        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-sm disabled:opacity-30">
        <Icon name="arrow-counter-clockwise" size={15} className="" />
      </button>
      <button onClick={() => dispatch({ type: 'REDO' })} disabled={!canRedo}
        title="redo (ctrl+shift+z)"
        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-sm disabled:opacity-30">
        <Icon name="arrow-clockwise" size={15} className="" />
      </button>

      <div className="w-px h-5 bg-gray-200" />

      {/* zoom */}
      <div className="flex items-center gap-1">
        <button onClick={() => onZoom(zoom / 1.2)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <Icon name="minus" size={13} className="" />
        </button>
        <button onClick={() => onZoom(1)} className="text-xs text-gray-500 hover:text-gray-700 transition-colors w-9 text-center">
          {zoomPct}%
        </button>
        <button onClick={() => onZoom(zoom * 1.2)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <Icon name="plus" size={13} className="" />
        </button>
      </div>

      <div className="flex-1" />

      {/* save status */}
      <span className="text-xs text-gray-400 lowercase flex items-center gap-1.5">
        {saveStatus === 'saving' && <><Spinner size={10} /> saving...</>}
        {saveStatus === 'saved'  && 'saved'}
        {saveStatus === 'error'  && <span className="text-red-400">save failed</span>}
      </span>

      {/* export */}
      <button onClick={onExportSvg} title="export SVG"
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-2.5 py-1.5 rounded-sm transition-colors lowercase">
        <Icon name="export" size={13} className="" /> svg
      </button>
      <button onClick={onExportPng} title="export PNG"
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-2.5 py-1.5 rounded-sm transition-colors lowercase">
        <Icon name="image" size={13} className="" /> png
      </button>

      <div className="w-px h-5 bg-gray-200" />

      {/* theme + dark mode */}
      <Dropdown
        value={theme}
        onChange={setTheme}
        width="w-24"
        options={[
          { value: 'zinc',   label: 'zinc'     },
          { value: 'arctic', label: 'arctic'   },
          { value: 'stone',  label: 'stone'    },
          { value: 'hc',     label: 'contrast' },
        ]}
      />
      <Toggle checked={mode === 'dark'} onChange={v => setMode(v ? 'dark' : 'light')} label="dark" />
    </header>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

function App() {
  // ── Theme -------------------------------------------------------------------
  const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
  const [mode, setMode]   = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode', mode);
  }, [theme, mode]);

  // ── Diagrams list -----------------------------------------------------------
  const [diagrams, setDiagrams]       = React.useState([]);
  const [activeDiagramId, setActiveDiagramId] = React.useState(null);
  const [diagramMeta, setDiagramMeta] = React.useState(null); // {id, name}

  // ── Content state (undo/redo) -----------------------------------------------
  const [history, dispatch] = React.useReducer(historyReducer, {
    past: [], present: INITIAL_CONTENT, future: [],
  });
  const content = history.present;

  // ── UI-only state -----------------------------------------------------------
  const [activeTool,   setActiveTool]   = React.useState('select');
  const [selectedIds,  setSelectedIds]  = React.useState([]);
  const [editingId,    setEditingId]    = React.useState(null);
  const [pan,          setPan]          = React.useState({ x: 60, y: 60 });
  const [zoom,         setZoom]         = React.useState(1);
  const [listOpen,     setListOpen]     = React.useState(false);
  const [saveStatus,   setSaveStatus]   = React.useState('saved'); // 'saving'|'saved'|'error'

  const svgRef = React.useRef(null);

  // ── Load diagrams list on mount -------------------------------------------
  React.useEffect(() => {
    apiFetch('/api/diagrams').then(list => {
      setDiagrams(list);
      if (list.length > 0) loadDiagram(list[0].id);
    }).catch(console.error);
  }, []);

  async function loadDiagram(id) {
    const d = await apiFetch(`/api/diagrams/${id}`);
    setActiveDiagramId(id);
    setDiagramMeta({ id: d.id, name: d.name });
    const parsed = JSON.parse(d.contentJson || '{"nodes":[],"edges":[],"groups":[]}');
    dispatch({ type: 'LOAD', content: parsed });
    setSelectedIds([]);
    setEditingId(null);
  }

  // ── Auto-save (debounced) --------------------------------------------------
  const saveTimerRef = React.useRef(null);
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!activeDiagramId) return;
    setSaveStatus('saving');
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await apiFetch(`/api/diagrams/${activeDiagramId}`, {
          method: 'PUT',
          body: { contentJson: JSON.stringify(content) },
        });
        setSaveStatus('saved');
        // refresh list timestamps
        setDiagrams(prev => prev.map(d => d.id === activeDiagramId ? { ...d, updatedAt: new Date().toISOString() } : d));
      } catch {
        setSaveStatus('error');
      }
    }, 1500);
    return () => clearTimeout(saveTimerRef.current);
  }, [content]);

  // ── Diagram CRUD ---------------------------------------------------------
  async function createDiagram(name) {
    const d = await apiFetch('/api/diagrams', { method: 'POST', body: { name } });
    setDiagrams(prev => [d, ...prev]);
    loadDiagram(d.id);
  }

  async function renameDiagram(id, name) {
    await apiFetch(`/api/diagrams/${id}`, { method: 'PUT', body: { name } });
    setDiagrams(prev => prev.map(d => d.id === id ? { ...d, name } : d));
    if (id === activeDiagramId) setDiagramMeta(m => ({ ...m, name }));
  }

  async function deleteDiagram(id) {
    await apiFetch(`/api/diagrams/${id}`, { method: 'DELETE' });
    const next = diagrams.filter(d => d.id !== id);
    setDiagrams(next);
    if (id === activeDiagramId) {
      if (next.length > 0) loadDiagram(next[0].id);
      else { setActiveDiagramId(null); setDiagramMeta(null); dispatch({ type: 'LOAD', content: INITIAL_CONTENT }); }
    }
  }

  // ── Intercept __RENAME from TopBar ----------------------------------------
  function appDispatch(action) {
    if (action.type === '__RENAME') {
      renameDiagram(activeDiagramId, action.name);
      return;
    }
    dispatch(action);
  }

  // ── Group selected nodes --------------------------------------------------
  function groupSelected() {
    if (selectedIds.length < 2) return;
    dispatch({ type: 'ADD_GROUP', selectedIds });
    setSelectedIds([]);
  }

  // ── Pan/zoom helpers -------------------------------------------------------
  function handlePanZoom(newPan, newZoom) {
    setPan(newPan);
    setZoom(newZoom);
  }

  function handleZoom(newZoom) {
    const clamped = Math.max(0.1, Math.min(4, newZoom));
    setZoom(clamped);
  }

  // ── Export ----------------------------------------------------------------
  function handleExportSvg() {
    const svgEl = document.querySelector('.canvas-wrap svg');
    if (svgEl) exportSvg(svgEl, diagramMeta?.name);
  }
  function handleExportPng() {
    const svgEl = document.querySelector('.canvas-wrap svg');
    if (svgEl) exportPng(svgEl, diagramMeta?.name);
  }

  // ── Render ----------------------------------------------------------------
  return (
    <div className="flex flex-col" style={{ width: '100vw', height: '100vh', background: 'var(--gray-50)' }}>
      <TopBar
        diagram={diagramMeta}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        dispatch={appDispatch}
        zoom={zoom}
        onZoom={handleZoom}
        onExportSvg={handleExportSvg}
        onExportPng={handleExportPng}
        saveStatus={saveStatus}
        theme={theme} setTheme={setTheme}
        mode={mode}   setMode={setMode}
        onOpenDiagrams={() => setListOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <ToolSidebar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onGroup={groupSelected}
          canGroup={selectedIds.length >= 2}
        />

        <Canvas
          nodes={content.nodes}
          edges={content.edges}
          groups={content.groups}
          dispatch={appDispatch}
          activeTool={activeTool}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          pan={pan}
          zoom={zoom}
          onPanZoom={handlePanZoom}
          editingId={editingId}
          setEditingId={setEditingId}
        />

        <PropertiesPanel
          nodes={content.nodes}
          edges={content.edges}
          selectedIds={selectedIds}
          dispatch={appDispatch}
        />
      </div>

      <DiagramListPanel
        diagrams={diagrams}
        activeDiagramId={activeDiagramId}
        onSelect={loadDiagram}
        onCreate={createDiagram}
        onRename={renameDiagram}
        onDelete={deleteDiagram}
        open={listOpen}
        onClose={() => setListOpen(false)}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
