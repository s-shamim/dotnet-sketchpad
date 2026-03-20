// script.jsx
// Root app component — wires all panels together, manages global state

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

    // Build query string from enabled params
    const qs = params.filter(p => p.enabled && p.key).map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
    const fullUrl = qs ? `${url}${url.includes('?') ? '&' : '?'}${qs}` : url;

    // Build headers
    const reqHeaders = {};
    headers.filter(h => h.enabled && h.key).forEach(h => { reqHeaders[h.key] = h.value; });

    try {
      const proxyRes = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url: fullUrl,
          headers: reqHeaders,
          body: ['GET', 'HEAD'].includes(method) ? null : body || null,
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
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
