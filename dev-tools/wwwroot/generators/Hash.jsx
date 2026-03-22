function HashTool() {
  const [input,     setInput]     = React.useState('');
  const [algorithm, setAlgorithm] = React.useState('sha256');
  const [result,    setResult]    = React.useState('');
  const [error,     setError]     = React.useState('');

  async function run() {
    setError(''); setResult('');
    try {
      const data = await api('/api/generators/hash', { text: input, algorithm });
      if (data.error) setError(data.error);
      else setResult(data.result);
    } catch { setError('Connection failed.'); }
  }

  const algorithms = ['md5', 'sha1', 'sha256', 'sha512', 'bcrypt'];
  const isBcrypt = algorithm === 'bcrypt';

  return (
    <div>
      <PageTitle sub="md5 · sha1 · sha256 · sha512 · bcrypt">hash generator</PageTitle>

      <div className="mb-5">
        <ColLabel action={input && <ClearBtn onClear={() => setInput('')} />}>input</ColLabel>
        <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="paste text to hash..." rows={5} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-xs text-gray-400">algorithm</span>
        <div className="flex gap-3">
          {algorithms.map(a => (
            <button key={a}
              onClick={() => setAlgorithm(a)}
              className={`text-sm lowercase transition-colors ${algorithm === a ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {isBcrypt && (
        <p className="text-xs text-gray-400 mb-5">bcrypt is one-way — the output cannot be reversed. each run produces a unique hash.</p>
      )}

      <Btn onClick={run}>hash</Btn>

      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs tracking-widest text-gray-400 uppercase">{algorithm}</h2>
            <CopyBtn text={result} />
          </div>
          <p className="font-mono text-gray-700 text-sm border-b border-gray-100 pb-3 break-all">{result}</p>
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
