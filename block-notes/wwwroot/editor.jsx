// editor.jsx — BLOCK_TYPES, BlockTypePicker, BlockItem, BlockEditor
// Depends on: Icon, Spinner (from shared.jsx)

// ---------------------------------------------------------------------------
// Block type configuration
// ---------------------------------------------------------------------------
const BLOCK_TYPES = [
  { type: 'paragraph',  label: 'Text',         icon: 'text-t',          placeholder: 'Type something...' },
  { type: 'heading1',   label: 'Heading 1',    icon: 'text-h-one',      placeholder: 'Heading 1' },
  { type: 'heading2',   label: 'Heading 2',    icon: 'text-h-two',      placeholder: 'Heading 2' },
  { type: 'heading3',   label: 'Heading 3',    icon: 'text-h-three',    placeholder: 'Heading 3' },
  { type: 'bullet',     label: 'Bullet list',  icon: 'list-bullets',    placeholder: 'List item' },
  { type: 'numbered',   label: 'Numbered list',icon: 'list-numbers',    placeholder: 'List item' },
  { type: 'todo',       label: 'To-do',        icon: 'check-square',    placeholder: 'To-do item' },
  { type: 'code',       label: 'Code',         icon: 'code',            placeholder: '// code here' },
  { type: 'quote',      label: 'Quote',        icon: 'quotes',          placeholder: 'Quote...' },
  { type: 'divider',    label: 'Divider',      icon: 'minus',           placeholder: '' },
];

function blockConfig(type) {
  return BLOCK_TYPES.find(b => b.type === type) || BLOCK_TYPES[0];
}

