const { useState, useRef, useEffect } = React;

// ── Icon ─────────────────────────────────────────────────────
function Icon({ name, size = 14, className = 'text-gray-400' }) {
  return <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />;
}

// ── Spinner ──────────────────────────────────────────────────
function Spinner({ size = 16 }) {
  return (
    <span
      role="status"
      aria-label="loading"
      style={{ width: size, height: size }}
      className="inline-block border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin"
    />
  );
}

// ── Theme / Dark mode controls ───────────────────────────────
const THEMES = [
  { id: 'zinc',   label: 'zinc' },
  { id: 'arctic', label: 'arctic' },
  { id: 'stone',  label: 'stone' },
  { id: 'hc',     label: 'hc' },
];

function getStored(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function applyTheme(theme, mode) {
  document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
  try {
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode', mode);
  } catch {}
}

function ThemeControls() {
  const [theme, setTheme] = useState(() => getStored('ui-theme', 'zinc'));
  const [mode,  setMode]  = useState(() => getStored('ui-mode',  'light'));

  function pickTheme(t) {
    setTheme(t);
    applyTheme(t, mode);
  }

  function toggleMode() {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    applyTheme(theme, next);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => pickTheme(t.id)}
            className={`px-2 py-0.5 text-xs rounded-sm border transition-colors ${
              theme === t.id
                ? 'border-gray-400 bg-gray-200 text-gray-800'
                : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <button
        onClick={toggleMode}
        className="flex items-center gap-1 px-2 py-0.5 text-xs border border-gray-200 rounded-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
        aria-label="toggle dark mode"
      >
        <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={12} className="text-gray-400" />
        {mode}
      </button>
    </div>
  );
}

// ── Tab bar ──────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
            active === tab.id
              ? 'border-gray-700 text-gray-800 font-medium'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Upload drop zone ─────────────────────────────────────────
function DropZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function readFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => onFile(e.target.result, file.name);
    reader.readAsText(file, 'utf-8');
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files[0]);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave() { setDragging(false); }

  function onInputChange(e) { readFile(e.target.files[0]); }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-sm cursor-pointer transition-colors
        ${dragging ? 'border-gray-400 bg-gray-100' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
      style={{ minHeight: 220 }}
    >
      <Icon name="file-text" size={32} className="text-gray-300" />
      <p className="text-sm text-gray-400">drag & drop a <span className="font-medium">.md</span> file here, or click to browse</p>
      <p className="text-xs text-gray-300">accepts .md · .txt · .markdown</p>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.txt,.markdown"
        className="hidden"
        onChange={onInputChange}
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────
function App() {
  const [tab, setTab]           = useState('paste');
  const [markdown, setMarkdown] = useState('');
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [downloadUrl, setDownloadUrl]   = useState(null);
  const [downloadName, setDownloadName] = useState('document.docx');
  const [pandocInfo, setPandocInfo]     = useState(null);

  // Check pandoc availability on mount
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setPandocInfo(d))
      .catch(() => setPandocInfo({ status: 'error', message: 'could not reach server' }));
  }, []);

  function reset() {
    setError(null);
    setDownloadUrl(null);
  }

  function handleTabChange(t) {
    setTab(t);
    setMarkdown('');
    setFileName(null);
    reset();
  }

  function handleFileLoad(content, name) {
    setMarkdown(content);
    setFileName(name);
    reset();
  }

  function handleTextChange(e) {
    setMarkdown(e.target.value);
    reset();
  }

  async function handleConvert() {
    if (!markdown.trim()) return;
    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `server returned ${res.status}`);
      }

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);

      const cd    = res.headers.get('Content-Disposition') || '';
      const match = cd.match(/filename=([^;]+)/);
      const name  = match ? match[1].replace(/"/g, '') : 'document.docx';

      setDownloadUrl(url);
      setDownloadName(name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const canConvert = markdown.trim().length > 0 && !loading;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon name="file-doc" size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">pandoc markdown to docx</span>
          </div>
          {pandocInfo && (
            <span className={`px-2 py-0.5 text-xs rounded-sm border ${
              pandocInfo.status === 'ok'
                ? 'border-green-200 text-green-600 bg-green-50'
                : 'border-red-200 text-red-500 bg-red-50'
            }`}>
              {pandocInfo.status === 'ok' ? pandocInfo.pandoc : 'pandoc not found'}
            </span>
          )}
        </div>
        <ThemeControls />
      </header>

      {/* Pandoc missing warning */}
      {pandocInfo?.status === 'error' && (
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <div className="flex items-center gap-2 p-3 border border-red-200 rounded-sm bg-red-50 text-sm text-red-600">
            <Icon name="warning" size={16} className="text-red-400" />
            pandoc is not installed. install it from <a href="https://pandoc.org/installing.html" target="_blank" rel="noopener" className="underline font-medium">pandoc.org</a>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">

          {/* Tabs */}
          <div className="px-6 pt-5 pb-0">
            <Tabs
              tabs={[
                { id: 'paste',  label: 'paste markdown' },
                { id: 'upload', label: 'upload file' },
              ]}
              active={tab}
              onChange={handleTabChange}
            />
          </div>

          {/* Tab content */}
          <div className="px-6 pt-5 pb-6">

            {tab === 'paste' && (
              <textarea
                className="w-full border border-gray-200 rounded-sm bg-gray-50 text-sm text-gray-700 font-mono p-3 resize-none focus-visible:outline-none focus-visible:border-gray-400 placeholder:text-gray-300"
                rows={18}
                placeholder={"# heading 1\n\nPaste your **markdown** here...\n\n- list item\n- another item\n\n```js\nconsole.log('hello');\n```"}
                value={markdown}
                onChange={handleTextChange}
                spellCheck={false}
              />
            )}

            {tab === 'upload' && (
              <div className="flex flex-col gap-3">
                <DropZone onFile={handleFileLoad} />
                {fileName && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon name="file-text" size={14} className="text-gray-400" />
                    <span>{fileName}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-300">{markdown.length.toLocaleString()} chars</span>
                  </div>
                )}
                {fileName && (
                  <textarea
                    className="w-full border border-gray-200 rounded-sm bg-gray-50 text-xs text-gray-500 font-mono p-3 resize-none focus-visible:outline-none focus-visible:border-gray-400"
                    rows={10}
                    value={markdown}
                    onChange={handleTextChange}
                    spellCheck={false}
                    aria-label="file content preview"
                  />
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex-1">
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <Icon name="warning" size={14} className="text-red-400" />
                    {error}
                  </div>
                )}
              </div>
              <button
                onClick={handleConvert}
                disabled={!canConvert}
                className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-sm transition-colors ${
                  canConvert
                    ? 'border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? <Spinner size={14} /> : <Icon name="file-arrow-down" size={14} className="text-current" />}
                {loading ? 'converting…' : 'convert'}
              </button>
            </div>

            {/* Download result */}
            {downloadUrl && (
              <div className="mt-4 flex items-center gap-3 p-3 border border-gray-200 rounded-sm bg-gray-50">
                <Icon name="check-circle" size={18} className="text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">ready to download</p>
                  <p className="text-xs text-gray-400">{downloadName}</p>
                </div>
                <a
                  href={downloadUrl}
                  download={downloadName}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-700 text-gray-700 rounded-sm hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Icon name="download-simple" size={14} className="text-current" />
                  download .docx
                </a>
              </div>
            )}

          </div>
        </div>

        {/* Supported syntax hint */}
        <div className="mt-6 flex flex-wrap gap-2">
          {['headings', 'bold', 'italic', 'strikethrough', 'lists', 'code blocks', 'inline code', 'blockquotes', 'tables', 'links', 'hr', 'smart quotes'].map(f => (
            <span key={f} className="px-2 py-0.5 text-xs border border-gray-200 rounded-sm text-gray-400">{f}</span>
          ))}
        </div>

      </main>
    </div>
  );
}

// ── Mount ────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
