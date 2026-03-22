const { useState } = React;

function App() {
  const [n, setN] = useState('40');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function calculate() {
    const num = parseInt(n, 10);
    if (isNaN(num) || num < 0 || num > 50) {
      setError('enter a number between 0 and 50.');
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const [memoRes, naiveRes] = await Promise.all([
        fetch(`/api/fibonacci/memoized?n=${num}`),
        fetch(`/api/fibonacci/naive?n=${num}`)
      ]);
      const memoData = await memoRes.json();
      const naiveData = await naiveRes.json();
      setResult({ n: num, memo: memoData, naive: naiveData });
    } catch {
      setError('something went wrong. is the server running?');
    } finally {
      setLoading(false);
    }
  }

  function formatMs(ms) {
    if (ms < 0.01) return '< 0.01 ms';
    return `${ms.toFixed(2)} ms`;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">

        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-2 lowercase">
          fibonacci
        </h1>
        <p className="text-xs text-gray-400 tracking-wide mb-8 lowercase">
          memoized vs naive recursion
        </p>

        {/* Input */}
        <div className="flex gap-2 mb-8">
          <input
            type="number"
            min="0"
            max="50"
            value={n}
            onChange={e => setN(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && calculate()}
            placeholder="n (0–50)"
            className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
          />
          <button
            onClick={calculate}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors disabled:opacity-30"
          >
            {loading ? 'calculating…' : 'calculate'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-xs mb-6">{error}</p>
        )}

        {/* Results */}
        {result && (
          <>
            <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">
              fibonacci({result.n}) = {result.memo.value.toLocaleString()}
            </h2>

            <ul className="divide-y divide-gray-100">
              <li className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm text-gray-700">memoized</p>
                  <p className="text-xs text-gray-400 mt-0.5">recursive with cache</p>
                </div>
                <span className="text-sm text-gray-500 tabular-nums">
                  {formatMs(result.memo.elapsedMs)}
                </span>
              </li>
              <li className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm text-gray-700">naive</p>
                  <p className="text-xs text-gray-400 mt-0.5">pure recursion, no cache</p>
                </div>
                <span className="text-sm text-gray-500 tabular-nums">
                  {formatMs(result.naive.elapsedMs)}
                </span>
              </li>
            </ul>

            {/* Speedup */}
            {result.naive.elapsedMs > 0 && result.memo.elapsedMs > 0 && (
              <p className="text-xs text-gray-400 mt-6 text-right">
                memoized was{' '}
                <span className="text-gray-600">
                  {Math.round(result.naive.elapsedMs / result.memo.elapsedMs).toLocaleString()}×
                </span>{' '}
                faster
              </p>
            )}
          </>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <p className="text-center text-gray-300 text-sm py-8">
            enter n and press calculate.
          </p>
        )}

      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
