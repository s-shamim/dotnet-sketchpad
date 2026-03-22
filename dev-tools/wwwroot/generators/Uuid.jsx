function UuidTool() {
  const [uuids, setUuids] = React.useState([]);
  const [count, setCount] = React.useState(5);
  const [type,  setType]  = React.useState('v4');
  const [error, setError] = React.useState('');

  async function generate() {
    setError('');
    try {
      const data = await apiGet(`/api/generators/uuid/batch?count=${count}&type=${type}`);
      if (data.error) setError(data.error);
      else setUuids(data.results);
    } catch { setError('Connection failed.'); }
  }

  const all = uuids.join('\n');

  return (
    <div>
      <PageTitle sub="version 4 · empty (nil)">uuid generator</PageTitle>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-xs text-gray-400">type</span>
        <div className="flex gap-3">
          {['v4', 'empty'].map(t => (
            <button key={t}
              onClick={() => setType(t)}
              className={`text-sm lowercase transition-colors ${type === t ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t === 'empty' ? 'empty (nil)' : t}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-4">count</span>
        <input
          type="number" value={count} min={1} max={50}
          onChange={e => setCount(Number(e.target.value))}
          className="w-16 border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-gray-500 text-sm text-center"
        />
        <Btn onClick={generate}>generate</Btn>
        {uuids.length > 0 && <CopyBtn text={all} />}
      </div>

      {uuids.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {uuids.map((u, i) => (
            <li key={i} className="flex items-center gap-3 py-2 group">
              <span className="flex-1 font-mono text-sm text-gray-700">{u}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyBtn text={u} />
              </span>
            </li>
          ))}
        </ul>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
