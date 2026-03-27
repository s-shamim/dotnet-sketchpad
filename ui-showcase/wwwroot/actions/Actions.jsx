function ActionsSection() {
  const [activeFormat, setActiveFormat] = React.useState('json');
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [lastAction, setLastAction] = React.useState(null);
  const splitRef = React.useRef(null);

  React.useEffect(() => {
    function handleOutside(e) {
      if (splitRef.current && !splitRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div>
      <SectionTitle sub="button group, split button, danger button">actions</SectionTitle>

      <DemoBlock title="button group">
        <div className="flex divide-x divide-gray-200 border border-gray-200 rounded-sm w-fit">
          {['json', 'xml', 'raw'].map(opt => (
            <button
              key={opt}
              className={`px-3 py-1.5 text-xs lowercase transition-colors ${
                activeFormat === opt ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'
              }`}
              onClick={() => setActiveFormat(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-300 mt-2 lowercase">selected: {activeFormat}</p>
      </DemoBlock>

      <DemoBlock title="split button (primary action + dropdown)">
        <div className="relative w-fit" ref={splitRef}>
          <div className="flex divide-x divide-gray-200 border border-gray-200 rounded-sm">
            <button
              onClick={() => setLastAction('send')}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors lowercase"
            >
              send
            </button>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="px-2 py-1.5 flex items-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Icon name="caret-down" size={12} />
            </button>
          </div>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 border border-gray-200 bg-white shadow-sm rounded-sm z-10">
              {['send and save', 'send and copy', 'schedule send'].map(opt => (
                <button
                  key={opt}
                  className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors lowercase"
                  onClick={() => { setLastAction(opt); setDropdownOpen(false); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        {lastAction && (
          <p className="text-xs text-gray-300 mt-2 lowercase">last action: {lastAction}</p>
        )}
      </DemoBlock>

      <DemoBlock title="danger / destructive button pattern">
        <div className="flex flex-col gap-5">
          <DangerButton label="delete account"    confirmLabel="yes, delete" onConfirm={() => {}} />
          <DangerButton label="remove workspace"  confirmLabel="remove"      onConfirm={() => {}} />
          <DangerButton label="revoke api token"  confirmLabel="revoke"      onConfirm={() => {}} />
        </div>
        <p className="text-xs text-gray-300 mt-4 lowercase">pattern: gray text first → confirm intent → red only after arming</p>
      </DemoBlock>
    </div>
  );
}

// ── Action components ─────────────────────────────────────

function DangerButton({ label, confirmLabel, onConfirm }) {
  const [armed, setArmed] = React.useState(false);
  if (!armed) {
    return (
      <button
        onClick={() => setArmed(true)}
        className="text-gray-400 hover:text-red-400 text-sm transition-colors lowercase"
      >
        {label}
      </button>
    );
  }
  return (
    <span className="flex items-center gap-3 text-sm">
      <span className="text-gray-400 lowercase">are you sure?</span>
      <button onClick={onConfirm} className="text-red-400 hover:text-red-600 transition-colors lowercase">{confirmLabel}</button>
      <button onClick={() => setArmed(false)} className="text-gray-300 hover:text-gray-500 transition-colors lowercase">cancel</button>
    </span>
  );
}
