function CronValidatorTool() {
  const [input,    setInput]    = React.useState('');
  const [valid,    setValid]    = React.useState(null);
  const [nexts,    setNexts]    = React.useState([]);
  const [error,    setError]    = React.useState('');

  async function run() {
    setError(''); setValid(null); setNexts([]);
    if (!input.trim()) return;
    try {
      const data = await api('/api/validators/cron', { text: input });
      if (data.error) { setValid(false); setError(data.error); }
      else            { setValid(true);  setNexts(data.nextOccurrences ?? []); }
    } catch { setError('Connection failed.'); }
  }

  function handleKey(e) {
    if (e.key === 'Enter') run();
  }

  return (
    <div>
      <PageTitle sub="seconds · standard · next 5 occurrences">cron validator</PageTitle>

      <div className="mb-6">
        <ColLabel>expression</ColLabel>
        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); setValid(null); setNexts([]); setError(''); }}
          onKeyDown={handleKey}
          placeholder="e.g. 0 9 * * 1-5 or 0 0 9 * * MON-FRI"
          className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
        />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Btn onClick={run}>validate</Btn>
        {valid === true  && <span className="text-xs text-gray-400 lowercase">valid</span>}
        {valid === false && !error && <span className="text-xs text-red-400 lowercase">invalid</span>}
      </div>

      {nexts.length > 0 && (
        <div>
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">next 5 occurrences (utc)</h2>
          <ul className="divide-y divide-gray-100">
            {nexts.map((ts, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <span className="text-sm font-mono text-gray-700">{ts}</span>
                <CopyBtn text={ts} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
