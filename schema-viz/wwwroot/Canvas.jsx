// ── Canvas ────────────────────────────────────────────────────────────────────
// Scrollable canvas surface with draggable TableNodes and SVG FK bezier lines.
// Drag is owned here so FK lines can track the in-flight position in real time.

const CANVAS_W   = 2600;
const CANVAS_H   = 1800;
const CURVE_CTRL = 80; // bezier horizontal control-point offset

const TABLE_PAD = 40; // padding around the bounding box when fitting to view

const ZOOM_LEVELS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
const ZOOM_DEFAULT_IDX = 6; // 1.0

function Canvas({ schema, selectedTableId, onSelectTable, onPositionChange, onNameChange, onAddColumn, onAddTable, onAutoArrange }) {
  const scrollRef = React.useRef(null);
  const innerRef  = React.useRef(null); // for PNG export
  const [zoomIdx, setZoomIdx] = React.useState(ZOOM_DEFAULT_IDX);
  const zoom = ZOOM_LEVELS[zoomIdx];

  function zoomIn()  { setZoomIdx(i => Math.min(i + 1, ZOOM_LEVELS.length - 1)); }
  function zoomOut() { setZoomIdx(i => Math.max(i - 1, 0)); }
  function zoomReset() { setZoomIdx(ZOOM_DEFAULT_IDX); }

  // ── Export as PNG ─────────────────────────────────────────────────────────
  const [exporting, setExporting] = React.useState(false);

  async function exportPng() {
    const el = innerRef.current;
    if (!el || typeof html2canvas === 'undefined' || schema.tables.length === 0) return;
    setExporting(true);
    try {
      const PAD  = 40;
      const SCALE = 2;

      // Compute bounding box of all tables (unscaled coordinates)
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const t of schema.tables) {
        const h = HEADER_HEIGHT + t.columns.length * COL_ROW_HEIGHT + FOOTER_HEIGHT;
        if (t.x            < minX) minX = t.x;
        if (t.y            < minY) minY = t.y;
        if (t.x + TABLE_WIDTH > maxX) maxX = t.x + TABLE_WIDTH;
        if (t.y + h        > maxY) maxY = t.y + h;
      }
      const cropX = Math.max(0, minX - PAD);
      const cropY = Math.max(0, minY - PAD);
      const cropW = maxX - minX + PAD * 2;
      const cropH = maxY - minY + PAD * 2;

      // Reset zoom for crisp 1:1 capture
      const prevTransform = el.style.transform;
      el.style.transform = 'scale(1)';

      // Capture the full element, then manually crop via a second canvas
      const full = await html2canvas(el, {
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue('--gray-100').trim() || '#f3f4f6',
        scale: SCALE,
        useCORS: true,
        logging: false,
      });

      el.style.transform = prevTransform;

      // Slice to the bounding box
      const out = document.createElement('canvas');
      out.width  = cropW * SCALE;
      out.height = cropH * SCALE;
      out.getContext('2d').drawImage(
        full,
        cropX * SCALE, cropY * SCALE, cropW * SCALE, cropH * SCALE,
        0, 0, cropW * SCALE, cropH * SCALE
      );

      const link = document.createElement('a');
      link.download = 'schema.png';
      link.href = out.toDataURL('image/png');
      link.click();
    } finally {
      setExporting(false);
    }
  }

  // ── Fit to view ───────────────────────────────────────────────────────────
  function fitToView() {
    const el = scrollRef.current;
    if (!el || schema.tables.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const t of schema.tables) {
      const nodeH = HEADER_HEIGHT + t.columns.length * COL_ROW_HEIGHT + FOOTER_HEIGHT;
      if (t.x < minX) minX = t.x;
      if (t.y < minY) minY = t.y;
      if (t.x + TABLE_WIDTH > maxX) maxX = t.x + TABLE_WIDTH;
      if (t.y + nodeH      > maxY) maxY = t.y + nodeH;
    }

    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const vpW = el.clientWidth;
    const vpH = el.clientHeight;

    // Scroll so the bounding box is centred in the viewport
    const scrollLeft = minX - TABLE_PAD - (vpW - contentW - TABLE_PAD * 2) / 2;
    const scrollTop  = minY - TABLE_PAD - (vpH - contentH - TABLE_PAD * 2) / 2;

    el.scrollTo({ left: Math.max(0, scrollLeft), top: Math.max(0, scrollTop), behavior: 'smooth' });
  }

  // ── Ctrl+scroll zoom ─────────────────────────────────────────────────────
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onWheel(e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      // Save scroll centre before zoom so we can restore it after
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const contentX = (el.scrollLeft + mouseX) / ZOOM_LEVELS[zoomIdx];
      const contentY = (el.scrollTop  + mouseY) / ZOOM_LEVELS[zoomIdx];
      setZoomIdx(prev => {
        const next = e.deltaY < 0
          ? Math.min(prev + 1, ZOOM_LEVELS.length - 1)
          : Math.max(prev - 1, 0);
        // Re-scroll after React re-renders so mouse stays over same content point
        requestAnimationFrame(() => {
          if (!scrollRef.current) return;
          const newZoom = ZOOM_LEVELS[next];
          scrollRef.current.scrollLeft = contentX * newZoom - mouseX;
          scrollRef.current.scrollTop  = contentY * newZoom - mouseY;
        });
        return next;
      });
    }
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomIdx]);

  // ── Middle-mouse pan ──────────────────────────────────────────────────────
  const midPanRef = React.useRef(null);

  React.useEffect(() => {
    function onMidMove(e) {
      if (!midPanRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      el.scrollLeft = midPanRef.current.scrollLeft - (e.clientX - midPanRef.current.mouseX);
      el.scrollTop  = midPanRef.current.scrollTop  - (e.clientY - midPanRef.current.mouseY);
    }
    function onMidUp(e) {
      if (e.button !== 1) return;
      midPanRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    document.addEventListener('mousemove', onMidMove);
    document.addEventListener('mouseup',   onMidUp);
    return () => {
      document.removeEventListener('mousemove', onMidMove);
      document.removeEventListener('mouseup',   onMidUp);
    };
  }, []);

  function handleCanvasMouseDown(e) {
    if (e.button === 1) {
      // Middle mouse — start pan
      e.preventDefault();
      const el = scrollRef.current;
      if (!el) return;
      midPanRef.current = { mouseX: e.clientX, mouseY: e.clientY, scrollLeft: el.scrollLeft, scrollTop: el.scrollTop };
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      return;
    }
    handlePanMouseDown(e);
  }

  // ── Space+drag pan state ─────────────────────────────────────────────────
  const [spaceDown, setSpaceDown] = React.useState(false);
  const panningRef    = React.useRef(false);
  const panStartRef   = React.useRef(null); // { mouseX, mouseY, scrollLeft, scrollTop }

  React.useEffect(() => {
    function onKeyDown(e) {
      if (e.code !== 'Space') return;
      // Don't intercept space inside text inputs/textareas/selects
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault(); // always block — including repeat events while held
      if (!e.repeat) setSpaceDown(true);
    }
    function onKeyUp(e) {
      if (e.code === 'Space') {
        setSpaceDown(false);
        panningRef.current = false;
        panStartRef.current = null;
        if (scrollRef.current) scrollRef.current.style.cursor = '';
        document.body.style.userSelect = '';
      }
    }
    // capture:true so we intercept before the scroll container
    // gets the event and triggers native keyboard scroll
    window.addEventListener('keydown', onKeyDown, { capture: true });
    window.addEventListener('keyup',   onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true });
      window.removeEventListener('keyup',   onKeyUp);
    };
  }, []);

  function handlePanMouseDown(e) {
    if (!spaceDown) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    panningRef.current = true;
    panStartRef.current = {
      mouseX: e.clientX, mouseY: e.clientY,
      scrollLeft: el.scrollLeft, scrollTop: el.scrollTop,
    };
    el.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }

  React.useEffect(() => {
    function onPanMove(e) {
      if (!panningRef.current || !panStartRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      el.scrollLeft = panStartRef.current.scrollLeft - (e.clientX - panStartRef.current.mouseX);
      el.scrollTop  = panStartRef.current.scrollTop  - (e.clientY - panStartRef.current.mouseY);
    }
    function onPanUp() {
      if (!panningRef.current) return;
      panningRef.current = false;
      panStartRef.current = null;
      const el = scrollRef.current;
      if (el) el.style.cursor = spaceDown ? 'grab' : '';
      document.body.style.userSelect = '';
    }
    document.addEventListener('mousemove', onPanMove);
    document.addEventListener('mouseup',   onPanUp);
    return () => {
      document.removeEventListener('mousemove', onPanMove);
      document.removeEventListener('mouseup',   onPanUp);
    };
  }, [spaceDown]);

  // ── Drag state (owned by Canvas so FK lines update live) ─────────────────
  const [draggingId, setDraggingId]   = React.useState(null);
  const [dragOffset, setDragOffset]   = React.useState({ dx: 0, dy: 0 });
  const dragStartRef                  = React.useRef(null); // { mouseX, mouseY }
  const onPositionChangeRef           = React.useRef(onPositionChange);
  onPositionChangeRef.current         = onPositionChange;

  // Committed base positions (needed in mouseup without stale closure)
  const basePosRef = React.useRef({});
  React.useEffect(() => {
    const m = {};
    for (const t of schema.tables) m[t.id] = { x: t.x, y: t.y };
    basePosRef.current = m;
  }, [schema.tables]);

  React.useEffect(() => {
    function onMove(e) {
      if (!draggingId || !dragStartRef.current) return;
      setDragOffset({
        dx: e.clientX - dragStartRef.current.mouseX,
        dy: e.clientY - dragStartRef.current.mouseY,
      });
    }
    function onUp(e) {
      if (!draggingId || !dragStartRef.current) return;
      const dx   = e.clientX - dragStartRef.current.mouseX;
      const dy   = e.clientY - dragStartRef.current.mouseY;
      const base = basePosRef.current[draggingId] || { x: 0, y: 0 };
      onPositionChangeRef.current(draggingId, Math.max(0, base.x + dx), Math.max(0, base.y + dy));
      setDraggingId(null);
      setDragOffset({ dx: 0, dy: 0 });
      dragStartRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };
  }, [draggingId]);

  function handleDragStart(id, e) {
    if (spaceDown) return; // pan mode takes priority
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(id);
    setDragOffset({ dx: 0, dy: 0 });
    dragStartRef.current = { mouseX: e.clientX, mouseY: e.clientY };
    document.body.style.cursor    = 'grabbing';
    document.body.style.userSelect = 'none';
  }

  // Visual position of a table — includes live drag offset for the dragged node
  function visualPos(table) {
    if (table.id === draggingId) {
      return {
        x: Math.max(0, table.x + dragOffset.dx),
        y: Math.max(0, table.y + dragOffset.dy),
      };
    }
    return { x: table.x, y: table.y };
  }

  // FK lines — recomputed every render while dragging (cheap coordinate math)
  const fkLines = [];
  for (const table of schema.tables) {
    const fromPos = visualPos(table);
    for (const fk of table.foreignKeys) {
      const fromColIdx = table.columns.findIndex(
        c => c.name.toLowerCase() === fk.fromColumn.toLowerCase()
      );
      const toTable = schema.tables.find(
        t => t.name.toLowerCase() === fk.toTable.toLowerCase()
      );
      if (!toTable || fromColIdx < 0) continue;
      const toColIdx = toTable.columns.findIndex(
        c => c.name.toLowerCase() === fk.toColumn.toLowerCase()
      );
      if (toColIdx < 0) continue;
      const toPos = visualPos(toTable);
      fkLines.push({
        id: fk.id,
        fromX: fromPos.x + TABLE_WIDTH,
        fromY: fromPos.y + HEADER_HEIGHT + fromColIdx * COL_ROW_HEIGHT + COL_ROW_HEIGHT / 2,
        toX: toPos.x,
        toY: toPos.y + HEADER_HEIGHT + toColIdx * COL_ROW_HEIGHT + COL_ROW_HEIGHT / 2,
      });
    }
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Scrollable canvas surface */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-auto"
        style={{ background: 'var(--gray-100)', cursor: spaceDown ? 'grab' : '' }}
        onClick={() => !spaceDown && onSelectTable(null)}
        onMouseDown={handleCanvasMouseDown}
      >
        {/* sizer div expands/contracts the scroll area to match current zoom */}
        <div style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom, position: 'relative', flexShrink: 0 }}>
        <div
          ref={innerRef}
          style={{
          position: 'absolute',
          top: 0, left: 0,
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}>

          {/* ── Dot-grid background ── */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1" fill="var(--gray-300)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
          </svg>

          {/* ── FK bezier lines ── */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
          >
            {fkLines.map(({ id, fromX, fromY, toX, toY }) => {
              const cx1 = fromX + CURVE_CTRL;
              const cy1 = fromY;
              const cx2 = toX - CURVE_CTRL;
              const cy2 = toY;
              // Label positions: 20% along curve from each end
              const lx1 = fromX + (cx1 - fromX) * 0.35 + 0;
              const ly1 = fromY - 10; // '1' label
              const lx2 = toX   - (toX - cx2) * 0.35;
              const ly2 = toY   - 10; // 'N' label
              return (
                <g key={id}>
                  <path
                    d={`M ${fromX} ${fromY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toX} ${toY}`}
                    fill="none"
                    stroke="var(--gray-400)"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                  />
                  <circle cx={fromX} cy={fromY} r="3.5" fill="var(--gray-400)" />
                  <circle cx={toX}   cy={toY}   r="3.5" fill="var(--gray-600)" />
                  <text x={lx1} y={ly1} textAnchor="middle" fontSize="10" fontFamily="monospace"
                    fill="var(--gray-500)" style={{ userSelect: 'none' }}>1</text>
                  <text x={lx2} y={ly2} textAnchor="middle" fontSize="10" fontFamily="monospace"
                    fill="var(--gray-500)" style={{ userSelect: 'none' }}>N</text>
                </g>
              );
            })}
          </svg>

          {/* ── Table nodes ── */}
          {schema.tables.map(table => {
            const { x, y } = visualPos(table);
            return (
              <TableNode
                key={table.id}
                table={table}
                x={x}
                y={y}
                isSelected={table.id === selectedTableId}
                onSelect={onSelectTable}
                onDragStart={handleDragStart}
                panMode={spaceDown}
                onNameChange={onNameChange}
                onAddColumn={onAddColumn}
              />
            );
          })}

          {/* ── Empty state ── */}
          {schema.tables.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Icon name="database" size={36} className="text-gray-300 block mx-auto mb-4" />
                <p className="text-sm text-gray-400 lowercase">paste sql ddl in the sidebar to import tables</p>
                <p className="text-xs text-gray-300 mt-1 lowercase">or use the "add table" button below</p>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* ── Overlay buttons (float over canvas, outside scroll container) ── */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 20 }} className="flex items-center gap-2">
        {/* zoom controls */}
        <div className="flex items-center bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
          <button
            onClick={e => { e.stopPropagation(); zoomOut(); }}
            disabled={zoomIdx === 0}
            aria-label="zoom out"
            title="zoom out"
            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-gray-200"
          >
            <Icon name="minus" size={13} className="" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); zoomReset(); }}
            title="reset zoom"
            className="flex items-center justify-center h-8 px-2 text-[10px] font-mono text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors border-r border-gray-200 tabular-nums w-11"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={e => { e.stopPropagation(); zoomIn(); }}
            disabled={zoomIdx === ZOOM_LEVELS.length - 1}
            aria-label="zoom in"
            title="zoom in"
            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="plus" size={13} className="" />
          </button>
        </div>
        {schema.tables.length > 0 && (
          <button
            onClick={e => { e.stopPropagation(); exportPng(); }}
            disabled={exporting}
            aria-label="export png"
            title="export as PNG"
            className="flex items-center justify-center bg-white border border-gray-300 w-9 h-9 rounded-sm shadow-sm hover:border-gray-500 hover:text-gray-800 text-gray-500 transition-colors disabled:opacity-50"
          >
            {exporting
              ? <Spinner size={14} />
              : <Icon name="image" size={16} className="" />}
          </button>
        )}
        {schema.tables.length > 0 && (
          <button
            onClick={e => { e.stopPropagation(); onAutoArrange(); fitToView(); }}
            aria-label="auto arrange"
            title="auto arrange"
            className="flex items-center justify-center bg-white border border-gray-300 w-9 h-9 rounded-sm shadow-sm hover:border-gray-500 hover:text-gray-800 text-gray-500 transition-colors"
          >
            <Icon name="tree-structure" size={16} className="" />
          </button>
        )}
        {schema.tables.length > 0 && (
          <button
            onClick={e => { e.stopPropagation(); fitToView(); }}
            aria-label="fit to view"
            title="fit to view"
            className="flex items-center justify-center bg-white border border-gray-300 w-9 h-9 rounded-sm shadow-sm hover:border-gray-500 hover:text-gray-800 text-gray-500 transition-colors"
          >
            <Icon name="frame-corners" size={16} className="" />
          </button>
        )}
        <button
          onClick={e => { e.stopPropagation(); onAddTable(); }}
          className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-sm shadow-sm hover:border-gray-500 hover:text-gray-800 transition-colors lowercase"
        >
          <Icon name="plus" size={14} className="" />
          add table
        </button>
      </div>
    </div>
  );
}
