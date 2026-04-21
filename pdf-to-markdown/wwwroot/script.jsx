const { useState, useRef, useCallback } = React;

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

  function pickTheme(t) { setTheme(t); applyTheme(t, mode); }
  function toggleMode() {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    applyTheme(theme, next);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {THEMES.map(t => (
          <button key={t.id} onClick={() => pickTheme(t.id)}
            className={`px-2 py-0.5 text-xs rounded-sm border transition-colors ${
              theme === t.id
                ? 'border-gray-400 bg-gray-200 text-gray-800'
                : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
            }`}>{t.label}</button>
        ))}
      </div>
      <button onClick={toggleMode}
        className="flex items-center gap-1 px-2 py-0.5 text-xs border border-gray-200 rounded-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
        aria-label="toggle dark mode">
        <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={12} className="text-gray-400" />
        {mode}
      </button>
    </div>
  );
}

// ── Drop zone ────────────────────────────────────────────────
function DropZone({ onFile, accept = '.pdf' }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    onFile(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-sm cursor-pointer transition-colors
        ${dragging ? 'border-gray-400 bg-gray-100' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
      style={{ minHeight: 220 }}
    >
      <Icon name="file-pdf" size={40} className="text-gray-300" />
      <p className="text-sm text-gray-400">drag & drop a <span className="font-medium">.pdf</span> file here, or click to browse</p>
      <p className="text-xs text-gray-300">supports digital, scanned, and mixed PDFs</p>
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={e => handleFile(e.target.files[0])}
        onClick={e => e.stopPropagation()} />
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────────
function ProgressBar({ page, total }) {
  const pct = total > 0 ? Math.round((page / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>processing page {page} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gray-500 transition-all duration-300 rounded-full"
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Markdown preview ─────────────────────────────────────────
function MarkdownPreview({ markdown }) {
  if (!markdown) return null;
  return (
    <pre className="w-full max-h-96 overflow-auto border border-gray-200 rounded-sm bg-gray-50 text-xs text-gray-700 font-mono p-4 whitespace-pre-wrap">
      {markdown}
    </pre>
  );
}

// ── Main App ─────────────────────────────────────────────────
function App() {
  const [file, setFile]             = useState(null);
  const [loading, setLoading]       = useState(false);
  const [progress, setProgress]     = useState(null);
  const [error, setError]           = useState(null);
  const [markdown, setMarkdown]     = useState('');
  const [downloadUrl, setDownloadUrl]     = useState(null);
  const [downloadName, setDownloadName]   = useState('');

  function reset() {
    setError(null);
    setMarkdown('');
    setDownloadUrl(null);
    setProgress(null);
  }

  function handleFileSelect(f) {
    setFile(f);
    reset();
  }

  function clearFile() {
    setFile(null);
    reset();
  }

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setMarkdown('');
    setDownloadUrl(null);
    setProgress({ page: 0, total: 0 });

    try {
      // Try streaming endpoint first for progress
      const formData = new FormData();
      formData.append('pdf', file);

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `server returned ${res.status}`);
      }

      const blob = await res.blob();
      const text = await blob.text();
      setMarkdown(text);

      const url = URL.createObjectURL(blob);
      const name = file.name.replace(/\.pdf$/i, '') + '.md';
      setDownloadUrl(url);
      setDownloadName(name);
      setProgress(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  const canConvert = file && !loading;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Icon name="file-pdf" size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">pdf to markdown</span>
        </div>
        <ThemeControls />
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="px-6 pt-5 pb-6">

            {/* Drop zone or file info */}
            {!file ? (
              <DropZone onFile={handleFileSelect} />
            ) : (
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-sm bg-gray-50">
                <Icon name="file-pdf" size={24} className="text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                </div>
                <button onClick={clearFile}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="remove file">
                  <Icon name="x" size={16} className="text-current" />
                </button>
              </div>
            )}

            {/* Progress */}
            {loading && progress && progress.total > 0 && (
              <div className="mt-4">
                <ProgressBar page={progress.page} total={progress.total} />
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
              <button onClick={handleConvert} disabled={!canConvert}
                className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-sm transition-colors ${
                  canConvert
                    ? 'border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}>
                {loading ? <Spinner size={14} /> : <Icon name="arrows-clockwise" size={14} className="text-current" />}
                {loading ? 'converting…' : 'convert to markdown'}
              </button>
            </div>

            {/* Download result */}
            {downloadUrl && (
              <div className="mt-4 flex items-center gap-3 p-3 border border-gray-200 rounded-sm bg-gray-50">
                <Icon name="check-circle" size={18} className="text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">conversion complete</p>
                  <p className="text-xs text-gray-400">{downloadName} · {markdown.length.toLocaleString()} chars</p>
                </div>
                <a href={downloadUrl} download={downloadName}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-700 text-gray-700 rounded-sm hover:bg-gray-700 hover:text-white transition-colors">
                  <Icon name="download-simple" size={14} className="text-current" />
                  download .md
                </a>
              </div>
            )}

            {/* Markdown preview */}
            {markdown && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="eye" size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400">preview (raw markdown)</span>
                </div>
                <MarkdownPreview markdown={markdown} />
              </div>
            )}

          </div>
        </div>

        {/* Feature hints */}
        <div className="mt-6 flex flex-wrap gap-2">
          {['digital text', 'scanned OCR', 'heading detection', 'code blocks', 'tables', 'font analysis', 'mixed PDFs'].map(f => (
            <span key={f} className="px-2 py-0.5 text-xs border border-gray-200 rounded-sm text-gray-400">{f}</span>
          ))}
        </div>

        {/* OCR note */}
        <p className="mt-4 text-xs text-gray-300">
          OCR for scanned pages requires Tesseract 5 installed on system.
          Windows: <code className="text-gray-400">choco install tesseract</code>
        </p>

      </main>
    </div>
  );
}

// ── Mount ────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
