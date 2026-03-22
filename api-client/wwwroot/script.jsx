// script.jsx
// Root app component — wires all panels together, manages global state

// Replaces {{key}} patterns with values from the active environment's variables
function interpolate(str, vars) {
  if (!str || !vars?.length) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const v = vars.find(v => v.key === key);
    return v ? (v.currentValue || v.initialValue || match) : match;
  });
}

// Modal for saving the current request into a collection
function SaveModal({ open, collections, onClose, onSave }) {
  const [colId, setColId] = React.useState('');
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setColId(collections[0]?.id || '');
      setName('');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.18)' }}>
      <div className="bg-white border border-gray-200 flex flex-col" style={{ width: 340 }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-[12px] font-medium text-gray-900 tracking-wide" style={{ fontFamily: 'Geist, sans-serif' }}>save to collection</span>
          <button onClick={onClose} className="text-[11px] text-gray-400 hover:text-gray-900 bg-transparent border-0 cursor-pointer transition-colors" style={{ fontFamily: 'Geist, sans-serif' }}>✕ close</button>
        </div>
        <div className="px-4 py-4 flex flex-col gap-4">
          <div>
            <p className="text-[9px] tracking-widest text-gray-300 mb-2">collection</p>
            {collections.length === 0 ? (
              <p className="text-[11px] text-gray-400">no collections yet. create one first.</p>
            ) : (
              <select
                value={colId}
                onChange={e => setColId(e.target.value)}
                className="border-b border-gray-400 pb-1 text-[11px] text-gray-900 bg-transparent outline-none w-full cursor-pointer"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </div>
          <div>
            <p className="text-[9px] tracking-widest text-gray-300 mb-2">request name</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="my request"
              className="border-b border-gray-400 focus:border-gray-900 pb-1 text-[11px] text-gray-900 bg-transparent outline-none w-full placeholder-gray-300 font-mono-geist"
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <button onClick={onClose} className="text-[11px] text-gray-400 hover:text-gray-900 bg-transparent border-0 cursor-pointer transition-colors" style={{ fontFamily: 'Geist, sans-serif' }}>cancel</button>
          <button
            onClick={() => onSave(colId, name)}
            disabled={!colId || !name.trim()}
            className="text-[11px] font-medium text-gray-900 bg-transparent border-0 send-emphasis cursor-pointer pb-[2px] tracking-wide hover:opacity-50 transition-opacity disabled:opacity-30"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >save</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Request state
  const [method, setMethod] = React.useState('GET');
  const [url, setUrl] = React.useState('https://api.example.com/users');
  const [params, setParams] = React.useState([{ key: 'page', value: '1', enabled: true }, { key: 'limit', value: '20', enabled: true }]);
  const [headers, setHeaders] = React.useState([{ key: 'Authorization', value: 'Bearer {{api_key}}', enabled: true }, { key: 'Content-Type', value: 'application/json', enabled: true }]);
  const [body, setBody] = React.useState('');
  const [bodyType, setBodyType] = React.useState('none');
  const [auth, setAuth] = React.useState({ type: 'bearer token', token: '{{api_key}}' });

  // Response state
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Collections & history
  const [collections, setCollections] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [logs, setLogs] = React.useState([]);

  // Environment
  const [environments, setEnvironments] = React.useState([]);
  const [activeEnvId, setActiveEnvId] = React.useState(null);

  // Layout
  const [layout, setLayout] = React.useState('stacked'); // 'stacked' | 'split'
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [consoleOpen, setConsoleOpen] = React.useState(true);
  const [envModalOpen, setEnvModalOpen] = React.useState(false);
  const [saveOpen, setSaveOpen] = React.useState(false);

  // Drag resize
  const [reqSize, setReqSize] = React.useState(null); // px or null (flex:1)
  const [resSize, setResSize] = React.useState(null);
  const dragging = React.useRef(false);
  const dragStart = React.useRef({ pos: 0, a: 0, b: 0 });

  // Load all initial data from the API once on mount
  React.useEffect(() => {
    Promise.all([
      fetch('/api/collections').then(r => r.json()),
      fetch('/api/environments').then(r => r.json()),
      fetch('/api/history').then(r => r.json()),
      fetch('/api/preferences').then(r => r.json()),
    ]).then(([cols, envs, hist, prefs]) => {
      setCollections(cols);
      setEnvironments(envs);
      setHistory(hist.map(h => ({ ...h, url: h.url })));
      setLayout(prefs.layout || 'stacked');
      setSidebarOpen(prefs.sidebarOpen !== false);
      setConsoleOpen(prefs.consoleOpen !== false);
      if (prefs.activeEnvironmentId) setActiveEnvId(prefs.activeEnvironmentId);
      else if (envs.length > 0) setActiveEnvId(envs[0].id);
    }).catch(() => {/* ignore load errors, use empty defaults */});
  }, []);

  // Persist preferences whenever layout/sidebar/console/env changes (debounced)
  const prefsSaveTimer = React.useRef(null);
  React.useEffect(() => {
    clearTimeout(prefsSaveTimer.current);
    prefsSaveTimer.current = setTimeout(() => {
      fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout, sidebarOpen, consoleOpen, activeEnvironmentId: activeEnvId }),
      });
    }, 500);
  }, [layout, sidebarOpen, consoleOpen, activeEnvId]);

  function addLog(msg, ok) {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    setLogs(prev => [{ time, message: msg, ok }, ...prev].slice(0, 50));
  }

  async function handleSend() {
    if (!url) return;
    setLoading(true);
    setResponse(null);
    const start = Date.now();

    // Resolve environment variables in url, headers, and body
    const activeEnv = environments.find(e => e.id === activeEnvId);
    const activeVars = activeEnv?.variables || [];

    // Build query string from enabled params
    const resolvedUrl = interpolate(url, activeVars);
    const qs = params.filter(p => p.enabled && p.key).map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
    const fullUrl = qs ? `${resolvedUrl}${resolvedUrl.includes('?') ? '&' : '?'}${qs}` : resolvedUrl;

    // Build headers — inject auth first so the headers table can override
    const reqHeaders = {};
    if (auth.type === 'bearer token' && auth.token) {
      reqHeaders['Authorization'] = `Bearer ${interpolate(auth.token, activeVars)}`;
    } else if (auth.type === 'basic auth' && auth.username) {
      reqHeaders['Authorization'] = 'Basic ' + btoa(`${auth.username || ''}:${auth.password || ''}`);
    } else if (auth.type === 'api key' && auth.apiKeyName) {
      reqHeaders[auth.apiKeyName] = interpolate(auth.apiKeyValue || '', activeVars);
    }
    headers.filter(h => h.enabled && h.key).forEach(h => { reqHeaders[h.key] = interpolate(h.value, activeVars); });

    try {
      const proxyRes = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url: fullUrl,
          headers: reqHeaders,
          body: ['GET', 'HEAD'].includes(method) ? null : interpolate(body, activeVars) || null,
          timeoutMs: 30000,
        }),
      });
      const duration = Date.now() - start;

      if (!proxyRes.ok) {
        const errText = await proxyRes.text();
        addLog(`${method} ${fullUrl} → proxy error ${proxyRes.status}`, false);
        setResponse({ status: proxyRes.status, statusText: 'proxy error', body: errText, headers: {}, duration, size: '0b' });
        return;
      }

      const data = await proxyRes.json();
      const sizeStr = data.sizeBytes > 1024 ? (data.sizeBytes / 1024).toFixed(1) + 'kb' : data.sizeBytes + 'b';

      setResponse({ status: data.status, statusText: data.statusText, body: data.body, headers: data.headers, duration: data.durationMs, size: sizeStr });
      addLog(`${method} ${fullUrl} → ${data.status} ${data.statusText} (${data.durationMs}ms)`, data.status < 400);

      // Persist to history
      const entry = { method, url: fullUrl, status: data.status, statusText: data.statusText, duration: data.durationMs, timestamp: new Date().toISOString() };
      fetch('/api/history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) })
        .then(r => r.json())
        .then(saved => setHistory(prev => [{ ...saved, time: new Date().toTimeString().slice(0, 8) }, ...prev].slice(0, 50)))
        .catch(() => {});
    } catch (err) {
      addLog(`${method} ${fullUrl} → ${err.message}`, false);
      setResponse({ status: 0, statusText: 'error', body: err.message, headers: {}, duration: Date.now() - start, size: '0b' });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCollection() {
    const name = prompt('collection name:');
    if (!name) return;
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const col = await res.json();
        setCollections(prev => [...prev, col]);
      }
    } catch { /* ignore */ }
  }

  async function handleSave(colId, name) {
    try {
      const res = await fetch(`/api/collections/${colId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, method, url, params, headers, body, bodyType, auth }),
      });
      if (res.ok) {
        const saved = await res.json();
        setCollections(prev => prev.map(c =>
          c.id !== colId ? c : { ...c, requests: [...(c.requests || []), saved] }
        ));
      }
    } catch { /* ignore */ }
    setSaveOpen(false);
  }

  function handleSelectRequest(req) {
    setMethod(req.method || 'GET');
    setUrl(req.url || '');
    setParams(req.params || []);
    setHeaders(req.headers || []);
    setBody(req.body || '');
    setBodyType(req.bodyType || 'none');
    setAuth(req.auth || { type: 'bearer token' });
    setResponse(null);
  }

  function handleToggleLayout() {
    setLayout(l => l === 'stacked' ? 'split' : 'stacked');
    setReqSize(null);
    setResSize(null);
  }

  // Mouse drag for resize
  React.useEffect(() => {
    function onMove(e) {
      if (!dragging.current) return;
      const { pos, a, b, axis } = dragStart.current;
      const delta = axis === 'y' ? e.clientY - pos : e.clientX - pos;
      setReqSize(Math.max(60, a + delta));
      setResSize(Math.max(60, b - delta));
    }
    function onUp() { dragging.current = false; document.body.style.cursor = ''; }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, []);

  function startDrag(e, axis) {
    const reqEl = document.getElementById('req-pane');
    const resEl = document.getElementById('res-pane');
    if (!reqEl || !resEl) return;
    dragging.current = true;
    dragStart.current = {
      pos: axis === 'y' ? e.clientY : e.clientX,
      a: axis === 'y' ? reqEl.getBoundingClientRect().height : reqEl.getBoundingClientRect().width,
      b: axis === 'y' ? resEl.getBoundingClientRect().height : resEl.getBoundingClientRect().width,
      axis,
    };
    document.body.style.cursor = axis === 'y' ? 'row-resize' : 'col-resize';
    e.preventDefault();
  }

  const reqStyle = reqSize ? { flex: 'none', [layout === 'stacked' ? 'height' : 'width']: reqSize } : { flex: 1 };
  const resStyle = resSize ? { flex: 'none', [layout === 'stacked' ? 'height' : 'width']: resSize } : { flex: 1 };

  return (
    <div className="flex flex-col bg-white overflow-hidden" style={{ height: '100vh' }}>

      {/* URL bar */}
      <UrlBar
        method={method} onMethodChange={setMethod}
        url={url} onUrlChange={setUrl}
        environment={activeEnvId}
        environments={environments}
        onEnvChange={setActiveEnvId}
        onSend={handleSend}
        onSave={() => setSaveOpen(true)}
        loading={loading}
      />

      {/* Body row */}
      <div className="flex overflow-hidden" style={{ flex: 1, minHeight: 0 }}>

        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          collections={collections}
          history={history}
          environments={environments}
          activeEnvId={activeEnvId}
          onEnvActivate={setActiveEnvId}
          onOpenEnvModal={() => setEnvModalOpen(true)}
          onSelectRequest={handleSelectRequest}
          onAddCollection={handleAddCollection}
        />

        {/* Main column */}
        <div className="flex flex-col overflow-hidden" style={{ flex: 1, minWidth: 0 }}>

          {/* Workspace */}
          <div className={`flex overflow-hidden ${layout === 'stacked' ? 'flex-col' : 'flex-row'}`} style={{ flex: 1, minHeight: 0 }}>

            {/* Request pane */}
            <div id="req-pane" className="flex flex-col overflow-hidden" style={{ ...reqStyle, minHeight: 0, minWidth: 0 }}>
              <RequestPane
                params={params} onParamsChange={setParams}
                headers={headers} onHeadersChange={setHeaders}
                body={body} onBodyChange={setBody}
                bodyType={bodyType} onBodyTypeChange={setBodyType}
                auth={auth} onAuthChange={setAuth}
              />
            </div>

            {/* Drag handle */}
            {layout === 'stacked' ? (
              <div
                onMouseDown={e => startDrag(e, 'y')}
                className="drag-h flex-shrink-0 border-t border-gray-200 flex items-center justify-center bg-transparent hover:bg-gray-50"
                style={{ height: 5, position: 'relative' }}
              >
                <span style={{ width: 28, height: 1.5, background: '#d1d5db', borderRadius: 2, position: 'absolute' }} />
              </div>
            ) : (
              <div
                onMouseDown={e => startDrag(e, 'x')}
                className="drag-v flex-shrink-0 border-l border-gray-200 flex items-center justify-center bg-transparent hover:bg-gray-50"
                style={{ width: 5, position: 'relative' }}
              >
                <span style={{ width: 1.5, height: 28, background: '#d1d5db', borderRadius: 2, position: 'absolute' }} />
              </div>
            )}

            {/* Response pane */}
            <div
              id="res-pane"
              className={`flex flex-col overflow-hidden ${layout === 'stacked' ? 'border-t border-gray-200' : 'border-l border-gray-200'}`}
              style={{ ...resStyle, minHeight: 0, minWidth: 0 }}
            >
              <ResponsePane response={response} loading={loading} />
            </div>

          </div>

          {/* Bottom bar */}
          <BottomBar
            logs={logs}
            layout={layout}
            onToggleLayout={handleToggleLayout}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(o => !o)}
            consoleOpen={consoleOpen}
            onToggleConsole={() => setConsoleOpen(o => !o)}
          />
        </div>
      </div>

      {/* Env modal */}
      <EnvModal
        open={envModalOpen}
        environments={environments}
        activeEnvId={activeEnvId}
        onClose={() => setEnvModalOpen(false)}
        onSave={async (localEnvs) => {
          const serverIds = new Set(environments.map(e => e.id));
          const results = await Promise.all(localEnvs.map(async env => {
            if (serverIds.has(env.id)) {
              // update existing
              const res = await fetch(`/api/environments/${env.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: env.name, variables: env.variables }),
              });
              return res.ok ? res.json() : env;
            } else {
              // create new
              const res = await fetch('/api/environments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: env.name, variables: env.variables }),
              });
              return res.ok ? res.json() : env;
            }
          }));
          setEnvironments(results);
          setEnvModalOpen(false);
        }}
      />
      <SaveModal
        open={saveOpen}
        collections={collections}
        onClose={() => setSaveOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
