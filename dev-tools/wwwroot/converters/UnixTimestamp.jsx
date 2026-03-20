function UnixTimestampTool() {
  const [unix,     setUnix]     = React.useState('');
  const [datetime, setDatetime] = React.useState('');
  const [result,   setResult]   = React.useState(null);
  const [unix2,    setUnix2]    = React.useState(null);
  const [error,    setError]    = React.useState('');

  async function toDatetime() {
    setError(''); setResult(null);
    try {
      const data = await api('/api/converters/unix-to-datetime', { unix: parseInt(unix, 10) });
      if (data.error) setError(data.error);
      else setResult(data);
    } catch { setError('Connection failed.'); }
  }

  async function toUnix() {
    setError(''); setUnix2(null);
    try {
      const data = await api('/api/converters/datetime-to-unix', { text: datetime });
      if (data.error) setError(data.error);
      else setUnix2(data.unix);
    } catch { setError('Connection failed.'); }
  }

  function useNow() {
    setUnix(Math.floor(Date.now() / 1000).toString());
    setResult(null);
  }

  return (
    <div>
      <PageTitle sub="focus on ist · utc">unix timestamp</PageTitle>

      {/* Unix → DateTime */}
      <div className="mb-8">
        <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">unix → datetime</h2>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text" value={unix} onChange={e => setUnix(e.target.value)}
            placeholder="e.g. 1700000000"
            className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
          />
          <Btn onClick={useNow}>now</Btn>
          <Btn onClick={toDatetime}>convert</Btn>
        </div>
        {result && (
          <div className="space-y-2 text-sm font-mono">
            <div className="flex gap-6">
              <span className="text-gray-400 w-8">utc</span>
              <span className="text-gray-700">{result.utc}</span>
            </div>
            <div className="flex gap-6">
              <span className="text-gray-400 w-8">ist</span>
              <span className="text-gray-700">{result.ist}</span>
            </div>
          </div>
        )}
      </div>

      {/* DateTime → Unix */}
      <div>
        <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">datetime → unix</h2>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text" value={datetime} onChange={e => setDatetime(e.target.value)}
            placeholder="e.g. 2024-11-14T22:13:20Z"
            className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
          />
          <Btn onClick={toUnix}>convert</Btn>
        </div>
        {unix2 !== null && (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-mono text-sm">{unix2}</span>
            <CopyBtn text={String(unix2)} />
          </div>
        )}
      </div>

      <ErrMsg error={error} />
    </div>
  );
}
