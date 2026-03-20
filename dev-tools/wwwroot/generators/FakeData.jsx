function FakeDataTool() {
  const [count,   setCount]   = React.useState(5);
  const [locale,  setLocale]  = React.useState('en');
  const [records, setRecords] = React.useState([]);
  const [error,   setError]   = React.useState('');

  const locales = ['en', 'de', 'fr', 'ja', 'es', 'pt_BR', 'it', 'nl', 'ru', 'zh_CN'];

  async function generate() {
    setError(''); setRecords([]);
    try {
      const data = await api('/api/generators/fake-data', { count, locale });
      if (data.error) setError(data.error);
      else setRecords(data.records);
    } catch { setError('Connection failed.'); }
  }

  const json = JSON.stringify(records, null, 2);

  return (
    <div>
      <PageTitle sub="names · emails · addresses · companies">fake data generator</PageTitle>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <span className="text-xs text-gray-400">count</span>
        <input
          type="number" value={count} min={1} max={100}
          onChange={e => setCount(Number(e.target.value))}
          className="w-16 border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-gray-500 text-sm text-center"
        />
        <span className="text-xs text-gray-400">locale</span>
        <select
          value={locale}
          onChange={e => setLocale(e.target.value)}
          className="border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-gray-500 text-sm bg-white"
        >
          {locales.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <Btn onClick={generate}>generate</Btn>
        {records.length > 0 && <CopyBtn text={json} />}
      </div>

      {records.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {records.map((r, i) => (
            <li key={i} className="py-3 text-sm">
              <div className="flex items-center gap-3 mb-0.5">
                <span className="text-gray-700 font-medium">{r.firstName} {r.lastName}</span>
                <span className="text-gray-400 text-xs">{r.username}</span>
              </div>
              <div className="text-gray-400 text-xs space-y-0.5">
                <div>{r.email} · {r.phone}</div>
                <div>{r.company}</div>
                <div>{r.address}, {r.city}, {r.country} {r.zipCode}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
