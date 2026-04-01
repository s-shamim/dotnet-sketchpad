# Flow Chart — Requirements & Feature Roadmap

Canvas-first diagram tool. Scope: single-user local canvas, no collaboration, no backend sharing.
Target feel: Whimsical / Miro canvas layer — clean, fast, keyboard-friendly.

---

## Current State (Baseline)

- SVG canvas with pan (space+drag), zoom (scroll), dot-grid background
- Node types: `rect`, `diamond`
- Edges drawn by dragging from port dots (cubic bezier, arrowhead)
- Inline label editing (double-click)
- Box-select, shift-click multi-select
- Corner resize handles (4 corners)
- Groups (visual frame around a node set)
- Properties panel (right sidebar) — fill, stroke, text color, font, size
- Undo / redo (broken — see Phase 0 bug fixes)
- Diagrams persisted to SQLite via EF Core
- Export SVG / PNG

---

## Phase 0 — Bug Fixes (blocking everything else)

### 0-A  Undo does not capture drag moves
`COMMIT_MOVE` falls through `contentReducer` unchanged → `next === present` → no
history snapshot is ever pushed.

Fix: `historyReducer` must special-case `COMMIT_MOVE` *before* calling
`contentReducer` — push `present` to `past` without touching `present`.

### 0-B  Edges don't follow nodes when moved
The global `mousemove/mouseup` effect in `Canvas` lists `[nodes, dispatch]` as
dependencies. On every incremental node move the effect tears down and
re-registers, killing the in-flight drag.

Fix: `nodesRef = useRef(nodes)` synced cheaply; main event effect uses `[]` deps.
All handlers read `nodesRef.current`.

### 0-C  NW / NE resize handles don't track the cursor
Same root cause as 0-B — the resize `onMouseMove` handler reads a stale `nodes`
closure. Fixed by the same ref pattern.

### 0-D  "Edge" toolbar item misleads
Selecting the edge tool in the sidebar does nothing useful — edges are
created by dragging from port dots in any mode.

Fix: remove the `edge` entry from the `TOOLS` array.

---

## Phase 1 — Context (Floating) Toolbar  ✅ implemented

Appears above the selected element. Replaces the need to reach to the right panel
for common quick edits.

```
  ┌──────────────────────────────────────────────────────────────────────┐
  │  [□] [◇] [○]  │  [●fill] [○stroke]  │  [−] 14 [+]  [B]  │  [⧉] [🗑] [×] │
  └──────────────────────────────────────────────────────────────────────┘
        shape          colors               font              actions
                                  ▲  8px gap
                         ╔═══════════════════╗
                         ║   selected node   ║
                         ╚═══════════════════╝
```

**Node toolbar items (left → right)**

| Slot | Control | Behaviour |
|------|---------|-----------|
| shape | rect / diamond / circle icon buttons | dispatches `CHANGE_NODE_TYPE` |
| fill | `ColorSwatch` | `UPDATE_NODE_STYLE { key:'fill' }` |
| stroke | `ColorSwatch` | `UPDATE_NODE_STYLE { key:'stroke' }` |
| font size | `−` / value / `+` | `UPDATE_NODE_STYLE { key:'fontSize' }` |
| bold | **B** toggle | `UPDATE_NODE_STYLE { key:'fontWeight' }` |
| duplicate | copy icon | `DUPLICATE_NODES` |
| delete | trash icon | `DELETE_SELECTED` |
| close | × | deselect |

**Edge toolbar (simpler)**

```
  ┌──────────────────────────────────────────┐
  │  [●color]  [───] [- -]  [1.5px ▾]  │  [🗑] [×] │
  └──────────────────────────────────────────┘
     stroke     style   width          actions
```

Position rule: toolbar is always rendered *above* the element with a fixed offset.
If element is near the top edge of the viewport, flip below.

---

## Phase 2 — Shape System Expansion  ✅ circle/ellipse implemented

### Built-in shapes

| id | SVG element | Status |
|----|-------------|--------|
| `rect` | `<rect>` | ✅ existing |
| `diamond` | `<polygon>` | ✅ existing |
| `circle` | `<ellipse>` | ✅ Phase 2 |
| `rounded-rect` | `<rect rx={12}>` | future |
| `parallelogram` | `<polygon>` | future |
| `hexagon` | `<polygon>` | future |
| `triangle` | `<polygon>` | future |
| `sticky` | `<rect>` + folded corner | future |
| `text` | `<foreignObject>` no border | future |

### Custom Shape Extension Point  ✅ implemented

