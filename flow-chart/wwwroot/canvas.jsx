// canvas.jsx — SVG Canvas with full interaction model
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
  // t=0.5
  const t = 0.5;
  const mt = 1 - t;
  const x = mt*mt*mt*sx + 3*mt*mt*t*c1x + 3*mt*t*t*c2x + t*t*t*dx;
  const y = mt*mt*mt*sy + 3*mt*mt*t*c1y + 3*mt*t*t*c2y + t*t*t*dy;
  return { x, y };
}

function rectContains(rx, ry, rw, rh, nx, ny, nw, nh) {
  return nx >= rx && ny >= ry && nx + nw <= rx + rw && ny + nh <= ry + rh;
}

function snapGuessPort(fromPort) {
  // Opposite port as default target
  switch (fromPort) {
    case 'top':    return 'bottom';
    case 'bottom': return 'top';
    case 'left':   return 'right';
    case 'right':  return 'left';
    default:       return 'top';
  }
}

// Closest port on a node to a given point (diagram coords)
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

// Snap radius in diagram-space units — used for port proximity detection during edge drag
const PORT_SNAP_RADIUS = 28;

// Find the closest port across all candidate nodes within PORT_SNAP_RADIUS.
// Returns { node, port, pos } or null.
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

// Corner resize handle descriptors
const RESIZE_HANDLES = [
  { id: 'nw', fx: (x,y,w,h) => x,     fy: (x,y,w,h) => y,     cursor: 'nwse-resize' },
  { id: 'ne', fx: (x,y,w,h) => x+w,   fy: (x,y,w,h) => y,     cursor: 'nesw-resize' },
  { id: 'se', fx: (x,y,w,h) => x+w,   fy: (x,y,w,h) => y+h,   cursor: 'nwse-resize' },
  { id: 'sw', fx: (x,y,w,h) => x,     fy: (x,y,w,h) => y+h,   cursor: 'nesw-resize' },
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
        {/* Visible dot — pointer-events off so the hit circle below takes events */}
        <circle cx={pos.x} cy={pos.y} r={5} className="port-dot" style={{ pointerEvents: 'none' }} />
        {/* Transparent hit area — always captures mouse */}
        <circle cx={pos.x} cy={pos.y} r={8} fill="transparent"
          style={{ cursor: 'crosshair' }}
          onMouseDown={e => handlePortMouseDown(e, port)} />
      </g>
    );
  });

  // Corner resize handles — only shown when selected in select mode
  const resizeHandles = (selected && activeTool === 'select') ? RESIZE_HANDLES.map(h => (
    <rect key={h.id}
      x={h.fx(x,y,w,h) - 4} y={h.fy(x,y,w,h) - 4}
      width={8} height={8}
      className="resize-handle"
      style={{ cursor: h.cursor }}
      onMouseDown={e => { e.stopPropagation(); onResizeStart(id, h.id, e); }}
    />
  )) : null;

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
        {resizeHandles}
      </g>
    );
  }

  // default: rect
  return (
    <g className={`node-group${selected ? ' node-selected' : ''}`}
      onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}
      style={{ cursor: activeTool === 'select' ? 'move' : 'default' }}>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {!isEditing && <text x={x + w / 2} y={y + h / 2} style={sharedTextStyle}>{label}</text>}
      {editorEl}
      {portEls}
      {resizeHandles}
    </g>
  );
}

// ── Edge component ────────────────────────────────────────────────────────────

