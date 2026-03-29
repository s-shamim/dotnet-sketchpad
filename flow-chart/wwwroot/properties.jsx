// properties.jsx — PropertiesPanel
// Shown when exactly 1 node or 1 edge is selected.
// Receives: { nodes, edges, selectedIds, dispatch }

const FONT_FAMILIES = [
  { value: 'Inter, sans-serif',         label: 'inter'       },
  { value: 'Georgia, serif',            label: 'georgia'     },
  { value: '"Courier New", monospace',  label: 'courier'     },
  { value: 'Arial, sans-serif',         label: 'arial'       },
];

const FONT_WEIGHTS = [
  { value: 'normal', label: 'normal' },
  { value: '500',    label: 'medium' },
  { value: 'bold',   label: 'bold'   },
];

function PropertiesPanel({ nodes, edges, selectedIds, dispatch }) {
  if (selectedIds.length !== 1) return null;

  const id = selectedIds[0];
  const node = nodes.find(n => n.id === id);
  const edge = !node ? edges.find(e => e.id === id) : null;

  if (!node && !edge) return null;

  // ── Node properties ──────────────────────────────────────────────────────────
  if (node) {
    const s = node.style || {};

    function updateStyle(key, val) {
      dispatch({ type: 'UPDATE_NODE_STYLE', id, key, val });
    }

    return (
      <aside className="w-56 shrink-0 border-l border-gray-100 bg-white flex flex-col overflow-y-auto">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs tracking-widest text-gray-400 uppercase">node</p>
        </div>

        {/* Label */}
        <Section title="label">
          <input
            className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
            value={node.label}
            onChange={e => dispatch({ type: 'UPDATE_NODE_LABEL', id, label: e.target.value })}
          />
        </Section>

        {/* Size */}
        <Section title="size">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest">w</label>
              <input type="number" min={40} max={600}
                className="w-full border-b border-gray-300 py-1 text-sm text-gray-700 bg-transparent focus:outline-none focus:border-gray-500"
                value={node.w}
                onChange={e => dispatch({ type: 'RESIZE_NODE', id, w: Math.max(40, +e.target.value), h: node.h })}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest">h</label>
              <input type="number" min={30} max={400}
                className="w-full border-b border-gray-300 py-1 text-sm text-gray-700 bg-transparent focus:outline-none focus:border-gray-500"
                value={node.h}
                onChange={e => dispatch({ type: 'RESIZE_NODE', id, w: node.w, h: Math.max(30, +e.target.value) })}
              />
            </div>
          </div>
        </Section>

        {/* Font */}
        <Section title="font">
          <div className="flex flex-col gap-3">
            <Dropdown
              value={s.fontFamily || 'Inter, sans-serif'}
              onChange={v => updateStyle('fontFamily', v)}
              options={FONT_FAMILIES}
              width="w-full"
            />
            <Dropdown
              value={s.fontWeight || 'normal'}
              onChange={v => updateStyle('fontWeight', v)}
              options={FONT_WEIGHTS}
              width="w-full"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 lowercase w-16 shrink-0">size ({s.fontSize || 14}px)</span>
              <input type="range" min={10} max={32} step={1}
                value={s.fontSize || 14}
                onChange={e => updateStyle('fontSize', +e.target.value)}
                className="flex-1 accent-gray-500"
              />
            </div>
          </div>
        </Section>

        {/* Colors */}
        <Section title="colors">
          <div className="flex flex-col gap-3">
            <ColorRow label="fill" value={s.fill || '#f9fafb'} onChange={v => updateStyle('fill', v)} />
            <ColorRow label="stroke" value={s.stroke || '#d1d5db'} onChange={v => updateStyle('stroke', v)} />
            <ColorRow label="text" value={s.textColor || '#374151'} onChange={v => updateStyle('textColor', v)} />
          </div>
        </Section>
      </aside>
    );
  }

  // ── Edge properties ──────────────────────────────────────────────────────────
  if (edge) {
    return (
      <aside className="w-56 shrink-0 border-l border-gray-100 bg-white flex flex-col overflow-y-auto">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs tracking-widest text-gray-400 uppercase">edge</p>
        </div>
        <Section title="label">
          <input
            className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
            value={edge.label || ''}
            placeholder="edge label..."
            onChange={e => dispatch({ type: 'UPDATE_EDGE_LABEL', id, label: e.target.value })}
          />
        </Section>
      </aside>
    );
  }

  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-3">{title}</p>
      {children}
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 lowercase w-10 shrink-0">{label}</span>
      <ColorSwatch value={value} onChange={onChange} />
      <span className="text-xs text-gray-400 font-mono">{value}</span>
    </div>
  );
}
