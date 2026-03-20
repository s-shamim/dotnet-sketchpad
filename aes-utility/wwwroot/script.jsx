const { useState } = React;

function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function App() {
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function run(mode) {
    setError('');
    setOutput('');
    setLoading(true);

    try {
      const url = mode === 'encrypt' ? '/api/encrypt' : '/api/decrypt';
      const body = mode === 'encrypt'
        ? { text: input, key, iv }
        : { cipherText: input, key, iv };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'An error occurred.');
      } else {
        setOutput(data.result);
      }
    } catch (e) {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto pt-16 px-4 pb-12">

        {/* Title */}
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-2 lowercase">
          aes utility
        </h1>
        <p className="text-xs text-gray-400 tracking-widest mb-10 lowercase">
          aes-cbc · pkcs7 · utf-8
        </p>

        {/* Key & IV */}
        <div className="mb-8 space-y-4">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-3">
            parameters
          </h2>

          {/* Key */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-6 tracking-widest lowercase">key</span>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="16, 24, or 32 characters..."
              className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
            />
            <span className={`text-xs tabular-nums w-6 text-right ${key.length === 16 || key.length === 24 || key.length === 32 ? 'text-gray-400' : 'text-gray-300'}`}>
              {key.length}
            </span>
            <button
              onClick={() => setKey(randomString(16))}
              className="text-gray-400 hover:text-gray-700 text-xs px-2 transition-colors lowercase"
            >
              generate
            </button>
          </div>

          {/* IV */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-6 tracking-widest lowercase">iv</span>
            <input
              type="text"
              value={iv}
              onChange={e => setIv(e.target.value)}
              placeholder="exactly 16 characters..."
              className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
            />
            <span className={`text-xs tabular-nums w-6 text-right ${iv.length === 16 ? 'text-gray-400' : 'text-gray-300'}`}>
              {iv.length}
            </span>
            <button
              onClick={() => setIv(randomString(16))}
              className="text-gray-400 hover:text-gray-700 text-xs px-2 transition-colors lowercase"
            >
              generate
            </button>
          </div>
        </div>

        {/* Input / Output side-by-side */}
        <div className="grid grid-cols-2 gap-6 mb-5">
          {/* Input */}
          <div>
            <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-3">input</h2>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="paste text or base64 here..."
              rows={8}
              className="w-full border-b border-gray-200 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 text-sm font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs tracking-widest text-gray-400 uppercase">output</h2>
              {output && (
                <button
                  onClick={copyOutput}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase"
                >
                  {copied ? 'copied!' : 'copy'}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="result will appear here..."
              rows={8}
              className="w-full border-b border-gray-200 py-2 text-gray-600 placeholder-gray-300 focus:outline-none text-sm font-mono resize-none leading-relaxed bg-white cursor-default"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-300 mb-4 lowercase">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => run('encrypt')}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase disabled:opacity-30"
          >
            encrypt
          </button>
          <button
            onClick={() => run('decrypt')}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase disabled:opacity-30"
          >
            decrypt
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="text-gray-300 hover:text-gray-500 text-sm px-2 transition-colors lowercase ml-auto"
          >
            clear
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