function EdgeEl({ edge, srcNode, dstNode, selected, activeTool, onMouseDown, editingId, onEditLabel }) {
  const { id, fromPort, toPort, label } = edge;
  const pathD = cubicBezierPath(srcNode, fromPort, dstNode, toPort);
  const sp = getPortPos(srcNode, fromPort);
  const dp = getPortPos(dstNode, toPort);
  const mid = bezierMid(sp.x, sp.y, fromPort, dp.x, dp.y, toPort);
  const isEditing = editingId === id;

  return (
    <g className={selected ? 'edge-selected' : ''} style={{ cursor: activeTool === 'select' ? 'pointer' : 'default' }}>
      {/* invisible wide hit area */}
      <path d={pathD} className="edge-hit" onMouseDown={onMouseDown} />
      {/* visible stroke */}
      <path d={pathD} fill="none" stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#arrow)" onMouseDown={onMouseDown} />
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

// ── Defs (arrow marker) ───────────────────────────────────────────────────────

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

// ── Canvas ─────────────────────────────────────────────────────────────────────

function Canvas({
  nodes, edges, groups,
  dispatch, activeTool,
  selectedIds, setSelectedIds,
  pan, zoom, onPanZoom,
  editingId, setEditingId,
}) {
  const svgRef     = React.useRef(null);
  const dragRef    = React.useRef(null);   // active drag state
  const isSpaceRef = React.useRef(false); // space held for pan
  // Refs that always hold the current pan/zoom so event-handler closures stay fresh
  const panRef  = React.useRef(pan);
  const zoomRef = React.useRef(zoom);
  React.useEffect(() => { panRef.current  = pan;  }, [pan]);
  React.useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  // ── Client → diagram coordinate conversion ──────────────────────────────────
  function clientToDiagram(cx, cy) {
    const rect = svgRef.current.getBoundingClientRect();
    const p = panRef.current, z = zoomRef.current;
    return {
      x: (cx - rect.left - p.x) / z,
      y: (cy - rect.top  - p.y) / z,
    };
  }

  // ── Keyboard: space for pan mode ─────────────────────────────────────────────
  React.useEffect(() => {
    function onKeyDown(e) {
      if (e.code === 'Space' && document.activeElement === document.body) {
        isSpaceRef.current = true;
        if (svgRef.current) svgRef.current.style.cursor = 'grab';
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && editingId === null && selectedIds.length > 0) {
        dispatch({ type: 'DELETE_SELECTED', ids: selectedIds });
        setSelectedIds([]);
      }
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') { e.preventDefault(); dispatch({ type: 'UNDO' }); }
      if (e.ctrlKey && (e.shiftKey && e.key === 'z' || e.key === 'y')) { e.preventDefault(); dispatch({ type: 'REDO' }); }
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
  }, [editingId, selectedIds, dispatch]);

  // ── Scroll to zoom ────────────────────────────────────────────────────────────
  function onWheel(e) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const curZoom = zoomRef.current;
    const curPan  = panRef.current;
    const newZoom = Math.max(0.1, Math.min(4, curZoom * factor));
    // Adjust pan so the point under cursor stays fixed
    const newPanX = mx - (mx - curPan.x) * (newZoom / curZoom);
    const newPanY = my - (my - curPan.y) * (newZoom / curZoom);
    onPanZoom({ x: newPanX, y: newPanY }, newZoom);
  }

  // ── Global mousemove / mouseup ────────────────────────────────────────────────
  React.useEffect(() => {
    function onMouseMove(e) {
      const d = dragRef.current;
      if (!d) return;

      if (d.type === 'pan') {
        const p = panRef.current, z = zoomRef.current;
        onPanZoom({ x: p.x + e.movementX, y: p.y + e.movementY }, z);
        return;
      }

      if (d.type === 'node-drag') {
        const z = zoomRef.current;
        const dx = e.movementX / z;
        const dy = e.movementY / z;
        dispatch({ type: 'MOVE_NODES', ids: d.ids, dx, dy });
        return;
      }

      if (d.type === 'group-drag') {
        const z = zoomRef.current;
        const dx = e.movementX / z;
        const dy = e.movementY / z;
        dispatch({ type: 'MOVE_GROUP', id: d.id, dx, dy });
        return;
      }

      if (d.type === 'resize-node') {
        const z = zoomRef.current;
        const dx = (e.clientX - d.startClientX) / z;
        const dy = (e.clientY - d.startClientY) / z;
        const { origX, origY, origW, origH, handleId } = d;
        let rx = origX, ry = origY, rw = origW, rh = origH;
        // East edge moves with dx
        if (handleId === 'ne' || handleId === 'se') rw = Math.max(40, origW + dx);
        // West edge: origin shifts and width shrinks
        if (handleId === 'nw' || handleId === 'sw') {
          rw = Math.max(40, origW - dx);
          rx = origX + origW - rw;
        }
        // South edge moves with dy
        if (handleId === 'se' || handleId === 'sw') rh = Math.max(30, origH + dy);
        // North edge: origin shifts and height shrinks
        if (handleId === 'nw' || handleId === 'ne') {
          rh = Math.max(30, origH - dy);
          ry = origY + origH - rh;
        }
        dispatch({ type: 'RESIZE_NODE_FULL', id: d.nodeId, x: rx, y: ry, w: rw, h: rh });
        return;
      }

      if (d.type === 'box-select') {
        const svgRect = svgRef.current.getBoundingClientRect();
        d.ex = e.clientX - svgRect.left;
        d.ey = e.clientY - svgRect.top;
        dragRef.current = { ...d };
        // Force re-render for selection box
        setBoxSel({ x: d.sx, y: d.sy, ex: d.ex, ey: d.ey });
        return;
      }

      if (d.type === 'edge-drag') {
        const pos = clientToDiagram(e.clientX, e.clientY);
        const snap = findSnapTarget(nodes, pos.x, pos.y, d.fromId);
        dragRef.current = { ...d, ex: pos.x, ey: pos.y, snap };
        setEdgePreview({ ...dragRef.current });
        return;
      }
    }

    function onMouseUp(e) {
      const d = dragRef.current;
      dragRef.current = null;

      if (!d) return;

      if (d.type === 'node-drag') {
        dispatch({ type: 'COMMIT_MOVE' });
        return;
      }

      if (d.type === 'group-drag') {
        dispatch({ type: 'COMMIT_MOVE' });
        return;
      }

      if (d.type === 'resize-node') {
        dispatch({ type: 'COMMIT_MOVE' });
        return;
      }

      if (d.type === 'box-select') {
        setBoxSel(null);
        // Determine which nodes fall inside box (in screen coords)
        const p = panRef.current, z = zoomRef.current;
        const bx1 = (Math.min(d.sx, d.ex) - p.x) / z;
        const by1 = (Math.min(d.sy, d.ey) - p.y) / z;
        const bx2 = (Math.max(d.sx, d.ex) - p.x) / z;
        const by2 = (Math.max(d.sy, d.ey) - p.y) / z;
        const bw = bx2 - bx1, bh = by2 - by1;
        const ids = nodes
          .filter(n => rectContains(bx1, by1, bw, bh, n.x, n.y, n.w, n.h))
          .map(n => n.id);
        setSelectedIds(ids);
        return;
      }

      if (d.type === 'edge-drag') {
        setEdgePreview(null);

        // Prefer the port-proximity snap computed during the last mousemove
        if (d.snap) {
          dispatch({
            type: 'ADD_EDGE',
            edge: { id: 'e' + Date.now(), fromId: d.fromId, fromPort: d.fromPort, toId: d.snap.node.id, toPort: d.snap.port, label: '' },
          });
          return;
        }

        // Fallback: buffered bounding-box hit-test (catches releases inside a node body)
        const pos = clientToDiagram(e.clientX, e.clientY);
        const BUF = 14;
        const target = nodes.find(n =>
          pos.x >= n.x - BUF && pos.x <= n.x + n.w + BUF &&
          pos.y >= n.y - BUF && pos.y <= n.y + n.h + BUF &&
          n.id !== d.fromId
        );
        if (target) {
          const toPort = nearestPort(target, pos.x, pos.y);
          dispatch({
            type: 'ADD_EDGE',
            edge: { id: 'e' + Date.now(), fromId: d.fromId, fromPort: d.fromPort, toId: target.id, toPort, label: '' },
          });
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
  }, [nodes, dispatch]);

  // ── Box select state ──────────────────────────────────────────────────────────
  const [boxSel, setBoxSel] = React.useState(null);
  // ── Edge preview (drag in progress) ──────────────────────────────────────────
  const [edgePreview, setEdgePreview] = React.useState(null);

  // ── Canvas mouse down (background click → pan or box-select or add-node) ─────
  function onSvgMouseDown(e) {
    if (e.button === 1 || isSpaceRef.current) {
      // Middle-click or space → pan
      dragRef.current = { type: 'pan' };
      return;
    }

    if (e.button !== 0) return;

    // Click on empty canvas
    const svgRect = svgRef.current.getBoundingClientRect();
    const pos = clientToDiagram(e.clientX, e.clientY);

    if (activeTool === 'rect' || activeTool === 'diamond') {
      dispatch({
        type: 'ADD_NODE',
        node: {
          id: 'n' + Date.now(),
          type: activeTool,
          x: pos.x - 80, y: pos.y - 30,
          w: 160, h: 60,
          label: activeTool === 'diamond' ? 'decision?' : 'new step',
          style: { fontSize: 14, fontWeight: 'normal', fontFamily: 'Inter, sans-serif', textColor: '#374151', fill: '#f9fafb', stroke: '#d1d5db' },
        }
      });
      return;
    }

    if (activeTool === 'select') {
      // Deselect and start box-select
      setSelectedIds([]);
      dragRef.current = {
        type: 'box-select',
        sx: e.clientX - svgRect.left,
        sy: e.clientY - svgRect.top,
        ex: e.clientX - svgRect.left,
        ey: e.clientY - svgRect.top,
      };
    }
  }

  // ── Node mouse down ───────────────────────────────────────────────────────────
  function onNodeMouseDown(nodeId, e) {
    if (activeTool !== 'select') return;
    e.stopPropagation();

    const isShift = e.shiftKey;
    let nextSelected;
    if (isShift) {
      nextSelected = selectedIds.includes(nodeId)
        ? selectedIds.filter(id => id !== nodeId)
        : [...selectedIds, nodeId];
    } else {
      nextSelected = selectedIds.includes(nodeId) ? selectedIds : [nodeId];
    }
    setSelectedIds(nextSelected);

    dragRef.current = { type: 'node-drag', ids: nextSelected };
  }

  // ── Edge mouse down ───────────────────────────────────────────────────────────
  function onEdgeMouseDown(edgeId, e) {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    setSelectedIds([edgeId]);
  }

  // ── Group mouse down ──────────────────────────────────────────────────────────
  function onGroupMouseDown(groupId, e) {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    setSelectedIds([groupId]);
    dragRef.current = { type: 'group-drag', id: groupId };
  }

  // ── Resize start ──────────────────────────────────────────────────────────────
  function onResizeStart(nodeId, handleId, e) {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    dragRef.current = {
      type: 'resize-node',
      nodeId, handleId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX: node.x, origY: node.y, origW: node.w, origH: node.h,
    };
  }

  // ── Port start drag ───────────────────────────────────────────────────────────
  function onPortDragStart(nodeId, port, e) {
    // Works regardless of active tool — port dots are always connection points
    e.stopPropagation();
    const srcNode = nodes.find(n => n.id === nodeId);
    const sp = getPortPos(srcNode, port);
    dragRef.current = {
      type: 'edge-drag',
      fromId: nodeId, fromPort: port,
      sx: sp.x, sy: sp.y,
      ex: sp.x, ey: sp.y,
    };
    setEdgePreview({ ...dragRef.current });
  }

  // ── Double-click node to edit ─────────────────────────────────────────────────
  function onNodeDoubleClick(nodeId, e) {
    e.stopPropagation();
    setEditingId(nodeId);
  }

  function onEditLabel(id, newLabel) {
    if (newLabel !== null) {
      const isNode = nodes.some(n => n.id === id);
      dispatch({ type: isNode ? 'UPDATE_NODE_LABEL' : 'UPDATE_EDGE_LABEL', id, label: newLabel });
    }
    setEditingId(null);
  }

  // ── Edge label dblclick ───────────────────────────────────────────────────────
  function onEdgeDblClick(edgeId) {
    setSelectedIds([edgeId]);
    setEditingId(edgeId);
  }

  // ── Render ─────────────────────────────────────────────────────────────────────
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const boxSelRect = boxSel ? {
    x: Math.min(boxSel.x, boxSel.ex),
    y: Math.min(boxSel.y, boxSel.ey),
    w: Math.abs(boxSel.ex - boxSel.x),
    h: Math.abs(boxSel.ey - boxSel.y),
  } : null;

  return (
    <div className="canvas-wrap" style={{ background: 'var(--gray-50)' }}>
      <svg
        ref={svgRef}
        onMouseDown={onSvgMouseDown}
        onWheel={onWheel}
        style={{ cursor: isSpaceRef.current ? 'grab' : (activeTool === 'select' ? 'default' : 'crosshair') }}
      >
        <SvgDefs />

        {/* ── dot-grid background ── */}
        <defs>
          <pattern id="dots" x={pan.x % (20 * zoom)} y={pan.y % (20 * zoom)} width={20 * zoom} height={20 * zoom} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={0.8} fill="var(--gray-300)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />

        {/* ── diagram content ── */}
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>

          {/* Groups (z-order: below nodes) */}
          {groups.map(g => (
            <GroupEl key={g.id} group={g}
              selected={selectedIds.includes(g.id)}
              activeTool={activeTool}
              onMouseDown={e => onGroupMouseDown(g.id, e)}
            />
          ))}

          {/* Edges */}
          {edges.map(edge => {
            const src = nodeMap[edge.fromId];
            const dst = nodeMap[edge.toId];
            if (!src || !dst) return null;
            return (
              <EdgeEl key={edge.id} edge={edge} srcNode={src} dstNode={dst}
                selected={selectedIds.includes(edge.id)}
                activeTool={activeTool}
                onMouseDown={e => onEdgeMouseDown(edge.id, e)}
                editingId={editingId}
                onEditLabel={onEditLabel}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => (
            <NodeShape
              key={node.id}
              node={node}
              selected={selectedIds.includes(node.id)}
              activeTool={activeTool}
              onMouseDown={e => onNodeMouseDown(node.id, e)}
              onDoubleClick={e => onNodeDoubleClick(node.id, e)}
              editingId={editingId}
              onEditLabel={onEditLabel}
              onPortDragStart={onPortDragStart}
              onResizeStart={onResizeStart}
            />
          ))}

          {/* In-progress edge preview — snaps to nearest port when within snap radius */}
          {edgePreview && (() => {
            const srcNode = nodeMap[edgePreview.fromId];
            if (!srcNode) return null;
            const sp = getPortPos(srcNode, edgePreview.fromPort);
            const snap = edgePreview.snap;
            const ex = snap ? snap.pos.x : edgePreview.ex;
            const ey = snap ? snap.pos.y : edgePreview.ey;
            const toPort = snap ? snap.port : snapGuessPort(edgePreview.fromPort);
            const pathD = cubicBezierPathFromPoints(sp.x, sp.y, edgePreview.fromPort, ex, ey, toPort);
            return (
              <g>
                <path d={pathD} className="edge-preview" markerEnd="url(#arrow-blue)" />
                {/* Highlight the snapped port */}
                {snap && <circle cx={snap.pos.x} cy={snap.pos.y} r={6} fill="#3b82f6" opacity={0.8} style={{ pointerEvents: 'none' }} />}
              </g>
            );
          })()}
        </g>

        {/* Box-select overlay (in screen coords, outside the transform group) */}
        {boxSelRect && (
          <rect className="sel-box"
            x={boxSelRect.x} y={boxSelRect.y}
            width={boxSelRect.w} height={boxSelRect.h}
          />
        )}
      </svg>
    </div>
  );
}
