function OverlaysSection() {
  const [modalOpen,   setModalOpen]   = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmResult, setConfirmResult] = React.useState(null);
  const [drawerOpen,  setDrawerOpen]  = React.useState(false);

  return (
    <div>
      <SectionTitle sub="modal, confirm dialog, tooltip, drawer">overlays</SectionTitle>

      <DemoBlock title="modal / dialog">
        <button
          onClick={() => setModalOpen(true)}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase"
        >
          open modal
        </button>

        {modalOpen && (
          <Modal
            title="modal title"
            onClose={() => setModalOpen(false)}
            actions={<>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase"
              >cancel</button>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-700 hover:text-gray-900 text-sm px-2 transition-colors lowercase"
              >confirm</button>
            </>}
          >
            <p className="text-gray-500 text-sm lowercase">
              this is the modal body. it can contain any elements — forms,
              descriptions, confirmations. the backdrop click also closes it.
            </p>
          </Modal>
        )}
      </DemoBlock>

      <DemoBlock title="confirm / destructive modal">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setConfirmOpen(true); setConfirmResult(null); }}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase"
          >
            delete item
          </button>
          {confirmResult !== null && (
            <span className={`text-sm lowercase ${confirmResult ? 'text-red-500' : 'text-gray-400'}`}>
              {confirmResult ? 'item deleted.' : 'cancelled.'}
            </span>
          )}
        </div>

        {confirmOpen && (
          <ConfirmModal
            message="are you sure you want to delete this item? this cannot be undone."
            onConfirm={() => { setConfirmResult(true);  setConfirmOpen(false); }}
            onCancel={() =>  { setConfirmResult(false); setConfirmOpen(false); }}
          />
        )}
      </DemoBlock>

      <DemoBlock title="drawer">
        <button
          onClick={() => setDrawerOpen(true)}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase"
        >
          open drawer
        </button>
        {drawerOpen && (
          <Drawer title="drawer title" onClose={() => setDrawerOpen(false)}>
            <p className="text-sm text-gray-500 lowercase">
              drawers slide in from the right and sit on top of the content.
              use them for edit panels, filters, detail views, and secondary flows
              that don't warrant a full page.
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <input placeholder="field one..." className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500" />
              <input placeholder="field two..." className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500" />
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setDrawerOpen(false)} className="text-sm text-gray-700 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-sm transition-colors lowercase">save</button>
              <button onClick={() => setDrawerOpen(false)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors lowercase">cancel</button>
            </div>
          </Drawer>
        )}
      </DemoBlock>

      <DemoBlock title="tooltip">
        <div className="flex items-center gap-10">
          <Tooltip text="copy to clipboard">
            <button className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 transition-colors lowercase">hover me</button>
          </Tooltip>
          <Tooltip text="a longer tooltip message explaining something">
            <span className="text-sm text-gray-500 cursor-default border-b border-dashed border-gray-300">underlined hint</span>
          </Tooltip>
          <Tooltip text="delete permanently">
            <Icon name="trash" size={16} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
          </Tooltip>
        </div>
      </DemoBlock>
    </div>
  );
}

// ── Overlay components ────────────────────────────────────

function Modal({ title, children, onClose, actions, size = 'md' }) {
  const dialogRef = React.useRef(null);
  const titleId = React.useId();
  const maxW = size === 'lg' ? 'max-w-xl' : 'max-w-md';

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const focusable = Array.from(el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    if (focusable.length) focusable[0].focus();
    function handleKey(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative bg-white w-full ${maxW} mx-4 p-6 shadow-sm rounded-sm`}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 id={titleId} className="text-sm tracking-widest text-gray-700 uppercase">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors flex items-center"><Icon name="x" size={12} className="" /></button>
        </div>
        <div className="text-sm text-gray-600">{children}</div>
        {actions && (
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'delete' }) {
  return (
    <Modal
      title="confirm"
      onClose={onCancel}
      actions={<>
        <button onClick={onCancel}  className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase">cancel</button>
        <button onClick={onConfirm} className="text-red-400 hover:text-red-600 text-sm px-2 transition-colors lowercase">{confirmLabel}</button>
      </>}
    >
      <p className="text-gray-500 text-sm lowercase">{message}</p>
    </Modal>
  );
}

function Tooltip({ text, children }) {
  const [visible, setVisible] = React.useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap text-xs px-2 py-1 pointer-events-none rounded-sm lowercase z-50"
          style={{ backgroundColor: 'var(--overlay-bg)', color: 'var(--overlay-text)' }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function Drawer({ title, children, onClose }) {
  const drawerRef = React.useRef(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    const focusable = Array.from(el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    if (focusable.length) focusable[0].focus();
    function handleKey(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-white w-80 h-full shadow-sm flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 id={titleId} className="text-sm tracking-widest text-gray-700 uppercase">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors flex items-center">
            <Icon name="x" size={14} className="" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}
