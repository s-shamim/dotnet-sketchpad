const METHOD_COLORS = {
  GET:    'text-green-600',
  POST:   'text-blue-500',
  PUT:    'text-yellow-600',
  PATCH:  'text-orange-500',
  DELETE: 'text-red-400',
};

function methodColor(m) {
  return METHOD_COLORS[m.toUpperCase()] || 'text-gray-500';
}

function buildSpecUrl(baseUrl, swaggerPath, version) {
  const base = baseUrl.replace(/\/$/, '');
  const sp   = swaggerPath.startsWith('/') ? swaggerPath : '/' + swaggerPath;
  // Common conventions: /swagger/v1/swagger.json  or  /v2/swagger.json
  return `${base}${sp}/${version}/swagger.json`;
}

function parseEndpoints(spec) {
  const endpoints = [];
  const paths = spec.paths || {};
  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (['get','post','put','patch','delete','options','head'].includes(method)) {
        endpoints.push({
          method:  method.toUpperCase(),
          path,
          summary: op.summary || op.operationId || '',
          tags:    op.tags || [],
        });
      }
    }
  }
  return endpoints;
}

function App() {
  const [baseUrl,     setBaseUrl]     = React.useState('');
  const [swaggerPath, setSwaggerPath] = React.useState('/swagger');
  const [version,     setVersion]     = React.useState('v1');
  const [endpoints,   setEndpoints]   = React.useState([]);
  const [loading,     setLoading]     = React.useState(false);
  const [error,       setError]       = React.useState('');
  const [copied,      setCopied]      = React.useState(false);
  const [settingsLoading, setSettingsLoading] = React.useState(true);

  // load settings on mount
  React.useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(s => {
        if (s.baseUrl)     setBaseUrl(s.baseUrl);
        if (s.swaggerPath) setSwaggerPath(s.swaggerPath);
        if (s.version)     setVersion(s.version);
      })
      .catch(() => {})
      .finally(() => setSettingsLoading(false));
  }, []);

  const specUrl = buildSpecUrl(baseUrl, swaggerPath, version);

  const fetchEndpoints = async () => {
    setLoading(true);
    setError('');
    setEndpoints([]);
    try {
      const proxyUrl = '/api/openapi-proxy?url=' + encodeURIComponent(specUrl);
      const res = await fetch(proxyUrl);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`${res.status} — ${msg}`);
      }
      const spec = await res.json();
      const parsed = parseEndpoints(spec);
      if (parsed.length === 0) {
        setError('No endpoints found. The spec was fetched but contained no paths.');
      } else {
        setEndpoints(parsed);
      }
    } catch (e) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    const text = endpoints
      .map(e => `${e.method} ${e.path}${e.summary ? ' — ' + e.summary : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto pt-20 px-4 pb-20">

        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          openapi explorer
        </h1>

        {/* Settings */}
        <div className="mb-8">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">settings</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 lowercase block mb-1">base url</label>
              <input
                type="text"
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com"
                className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500"
                disabled={settingsLoading}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <label className="text-xs text-gray-400 lowercase block mb-1">swagger path</label>
                <input
                  type="text"
                  value={swaggerPath}
                  onChange={e => setSwaggerPath(e.target.value)}
                  placeholder="/swagger"
                  className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500"
                  disabled={settingsLoading}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 lowercase block mb-1">version</label>
                <input
                  type="text"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  placeholder="v1"
                  className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500"
                  disabled={settingsLoading}
                />
              </div>
            </div>
          </div>

          {/* URL preview */}
          <p className="mt-4 text-xs text-gray-300 break-all">
            {baseUrl ? specUrl : 'fill in base url to see the constructed spec url'}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={fetchEndpoints}
              disabled={loading || settingsLoading || !baseUrl}
              className="text-gray-400 hover:text-gray-700 text-sm px-2 py-1 transition-colors disabled:text-gray-200 disabled:cursor-not-allowed"
            >
              {loading ? 'fetching...' : 'fetch endpoints'}
            </button>
            {endpoints.length > 0 && (
              <button
                onClick={copyAll}
                className="text-gray-400 hover:text-gray-700 text-sm px-2 py-1 transition-colors"
              >
                {copied ? 'copied ✓' : 'copy all'}
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="border-l-2 border-red-200 pl-4 py-2 mb-6">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Endpoint list */}
        {endpoints.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs tracking-widest text-gray-400 uppercase">
                endpoints <span className="normal-case text-gray-300">({endpoints.length})</span>
              </h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {endpoints.map((ep, i) => (
                <li key={i} className="flex items-start gap-4 py-3 group">
                  <span className={`text-xs font-mono w-14 shrink-0 pt-0.5 ${methodColor(ep.method)}`}>
                    {ep.method}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 font-mono break-all">{ep.path}</p>
                    {ep.summary && (
                      <p className="text-xs text-gray-400 mt-0.5">{ep.summary}</p>
                    )}
                    {ep.tags.length > 0 && (
                      <p className="text-xs text-gray-300 mt-0.5">{ep.tags.join(', ')}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty state — only after a successful fetch */}
        {!loading && !error && endpoints.length === 0 && !settingsLoading && (
          <p className="text-center text-gray-300 text-sm py-8">
            nothing here yet. fill in the settings and click fetch endpoints.
          </p>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
