// canvas.jsx — SVG Canvas with full interaction model + ContextToolbar
// Receives: { nodes, edges, groups, dispatch, activeTool, selectedIds, setSelectedIds,
//             pan, zoom, onPanZoom, editingId, setEditingId }

// ── Geometry helpers ──────────────────────────────────────────────────────────

function getPortPos(node, port) {
  const { x, y, w, h } = node;
  switch (port) {
    case 'top':    return { x: x + w / 2, y };
    case 'right':  return { x: x + w,     y: y + h / 2 };
    case 'bottom': return { x: x + w / 2, y: y + h };
    case 'left':   return { x,             y: y + h / 2 };
    default:       return { x: x + w / 2, y: y + h / 2 };
  }
}

function portTangent(port, dist = 80) {
  switch (port) {
    case 'top':    return { dx: 0,     dy: -dist };
    case 'right':  return { dx: dist,  dy: 0     };
    case 'bottom': return { dx: 0,     dy: dist  };
    case 'left':   return { dx: -dist, dy: 0     };
    default:       return { dx: 0,     dy: 0     };
  }
}

function cubicBezierPath(srcNode, srcPort, dstNode, dstPort) {
  const s  = getPortPos(srcNode, srcPort);
  const d  = getPortPos(dstNode, dstPort);
  const ts = portTangent(srcPort);
  const td = portTangent(dstPort);
  const c1x = s.x + ts.dx, c1y = s.y + ts.dy;
  const c2x = d.x + td.dx, c2y = d.y + td.dy;
  return `M${s.x},${s.y} C${c1x},${c1y} ${c2x},${c2y} ${d.x},${d.y}`;
}

function cubicBezierPathFromPoints(sx, sy, srcPort, dx, dy, dstPort) {
  const ts = portTangent(srcPort);
  const td = portTangent(dstPort);
  const c1x = sx + ts.dx, c1y = sy + ts.dy;
  const c2x = dx + td.dx, c2y = dy + td.dy;
  return `M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${dx},${dy}`;
}

// Midpoint of cubic bezier at t=0.5 (de Casteljau)
function bezierMid(sx, sy, srcPort, dx, dy, dstPort) {
  const ts = portTangent(srcPort);
  const td = portTangent(dstPort);
  const c1x = sx + ts.dx, c1y = sy + ts.dy;
  const c2x = dx + td.dx, c2y = dy + td.dy;
  const t = 0.5, mt = 1 - t;
  const x = mt*mt*mt*sx + 3*mt*mt*t*c1x + 3*mt*t*t*c2x + t*t*t*dx;
  const y = mt*mt*mt*sy + 3*mt*mt*t*c1y + 3*mt*t*t*c2y + t*t*t*dy;
  return { x, y };
}

function rectContains(rx, ry, rw, rh, nx, ny, nw, nh) {
  return nx >= rx && ny >= ry && nx + nw <= rx + rw && ny + nh <= ry + rh;
}

function snapGuessPort(fromPort) {
  switch (fromPort) {
    case 'top':    return 'bottom';
    case 'bottom': return 'top';
    case 'left':   return 'right';
    case 'right':  return 'left';
    default:       return 'top';
  }
}

function nearestPort(node, px, py) {
  const ports = ['top','right','bottom','left'];
  let best = null, bestDist = Infinity;
  for (const p of ports) {
    const pos = getPortPos(node, p);
    const d = Math.hypot(pos.x - px, pos.y - py);
    if (d < bestDist) { bestDist = d; best = p; }
  }
  return best;
}

const PORT_SNAP_RADIUS = 28;

function findSnapTarget(nodes, px, py, excludeNodeId) {
  let best = null, bestDist = PORT_SNAP_RADIUS;
  for (const node of nodes) {
    if (node.id === excludeNodeId) continue;
    for (const port of ['top','right','bottom','left']) {
      const pos = getPortPos(node, port);
      const dist = Math.hypot(pos.x - px, pos.y - py);
      if (dist < bestDist) { bestDist = dist; best = { node, port, pos }; }
    }
  }
  return best;
}

// ── Node shape components ─────────────────────────────────────────────────────

// Corner resize handles (4 corners)
const RESIZE_HANDLES = [
  { id: 'nw', fx: (x,y,w,h) => x,     fy: (x,y,w,h) => y,     cursor: 'nwse-resize' },
  { id: 'ne', fx: (x,y,w,h) => x+w,   fy: (x,y,w,h) => y,     cursor: 'nesw-resize' },
  { id: 'se', fx: (x,y,w,h) => x+w,   fy: (x,y,w,h) => y+h,   cursor: 'nwse-resize' },
  { id: 'sw', fx: (x,y,w,h) => x,     fy: (x,y,w,h) => y+h,   cursor: 'nesw-resize' },
];

// Mid-edge resize handles (cardinal directions — purple dots like Whimsical)
const MID_HANDLES = [
  { id: 'n', fx: (x,y,w,h) => x+w/2, fy: (x,y,w,h) => y,     cursor: 'ns-resize' },
  { id: 'e', fx: (x,y,w,h) => x+w,   fy: (x,y,w,h) => y+h/2, cursor: 'ew-resize' },
  { id: 's', fx: (x,y,w,h) => x+w/2, fy: (x,y,w,h) => y+h,   cursor: 'ns-resize' },
  { id: 'w', fx: (x,y,w,h) => x,     fy: (x,y,w,h) => y+h/2, cursor: 'ew-resize' },
];