// ---------------------------------------------------------------------------
// BlockTypePicker — dropdown to select block type
// ---------------------------------------------------------------------------
function BlockTypePicker({ onSelect, onClose }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    function handleEsc(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-1 z-30 w-52 border border-gray-200 bg-white shadow-sm rounded-sm"
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <span className="text-[10px] tracking-widest text-gray-400 uppercase">add block</span>
      </div>
      <div className="py-1 max-h-72 overflow-y-auto">
        {BLOCK_TYPES.map(bt => (
          <button
            key={bt.type}
            onClick={() => { onSelect(bt.type); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors text-left"
          >
            <Icon name={bt.icon} size={14} className="text-gray-400 shrink-0" />
            <span className="lowercase">{bt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BlockItem — renders a single block with controls
// ---------------------------------------------------------------------------
function BlockItem({ block, index, isFirst, isLast, onUpdate, onDelete, onMoveUp, onMoveDown, onTypeChange, onEnter, registerRef }) {
  const cfg         = blockConfig(block.type);
  const contentRef  = React.useRef(null);
  const [hovered, setHovered] = React.useState(false);

  // Register ref for external focus management (used by BlockEditor to auto-focus new blocks)
  React.useEffect(() => {
    if (registerRef) registerRef(contentRef.current);
    return () => { if (registerRef) registerRef(null); };
  }, [block.id]);

  // Sync contenteditable with block.content when block changes from outside
  React.useEffect(() => {
    if (contentRef.current && block.type !== 'code' && block.type !== 'divider') {
      if (contentRef.current.innerText !== block.content) {
        contentRef.current.innerText = block.content;
      }
    }
  }, [block.id, block.content, block.type]);

  function handleContentBlur() {
    if (!contentRef.current) return;
    const text = contentRef.current.innerText.replace(/\n$/, '');
    if (text !== block.content) onUpdate({ content: text });
  }

  function handleContentKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Save current content first, then signal parent to create next block
      if (contentRef.current) {
        const text = contentRef.current.innerText.replace(/\n$/, '');
        if (text !== block.content) onUpdate({ content: text });
      }
      if (onEnter) onEnter(block.type, block.id);
    }
  }

  // ── Render helpers ──

  function renderContent() {
    if (block.type === 'divider') {
      return <hr className="border-0 border-t border-gray-200 my-2" />;
    }

    if (block.type === 'code') {
      return (
        <textarea
          className="block-code-content w-full bg-gray-100 text-gray-800 font-mono text-sm px-4 py-3 rounded-sm leading-relaxed"
          value={block.content}
          placeholder={cfg.placeholder}
          onChange={e => onUpdate({ content: e.target.value })}
          rows={Math.max(3, block.content.split('\n').length + 1)}
        />
      );
    }

    if (block.type === 'todo') {
      return (
        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={block.checked}
            onChange={e => onUpdate({ checked: e.target.checked })}
            className="mt-1 w-4 h-4 rounded-sm border border-gray-300 accent-gray-600 cursor-pointer shrink-0"
          />
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className={`block-content flex-1 text-sm leading-relaxed text-gray-700 ${block.checked ? 'line-through text-gray-400' : ''}`}
            data-placeholder={cfg.placeholder}
            onBlur={handleContentBlur}
            onKeyDown={handleContentKeyDown}
          />
        </div>
      );
    }

    if (block.type === 'bullet') {
      return (
        <div className="flex items-start gap-2.5">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="block-content flex-1 text-sm leading-relaxed text-gray-700"
            data-placeholder={cfg.placeholder}
            onBlur={handleContentBlur}
            onKeyDown={handleContentKeyDown}
          />
        </div>
      );
    }

    if (block.type === 'numbered') {
      return (
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 text-sm text-gray-400 shrink-0 w-5 text-right">{index + 1}.</span>
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="block-content flex-1 text-sm leading-relaxed text-gray-700"
            data-placeholder={cfg.placeholder}
            onBlur={handleContentBlur}
            onKeyDown={handleContentKeyDown}
          />
        </div>
      );
    }

    if (block.type === 'quote') {
      return (
        <div className="flex gap-3 border-l-2 border-gray-300 pl-4 py-0.5">
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="block-content flex-1 text-sm leading-relaxed text-gray-500 italic"
            data-placeholder={cfg.placeholder}
            onBlur={handleContentBlur}
            onKeyDown={handleContentKeyDown}
          />
        </div>
      );
    }

    // heading1 / heading2 / heading3 / paragraph
    const sizeClass = {
      heading1:  'text-3xl font-semibold text-gray-900 leading-snug',
      heading2:  'text-xl font-semibold text-gray-800 leading-snug',
      heading3:  'text-base font-semibold text-gray-800',
      paragraph: 'text-sm leading-relaxed text-gray-700',
    }[block.type] || 'text-sm text-gray-700';

    return (
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className={`block-content ${sizeClass}`}
        data-placeholder={cfg.placeholder}
        onBlur={handleContentBlur}
        onKeyDown={handleContentKeyDown}
      />
    );
  }

  return (
    <div
      className="group relative flex items-start gap-2 py-0.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Block controls — appear on hover */}
      <div
        className={`flex items-center gap-0.5 pt-1 shrink-0 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ width: 56 }}
      >
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          title="Move up"
          className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="arrow-up" size={12} className="" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          title="Move down"
          className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="arrow-down" size={12} className="" />
        </button>
        <button
          onClick={onDelete}
          title="Delete block"
          className="p-1 text-gray-300 hover:text-red-500 transition-colors"
        >
          <Icon name="trash" size={12} className="" />
        </button>
      </div>

      {/* Block content */}
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BlockEditor — loads + manages blocks for the active page
// ---------------------------------------------------------------------------
function BlockEditor({ pageId }) {
  const [blocks,      setBlocks]      = React.useState([]);
  const [loading,     setLoading]     = React.useState(true);
  const [pickerOpen,  setPickerOpen]  = React.useState(false);
  const [focusId,     setFocusId]     = React.useState(null);
  const pickerAnchor                  = React.useRef(null);
  const blockRefs                     = React.useRef({});

  // Auto-focus a newly created block
  React.useEffect(() => {
    if (!focusId) return;
    const el = blockRefs.current[focusId];
    if (el) {
      el.focus();
      // Place cursor at end
      const range = document.createRange();
      const sel   = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    setFocusId(null);
  }, [focusId, blocks]);

  // Load blocks when page changes
  React.useEffect(() => {
    if (!pageId) return;
    setLoading(true);
    fetch(`/api/pages/${pageId}/blocks`)
      .then(r => r.json())
      .then(data => { setBlocks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [pageId]);

  // insertAfterId: when set, new block is inserted right after that block
  async function addBlock(type, insertAfterId = null) {
    const body = { type, content: '', ...(insertAfterId ? { insertAfterId } : {}) };
    const res = await fetch(`/api/pages/${pageId}/blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return;
    const newBlock = await res.json();
    setBlocks(prev => {
      // If inserting mid-list, shift local orders to match server state
      if (insertAfterId) {
        const anchor = prev.find(b => b.id === insertAfterId);
        if (anchor) {
          const shifted = prev.map(b =>
            b.order >= newBlock.order && b.id !== newBlock.id
              ? { ...b, order: b.order + 1 }
              : b
          );
          return [...shifted, newBlock].sort((a, b) => a.order - b.order);
        }
      }
      return [...prev, newBlock].sort((a, b) => a.order - b.order);
    });
    // Focus the new block after render
    setFocusId(newBlock.id);
  }

  async function updateBlock(id, patch) {
    const res = await fetch(`/api/blocks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setBlocks(prev => prev.map(b => b.id === id ? updated : b));
  }

  async function deleteBlock(id) {
    const res = await fetch(`/api/blocks/${id}`, { method: 'DELETE' });
    if (!res.ok) return;
    setBlocks(prev => prev.filter(b => b.id !== id));
  }

  async function moveBlock(id, direction) {
    const res = await fetch(`/api/blocks/${id}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    });
    if (!res.ok) return;
    const { block: a, neighbor: b } = await res.json();
    setBlocks(prev =>
      prev.map(bl => bl.id === a.id ? a : bl.id === b.id ? b : bl)
          .sort((x, y) => x.order - y.order)
    );
  }

  if (!pageId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-300">
        <Icon name="file-text" size={48} className="text-gray-200" />
        <span className="text-sm lowercase">select or create a page</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner />
      </div>
    );
  }

  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-1">
      {/* Block list */}
      {sorted.map((block, idx) => (
        <BlockItem
          key={block.id}
          block={block}
          index={idx}
          isFirst={idx === 0}
          isLast={idx === sorted.length - 1}
          onUpdate={patch => updateBlock(block.id, patch)}
          onDelete={() => deleteBlock(block.id)}
          onMoveUp={() => moveBlock(block.id, 'up')}
          onMoveDown={() => moveBlock(block.id, 'down')}
          onEnter={(type, id) => addBlock(type, id)}
          registerRef={(el) => { if (el) blockRefs.current[block.id] = el; else delete blockRefs.current[block.id]; }}
        />
      ))}

      {/* Add block row */}
      <div className="relative mt-4 flex items-center gap-2" ref={pickerAnchor}>
        <div className="flex items-center gap-1 pl-14">
          <button
            onClick={() => setPickerOpen(o => !o)}
            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-gray-600 transition-colors lowercase"
          >
            <span className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
              <Icon name="plus" size={11} className="" />
            </span>
            add block
          </button>
        </div>

        {pickerOpen && (
          <BlockTypePicker
            onSelect={type => { addBlock(type); setPickerOpen(false); }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