Every shape is described by a **ShapeDescriptor** object registered into a global
`SHAPE_REGISTRY` map. Built-in shapes are themselves registered this way.

```
SHAPE_REGISTRY: Map<string, ShapeDescriptor>
                             │
          ┌──────────────────┤
          │                  │
    ShapeDescriptor          │
    ─────────────            │
    id:        string  ◄─────┘   e.g. "rect", "uml-class", "swimlane"
    label:     string            display name
    icon:      string            Phosphor icon name
    defaultW:  number
    defaultH:  number
    render(node, opts): JSX      returns the SVG shape elements (no ports, no handles)
    ports(node): Port[]          returns { id, x, y } array
    hitTest(node, px, py): bool  optional — bbox used if absent
```

**Registration API (client-side JS):**

```js
FlowChart.registerShape({
  id: 'uml-class',
  label: 'UML Class',
  icon: 'table',
  defaultW: 180,
  defaultH: 120,
  render(node) { /* return SVG group elements */ },
  ports(node) { return [
    { id: 'top',    x: node.x + node.w/2,  y: node.y          },
    { id: 'bottom', x: node.x + node.w/2,  y: node.y + node.h },
  ]},
});
```

Shapes registered before `ReactDOM.createRoot(...)` are available immediately.
A `shapes/` folder in `wwwroot/` holds shape definition files loaded in
`index.html` before `app.jsx`:

```html
<!-- in index.html, after shared.jsx, before app.jsx -->
<script type="text/babel" src="shapes/uml.jsx?v=1"></script>
```

**`node.meta`** — a free JSON blob stored alongside `node.style` carries
shape-specific data (UML sections, swimlane titles, etc.) without touching the
DB schema.

**UML Class shape (example built-in extension):**

```
  ┌─────────────────────┐
  │   «interface»       │  ← node.meta.stereotype
  │   ClassName         │  ← node.label (bold)
  ├─────────────────────┤
  │ + field: Type       │  ← node.meta.attributes[]
  │ - field: Type       │
  ├─────────────────────┤
  │ + method(): void    │  ← node.meta.methods[]
  └─────────────────────┘
```

---

## Phase 3 — Edge System Expansion  ✅ style + dash implemented

### Edge data model extension

```js
edge: {
  id, fromId, fromPort, toId, toPort, label,
  style: {
    strokeColor:  '#9ca3af',   // default
    strokeWidth:  1.5,
    strokeDash:   'solid',     // 'solid' | 'dashed' | 'dotted'
    startCap:     'none',      // future: 'none' | 'arrow' | 'circle' | 'diamond'
    endCap:       'arrow',     // future: 'arrow' | 'circle' | ...
    routing:      'bezier',    // future: 'bezier' | 'straight' | 'orthogonal'
  }
}
```

### Edge routing modes (future)

```
  bezier (default)          straight             orthogonal (elbow)
  ─────────────────         ──────────           ────────────────────
    ╔═══╗                   ╔═══╗                ╔═══╗
    ║ A ║                   ║ A ║                ║ A ║
    ╚═══╝                   ╚═══╝                ╚═══╝
       ╲                      │                    │
        ╲ (curve)             │                    └──────┐
         ╲                    ▼               (right angles)
          ▼                 ╔═══╗                       ╔═══╗
        ╔═══╗               ║ B ║                       ║ B ║
        ╚═══╝               ╚═══╝                       ╚═══╝
```

---

## Phase 4 — Selection & Manipulation  ✅ copy/paste/duplicate implemented

### Copy / Paste / Duplicate

```
  Ctrl+C         copy selected nodes (session clipboard, not persisted)
  Ctrl+X         cut selected nodes
  Ctrl+V         paste with +20px offset
  Ctrl+D         duplicate in place with +20px offset (no clipboard)
  Backspace/Del  delete selected
```

Clipboard stores deep-clones with new IDs; edges between clipboard nodes are
re-created on paste with the new IDs. Edges to external nodes are dropped.

### Alignment toolbar (future — shown when 2+ nodes selected)

```
  ┌──────────────────────────────────────────────────────────────┐
  │  align: [⬜←] [⬜↔] [→⬜]  [⬜↑] [⬛↕] [↓⬜]  │  distribute: [↔] [↕] │
  └──────────────────────────────────────────────────────────────┘
             left  center right  top  middle bottom   h     v
```

### Z-order (future)

- **Bring to front** / **Send to back** via context menu or toolbar
- Nodes render in array order; BRING_FRONT moves node to end of array

### Node locking (future)

- Lock icon in context toolbar → locked node cannot be moved or resized
- Stored as `node.locked: bool`

