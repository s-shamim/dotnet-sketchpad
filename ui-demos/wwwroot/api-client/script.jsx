function App() {
  const [method, setMethod] = React.useState('GET');
  const [url, setUrl] = React.useState('https://jsonplaceholder.typicode.com/posts/1');
  const [headers, setHeaders] = React.useState([{ id: 1, key: 'Content-Type', value: 'application/json', enabled: true }]);
  const [body, setBody] = React.useState('');
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('headers');
  const [responseTab, setResponseTab] = React.useState('body');
  const [history, setHistory] = React.useState([]);

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  const addHeader = () => {
    setHeaders([...headers, { id: Date.now(), key: '', value: '', enabled: true }]);
  };

  const updateHeader = (id, field, value) => {
    setHeaders(headers.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const deleteHeader = (id) => {
    setHeaders(headers.filter(h => h.id !== id));
  };

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    const startTime = Date.now();

    try {
      const enabledHeaders = headers
        .filter(h => h.enabled && h.key)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

      const options = { method, headers: enabledHeaders };
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const duration = Date.now() - startTime;

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      const responseHeaders = {};
      res.headers.forEach((value, key) => { responseHeaders[key] = value; });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        data,
        duration,
        size: JSON.stringify(data).length
      });

      setHistory([{
        id: Date.now(),
        method,
        url,
        status: res.status,
        duration,
        timestamp: new Date().toLocaleTimeString()
      }, ...history.slice(0, 9)]);

    } catch (error) {
      setResponse({ error: true, message: error.message, duration: Date.now() - startTime });
    }

    setLoading(false);
  };

  const loadFromHistory = (item) => {
    setMethod(item.method);
    setUrl(item.url);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-blue-600';
    if (status >= 400 && status < 500) return 'text-orange-500';
    if (status >= 500) return 'text-red-500';
    return 'text-gray-600';
  };

  const Tab = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`pb-2 px-1 text-sm transition-colors ${active ? 'border-b border-gray-700 text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto pt-20 px-4">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          api client
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">
              history <span className="normal-case text-gray-300">({history.length})</span>
            </h2>
            {history.length === 0 ? (
              <p className="text-sm text-gray-300">no requests yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {history.map(item => (
                  <li
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="py-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{item.method}</span>
                      <span className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{item.url}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{item.duration}ms · {item.timestamp}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* Request */}
            <div>
              <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">request</h2>

              {/* URL Bar */}
              <div className="flex items-center gap-2 border-b border-gray-300 mb-6">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="text-sm text-gray-700 py-2 focus:outline-none bg-transparent"
                >
                  {methods.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendRequest()}
                  placeholder="enter request url"
                  className="flex-1 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none"
                />
                <button
                  onClick={sendRequest}
                  disabled={loading || !url}
                  className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors disabled:text-gray-200 disabled:cursor-not-allowed"
                >
                  {loading ? 'sending...' : 'send'}
                </button>
              </div>

              {/* Request Tabs */}
              <div className="flex gap-4 mb-4">
                <Tab
                  label={`headers (${headers.filter(h => h.enabled && h.key).length})`}
                  active={activeTab === 'headers'}
                  onClick={() => setActiveTab('headers')}
                />
                <Tab
                  label="body"
                  active={activeTab === 'body'}
                  onClick={() => setActiveTab('body')}
                />
              </div>

              {/* Headers Tab */}
              {activeTab === 'headers' && (
                <div className="space-y-2">
                  {headers.map(header => (
                    <div key={header.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => updateHeader(header.id, 'enabled', e.target.checked)}
                        className="accent-gray-400 w-4 h-4 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                        placeholder="key"
                        className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                        placeholder="value"
                        className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500"
                      />
                      <button
                        onClick={() => deleteHeader(header.id)}
                        className="text-gray-200 hover:text-red-400 text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addHeader}
                    className="text-gray-400 hover:text-gray-700 text-sm transition-colors mt-2"
                  >
                    + add header
                  </button>
                </div>
              )}

              {/* Body Tab */}
              {activeTab === 'body' && (
                <div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="enter request body (json, xml, etc.)"
                    className="w-full h-40 border-b border-gray-200 py-2 font-mono text-sm text-gray-700 placeholder-gray-300 focus:outline-none resize-none"
                    disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
                  />
                  {!['POST', 'PUT', 'PATCH'].includes(method) && (
                    <p className="text-xs text-gray-300 mt-2">body is only available for post, put, and patch requests</p>
                  )}
                </div>
              )}
            </div>

            {/* Response */}
            {response && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs tracking-widest text-gray-400 uppercase">response</h2>
                  {!response.error && (
                    <div className="flex items-center gap-4 text-xs">
                      <span className={getStatusColor(response.status)}>{response.status} {response.statusText}</span>
                      <span className="text-gray-400">{response.duration}ms</span>
                      <span className="text-gray-400">{(response.size / 1024).toFixed(2)} kb</span>
                    </div>
                  )}
                </div>

                {response.error ? (
                  <div className="border-l-2 border-red-200 pl-4 py-2">
                    <p className="text-sm text-red-400">{response.message}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-4 mb-4">
                      <Tab label="body" active={responseTab === 'body'} onClick={() => setResponseTab('body')} />
                      <Tab
                        label={`headers (${Object.keys(response.headers).length})`}
                        active={responseTab === 'headers'}
                        onClick={() => setResponseTab('headers')}
                      />
                    </div>

                    {responseTab === 'body' && (
                      <div className="border-b border-gray-100 pb-4 max-h-96 overflow-auto">
                        <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                          {typeof response.data === 'object'
                            ? JSON.stringify(response.data, null, 2)
                            : response.data}
                        </pre>
                      </div>
                    )}

                    {responseTab === 'headers' && (
                      <ul className="divide-y divide-gray-100 max-h-96 overflow-auto">
                        {Object.entries(response.headers).map(([key, value]) => (
                          <li key={key} className="flex gap-4 py-2 text-xs">
                            <span className="text-gray-500 min-w-[180px]">{key}</span>
                            <span className="text-gray-400 break-all">{value}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
