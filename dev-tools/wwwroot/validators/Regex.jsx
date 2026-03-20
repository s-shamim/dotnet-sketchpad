function RegexValidatorTool() {
  const [pattern, setPattern] = React.useState('');
  const [flags,   setFlags]   = React.useState('');
  const [input,   setInput]   = React.useState('');
  const [result,  setResult]  = React.useState(null);
  const [error,   setError]   = React.useState('');

  async function run() {
    setError(''); setResult(null);
    try {
      const data = await api('/api/validators/regex', { pattern, input, flags });
      if (data.error && !data.valid) { setError(data.error); return; }
      setResult(data);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="flags: i · m · s">regex validator</PageTitle>

      {/* Pattern + flags */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-gray-400">/</span>
        <input
          type="text" value={pattern} onChange={e => setPattern(e.target.value)}
          placeholder="pattern..."
          className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
        />
        <span className="text-xs text-gray-400">/</span>
        <input
          type="text" value={flags} onChange={e => setFlags(e.target.value)}
          placeholder="ims"
          className="w-16 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
        />
      </div>

      {/* Test string */}
      <div className="mb-5">
        <ColLabel>test string</ColLabel>
        <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="paste test string here..." rows={5} />
      </div>

      <Btn onClick={run}>test</Btn>

      {result && (
        <div className="mt-5">
          <div className={`text-sm mb-3 ${result.valid ? 'text-gray-500' : 'text-red-400'}`}>
            {result.valid
              ? `${result.matches.length} match${result.matches.length !== 1 ? 'es' : ''}`
              : `✗ ${result.error}`}
          </div>
          {result.matches.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {result.matches.map((m, i) => (
                <li key={i} className="py-2 flex gap-4 text-sm font-mono">
                  <span className="text-gray-300 w-6 text-right tabular-nums">{i + 1}</span>
                  <span className="text-gray-700">{m.value}</span>
                  <span className="text-gray-300 text-xs self-center">@ {m.index}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
