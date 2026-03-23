const { useState } = React;

function App() {
  const [curlInput, setCurlInput] = useState('');
  const [mode, setMode] = useState('actual');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function convert() {
    const curl = curlInput.trim();
    if (!curl) return;
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curl, mode })
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch {
      setError('Request failed. Check the console for details.');
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleKey(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') convert();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto pt-20 px-4 pb-16">

        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          curl to http
        </h1>

        {/* Input */}
        <div className="mb-4">
          <label className="text-xs tracking-widest text-gray-400 uppercase block mb-2">
            curl command
          </label>
          <textarea
            value={curlInput}
            onChange={e => setCurlInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="paste curl command here..."
            rows={8}
            spellCheck={false}
            className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono resize-y"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-5 text-sm">
            {['actual', 'preferred'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`lowercase transition-colors ${mode === m ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={convert}
            disabled={loading || !curlInput.trim()}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors disabled:opacity-30 lowercase"
          >
            {loading ? 'converting...' : 'convert'}
          </button>
        </div>

        <p className="text-xs text-gray-300 mb-6 -mt-3">ctrl+enter to convert</p>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-300 mb-4">{error}</p>
        )}

        {/* Output */}
        {result && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs tracking-widest text-gray-400 uppercase">
                output
              </label>
              <button
                onClick={copy}
                className="text-gray-400 hover:text-gray-700 text-xs transition-colors lowercase"
              >
                {copied ? 'copied!' : 'copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={result}
              rows={Math.min(30, result.split('\n').length + 2)}
              spellCheck={false}
              className="w-full border-b border-gray-300 py-2 text-gray-700 focus:outline-none text-sm font-mono resize-y bg-white"
            />
          </div>
        )}

      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