---

## Phase 5 — Canvas Navigation & View (future)

### Minimap

```
  ┌──────────────────────────────────────────────────────┐
  │   (canvas area)                                       │
  │                                                       │
  │                                            ┌────────┐ │
  │                                            │  ░░░░  │ │  ← minimap
  │                                            │  ░vp░  │ │    viewport rect
  │                                            │  ░░░░  │ │    is draggable
  │                                            └────────┘ │
  └──────────────────────────────────────────────────────┘
```

- Fixed bottom-right corner, `120×80` px
- Shows all nodes as colored rectangles; viewport frame draggable to pan

### View toolbar (bottom-left HUD)

```
  ┌─────────────────────────────────────┐
  │  [−]  75%  [+]   [⊡ fit]  [⌂ 100%] │
  └─────────────────────────────────────┘
```

| Action | Shortcut |
|--------|----------|
| Zoom in | `Ctrl+=` or scroll |
| Zoom out | `Ctrl+-` or scroll |
| Fit to screen | `Ctrl+Shift+H` |
| Reset 100% | `Ctrl+0` |

### Snap & alignment guides

```
  ┌───────────┐
  │  Node A   │
  └───────────┘
       │               ← vertical snap guide (dashed blue line)
  ┌───────────┐         shown while dragging another node near alignment
  │  Node B   │
  └───────────┘
```

- Snap to grid (optional toggle, 8px grid)
- Smart guides: dashed lines when edges/centers align while dragging
- Snap threshold: ±6px

---

## Phase 6 — Text & Style Richness (future)

### Node text alignment

```
  ┌─────────┐   ┌─────────┐   ┌─────────┐
  │ Left    │   │  Center │   │   Right │
  │ aligned │   │ aligned │   │ aligned │
  └─────────┘   └─────────┘   └─────────┘
```

### Corner radius (rect only)

```
  ┌────────┐   ╭────────╮   ╭────────╮
  │ rx = 0 │   │ rx = 6 │   │ rx = 20│
  └────────┘   ╰────────╯   ╰────────╯
```

Slider in Properties panel: 0 → 40px.

### Node opacity / shadow

- Opacity slider 10%–100%
- Drop shadow toggle (SVG filter `feDropShadow`)

---

## Phase 7 — Import / Export Enhancements (future)

| Format | Direction | Notes |
|--------|-----------|-------|
| SVG | export | existing |
| PNG | export | existing |
| JSON | export | download diagram ContentJson |
| JSON | import | drag-drop or file picker, validates + loads |
| Clipboard image | export | `navigator.clipboard.write` with PNG blob |

---

## Shape Extension Cookbook

To add a custom shape (e.g. UML package, swimlane), create a file in
`wwwroot/shapes/` and load it in `index.html` before `app.jsx`:

```html
<!-- index.html, after shared.jsx deps, before app.jsx -->
<script type="text/babel" src="shapes/uml.jsx?v=1"></script>
```

Inside the shape file:

```jsx
// shapes/uml.jsx
FlowChart.registerShape({
  id: 'uml-class',
  label: 'UML Class',
  icon: 'table',
  defaultW: 180,
  defaultH: 140,
  render(node) {
    const { x, y, w, h, style = {}, meta = {} } = node;
    const headerH = 48;
    const attrs   = meta.attributes || [];
    const methods = meta.methods    || [];
    return (
      <g>
        <rect x={x} y={y} width={w} height={h}
          fill={style.fill || '#fff'} stroke={style.stroke || '#d1d5db'} strokeWidth={1.5} />
        <line x1={x} y1={y + headerH} x2={x + w} y2={y + headerH}
          stroke={style.stroke || '#d1d5db'} />
        <text x={x + w/2} y={y + headerH/2}
          textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight="bold">
          {node.label}
        </text>
        {attrs.map((a, i) => (
          <text key={i} x={x + 8} y={y + headerH + 16 + i * 16} fontSize={11} fill="#374151">{a}</text>
        ))}
      </g>
    );
  },
  ports: FlowChart.standardPorts,
});
```

`FlowChart.registerShape` and `FlowChart.standardPorts` are exposed on
`window.FlowChart` by `app.jsx` before `createRoot` is called.

---

## Out of Scope (explicitly)

- Real-time collaboration / multiplayer cursors
- Comments / annotations on nodes
- Version history / named snapshots (beyond undo stack)
- Presentation / slideshow mode
- Embedded iframes or live data sources
- Mobile / touch input
- Plugin marketplace / remote shape loading
