// app.jsx — App shell, state management, mock data, layout, mount (loaded LAST)

// ── Shared primitives ──

function Icon({ name, size = 14, className = "text-gray-400" }) {
  return <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />;
}

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
                  value === v ? 'text-gray-800 bg-gray-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
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

function Toggle({ checked, onChange, label }) {
  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  }

  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={e => { e.stopPropagation(); onChange(!checked); }}
        className={`relative w-8 h-4 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1 ${
          checked ? 'bg-gray-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}
          style={{ backgroundColor: 'var(--toggle-thumb)' }}
        />
      </button>
      {label && <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors lowercase select-none">{label}</span>}
    </div>
  );
}

function Badge({ label, variant = 'neutral' }) {
  const styles = {
    neutral: 'text-gray-500 bg-gray-100',
    info:    'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    error:   'text-red-500 bg-red-50',
    get:     'text-green-600 bg-green-50',
    post:    'text-yellow-600 bg-yellow-50',
    put:     'text-blue-600 bg-blue-50',
    delete:  'text-red-500 bg-red-50',
    patch:   'text-purple-600 bg-purple-50',
    head:    'text-gray-500 bg-gray-100',
    options: 'text-gray-500 bg-gray-100',
  };
  return (
    <span className={`inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${styles[variant] ?? styles.neutral}`}>
      {label}
    </span>
  );
}

function Modal({ title, children, onClose, actions, size = 'md' }) {
  const dialogRef = React.useRef(null);
  const titleId = React.useId();
  const maxW = size === 'lg' ? 'max-w-3xl' : 'max-w-lg';

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const focusable = Array.from(el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    if (focusable.length) focusable[0].focus();
    function handleKey(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.18)' }} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`bg-white border border-gray-200 rounded-sm shadow-sm ${maxW} w-full flex flex-col`}
        style={{ maxHeight: '88vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <span id={titleId} className="text-sm tracking-widest text-gray-700 uppercase">{title}</span>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors flex items-center">
            <Icon name="x" size={14} className="" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4" style={size === 'lg' ? { minHeight: '400px' } : undefined}>{children}</div>
        {actions && (
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-100 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-gray-100">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-xs tracking-wide lowercase transition-colors border-b-2 -mb-px ${
            active === tab.id
              ? 'border-gray-700 text-gray-700'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function KVEditor({ pairs, onChange }) {
  const nextId = React.useRef(pairs.length + 1);
  const update = (id, field, val) => {
    onChange(pairs.map(p => p.id === id ? { ...p, [field]: val } : p));
  };
  const add = () => {
    nextId.current += 1;
    onChange([...pairs, { id: nextId.current, key: '', value: '', enabled: true }]);
  };
  const remove = (id) => onChange(pairs.filter(p => p.id !== id));

  return (
    <div className="divide-y divide-gray-100">
      {pairs.map(pair => (
        <div key={pair.id} className="flex items-center gap-2 py-2 group">
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={e => update(pair.id, 'enabled', e.target.checked)}
            className="accent-gray-400 w-3.5 h-3.5 cursor-pointer flex-shrink-0"
          />
          <input
            value={pair.key}
            onChange={e => update(pair.id, 'key', e.target.value)}
            placeholder="key"
            className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent"
          />
          <input
            value={pair.value}
            onChange={e => update(pair.id, 'value', e.target.value)}
            placeholder="value"
            className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent"
          />
          <button
            onClick={() => remove(pair.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex items-center"
          >
            <Icon name="x" size={12} className="" />
          </button>
        </div>
      ))}
      <button onClick={add} className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase">
        <Icon name="plus" size={12} /> add row
      </button>
    </div>
  );
}

// ── Mock data ──

const MOCK_COLLECTIONS = [
  {
    id: 'col-1', name: 'user api',
    description: 'user management endpoints',
    baseUrl: 'https://api.example.com',
    headers: [{ id: 1, key: 'Accept', value: 'application/json', enabled: true }],
    authType: 'bearer', authData: { token: '{{api_key}}' },
    preRequestScript: 'set header X-Request-Id = uuid()',
    testScript: '',
    settings: { followRedirects: true, verifySsl: false, timeoutMs: 30000 },
    folders: [
      {
        id: 'fld-1', name: 'admin',
        folders: [],
        requests: [
          { id: 'req-3', name: 'get user by id', method: 'GET', url: 'https://api.example.com/users/1', collectionId: 'col-1', collectionName: 'user api', folderId: 'fld-1', folderName: 'admin' },
        ],
      },
    ],
    requests: [
      { id: 'req-1', name: 'list users', method: 'GET', url: 'https://api.example.com/users', collectionId: 'col-1', collectionName: 'user api', folderId: null },
      { id: 'req-2', name: 'create user', method: 'POST', url: 'https://api.example.com/users', collectionId: 'col-1', collectionName: 'user api', folderId: null },
    ],
  },
  {
    id: 'col-2', name: 'order api',
    description: 'order management endpoints',
    headers: [],
    authType: 'none', authData: {},
    preRequestScript: '',
    testScript: 'status < 500',
    settings: { followRedirects: true, verifySsl: false, timeoutMs: 30000 },
    folders: [
      {
        id: 'fld-2', name: 'crud',
        folders: [
          {
            id: 'fld-3', name: 'mutations',
            folders: [],
            requests: [
              { id: 'req-5', name: 'create order', method: 'POST', url: 'https://api.example.com/orders', collectionId: 'col-2', collectionName: 'order api', folderId: 'fld-3', folderName: 'mutations' },
              { id: 'req-6', name: 'delete order', method: 'DELETE', url: 'https://api.example.com/orders/1', collectionId: 'col-2', collectionName: 'order api', folderId: 'fld-3', folderName: 'mutations' },
              { id: 'req-7', name: 'update order', method: 'PATCH', url: 'https://api.example.com/orders/1', collectionId: 'col-2', collectionName: 'order api', folderId: 'fld-3', folderName: 'mutations' },
            ],
          },
        ],
        requests: [
          { id: 'req-4', name: 'list orders', method: 'GET', url: 'https://api.example.com/orders', collectionId: 'col-2', collectionName: 'order api', folderId: 'fld-2', folderName: 'crud' },
        ],
      },
    ],
    requests: [],
  },
];

const MOCK_ENVIRONMENTS = [
  {
    id: 'env-1', name: 'development',
    variables: [
      { id: 1, key: 'base_url', initialValue: 'http://localhost:3000', currentValue: 'http://localhost:3000' },
      { id: 2, key: 'api_key', initialValue: 'dev-key-123', currentValue: 'dev-key-123' },
    ],
  },
  {
    id: 'env-2', name: 'production',
    variables: [
      { id: 1, key: 'base_url', initialValue: 'https://api.example.com', currentValue: 'https://api.example.com' },
      { id: 2, key: 'api_key', initialValue: '', currentValue: '' },
    ],
  },
];

const MOCK_HISTORY = [
  { id: 'h-1', method: 'GET', url: 'https://api.example.com/users', status: 200, duration: 142, time: '14:32:05' },
  { id: 'h-2', method: 'POST', url: 'https://api.example.com/users', status: 201, duration: 310, time: '14:30:12' },
  { id: 'h-3', method: 'GET', url: 'https://api.example.com/orders', status: 200, duration: 98, time: '14:28:44' },
  { id: 'h-4', method: 'DELETE', url: 'https://api.example.com/orders/5', status: 404, duration: 45, time: '14:25:01' },
  { id: 'h-5', method: 'PUT', url: 'https://api.example.com/users/3', status: 500, duration: 1200, time: '14:20:33' },
];

const MOCK_CONSOLE = [
  { time: '14:32:05', type: 'request', message: 'GET https://api.example.com/users → 200 OK (142ms)', ok: true },
  { time: '14:32:05', type: 'test', message: 'status == 200 — passed', ok: true },
  { time: '14:32:05', type: 'test', message: 'body.length > 0 — passed', ok: true },
  { time: '14:32:05', type: 'log', message: 'found 3 users', ok: null },
  { time: '14:30:12', type: 'request', message: 'POST https://api.example.com/users → 201 Created (310ms)', ok: true },
  { time: '14:28:44', type: 'request', message: 'GET https://api.example.com/orders → 200 OK (98ms)', ok: true },
  { time: '14:25:01', type: 'request', message: 'DELETE https://api.example.com/orders/5 → 404 Not Found (45ms)', ok: false },
  { time: '14:25:01', type: 'test', message: 'status == 200 — failed (expected: 200, got: 404)', ok: false },
  { time: '14:20:33', type: 'request', message: 'PUT https://api.example.com/users/3 → 500 Internal Server Error (1200ms)', ok: false },
];

const MOCK_RESPONSE = {
  status: 200,
  statusText: 'OK',
  duration: 142,
  size: '2.1kb',
  body: JSON.stringify([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
    { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'user' },
  ], null, 2),
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'x-request-id': 'abc-123-def',
    'cache-control': 'no-cache',
    'x-ratelimit-remaining': '98',
  },
  testResults: [
    { description: 'status == 200', passed: true },
    { description: 'body.length > 0', passed: true },
    { description: 'body[0].name == "Alice Johnson"', passed: true },
    { description: 'header content-type contains json', passed: true },
    { description: 'duration < 500', passed: true },
    { description: 'body[0].role == "user"', passed: false, expected: 'user', actual: 'admin' },
  ],
  scriptLogs: ['found 3 users'],
};

function newTab() {
  return {
    id: 'tab-' + Date.now(),
    name: 'new request',
    method: 'GET',
    url: '',
    collectionId: null,
    collectionName: null,
    saved: false,
    params: [{ id: 1, key: '', value: '', enabled: true }],
    headers: [{ id: 1, key: '', value: '', enabled: true }],
    body: '',
    bodyType: 'none',
    auth: { type: 'none' },
    preRequestScript: '',
    testScript: '',
    settings: { followRedirects: true, verifySsl: false, timeoutMs: 30000 },
  };
}

// ── App ──

function App() {
  // Theme
  const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
  const [mode, setMode] = React.useState(() => localStorage.getItem('ui-mode') || 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode', mode);
  }, [theme, mode]);

  // Layout
  const [activePanel, setActivePanel] = React.useState('collections');
  const [splitDirection, setSplitDirection] = React.useState('horizontal');
  const [consoleOpen, setConsoleOpen] = React.useState(true);

  // Data
  const [collections, setCollections] = React.useState(MOCK_COLLECTIONS);
  const [environments, setEnvironments] = React.useState(MOCK_ENVIRONMENTS);
  const [activeEnvId, setActiveEnvId] = React.useState('env-1');
  const [history, setHistory] = React.useState(MOCK_HISTORY);
  const [consoleLogs, setConsoleLogs] = React.useState(MOCK_CONSOLE);

  // Request tabs
  const [tabs, setTabs] = React.useState([
    {
      id: 'tab-1',
      name: 'list users',
      method: 'GET',
      url: 'https://api.example.com/users',
      collectionId: 'col-1',
      collectionName: 'user api',
      breadcrumb: ['user api'],
      saved: true,
      params: [
        { id: 1, key: 'page', value: '1', enabled: true },
        { id: 2, key: 'limit', value: '20', enabled: true },
      ],
      headers: [
        { id: 1, key: 'Authorization', value: 'Bearer {{api_key}}', enabled: true },
        { id: 2, key: 'Content-Type', value: 'application/json', enabled: true },
      ],
      body: '',
      bodyType: 'none',
      auth: { type: 'bearer', token: '{{api_key}}' },
    },
    {
      id: 'tab-2',
      name: 'create user',
      method: 'POST',
      url: 'https://api.example.com/users',
      collectionId: 'col-1',
      collectionName: 'user api',
      breadcrumb: ['user api'],
      saved: true,
      params: [{ id: 1, key: '', value: '', enabled: true }],
      headers: [{ id: 1, key: 'Content-Type', value: 'application/json', enabled: true }],
      body: '{\n  "name": "New User",\n  "email": "user@example.com"\n}',
      bodyType: 'json',
      auth: { type: 'bearer', token: '{{api_key}}' },
    },
  ]);
  const [activeTabId, setActiveTabId] = React.useState('tab-1');
  const [response] = React.useState(MOCK_RESPONSE);

  // Search
  const [searchQuery, setSearchQuery] = React.useState('');

  // Modals
  const [modalOpen, setModalOpen] = React.useState(null);
  const [modalData, setModalData] = React.useState(null);

  // Drag resize
  const [paneSize, setPaneSize] = React.useState(null);
  const dragging = React.useRef(false);
  const dragStart = React.useRef({ pos: 0, aSize: 0, total: 0 });

  React.useEffect(() => {
    function onMove(e) {
      if (!dragging.current) return;
      const { pos, aSize, total, axis } = dragStart.current;
      const delta = axis === 'y' ? e.clientY - pos : e.clientX - pos;
      const newSize = Math.max(120, Math.min(total - 120, aSize + delta));
      const pct = (newSize / total) * 100;
      setPaneSize(pct);
    }
    function onUp() {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, []);

  function startDrag(e) {
    const container = e.currentTarget.parentElement;
    if (!container) return;
    const axis = splitDirection === 'horizontal' ? 'x' : 'y';
    const rect = container.getBoundingClientRect();
    const total = axis === 'x' ? rect.width : rect.height;
    const inputPane = container.children[0];
    const aSize = axis === 'x' ? inputPane.getBoundingClientRect().width : inputPane.getBoundingClientRect().height;
    dragging.current = true;
    dragStart.current = { pos: axis === 'x' ? e.clientX : e.clientY, aSize, total, axis };
    document.body.style.cursor = axis === 'x' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  // Tab helpers
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  function updateActiveTab(updates) {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  }

  function addTab() {
    const t = newTab();
    setTabs(prev => [...prev, t]);
    setActiveTabId(t.id);
  }

  function closeTab(tabId) {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== tabId);
      if (next.length === 0) {
        const t = newTab();
        setActiveTabId(t.id);
        return [t];
      }
      if (activeTabId === tabId) {
        const idx = prev.findIndex(t => t.id === tabId);
        setActiveTabId(next[Math.min(idx, next.length - 1)].id);
      }
      return next;
    });
  }

  // Build breadcrumb path: [collectionName, folder1, folder2, ...]
  function buildBreadcrumb(req) {
    if (!req.collectionId) return [];
    const col = collections.find(c => c.id === req.collectionId);
    if (!col) return [];
    const path = [col.name];
    if (!req.folderId) return path;
    // Walk folder tree to find the path to this folder
    function findPath(folders, targetId, trail) {
      for (const f of folders) {
        const next = [...trail, f.name];
        if (f.id === targetId) return next;
        const found = findPath(f.folders || [], targetId, next);
        if (found) return found;
      }
      return null;
    }
    const folderPath = findPath(col.folders || [], req.folderId, []);
    return folderPath ? [...path, ...folderPath] : path;
  }

  function openRequest(req) {
    const existing = tabs.find(t => t.id === req.id);
    if (existing) {
      setActiveTabId(existing.id);
      return;
    }
    const t = {
      id: req.id,
      name: req.name || req.url,
      method: req.method,
      url: req.url,
      collectionId: req.collectionId || null,
      collectionName: req.collectionName || null,
      breadcrumb: buildBreadcrumb(req),
      saved: !!req.collectionId,
      params: [{ id: 1, key: '', value: '', enabled: true }],
      headers: [{ id: 1, key: '', value: '', enabled: true }],
      body: '',
      bodyType: 'none',
      auth: { type: 'none' },
    };
    setTabs(prev => [...prev, t]);
    setActiveTabId(t.id);
  }

  function openEnvModal(envId) {
    setModalData(envId);
    setModalOpen('env');
  }

  function openCollectionModal(colId) {
    setModalData(colId);
    setModalOpen('collection');
  }

  function handleNewAction(type) {
    if (type === 'request') addTab();
    else if (type === 'environment') { setModalData(null); setModalOpen('env'); }
    else if (type === 'collection') { setModalData(null); setModalOpen('collection'); }
  }

  // Rename helpers — update name in collections state tree
  function renameCollection(colId, newName) {
    setCollections(prev => prev.map(c => c.id === colId ? { ...c, name: newName } : c));
  }

  function renameFolder(folderId, newName) {
    function renameFolderIn(folders) {
      return folders.map(f =>
        f.id === folderId
          ? { ...f, name: newName }
          : { ...f, folders: renameFolderIn(f.folders || []) }
      );
    }
    setCollections(prev => prev.map(c => ({ ...c, folders: renameFolderIn(c.folders || []) })));
  }

  function renameRequest(reqId, newName) {
    function renameReqInFolders(folders) {
      return folders.map(f => ({
        ...f,
        requests: f.requests.map(r => r.id === reqId ? { ...r, name: newName } : r),
        folders: renameReqInFolders(f.folders || []),
      }));
    }
    setCollections(prev => prev.map(c => ({
      ...c,
      requests: (c.requests || []).map(r => r.id === reqId ? { ...r, name: newName } : r),
      folders: renameReqInFolders(c.folders || []),
    })));
    // Also update the tab name if this request is open
    setTabs(prev => prev.map(t => t.id === reqId ? { ...t, name: newName } : t));
  }

  function handleSend() {
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);
    const logEntry = { time: timeStr, type: 'request', message: `${tab.method} ${tab.url || '(no url)'} — sending...`, ok: null };
    setConsoleLogs(prev => [logEntry, ...prev]);
  }

  function handleSave() {
    if (!activeTab) return;
    updateActiveTab({ saved: true });
  }

  const activeCollection = activeTab?.collectionId
    ? collections.find(c => c.id === activeTab.collectionId)
    : null;
  const activeBaseUrl = activeCollection?.baseUrl || '';

  const inputStyle = paneSize != null
    ? { flex: 'none', [splitDirection === 'horizontal' ? 'width' : 'height']: paneSize + '%' }
    : { flex: 1 };
  const outputStyle = paneSize != null
    ? { flex: 1 }
    : { flex: 1 };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top bar */}
      <TopBar
        theme={theme}
        onThemeChange={setTheme}
        mode={mode}
        onModeChange={setMode}
        activeEnvId={activeEnvId}
        environments={environments}
        onEnvChange={setActiveEnvId}
        onNewAction={handleNewAction}
        onSearch={setSearchQuery}
      />

      <div className="flex-1 flex min-h-0">
        {/* Activity bar */}
        <ActivityBar
          activePanel={activePanel}
          onPanelChange={p => setActivePanel(activePanel === p ? null : p)}
        />

        {/* Side panel */}
        {activePanel && (
          <SidePanel
            activePanel={activePanel}
            onClose={() => setActivePanel(null)}
            collections={collections}
            environments={environments}
            activeEnvId={activeEnvId}
            onEnvActivate={setActiveEnvId}
            history={history}
            onSelectRequest={openRequest}
            onEditEnv={openEnvModal}
            onEditCollection={openCollectionModal}
            onNewAction={handleNewAction}
            onRenameCollection={renameCollection}
            onRenameFolder={renameFolder}
            onRenameRequest={renameRequest}
            onClearHistory={() => setHistory([])}
            externalSearch={searchQuery}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Request tabs */}
          <RequestTabs
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
            onCloseTab={closeTab}
            onAddTab={addTab}
          />

          {/* Request shoulder */}
          <RequestShoulder
            name={activeTab?.name}
            breadcrumb={activeTab?.breadcrumb || []}
            saved={activeTab?.saved}
            onRename={newName => updateActiveTab({ name: newName })}
            onSave={handleSave}
          />

          {/* URL bar */}
          <UrlBar
            method={activeTab?.method || 'GET'}
            onMethodChange={m => updateActiveTab({ method: m })}
            url={activeTab?.url || ''}
            onUrlChange={u => updateActiveTab({ url: u })}
            onSend={handleSend}
            baseUrl={activeBaseUrl}
          />

          {/* Input / Output split */}
          <div className={`flex-1 flex min-h-0 ${splitDirection === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
            <div style={inputStyle} className="min-h-0 min-w-0 flex flex-col overflow-hidden">
              <InputPane
                tab={activeTab}
                onUpdate={updateActiveTab}
              />
            </div>

            {/* Drag divider with split toggle */}
            <div
              className={`flex-shrink-0 flex items-center justify-center ${
                splitDirection === 'horizontal'
                  ? 'w-[5px] cursor-col-resize hover:bg-gray-200'
                  : 'h-[5px] cursor-row-resize hover:bg-gray-200'
              } bg-gray-100 transition-colors group relative`}
              onMouseDown={startDrag}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setSplitDirection(d => d === 'horizontal' ? 'vertical' : 'horizontal'); setPaneSize(null); }}
                className="absolute z-10 p-0.5 bg-gray-100 border border-gray-200 rounded-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                aria-label="toggle split direction"
              >
                <Icon name={splitDirection === 'horizontal' ? 'split-horizontal' : 'split-vertical'} size={12} className="" />
              </button>
            </div>

            <div style={outputStyle} className="min-h-0 min-w-0 flex flex-col overflow-hidden">
              <OutputPane response={response} />
            </div>
          </div>

          {/* Console */}
          <ConsolePanel
            open={consoleOpen}
            onToggle={() => setConsoleOpen(o => !o)}
            logs={consoleLogs}
            onClear={() => setConsoleLogs([])}
          />
        </div>
      </div>

      {/* Modals */}
      {modalOpen === 'env' && (
        <EnvModal
          environments={environments}
          editEnvId={modalData}
          onClose={() => setModalOpen(null)}
          onSave={envs => { setEnvironments(envs); setModalOpen(null); }}
        />
      )}
      {modalOpen === 'collection' && (
        <CollectionModal
          collections={collections}
          editColId={modalData}
          onClose={() => setModalOpen(null)}
          onSave={cols => { setCollections(cols); setModalOpen(null); }}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
