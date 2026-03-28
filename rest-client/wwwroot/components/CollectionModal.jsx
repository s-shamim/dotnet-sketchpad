// CollectionModal.jsx — modal for collection settings, headers, auth, scripts, tests, import

function ImportSection({ onImported, selectedCol }) {
  const [json, setJson] = React.useState('');
  const [baseUrl, setBaseUrl] = React.useState('');
  const [error, setError] = React.useState('');
  const [status, setStatus] = React.useState('');
  const fileRef = React.useRef(null);

  function detectFormat(parsed) {
    if (parsed?.info?.schema?.includes('postman')) return 'postman';
    if (parsed?.name && (parsed?.requests || parsed?.folders)) return 'custom';
    return 'unknown';
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setJson(ev.target.result);
    reader.readAsText(file);
  }

  async function doImport() {
    setError('');
    setStatus('');
    let parsed;
    try {
      parsed = JSON.parse(json);
    } catch {
      setError('invalid json — check the pasted content');
      return;
    }
    const format = detectFormat(parsed);
    if (format === 'unknown') {
      setError('unrecognized format — expected postman v2.1 or custom json');
      return;
    }
    setStatus('importing...');
    try {
      const res = await fetch('/api/collections/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, json, baseUrl: baseUrl || undefined }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || `import failed (${res.status})`);
        setStatus('');
        return;
      }
      const imported = await res.json();
      setStatus('imported successfully');
      if (onImported) onImported(imported);
    } catch (err) {
      setError('request failed — is the server running?');
      setStatus('');
    }
  }

  let detectedFormat = '';
  try {
    const p = JSON.parse(json);
    detectedFormat = detectFormat(p);
  } catch {}

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-400 lowercase">import from postman v2.1 or custom json format</p>

      {/* Paste or upload */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400 lowercase">paste json</label>
          <div className="flex items-center gap-2">
            {detectedFormat && detectedFormat !== 'unknown' && (
              <span className="text-[10px] text-gray-400 lowercase">detected: {detectedFormat}</span>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="text-[10px] text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-0.5 rounded-sm transition-colors lowercase"
            >
              upload file
            </button>
            <input ref={fileRef} type="file" accept=".json" onChange={handleFile} className="hidden" />
          </div>
        </div>
        <textarea
          value={json}
          onChange={e => { setJson(e.target.value); setError(''); setStatus(''); }}
          placeholder={'paste collection json here...\n\n// postman v2.1 or custom format\n{\n  "name": "my api",\n  "baseUrl": "{{baseUrl}}",\n  "requests": [...]\n}'}
          rows={8}
          className="w-full border border-gray-200 rounded-sm py-2 px-3 text-sm text-gray-700 placeholder-gray-300 bg-transparent resize-none focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 font-mono"
        />
      </div>

      {/* Base URL override (always shown for Postman; optional for custom) */}
      <div>
        <label className="text-xs text-gray-400 lowercase mb-1 block">
          base url {detectedFormat !== 'postman' && <span className="text-gray-300">(optional)</span>}
        </label>
        <input
          value={baseUrl}
          onChange={e => setBaseUrl(e.target.value)}
          placeholder="https://api.example.com or {{baseUrl}}"
          className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 font-mono placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
        />
        {detectedFormat === 'postman' && (
          <p className="text-[10px] text-gray-300 mt-1">strips this prefix from all request urls and stores relative paths</p>
        )}
      </div>

      {/* Feedback */}
      {error && <p className="text-xs text-red-400 lowercase">{error}</p>}
      {status && <p className="text-xs text-green-600 lowercase">{status}</p>}

      <button
        onClick={doImport}
        disabled={!json.trim()}
        className="self-start text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors lowercase"
      >
        import
      </button>
    </div>
  );
}

window.CollectionModal = function CollectionModal({ collections, editColId, onClose, onSave }) {
  const isNew = !editColId;
  const [localCols, setLocalCols] = React.useState(() => JSON.parse(JSON.stringify(collections)));
  const [selectedColId, setSelectedColId] = React.useState(editColId || collections[0]?.id || null);
  const [activeSection, setActiveSection] = React.useState('settings');

  const selectedCol = isNew && !localCols.find(c => c.id === selectedColId)
    ? null
    : localCols.find(c => c.id === selectedColId);

  function updateCol(field, val) {
    setLocalCols(prev => prev.map(c =>
      c.id !== selectedColId ? c : { ...c, [field]: val }
    ));
  }

  function addNewCol() {
    const id = 'col-' + Date.now();
    const newCol = {
      id, name: 'new collection', description: '', baseUrl: '',
      headers: [{ id: 1, key: '', value: '', enabled: true }],
      authType: 'none', authData: {},
      preRequestScript: '', testScript: '',
      settings: { followRedirects: true, verifySsl: false, timeoutMs: 30000 },
      folders: [], requests: [],
    };
    setLocalCols(prev => [...prev, newCol]);
    setSelectedColId(id);
  }

  React.useEffect(() => {
    if (isNew && !selectedCol) addNewCol();
  }, []);

  // Count all requests recursively
  function countRequests(col) {
    let count = (col.requests || []).length;
    (col.folders || []).forEach(f => { count += countFolderRequests(f); });
    return count;
  }
  function countFolderRequests(f) {
    let count = (f.requests || []).length;
    (f.folders || []).forEach(sub => { count += countFolderRequests(sub); });
    return count;
  }

  const sectionTabs = [
    { id: 'settings', label: 'settings' },
    { id: 'headers', label: 'headers' },
    { id: 'auth', label: 'auth' },
    { id: 'scripts', label: 'scripts' },
    { id: 'tests', label: 'tests' },
    { id: 'import', label: 'import' },
  ];

  const authTypes = [
    { value: 'none', label: 'no auth' },
    { value: 'bearer', label: 'bearer token' },
    { value: 'basic', label: 'basic auth' },
    { value: 'apikey', label: 'api key' },
  ];

  return (
    <Modal
      title={isNew ? 'new collection' : 'collection settings'}
      size="lg"
      onClose={onClose}
      actions={
        <>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors lowercase">cancel</button>
          <button onClick={() => onSave(localCols)} className="text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase">save</button>
        </>
      }
    >
      {/* Collection tab strip (for editing existing collections) */}
      {!isNew && (
        <div className="flex gap-1 border-b border-gray-100 mb-4">
          {localCols.map(col => (
            <button
              key={col.id}
              onClick={() => setSelectedColId(col.id)}
              className={`px-3 py-2 text-xs tracking-wide lowercase transition-colors border-b-2 -mb-px ${
                selectedColId === col.id
                  ? 'border-gray-700 text-gray-700'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      )}

      {selectedCol && (
        <div>
          <Tabs tabs={sectionTabs} active={activeSection} onChange={setActiveSection} />

          <div className="mt-4">
            {/* Settings */}
            {activeSection === 'settings' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-400 lowercase mb-1 block">collection name</label>
                  <input
                    value={selectedCol.name}
                    onChange={e => updateCol('name', e.target.value)}
                    placeholder="my collection"
                    className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 lowercase mb-1 block">description</label>
                  <textarea
                    value={selectedCol.description || ''}
                    onChange={e => updateCol('description', e.target.value)}
                    placeholder="collection description..."
                    rows={3}
                    className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent resize-none focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 lowercase mb-1 block">base url</label>
                  <input
                    value={selectedCol.baseUrl || ''}
                    onChange={e => updateCol('baseUrl', e.target.value)}
                    placeholder="https://api.example.com or {{baseUrl}}"
                    className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 font-mono placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                  />
                  <p className="text-[10px] text-gray-300 mt-1">request URLs are stored as relative paths when this is set</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 lowercase block mb-1">requests</span>
                  <span className="text-sm text-gray-600">{countRequests(selectedCol)} requests</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 lowercase">default settings</label>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input type="checkbox" checked={selectedCol.settings?.followRedirects ?? true}
                      onChange={e => updateCol('settings', { ...selectedCol.settings, followRedirects: e.target.checked })}
                      className="accent-gray-500" />
                    follow redirects
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input type="checkbox" checked={selectedCol.settings?.verifySsl ?? false}
                      onChange={e => updateCol('settings', { ...selectedCol.settings, verifySsl: e.target.checked })}
                      className="accent-gray-500" />
                    verify ssl
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 lowercase">timeout (ms)</label>
                    <input type="number" value={selectedCol.settings?.timeoutMs ?? 30000}
                      onChange={e => updateCol('settings', { ...selectedCol.settings, timeoutMs: parseInt(e.target.value) || 30000 })}
                      className="w-24 border-b border-gray-300 py-1 text-sm text-gray-700 bg-transparent focus:outline-none focus:border-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Headers (inherited by all requests) */}
            {activeSection === 'headers' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-400 lowercase">default headers applied to all requests in this collection</p>
                <KVEditor
                  pairs={selectedCol.headers || [{ id: 1, key: '', value: '', enabled: true }]}
                  onChange={pairs => updateCol('headers', pairs)}
                />
              </div>
            )}

            {/* Auth (inherited by all requests) */}
            {activeSection === 'auth' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-400 lowercase">default auth applied to requests without their own auth</p>
                <Dropdown
                  value={selectedCol.authType || 'none'}
                  options={authTypes}
                  onChange={v => updateCol('authType', v)}
                />
                {selectedCol.authType === 'bearer' && (
                  <div>
                    <label className="text-xs text-gray-400 lowercase mb-1 block">token</label>
                    <input
                      value={selectedCol.authData?.token || ''}
                      onChange={e => updateCol('authData', { ...selectedCol.authData, token: e.target.value })}
                      placeholder="{{access_token}}"
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 font-mono placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                    />
                  </div>
                )}
                {selectedCol.authType === 'basic' && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-gray-400 lowercase mb-1 block">username</label>
                      <input
                        value={selectedCol.authData?.username || ''}
                        onChange={e => updateCol('authData', { ...selectedCol.authData, username: e.target.value })}
                        className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 lowercase mb-1 block">password</label>
                      <input
                        type="password"
                        value={selectedCol.authData?.password || ''}
                        onChange={e => updateCol('authData', { ...selectedCol.authData, password: e.target.value })}
                        className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                      />
                    </div>
                  </div>
                )}
                {selectedCol.authType === 'apikey' && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-gray-400 lowercase mb-1 block">header name</label>
                      <input
                        value={selectedCol.authData?.headerName || ''}
                        onChange={e => updateCol('authData', { ...selectedCol.authData, headerName: e.target.value })}
                        placeholder="X-API-Key"
                        className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 font-mono placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 lowercase mb-1 block">value</label>
                      <input
                        value={selectedCol.authData?.value || ''}
                        onChange={e => updateCol('authData', { ...selectedCol.authData, value: e.target.value })}
                        placeholder="{{api_key}}"
                        className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 font-mono placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pre-request scripts */}
            {activeSection === 'scripts' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-400 lowercase">pre-request script runs before every request in this collection</p>
                <ScriptEditor
                  value={selectedCol.preRequestScript || ''}
                  onChange={v => updateCol('preRequestScript', v)}
                  placeholder={'# runs before each request\nset header X-Request-Id = uuid()'}
                  environments={[]}
                />
              </div>
            )}

            {/* Tests */}
            {activeSection === 'tests' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-400 lowercase">test script runs after every request in this collection</p>
                <ScriptEditor
                  value={selectedCol.testScript || ''}
                  onChange={v => updateCol('testScript', v)}
                  placeholder={'# runs after each request\nstatus < 500\nduration < 5000'}
                  environments={[]}
                />
              </div>
            )}

            {/* Import */}
            {activeSection === 'import' && (
              <ImportSection onImported={cols => { setLocalCols(cols); setActiveSection('settings'); }} selectedCol={selectedCol} />
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