function NodeShape({ node, selected, onMouseDown, onDoubleClick, editingId, onEditLabel, activeTool, onPortDragStart, onResizeStart }) {
  const { id, type, x, y, w, h, label, style = {} } = node;
  const {
    fontSize = 14, fontWeight = 'normal', fontFamily = 'Inter, sans-serif',
    textColor = '#374151', fill = '#f9fafb', stroke = '#d1d5db'
  } = style;

  const isEditing = editingId === id;
  const ports = ['top', 'right', 'bottom', 'left'];

  const sharedTextStyle = {
    fontSize, fontWeight, fontFamily, fill: textColor,
    dominantBaseline: 'middle', textAnchor: 'middle',
    pointerEvents: 'none', userSelect: 'none',
  };

  function handlePortMouseDown(e, port) {
    e.stopPropagation();
    onPortDragStart(id, port, e);
  }

  // Port dots — always present; CSS controls visibility via .node-group:hover
  const portEls = ports.map(port => {
    const pos = getPortPos(node, port);
    return (
      <g key={port} className="port-group">
        <circle cx={pos.x} cy={pos.y} r={5} className="port-dot" style={{ pointerEvents: 'none' }} />
        <circle cx={pos.x} cy={pos.y} r={8} fill="transparent"
          style={{ cursor: 'crosshair' }}
          onMouseDown={e => handlePortMouseDown(e, port)} />
      </g>
    );
  });

  // Corner resize handles — white squares, visible when selected
  const cornerHandles = (selected && activeTool === 'select') ? RESIZE_HANDLES.map(h => (
    <rect key={h.id}
      x={h.fx(x,y,w,h) - 4} y={h.fy(x,y,w,h) - 4}
      width={8} height={8}
      className="resize-handle"
      style={{ cursor: h.cursor }}
      onMouseDown={e => { e.stopPropagation(); onResizeStart(id, h.id, e); }}
    />
  )) : null;

  // Mid-edge resize handles — always in DOM (like port dots) to avoid ghost-at-insert-position
  const midHandleVisible = selected && activeTool === 'select';
  const midHandles = MID_HANDLES.map(h => (
    <circle key={h.id}
      cx={h.fx(x,y,w,h)} cy={h.fy(x,y,w,h)} r={5}
      className="mid-handle"
      style={{
        opacity: midHandleVisible ? 1 : 0,
        pointerEvents: midHandleVisible ? 'auto' : 'none',
        cursor: midHandleVisible ? h.cursor : 'default',
      }}
      onMouseDown={midHandleVisible ? (e => { e.stopPropagation(); onResizeStart(id, h.id, e); }) : undefined}
    />
  ));

  const editorEl = isEditing ? (
    <foreignObject x={x + 2} y={y + 2} width={w - 4} height={h - 4}>
      <textarea
        className="node-editor"
        style={{ fontSize, fontWeight, fontFamily, color: textColor, lineHeight: 1.4 }}
        defaultValue={label}
        autoFocus
        onBlur={e => onEditLabel(id, e.target.value)}
        onKeyDown={e => { if (e.key === 'Escape') onEditLabel(id, e.target.value); }}
      />
    </foreignObject>
  ) : null;

  // ── Circle / Ellipse ────────────────────────────────────────────────────────
  if (type === 'circle') {
    const cx = x + w / 2, cy = y + h / 2;
    return (
      <g className={`node-group${selected ? ' node-selected' : ''}`}
        onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}
        style={{ cursor: activeTool === 'select' ? 'move' : 'default' }}>
        <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} fill={fill} stroke={stroke} strokeWidth={1.5} />
        {!isEditing && <text x={cx} y={cy} style={sharedTextStyle}>{label}</text>}
        {editorEl}
        {portEls}
        {cornerHandles}
        {midHandles}
      </g>
    );
  }

  // ── Diamond ─────────────────────────────────────────────────────────────────
  if (type === 'diamond') {
    const cx = x + w / 2, cy = y + h / 2;
    const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
    return (
      <g className={`node-group${selected ? ' node-selected' : ''}`}
        onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}
        style={{ cursor: activeTool === 'select' ? 'move' : 'default' }}>
        <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={1.5} />
        {!isEditing && <text x={cx} y={cy} style={sharedTextStyle}>{label}</text>}
        {editorEl}
        {portEls}
        {cornerHandles}
        {midHandles}
      </g>
    );
  }

  // ── Custom shape via SHAPE_REGISTRY ─────────────────────────────────────────
  const customDescriptor = window.FlowChart?.SHAPE_REGISTRY?.get(type);
  if (customDescriptor?.render) {
    return (
      <g className={`node-group${selected ? ' node-selected' : ''}`}
        onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}
        style={{ cursor: activeTool === 'select' ? 'move' : 'default' }}>
        {customDescriptor.render(node, { isEditing, sharedTextStyle })}
        {editorEl}
        {portEls}
        {cornerHandles}
        {midHandles}
      </g>
    );
  }

  // ── Default: rect ────────────────────────────────────────────────────────────
  return (
    <g className={`node-group${selected ? ' node-selected' : ''}`}
      onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}
      style={{ cursor: activeTool === 'select' ? 'move' : 'default' }}>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {!isEditing && <text x={x + w / 2} y={y + h / 2} style={sharedTextStyle}>{label}</text>}
      {editorEl}
      {portEls}
      {cornerHandles}
      {midHandles}
    </g>
  );
}

