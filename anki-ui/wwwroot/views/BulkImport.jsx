function BulkImport({ anki, api, decks }) {
  const [raw, setRaw] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [deck, setDeck] = React.useState('');
  const [progress, setProgress] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [imports, setImports] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    api('GET', '/api/imports').then(setImports).catch(() => {});
  }, []);

  function parse() {
    const lines = raw.trim().split('\n').filter(l => l.trim());
    const parsed = lines.map(line => {
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      return {
        front: (parts[0] || '').trim(),
        back: (parts[1] || '').trim(),
        tags: (parts[2] || '').trim()
      };
    }).filter(r => r.front || r.back);
    setRows(parsed);
    setResult(null);
    setProgress(null);
    setError('');
  }

  async function importAll() {
    if (!deck) { setError('select a deck first'); return; }
    if (rows.length === 0) { setError('parse rows first'); return; }
    setError('');
    setResult(null);
    let succeeded = 0, failed = 0;
    setProgress({ current: 0, total: rows.length });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        await anki('addNote', {
          note: {
            deckName: deck,
            modelName: 'Basic',
            fields: { Front: row.front, Back: row.back },
            tags: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : []
          }
        });
        succeeded++;
      } catch { failed++; }
      setProgress({ current: i + 1, total: rows.length });
    }

    setResult({ succeeded, failed });
    await api('POST', '/api/imports', { deck, total: rows.length, succeeded, failed });
    api('GET', '/api/imports').then(setImports).catch(() => {});
  }

  return (
    <div>
      {/* Deck selector — shown upfront before paste */}
      <div className="mb-5">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">deck</p>
        <select
          value={deck}
          onChange={e => setDeck(e.target.value)}
          className="w-full border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-gray-500 text-sm bg-white"
        >
          <option value="">select deck...</option>
          {decks.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">
          paste rows — front [tab or comma] back [tab or comma] tags
        </p>
        <textarea
          value={raw}
          onChange={e => { setRaw(e.target.value); setRows([]); setResult(null); }}
          placeholder={"apple\tmanzana\nbook\tlibro"}
          rows={6}
          className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm resize-none font-mono"
        />
      </div>

      <button
        onClick={parse}
        className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase"
      >
        parse
      </button>

      {rows.length > 0 && (
        <div className="mt-5 mb-4">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">{rows.length} rows parsed</p>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="text-xs text-gray-400 text-left">
                <th className="pb-2 font-normal">front</th>
                <th className="pb-2 font-normal">back</th>
                <th className="pb-2 font-normal">tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.slice(0, 10).map((r, i) => (
                <tr key={i}>
                  <td className="py-1 pr-4 text-gray-700">{r.front}</td>
                  <td className="py-1 pr-4 text-gray-700">{r.back}</td>
                  <td className="py-1 text-gray-400">{r.tags}</td>
                </tr>
              ))}
              {rows.length > 10 && (
                <tr>
                  <td colSpan={3} className="py-1 text-gray-300 text-xs">
                    ... and {rows.length - 10} more
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center gap-4">
            <button
              onClick={importAll}
              className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase"
            >
              import
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-300 text-sm mt-3">{error}</p>}

      {progress && !result && (
        <p className="text-gray-400 text-sm mt-3">
          importing {progress.current} / {progress.total}...
        </p>
      )}

      {result && (
        <p className="text-gray-600 text-sm mt-3">
          {result.succeeded} succeeded · {result.failed} failed
        </p>
      )}

      {imports.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-3">import history</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 text-left border-b border-gray-100">
                <th className="pb-2 font-normal">date</th>
                <th className="pb-2 font-normal">deck</th>
                <th className="pb-2 font-normal">total</th>
                <th className="pb-2 font-normal">ok</th>
                <th className="pb-2 font-normal">failed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {imports.map(r => (
                <tr key={r.id}>
                  <td className="py-2 pr-4 text-gray-400 text-xs">
                    {new Date(r.importedAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-4 text-gray-700">{r.deck}</td>
                  <td className="py-2 pr-4 text-gray-400">{r.total}</td>
                  <td className="py-2 pr-4 text-gray-500">{r.succeeded}</td>
                  <td className="py-2 text-red-300">{r.failed > 0 ? r.failed : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
