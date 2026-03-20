function NumberBaseTool() {
  const [value,  setValue]  = React.useState('');
  const [from,   setFrom]   = React.useState('decimal');
  const [result, setResult] = React.useState(null);
  const [error,  setError]  = React.useState('');

  async function run() {
    setError(''); setResult(null);
    try {
      const data = await api('/api/converters/number-base', { value, from });
      if (data.error) setError(data.error);
      else setResult(data);
    } catch { setError('Connection failed.'); }
  }

  const bases = ['decimal', 'hex', 'binary', 'octal'];

  return (
    <div>
      <PageTitle sub="hex · decimal · binary · octal">number base</PageTitle>

      <div className="mb-6">
        <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">input</h2>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text" value={value} onChange={e => setValue(e.target.value)}
            placeholder="enter a number..."
            className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
          />
          <select
            value={from} onChange={e => setFrom(e.target.value)}
            className="border-b border-gray-300 py-2 text-gray-500 text-sm focus:outline-none focus:border-gray-500 bg-white lowercase"
          >
            {bases.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <Btn onClick={run}>convert</Btn>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">result</h2>
          {[
            { label: 'decimal',     val: result.dec },
            { label: 'hexadecimal', val: result.hex },
            { label: 'binary',      val: result.binary },
            { label: 'octal',       val: result.octal },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center gap-4 border-b border-gray-100 pb-3 group">
              <span className="text-xs text-gray-400 w-28 lowercase">{label}</span>
              <span className="flex-1 text-gray-700 font-mono text-sm">{val}</span>
              <CopyBtn text={val} />
            </div>
          ))}
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
