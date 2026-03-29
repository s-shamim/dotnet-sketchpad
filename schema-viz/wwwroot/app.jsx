// ── Dropdown ──────────────────────────────────────────────────────────────────

function Dropdown({ value, onChange, options, placeholder = 'select...', width = 'w-48' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = options.find(o => (o.value ?? o) === value);
  const label = selected ? (selected.label ?? selected) : placeholder;

  return (
    <div className={`relative ${width}`} ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
      >
        <span className={`lowercase ${!value ? 'text-gray-400' : ''}`}>{label}</span>
        <Icon name="caret-down" size={12} className={`text-gray-400 transition-transform ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full border border-gray-200 bg-white shadow-sm rounded-sm z-20">
          {options.map(opt => {
            const v = opt.value ?? opt;
            const l = opt.label ?? opt;
            return (
              <button
                key={v}
                onClick={() => { onChange(v); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors lowercase ${
                  value === v
                    ? 'text-gray-800 bg-gray-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Grid layout helper ────────────────────────────────────────────────────────

const GRID_COLS   = 4;
const GRID_CELL_W = 300;
const GRID_CELL_H = 280;
const GRID_OFF_X  = 40;
const GRID_OFF_Y  = 40;

function gridPosition(existingCount, index) {
  const i = existingCount + index;
  return {
    x: GRID_OFF_X + (i % GRID_COLS) * GRID_CELL_W,
    y: GRID_OFF_Y + Math.floor(i / GRID_COLS) * GRID_CELL_H,
  };
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
  const [mode,  setMode]  = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode',  mode);
  }, [theme, mode]);

  const [schema, setSchema] = React.useState(() => ({
    tables: [
      {
        id: 'demo-users', name: 'users', x: 400, y: 60,
        columns: [
          { id: 'u1', name: 'id',         type: 'INT',          nullable: false, isPK: true  },
          { id: 'u2', name: 'email',       type: 'VARCHAR(255)', nullable: false, isPK: false },
          { id: 'u3', name: 'name',        type: 'VARCHAR(100)', nullable: true,  isPK: false },
          { id: 'u4', name: 'role_id',     type: 'INT',          nullable: true,  isPK: false },
          { id: 'u5', name: 'created_at',  type: 'TIMESTAMP',    nullable: false, isPK: false },
        ],
        foreignKeys: [
          { id: 'fk-u-r', fromColumn: 'role_id', toTable: 'roles', toColumn: 'id' },
        ],
      },
      {
        id: 'demo-roles', name: 'roles', x: 740, y: 235,
        columns: [
          { id: 'r1', name: 'id',    type: 'INT',         nullable: false, isPK: true  },
          { id: 'r2', name: 'label', type: 'VARCHAR(50)', nullable: false, isPK: false },
        ],
        foreignKeys: [],
      },
      {
        id: 'demo-posts', name: 'posts', x: 400, y: 326,
        columns: [
          { id: 'p1', name: 'id',         type: 'INT',  nullable: false, isPK: true  },
          { id: 'p2', name: 'author_id',  type: 'INT',  nullable: false, isPK: false },
          { id: 'p3', name: 'title',      type: 'TEXT', nullable: false, isPK: false },
          { id: 'p4', name: 'body',       type: 'TEXT', nullable: true,  isPK: false },
          { id: 'p5', name: 'created_at', type: 'TIMESTAMP', nullable: false, isPK: false },
        ],
        foreignKeys: [
          { id: 'fk-p-u', fromColumn: 'author_id', toTable: 'users', toColumn: 'id' },
        ],
      },
      {
        id: 'demo-comments', name: 'comments', x: 60, y: 207,
        columns: [
          { id: 'c1', name: 'id',         type: 'INT',  nullable: false, isPK: true  },
          { id: 'c2', name: 'post_id',    type: 'INT',  nullable: false, isPK: false },
          { id: 'c3', name: 'author_id',  type: 'INT',  nullable: false, isPK: false },
          { id: 'c4', name: 'body',       type: 'TEXT', nullable: false, isPK: false },
        ],
        foreignKeys: [
          { id: 'fk-c-p', fromColumn: 'post_id',   toTable: 'posts', toColumn: 'id' },
          { id: 'fk-c-u', fromColumn: 'author_id', toTable: 'users', toColumn: 'id' },
        ],
      },
    ],
  }));
  const [selectedTableId, setSelectedTableId] = React.useState(null);

  // ── Schema mutations ──────────────────────────────────────────────────────

  function importSchema(newTables) {
    setSchema(prev => {
      // Merge with placeholder positions first, then auto-arrange the full set
      const placeholder = newTables.map((t, i) => ({ ...t, ...gridPosition(prev.tables.length, i) }));
      const merged = [...prev.tables, ...placeholder];
      return { tables: arrangeTables(merged) };
    });
  }

  function clearSchema() {
    setSchema({ tables: [] });
    setSelectedTableId(null);
  }

  function addTable() {
    const id = generateId();
    setSchema(prev => {
      const pos = gridPosition(prev.tables.length, 0);
      return {
        tables: [...prev.tables, {
          id,
          name: `table_${prev.tables.length + 1}`,
          columns: [],
          foreignKeys: [],
          ...pos,
        }],
      };
    });
    setSelectedTableId(id);
  }

  function deleteTable(id) {
    setSchema(prev => ({ tables: prev.tables.filter(t => t.id !== id) }));
    if (selectedTableId === id) setSelectedTableId(null);
  }

  function updateTableName(id, name) {
    setSchema(prev => ({
      tables: prev.tables.map(t => t.id === id ? { ...t, name } : t),
    }));
  }

  function moveTable(id, x, y) {
    setSchema(prev => ({
      tables: prev.tables.map(t => t.id === id ? { ...t, x, y } : t),
    }));
  }

  function addColumn(tableId, col) {
    setSchema(prev => ({
      tables: prev.tables.map(t =>
        t.id === tableId ? { ...t, columns: [...t.columns, col] } : t
      ),
    }));
  }

  function deleteColumn(tableId, colId) {
    setSchema(prev => ({
      tables: prev.tables.map(t =>
        t.id === tableId ? { ...t, columns: t.columns.filter(c => c.id !== colId) } : t
      ),
    }));
  }

  function updateColumn(tableId, colId, updates) {
    setSchema(prev => ({
      tables: prev.tables.map(t =>
        t.id === tableId
          ? { ...t, columns: t.columns.map(c => c.id === colId ? { ...c, ...updates } : c) }
          : t
      ),
    }));
  }

  function addForeignKey(tableId, fk) {
    setSchema(prev => ({
      tables: prev.tables.map(t =>
        t.id === tableId ? { ...t, foreignKeys: [...t.foreignKeys, fk] } : t
      ),
    }));
  }

  function deleteForeignKey(tableId, fkId) {
    setSchema(prev => ({
      tables: prev.tables.map(t =>
        t.id === tableId ? { ...t, foreignKeys: t.foreignKeys.filter(fk => fk.id !== fkId) } : t
      ),
    }));
  }

  // ── Auto-arrange: Sugiyama layered graph layout ───────────────────────────
  //
  // Layers (X axis): FK-source table on LEFT, FK-target (referenced) on RIGHT.
  //   - FK arrows always flow LEFT → RIGHT.
  //   - Longest-path BFS from tables with no incoming FK edges (sources/leaves).
  //
  // Ordering (Y axis): Barycentric sweep (left→right, then right→left) minimises
  //   edge crossings so wires don't tangle. Repeated until stable or max 4 rounds.
  //
  // Position: columns are vertically centred against the tallest column.
  function arrangeTables(tables) {
      if (tables.length === 0) return tables;

      const COL_GAP = 120;
      const ROW_GAP = 56;
      const PAD_X   = 60;
      const PAD_Y   = 60;

      // ── 1. Build directed graph: FK-source → FK-target ───────────────────
      const idByName = {};
      for (const t of tables) idByName[t.name.toLowerCase()] = t.id;

      const outEdges = {};  // FK-source id → [FK-target id, ...]
      const inEdges  = {};  // FK-target id → [FK-source id, ...]
      const inCount  = {};  // Kahn's BFS: incoming edge count
      for (const t of tables) { outEdges[t.id] = []; inEdges[t.id] = []; inCount[t.id] = 0; }

      for (const t of tables) {
        for (const fk of t.foreignKeys) {
          const tgtId = idByName[fk.toTable.toLowerCase()];
          if (!tgtId || tgtId === t.id) continue;
          if (!outEdges[t.id].includes(tgtId)) {
            outEdges[t.id].push(tgtId);  // source → target
            inEdges[tgtId].push(t.id);
            inCount[tgtId]++;
          }
        }
      }

      // ── 2. Shortest-path BFS layer assignment ────────────────────────────
      // Uses BFS (not longest-path) so a node's layer = min hops from any source.
      // This keeps the layout compact: posts and users are both 1 hop from
      // comments, so they share column 1 rather than getting their own columns.
      const layerOf = {};
      const bfsQueue = [];
      for (const t of tables) {
        if (inCount[t.id] === 0) {
          layerOf[t.id] = 0;
          bfsQueue.push(t.id);
        }
      }
      let qi = 0;
      while (qi < bfsQueue.length) {
        const id = bfsQueue[qi++];
        for (const tgtId of outEdges[id]) {
          if (layerOf[tgtId] === undefined) {
            layerOf[tgtId] = layerOf[id] + 1;
            bfsQueue.push(tgtId);
          }
        }
      }
      // Cycle members: column 0
      for (const t of tables) { if (layerOf[t.id] === undefined) layerOf[t.id] = 0; }

      // ── 3. Group by layer ─────────────────────────────────────────────────
      const byLayer = {};
      for (const t of tables) {
        const l = layerOf[t.id];
        if (!byLayer[l]) byLayer[l] = [];
        byLayer[l].push(t);
      }
      const layerNums = Object.keys(byLayer).map(Number).sort((a, b) => a - b);

      // Initial sort: most-connected tables first (they're natural hubs)
      for (const g of Object.values(byLayer)) {
        g.sort((a, b) =>
          (outEdges[b.id].length + inEdges[b.id].length) -
          (outEdges[a.id].length + inEdges[a.id].length) ||
          a.name.localeCompare(b.name)
        );
      }

      // ── 4. Barycentric crossing-minimisation ──────────────────────────────
      // Sweep left→right then right→left, up to 4 full rounds.
      const posIdx = {};  // id → position index within its layer
      function refreshIdx() {
        for (const l of layerNums) byLayer[l].forEach((t, i) => { posIdx[t.id] = i; });
      }
      function bary(id, useIn, useOut) {
        const ps = [];
        if (useIn)  for (const s of inEdges[id])  if (posIdx[s] !== undefined) ps.push(posIdx[s]);
        if (useOut) for (const d of outEdges[id]) if (posIdx[d] !== undefined) ps.push(posIdx[d]);
        return ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : posIdx[id] ?? 0;
      }
      refreshIdx();
      for (let round = 0; round < 4; round++) {
        for (const l of layerNums)
          byLayer[l].sort((a, b) => bary(a.id, true, false) - bary(b.id, true, false));
        refreshIdx();
        for (const l of [...layerNums].reverse())
          byLayer[l].sort((a, b) => bary(a.id, false, true) - bary(b.id, false, true));
        refreshIdx();
      }

      // ── 5. Assign pixel positions ─────────────────────────────────────────
      function nodeH(t) { return HEADER_HEIGHT + t.columns.length * COL_ROW_HEIGHT + FOOTER_HEIGHT; }

      const colHeights = {};
      for (const l of layerNums) {
        const g = byLayer[l];
        colHeights[l] = g.reduce((s, t) => s + nodeH(t), 0) + Math.max(0, g.length - 1) * ROW_GAP;
      }
      const maxColH = Math.max(...Object.values(colHeights));

      const posMap = {};
      let x = PAD_X;
      for (const l of layerNums) {
        let y = PAD_Y + (maxColH - colHeights[l]) / 2;
        for (const t of byLayer[l]) {
          posMap[t.id] = { x, y };
          y += nodeH(t) + ROW_GAP;
        }
        x += TABLE_WIDTH + COL_GAP;
      }

      return tables.map(t => ({ ...t, ...posMap[t.id] }));
  }

  function autoArrange() {
    setSchema(prev => ({ tables: arrangeTables(prev.tables) }));
  }

  const actions = {
    importSchema,
    clearSchema,
    addTable,
    deleteTable,
    updateTableName,
    moveTable,
    addColumn,
    deleteColumn,
    updateColumn,
    addForeignKey,
    deleteForeignKey,
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">

      {/* ── Top bar ── */}
      <header
        className="flex items-center justify-between px-4 shrink-0 border-b border-gray-200"
        style={{ height: 44, background: 'var(--color-white)' }}
      >
        <div className="flex items-center gap-2.5">
          <Icon name="graph" size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-800 lowercase tracking-wide">schema viz</span>
          {schema.tables.length > 0 && (
            <span className="text-xs text-gray-400 lowercase">
              — {schema.tables.length} table{schema.tables.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Dropdown
            value={theme}
            onChange={setTheme}
            width="w-28"
            options={[
              { value: 'zinc',   label: 'zinc'     },
              { value: 'arctic', label: 'arctic'   },
              { value: 'stone',  label: 'stone'    },
              { value: 'hc',     label: 'contrast' },
            ]}
          />
          <Toggle
            checked={mode === 'dark'}
            onChange={v => setMode(v ? 'dark' : 'light')}
            label="dark"
          />
        </div>
      </header>

      {/* ── Body: sidebar + canvas ── */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          schema={schema}
          selectedTableId={selectedTableId}
          onSelectTable={setSelectedTableId}
          actions={actions}
        />
        <Canvas
          schema={schema}
          selectedTableId={selectedTableId}
          onSelectTable={setSelectedTableId}
          onPositionChange={moveTable}
          onNameChange={updateTableName}
          onAutoArrange={autoArrange}
          onAddColumn={(tableId) =>
            addColumn(tableId, {
              id: generateId(),
              name: 'new_column',
              type: 'VARCHAR(255)',
              nullable: true,
              isPK: false,
            })
          }
          onAddTable={addTable}
        />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
