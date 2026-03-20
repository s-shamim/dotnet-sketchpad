const { useState, useEffect } = React;

function App() {
  const [config, setConfig] = useState({ host: '127.0.0.1', port: '6379' });
  const [health, setHealth] = useState({ connected: false, latencyMs: null, error: null });
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchConfig();
    checkHealth();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig({ host: data.host, port: String(data.port) });
    } catch { /* ignored */ }
  }

  async function checkHealth() {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
      if (data.connected) fetchKeys();
    } catch {
      setHealth({ connected: false, latencyMs: null, error: 'unable to reach server' });
    }
  }

  async function connect() {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: config.host, port: parseInt(config.port) || 6379 })
      });
      const data = await res.json();
      if (data.isConnected) {
        checkHealth();
      } else {
        setHealth({ connected: false, latencyMs: null, error: data.lastError || 'connection failed' });
      }
    } catch (e) {
      setHealth({ connected: false, latencyMs: null, error: e.message });
    }
  }

  async function fetchKeys() {
    setLoading(true);
    try {
      const res = await fetch('/api/keys');
      if (res.ok) setKeys(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function selectKey(key) {
    setSelectedKey(key);
    setSaved(false);
    try {
      const res = await fetch(`/api/keys/${encodeURIComponent(key)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedValue(data.value);
      }
    } catch { /* ignored */ }
  }

  async function saveValue() {
    if (!selectedKey) return;
    await fetch(`/api/keys/${encodeURIComponent(selectedKey)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: selectedValue })
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function addKey() {
    if (!newKey.trim()) return;
    await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: newKey.trim(), value: newValue })
    });
    setNewKey('');
    setNewValue('');
    fetchKeys();
  }

  async function deleteKey(key) {
    await fetch(`/api/keys/${encodeURIComponent(key)}`, { method: 'DELETE' });
    if (selectedKey === key) {
      setSelectedKey(null);
      setSelectedValue('');
    }
    fetchKeys();
  }

  const statusDot = health.connected
    ? 'bg-green-300'
    : health.error
    ? 'bg-red-300'
    : 'bg-gray-200';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-16 px-6">

        {/* Header */}
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          redis manager
        </h1>

        {/* Connection Bar */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot}`} />
          <input
            type="text"
            value={config.host}
            onChange={e => setConfig(c => ({ ...c, host: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && connect()}
            placeholder="host"
            className="border-b border-gray-300 py-1.5 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm w-44"
          />
          <span className="text-gray-300 text-sm">:</span>
          <input
            type="text"
            value={config.port}
            onChange={e => setConfig(c => ({ ...c, port: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && connect()}
            placeholder="6379"
            className="border-b border-gray-300 py-1.5 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm w-16"
          />
          <button
            onClick={connect}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors"
          >
            connect
          </button>
          {health.connected && health.latencyMs != null && (
            <span className="text-xs text-gray-300">{health.latencyMs}ms</span>
          )}
          {!health.connected && health.error && (
            <span className="text-xs text-red-300 truncate max-w-xs">{health.error}</span>
          )}
        </div>

        {/* Dashboard — visible when connected */}
        {health.connected ? (
          <div className="flex gap-12">

            {/* Left: Key List */}
            <div className="w-52 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs tracking-widest text-gray-400 uppercase">keys</h2>
                <button
                  onClick={fetchKeys}
                  title="refresh"
                  className="text-gray-300 hover:text-gray-600 text-base leading-none transition-colors"
                >
                  ↻
                </button>
              </div>

              {loading ? (
                <p className="text-xs text-gray-300 py-4">loading...</p>
              ) : keys.length === 0 ? (
                <p className="text-center text-gray-300 text-sm py-8">no keys.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {keys.map(key => (
                    <li
                      key={key}
                      className="flex items-center justify-between py-2.5 group cursor-pointer"
                      onClick={() => selectKey(key)}
                    >
                      <span
                        className={`text-sm truncate flex-1 transition-colors ${
                          selectedKey === key
                            ? 'text-gray-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={key}
                      >
                        {key}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); deleteKey(key); }}
                        className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs ml-2 flex-shrink-0 transition-all"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right: Add Key + Detail Panel */}
            <div className="flex-1 min-w-0">

              {/* Add Key Section */}
              <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">add key</h2>
              <div className="mb-3">
                <input
                  type="text"
                  value={newKey}
                  onChange={e => setNewKey(e.target.value)}
                  placeholder="key"
                  className="w-full border-b border-gray-300 py-1.5 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
                />
              </div>
              <textarea
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="value"
                rows={3}
                className="w-full border border-gray-200 py-2 px-3 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 text-sm resize-y"
              />
              <div className="flex justify-end mt-2 mb-10">
                <button
                  onClick={addKey}
                  className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors"
                >
                  add
                </button>
              </div>

              {/* Selected Key Detail */}
              {selectedKey && (
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-1">value</h2>
                  <p className="text-sm text-gray-400 font-mono mb-3 truncate" title={selectedKey}>
                    {selectedKey}
                  </p>
                  <textarea
                    value={selectedValue}
                    onChange={e => setSelectedValue(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-200 py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400 text-sm resize-y font-mono"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={saveValue}
                      className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors"
                    >
                      {saved ? 'saved.' : 'save'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          <p className="text-center text-gray-300 text-sm py-12">
            enter connection details above and press connect.
          </p>
        )}

      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
