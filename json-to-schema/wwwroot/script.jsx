const { useState, useEffect, useRef, useCallback } = React;

const PLACEHOLDER = `{
  "name": "Alice",
  "age": 30,
  "active": true,
  "tags": ["admin", "user"],
  "address": {
    "city": "Wonderland",
    "zip": "12345"
  }
}`;

function App() {
  const [input, setInput]   = useState('');
  const [schema, setSchema] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const convert = useCallback(async (json) => {
    if (!json.trim()) { setSchema(''); setError(''); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/convert', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ json }),
      });
      const data = await res.json();
      if (res.ok) { setSchema(data.schema); setError(''); }
      else        { setSchema(''); setError(data.error || 'invalid json'); }
    } catch {
      setError('network error');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => convert(input), 400);
    return () => clearTimeout(timerRef.current);
  }, [input, convert]);

  const copy = () => {
    navigator.clipboard.writeText(schema).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const format = () => {
    try { setInput(JSON.stringify(JSON.parse(input), null, 2)); } catch {}
  };

  const clear = () => { setInput(''); setSchema(''); setError(''); };

  const isEmpty  = !input.trim();
  const isValid  = !isEmpty && !error && !loading && !!schema;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">

      {/* Header */}
      <header className="px-8 pt-7 pb-5 border-b border-gray-100 flex-shrink-0">
        <h1 className="text-2xl font-light tracking-widest text-gray-800 lowercase">
          json → schema
        </h1>
        <p className="text-xs text-gray-400 mt-1 tracking-wide">
          draft 2020-12
        </p>
      </header>

      {/* Panels */}
      <main className="flex flex-1 overflow-hidden min-h-0">

        {/* Left — JSON input */}
        <div className="flex-1 flex flex-col p-6 border-r border-gray-100 min-w-0">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <span className="text-xs tracking-widest text-gray-400 uppercase">
              json input
            </span>
            <div className="flex items-center gap-4">
              {error && (
                <span className="text-xs text-red-400 truncate max-w-xs">{error}</span>
              )}
              {isValid && (
                <span className="text-xs text-gray-300">valid</span>
              )}
              {!isEmpty && !error && (
                <button
                  onClick={format}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                >
                  format
                </button>
              )}
              {!isEmpty && (
                <button
                  onClick={clear}
                  className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                >
                  clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={PLACEHOLDER}
            className={`flex-1 min-h-0 w-full font-mono text-sm text-gray-700 bg-gray-50 p-4 resize-none focus:outline-none border transition-colors ${
              error ? 'border-red-200 focus:border-red-300' : 'border-gray-100 focus:border-gray-300'
            }`}
            spellCheck={false}
          />
        </div>

        {/* Right — Schema output */}
        <div className="flex-1 flex flex-col p-6 min-w-0">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <span className="text-xs tracking-widest text-gray-400 uppercase">
              json schema
            </span>
            {schema && (
              <button
                onClick={copy}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                {copied ? 'copied ✓' : 'copy'}
              </button>
            )}
          </div>
          <textarea
            value={schema}
            readOnly
            placeholder={
              isEmpty   ? 'paste json on the left...' :
              loading   ? 'converting...' :
              error     ? '' :
                          ''
            }
            className="flex-1 min-h-0 w-full font-mono text-sm text-gray-500 bg-gray-50 p-4 resize-none focus:outline-none border border-gray-100 placeholder-gray-300"
            spellCheck={false}
          />
        </div>

      </main>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