// ── Edge component ────────────────────────────────────────────────────────────

function EdgeEl({ edge, srcNode, dstNode, selected, activeTool, onMouseDown, editingId, onEditLabel }) {
  const { id, fromPort, toPort, label, style: edgeStyle = {} } = edge;
  const {
    strokeColor = '#9ca3af',
    strokeWidth = 1.5,
    strokeDash  = 'solid',
  } = edgeStyle;

  const dashArray = strokeDash === 'dashed' ? '8 4'
                  : strokeDash === 'dotted' ? '2 4'
                  : 'none';

  const markerId = `arrow-e-${id}`;
  const arrowColor = selected ? '#3b82f6' : strokeColor;
  const pathD = cubicBezierPath(srcNode, fromPort, dstNode, toPort);
  const sp = getPortPos(srcNode, fromPort);
  const dp = getPortPos(dstNode, toPort);
  const mid = bezierMid(sp.x, sp.y, fromPort, dp.x, dp.y, toPort);
  const isEditing = editingId === id;

  return (
    <g className={selected ? 'edge-selected' : ''} style={{ cursor: activeTool === 'select' ? 'pointer' : 'default' }}>
      {/* Per-edge colored arrowhead */}
      <defs>
        <marker id={markerId} markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto" markerUnits="strokeWidth">
          <path d="M0,1 L0,9 L9,5 z" fill={arrowColor} />
        </marker>
      </defs>
      {/* invisible wide hit area */}
      <path d={pathD} className="edge-hit" onMouseDown={onMouseDown} />
      {/* visible stroke */}
      {/* visible stroke with per-edge color + dash */}
      <path d={pathD} fill="none"
        stroke={arrowColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        markerEnd={`url(#${markerId})`}
        onMouseDown={onMouseDown}
      />
      {/* label */}
      {label && !isEditing && (
        <text x={mid.x} y={mid.y - 8} textAnchor="middle" fontSize={11} fill="#6b7280"
          style={{ userSelect: 'none', pointerEvents: 'none' }}>
          {label}
        </text>
      )}
      {/* label editor */}
      {isEditing && (
        <foreignObject x={mid.x - 60} y={mid.y - 26} width={120} height={24}>
          <input
            style={{
              width: '100%', height: '100%', border: '1px solid #d1d5db', borderRadius: 2,
              padding: '0 4px', fontSize: 11, background: 'white', color: '#374151', outline: 'none'
            }}
            defaultValue={label}
            autoFocus
            onBlur={e => onEditLabel(id, e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape' || e.key === 'Enter') onEditLabel(id, e.target.value); }}
          />
        </foreignObject>
      )}
      {/* dblclick zone on midpoint for label editing */}
      {!isEditing && (
        <circle cx={mid.x} cy={mid.y} r={10} fill="transparent"
          onDoubleClick={e => { e.stopPropagation(); onMouseDown(e); /* select first */ setTimeout(() => onEditLabel(id, null), 0); }}
        />
      )}
    </g>
  );
}

// ── Group component ───────────────────────────────────────────────────────────

function GroupEl({ group, selected, activeTool, onMouseDown }) {
  const { x, y, w, h, label, fill = 'rgba(99,102,241,0.06)' } = group;
  const strokeColor = selected ? '#3b82f6' : '#c7d2fe';
  return (
    <g className={selected ? 'group-selected' : ''} onMouseDown={onMouseDown}
      style={{ cursor: activeTool === 'select' ? 'move' : 'default' }}>
      <rect className="group-rect" x={x} y={y} width={w} height={h} rx={4}
        fill={fill} stroke={strokeColor} strokeWidth={1} strokeDasharray="6 3" />
      {label && (
        <text x={x + 8} y={y + 16} fontSize={11} fill="#6366f1"
          style={{ userSelect: 'none', pointerEvents: 'none', fontWeight: 500 }}>
          {label}
        </text>
      )}
    </g>
  );
}

// ── Defs (fallback arrow marker) ──────────────────────────────────────────────

function SvgDefs() {
  return (
    <defs>
      <marker id="arrow" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto" markerUnits="strokeWidth">
        <path d="M0,1 L0,9 L9,5 z" fill="#9ca3af" />
      </marker>
      <marker id="arrow-blue" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto" markerUnits="strokeWidth">
        <path d="M0,1 L0,9 L9,5 z" fill="#3b82f6" />
      </marker>
    </defs>
  );
}

// ── Context (Floating) Toolbar ────────────────────────────────────────────────

function ContextToolbar({ nodes, edges, selectedIds, dispatch, setSelectedIds, pan, zoom, svgRef }) {
  if (selectedIds.length !== 1) return null;
  const id   = selectedIds[0];
  const node = nodes.find(n => n.id === id);
  const edge = !node ? edges.find(e => e.id === id) : null;
  if (!node && !edge) return null;

  const TOOLBAR_H = 40, GAP = 8;

  function toolbarPos() {
    if (!svgRef.current) return { left: 0, top: 0, transform: '' };
    const rect = svgRef.current.getBoundingClientRect();
    if (node) {
      const screenX = rect.left + pan.x + (node.x + node.w / 2) * zoom;
      let   screenY = rect.top  + pan.y + node.y * zoom - TOOLBAR_H - GAP;
      if (screenY < rect.top + 8) screenY = rect.top + pan.y + (node.y + node.h) * zoom + GAP;
      return { left: screenX, top: screenY, transform: 'translateX(-50%)' };
    }
    if (edge) {
      const src = nodes.find(n => n.id === edge.fromId);
      const dst = nodes.find(n => n.id === edge.toId);
      if (!src || !dst) return { left: 0, top: 0, transform: '' };
      const sp  = getPortPos(src, edge.fromPort), dp = getPortPos(dst, edge.toPort);
      const mid = bezierMid(sp.x, sp.y, edge.fromPort, dp.x, dp.y, edge.toPort);
      return {
        left: rect.left + pan.x + mid.x * zoom,
        top:  rect.top  + pan.y + mid.y * zoom - TOOLBAR_H - GAP,
        transform: 'translateX(-50%)',
      };
    }
    return { left: 0, top: 0, transform: '' };
  }

  const pos = toolbarPos();
  const divider = <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />;
  const btnCls       = 'w-7 h-7 flex items-center justify-center rounded-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors flex-shrink-0';
  const activeBtnCls = 'w-7 h-7 flex items-center justify-center rounded-sm bg-gray-200 text-gray-900 flex-shrink-0';

  if (node) {
    const s = node.style || {};
    const isBold = s.fontWeight === 'bold' || s.fontWeight === '700';
    const curType = node.type || 'rect';
    return (
      <div style={{ position: 'fixed', left: pos.left, top: pos.top, transform: pos.transform, zIndex: 60 }}
        onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-center h-10 bg-white border border-gray-200 rounded-sm px-1 gap-0.5"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)', whiteSpace: 'nowrap' }}>

          {/* Shape switcher */}
          <button title="rect"    className={curType === 'rect'    ? activeBtnCls : btnCls} onClick={() => dispatch({ type: 'CHANGE_NODE_TYPE', id, nodeType: 'rect'    })}><Icon name="rectangle" size={14} className="" /></button>
          <button title="diamond" className={curType === 'diamond' ? activeBtnCls : btnCls} onClick={() => dispatch({ type: 'CHANGE_NODE_TYPE', id, nodeType: 'diamond' })}><Icon name="diamond"   size={14} className="" /></button>
          <button title="circle"  className={curType === 'circle'  ? activeBtnCls : btnCls} onClick={() => dispatch({ type: 'CHANGE_NODE_TYPE', id, nodeType: 'circle'  })}><Icon name="circle"    size={14} className="" /></button>

          {divider}

          {/* Fill + Stroke */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[10px] text-gray-400">fill</span>
            <ColorSwatch value={s.fill || '#f9fafb'} onChange={v => dispatch({ type: 'UPDATE_NODE_STYLE', id, key: 'fill', val: v })} />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            <span className="text-[10px] text-gray-400">stroke</span>
            <ColorSwatch value={s.stroke || '#d1d5db'} onChange={v => dispatch({ type: 'UPDATE_NODE_STYLE', id, key: 'stroke', val: v })} />
          </div>

          {divider}

          {/* Font size */}
          <button className={btnCls} onClick={() => dispatch({ type: 'UPDATE_NODE_STYLE', id, key: 'fontSize', val: Math.max(10, (s.fontSize || 14) - 1) })}><Icon name="minus" size={11} className="" /></button>
          <span className="text-xs text-gray-500 w-6 text-center flex-shrink-0 tabular-nums">{s.fontSize || 14}</span>
          <button className={btnCls} onClick={() => dispatch({ type: 'UPDATE_NODE_STYLE', id, key: 'fontSize', val: Math.min(48, (s.fontSize || 14) + 1) })}><Icon name="plus" size={11} className="" /></button>
          <button title="bold" className={isBold ? activeBtnCls : btnCls} style={{ fontWeight: 700, fontSize: 12 }}
            onClick={() => dispatch({ type: 'UPDATE_NODE_STYLE', id, key: 'fontWeight', val: isBold ? 'normal' : 'bold' })}>B</button>

          {divider}

          {/* Duplicate + Delete + Close */}
          <button title="duplicate (Ctrl+D)" className={btnCls} onClick={() => dispatch({ type: 'DUPLICATE_NODES', ids: [id] })}><Icon name="copy"  size={14} className="" /></button>
          <button title="delete (Del)" className={`${btnCls} hover:text-red-500`} onClick={() => { dispatch({ type: 'DELETE_SELECTED', ids: [id] }); setSelectedIds([]); }}><Icon name="trash" size={14} className="" /></button>
          {divider}
          <button title="deselect" className={btnCls} onClick={() => setSelectedIds([])}><Icon name="x" size={13} className="" /></button>
        </div>
      </div>
    );
  }

  if (edge) {
    const es = edge.style || {};
    const strokeColor = es.strokeColor || '#9ca3af';
    const strokeDash  = es.strokeDash  || 'solid';
    const strokeWidth = es.strokeWidth || 1.5;
    return (
      <div style={{ position: 'fixed', left: pos.left, top: pos.top, transform: pos.transform, zIndex: 60 }}
        onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-center h-10 bg-white border border-gray-200 rounded-sm px-1 gap-0.5"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)', whiteSpace: 'nowrap' }}>

          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[10px] text-gray-400">color</span>
            <ColorSwatch value={strokeColor} onChange={v => dispatch({ type: 'UPDATE_EDGE_STYLE', id, key: 'strokeColor', val: v })} />
          </div>

          {divider}

          <button title="solid"  className={strokeDash === 'solid'  ? activeBtnCls : btnCls} onClick={() => dispatch({ type: 'UPDATE_EDGE_STYLE', id, key: 'strokeDash', val: 'solid'  })}><svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke="currentColor" strokeWidth={1.5} /></svg></button>
          <button title="dashed" className={strokeDash === 'dashed' ? activeBtnCls : btnCls} onClick={() => dispatch({ type: 'UPDATE_EDGE_STYLE', id, key: 'strokeDash', val: 'dashed' })}><svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke="currentColor" strokeWidth={1.5} strokeDasharray="5 3" /></svg></button>
          <button title="dotted" className={strokeDash === 'dotted' ? activeBtnCls : btnCls} onClick={() => dispatch({ type: 'UPDATE_EDGE_STYLE', id, key: 'strokeDash', val: 'dotted' })}><svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke="currentColor" strokeWidth={1.5} strokeDasharray="2 3" /></svg></button>

          {divider}

          <button className={btnCls} onClick={() => dispatch({ type: 'UPDATE_EDGE_STYLE', id, key: 'strokeWidth', val: Math.max(0.5, strokeWidth - 0.5) })}><Icon name="minus" size={11} className="" /></button>
          <span className="text-xs text-gray-500 w-6 text-center flex-shrink-0 tabular-nums">{strokeWidth}</span>
          <button className={btnCls} onClick={() => dispatch({ type: 'UPDATE_EDGE_STYLE', id, key: 'strokeWidth', val: Math.min(8, strokeWidth + 0.5) })}><Icon name="plus"  size={11} className="" /></button>

          {divider}
          <button title="delete (Del)" className={`${btnCls} hover:text-red-500`} onClick={() => { dispatch({ type: 'DELETE_SELECTED', ids: [id] }); setSelectedIds([]); }}><Icon name="trash" size={14} className="" /></button>
          <button title="deselect"     className={btnCls}                          onClick={() => setSelectedIds([])}><Icon name="x" size={13} className="" /></button>
        </div>
      </div>
    );
  }

  return null;
}

// ── Canvas ─────────────────────────────────────────────────────────────────────

function Canvas({
  nodes, edges, groups,
  dispatch, activeTool,
  selectedIds, setSelectedIds,
  pan, zoom, onPanZoom,
  editingId, setEditingId,
}) {
  const svgRef     = React.useRef(null);
  const dragRef    = React.useRef(null);
  const isSpaceRef = React.useRef(false);

  // Refs holding current values — all event handlers read from these, never from props/state
  const panRef      = React.useRef(pan);
  const zoomRef     = React.useRef(zoom);
  const nodesRef    = React.useRef(nodes);
  const edgesRef    = React.useRef(edges);
  const dispatchRef = React.useRef(dispatch);
  const selectedRef = React.useRef(selectedIds);
  const editingRef  = React.useRef(editingId);
  const setSelRef   = React.useRef(setSelectedIds);
  const setEdRef    = React.useRef(setEditingId);

  React.useEffect(() => { panRef.current      = pan;            }, [pan]);
  React.useEffect(() => { zoomRef.current     = zoom;           }, [zoom]);
  React.useEffect(() => { nodesRef.current    = nodes;          }, [nodes]);
  React.useEffect(() => { edgesRef.current    = edges;          }, [edges]);
  React.useEffect(() => { dispatchRef.current = dispatch;       }, [dispatch]);
  React.useEffect(() => { selectedRef.current = selectedIds;    }, [selectedIds]);
  React.useEffect(() => { editingRef.current  = editingId;      }, [editingId]);
  React.useEffect(() => { setSelRef.current   = setSelectedIds; }, [setSelectedIds]);
  React.useEffect(() => { setEdRef.current    = setEditingId;   }, [setEditingId]);

  const clipboardRef = React.useRef([]);

  function clientToDiagramRaw(cx, cy) {
    const rect = svgRef.current.getBoundingClientRect();
    const p = panRef.current, z = zoomRef.current;
    return { x: (cx - rect.left - p.x) / z, y: (cy - rect.top - p.y) / z };
  }

  // ── Keyboard — registered once with [] deps; state via refs ───────────────────
  React.useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space') {
        isSpaceRef.current = true;
        if (svgRef.current) svgRef.current.style.cursor = 'grab';
        return;
      }

      const sel = selectedRef.current;
      const ed  = editingRef.current;

      if ((e.key === 'Delete' || e.key === 'Backspace') && ed === null && sel.length > 0) {
        dispatchRef.current({ type: 'DELETE_SELECTED', ids: sel });
        setSelRef.current([]);
        return;
      }
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') { e.preventDefault(); dispatchRef.current({ type: 'UNDO' }); return; }
      if (e.ctrlKey && (e.shiftKey && e.key === 'z' || e.key === 'y')) { e.preventDefault(); dispatchRef.current({ type: 'REDO' }); return; }

      if (e.ctrlKey && e.key === 'c') {
        const ns = nodesRef.current.filter(n => sel.includes(n.id));
        if (ns.length) clipboardRef.current = ns.map(n => ({ ...n }));
        return;
      }
      if (e.ctrlKey && e.key === 'x') {
        const ns = nodesRef.current.filter(n => sel.includes(n.id));
        if (ns.length) {
          clipboardRef.current = ns.map(n => ({ ...n }));
          dispatchRef.current({ type: 'DELETE_SELECTED', ids: sel });
          setSelRef.current([]);
        }
        return;
      }
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        if (!clipboardRef.current.length) return;
        pasteNodes(clipboardRef.current, 20);
        return;
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (sel.length) dispatchRef.current({ type: 'DUPLICATE_NODES', ids: sel });
        return;
      }
    }

    function onKeyUp(e) {
      if (e.code === 'Space') {
        isSpaceRef.current = false;
        if (svgRef.current) svgRef.current.style.cursor = '';
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []); // safe: all reads via refs

  function pasteNodes(srcNodes, offset = 20) {
    const idMap = {};
    const newNodes = srcNodes.map(n => {
      const newId = 'n' + Date.now() + Math.random().toString(36).slice(2, 6);
      idMap[n.id] = newId;
      return { ...n, id: newId, x: n.x + offset, y: n.y + offset };
    });
    const srcIdSet = new Set(srcNodes.map(n => n.id));
    const newEdges = edgesRef.current
      .filter(e => srcIdSet.has(e.fromId) && srcIdSet.has(e.toId))
      .map(e => ({ ...e, id: 'e' + Date.now() + Math.random().toString(36).slice(2, 6), fromId: idMap[e.fromId], toId: idMap[e.toId] }));
    dispatchRef.current({ type: 'ADD_NODES', nodes: newNodes });
    if (newEdges.length) dispatchRef.current({ type: 'ADD_EDGES', edges: newEdges });
    setSelRef.current(newNodes.map(n => n.id));
    clipboardRef.current = newNodes.map(n => ({ ...n }));
  }

  // ── Scroll to zoom ────────────────────────────────────────────────────────────
  function onWheel(e) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const curZoom = zoomRef.current, curPan = panRef.current;
    const newZoom = Math.max(0.1, Math.min(4, curZoom * factor));
    onPanZoom({
      x: mx - (mx - curPan.x) * (newZoom / curZoom),
      y: my - (my - curPan.y) * (newZoom / curZoom),
    }, newZoom);
  }

  // ── Global mousemove / mouseup — registered ONCE with [] deps ─────────────────
  React.useEffect(() => {
    function onMouseMove(e) {
      const d = dragRef.current;
      if (!d) return;

      if (d.type === 'pan') {
        onPanZoom({ x: panRef.current.x + e.movementX, y: panRef.current.y + e.movementY }, zoomRef.current);
        return;
      }
      if (d.type === 'node-drag') {
        const z = zoomRef.current;
        dispatchRef.current({ type: 'MOVE_NODES', ids: d.ids, dx: e.movementX / z, dy: e.movementY / z });
        return;
      }
      if (d.type === 'group-drag') {
        const z = zoomRef.current;
        dispatchRef.current({ type: 'MOVE_GROUP', id: d.id, dx: e.movementX / z, dy: e.movementY / z });
        return;
      }
      if (d.type === 'resize-node') {
        const z = zoomRef.current;
        const dx = (e.clientX - d.startClientX) / z;
        const dy = (e.clientY - d.startClientY) / z;
        const { origX, origY, origW, origH, handleId } = d;
        let rx = origX, ry = origY, rw = origW, rh = origH;
        if (['ne','se','e'].includes(handleId)) rw = Math.max(40, origW + dx);
        if (['nw','sw','w'].includes(handleId)) { rw = Math.max(40, origW - dx); rx = origX + origW - rw; }
        if (['se','sw','s'].includes(handleId)) rh = Math.max(30, origH + dy);
        if (['nw','ne','n'].includes(handleId)) { rh = Math.max(30, origH - dy); ry = origY + origH - rh; }
        dispatchRef.current({ type: 'RESIZE_NODE_FULL', id: d.nodeId, x: rx, y: ry, w: rw, h: rh });
        return;
      }
      if (d.type === 'box-select') {
        const svgRect = svgRef.current.getBoundingClientRect();
        d.ex = e.clientX - svgRect.left;
        d.ey = e.clientY - svgRect.top;
        dragRef.current = { ...d };
        setBoxSel({ x: d.sx, y: d.sy, ex: d.ex, ey: d.ey });
        return;
      }
      if (d.type === 'edge-drag') {
        const pos = clientToDiagramRaw(e.clientX, e.clientY);
        const snap = findSnapTarget(nodesRef.current, pos.x, pos.y, d.fromId);
        dragRef.current = { ...d, ex: pos.x, ey: pos.y, snap };
        setEdgePreview({ ...dragRef.current });
        return;
      }
    }

    function onMouseUp(e) {
      const d = dragRef.current;
      dragRef.current = null;
      if (!d) return;

      if (['node-drag','group-drag','resize-node'].includes(d.type)) {
        dispatchRef.current({ type: 'COMMIT_MOVE' });
        return;
      }
      if (d.type === 'box-select') {
        setBoxSel(null);
        const p = panRef.current, z = zoomRef.current;
        const bx1 = (Math.min(d.sx, d.ex) - p.x) / z;
        const by1 = (Math.min(d.sy, d.ey) - p.y) / z;
        const bx2 = (Math.max(d.sx, d.ex) - p.x) / z;
        const by2 = (Math.max(d.sy, d.ey) - p.y) / z;
        const ids = nodesRef.current
          .filter(n => rectContains(bx1, by1, bx2 - bx1, by2 - by1, n.x, n.y, n.w, n.h))
          .map(n => n.id);
        setSelRef.current(ids);
        return;
      }
      if (d.type === 'edge-drag') {
        setEdgePreview(null);
        if (d.snap) {
          dispatchRef.current({ type: 'ADD_EDGE', edge: { id: 'e'+Date.now(), fromId: d.fromId, fromPort: d.fromPort, toId: d.snap.node.id, toPort: d.snap.port, label: '' } });
          return;
        }
        const pos = clientToDiagramRaw(e.clientX, e.clientY);
        const BUF = 14;
        const target = nodesRef.current.find(n =>
          pos.x >= n.x - BUF && pos.x <= n.x + n.w + BUF &&
          pos.y >= n.y - BUF && pos.y <= n.y + n.h + BUF &&
          n.id !== d.fromId
        );
        if (target) {
          dispatchRef.current({ type: 'ADD_EDGE', edge: { id: 'e'+Date.now(), fromId: d.fromId, fromPort: d.fromPort, toId: target.id, toPort: nearestPort(target, pos.x, pos.y), label: '' } });
        }
        return;
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []); // [] — eliminates stale closure bugs from old [nodes, dispatch] deps

  const [boxSel, setBoxSel]         = React.useState(null);
  const [edgePreview, setEdgePreview] = React.useState(null);

  // ── Canvas background mousedown ───────────────────────────────────────────────
  function onSvgMouseDown(e) {
    if (e.button === 1 || isSpaceRef.current) { dragRef.current = { type: 'pan' }; return; }
    if (e.button !== 0) return;

    const pos = clientToDiagramRaw(e.clientX, e.clientY);

    if (activeTool === 'rect' || activeTool === 'diamond' || activeTool === 'circle') {
      const shapeDef = window.FlowChart?.SHAPE_REGISTRY?.get(activeTool);
      const dw = shapeDef?.defaultW ?? 160, dh = shapeDef?.defaultH ?? 60;
      dispatch({
        type: 'ADD_NODE',
        node: {
          id: 'n' + Date.now(), type: activeTool,
          x: pos.x - dw / 2, y: pos.y - dh / 2, w: dw, h: dh,
          label: activeTool === 'diamond' ? 'decision?' : activeTool === 'circle' ? 'step' : 'new step',
          style: { fontSize: 14, fontWeight: 'normal', fontFamily: 'Inter, sans-serif', textColor: '#374151', fill: '#f9fafb', stroke: '#d1d5db' },
        }
      });
      return;
    }

    // Custom shapes via registry
    const customShape = window.FlowChart?.SHAPE_REGISTRY?.get(activeTool);
    if (customShape) {
      dispatch({
        type: 'ADD_NODE',
        node: { id: 'n'+Date.now(), type: activeTool, x: pos.x-(customShape.defaultW??160)/2, y: pos.y-(customShape.defaultH??60)/2, w: customShape.defaultW??160, h: customShape.defaultH??60, label: customShape.label||'node', style: { fontSize: 14, fontWeight: 'normal', fontFamily: 'Inter, sans-serif', textColor: '#374151', fill: '#f9fafb', stroke: '#d1d5db' }, meta: {} }
      });
      return;
    }

    if (activeTool === 'select') {
      setSelectedIds([]);
      const svgRect = svgRef.current.getBoundingClientRect();
      dragRef.current = { type: 'box-select', sx: e.clientX-svgRect.left, sy: e.clientY-svgRect.top, ex: e.clientX-svgRect.left, ey: e.clientY-svgRect.top };
    }
  }

  function onNodeMouseDown(nodeId, e) {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    const next = e.shiftKey
      ? (selectedIds.includes(nodeId) ? selectedIds.filter(i => i !== nodeId) : [...selectedIds, nodeId])
      : (selectedIds.includes(nodeId) ? selectedIds : [nodeId]);
    setSelectedIds(next);
    dragRef.current = { type: 'node-drag', ids: next };
  }

  function onEdgeMouseDown(edgeId, e) {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    setSelectedIds([edgeId]);
  }

  function onGroupMouseDown(groupId, e) {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    setSelectedIds([groupId]);
    dragRef.current = { type: 'group-drag', id: groupId };
  }

  function onResizeStart(nodeId, handleId, e) {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    dragRef.current = { type: 'resize-node', nodeId, handleId, startClientX: e.clientX, startClientY: e.clientY, origX: node.x, origY: node.y, origW: node.w, origH: node.h };
  }

  function onPortDragStart(nodeId, port, e) {
    e.stopPropagation();
    const sp = getPortPos(nodes.find(n => n.id === nodeId), port);
    dragRef.current = { type: 'edge-drag', fromId: nodeId, fromPort: port, sx: sp.x, sy: sp.y, ex: sp.x, ey: sp.y };
    setEdgePreview({ ...dragRef.current });
  }

  function onNodeDoubleClick(nodeId, e) {
    e.stopPropagation();
    setEditingId(nodeId);
  }

  function onEditLabel(id, newLabel) {
    if (newLabel !== null) {
      const isNode = nodesRef.current.some(n => n.id === id);
      dispatch({ type: isNode ? 'UPDATE_NODE_LABEL' : 'UPDATE_EDGE_LABEL', id, label: newLabel });
    }
    setEditingId(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────────────
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const boxSelRect = boxSel ? {
    x: Math.min(boxSel.x, boxSel.ex), y: Math.min(boxSel.y, boxSel.ey),
    w: Math.abs(boxSel.ex - boxSel.x), h: Math.abs(boxSel.ey - boxSel.y),
  } : null;

  return (
    <div className="canvas-wrap" style={{ background: 'var(--gray-50)', position: 'relative' }}>
      <svg
        ref={svgRef}
        onMouseDown={onSvgMouseDown}
        onWheel={onWheel}
        style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
      >
        <SvgDefs />
        <defs>
          <pattern id="dots" x={pan.x % (20 * zoom)} y={pan.y % (20 * zoom)} width={20 * zoom} height={20 * zoom} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={0.8} fill="var(--gray-300)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />

        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {groups.map(g => (
            <GroupEl key={g.id} group={g}
              selected={selectedIds.includes(g.id)} activeTool={activeTool}
              onMouseDown={e => onGroupMouseDown(g.id, e)} />
          ))}
          {edges.map(edge => {
            const src = nodeMap[edge.fromId], dst = nodeMap[edge.toId];
            if (!src || !dst) return null;
            return <EdgeEl key={edge.id} edge={edge} srcNode={src} dstNode={dst}
              selected={selectedIds.includes(edge.id)} activeTool={activeTool}
              onMouseDown={e => onEdgeMouseDown(edge.id, e)}
              editingId={editingId} onEditLabel={onEditLabel} />;
          })}
          {nodes.map(node => (
            <NodeShape key={node.id} node={node}
              selected={selectedIds.includes(node.id)} activeTool={activeTool}
              onMouseDown={e => onNodeMouseDown(node.id, e)}
              onDoubleClick={e => onNodeDoubleClick(node.id, e)}
              editingId={editingId} onEditLabel={onEditLabel}
              onPortDragStart={onPortDragStart} onResizeStart={onResizeStart} />
          ))}
          {edgePreview && (() => {
            const srcNode = nodeMap[edgePreview.fromId];
            if (!srcNode) return null;
            const sp = getPortPos(srcNode, edgePreview.fromPort);
            const snap = edgePreview.snap;
            const ex = snap ? snap.pos.x : edgePreview.ex;
            const ey = snap ? snap.pos.y : edgePreview.ey;
            const toPort = snap ? snap.port : snapGuessPort(edgePreview.fromPort);
            return (
              <g>
                <path d={cubicBezierPathFromPoints(sp.x, sp.y, edgePreview.fromPort, ex, ey, toPort)} className="edge-preview" markerEnd="url(#arrow-blue)" />
                {snap && <circle cx={snap.pos.x} cy={snap.pos.y} r={6} fill="#3b82f6" opacity={0.8} style={{ pointerEvents: 'none' }} />}
              </g>
            );
          })()}
        </g>

        {boxSelRect && (
          <rect className="sel-box"
            x={boxSelRect.x} y={boxSelRect.y}
            width={boxSelRect.w} height={boxSelRect.h}
          />
        )}
      </svg>

      {/* Context toolbar — HTML overlay positioned in fixed screen coords */}
      <ContextToolbar
        nodes={nodes}
        edges={edges}
        selectedIds={selectedIds}
        dispatch={dispatch}
        setSelectedIds={setSelectedIds}
        pan={pan}
        zoom={zoom}
        svgRef={svgRef}
      />
    </div>
  );
}
