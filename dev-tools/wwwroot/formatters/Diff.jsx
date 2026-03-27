function DiffTool() {
  const [left,     setLeft]     = React.useState('');
  const [right,    setRight]    = React.useState('');
  const [hunks,    setHunks]    = React.useState(null);
  const [jsonMode, setJsonMode] = React.useState(false);
  const [error,    setError]    = React.useState('');

  async function run() {
    setError(''); setHunks(null);
    let l = left, r = right;
    if (jsonMode) {
      try { l = JSON.stringify(JSON.parse(l), null, 2); } catch { /* leave as-is */ }
      try { r = JSON.stringify(JSON.parse(r), null, 2); } catch { /* leave as-is */ }
    }
    try {
      const data = await api('/api/formatters/diff', { left: l, right: r });
      if (data.error) setError(data.error);
      else setHunks(data.hunks ?? []);
    } catch { setError('Connection failed.'); }
  }

  const stats = hunks
    ? { added: hunks.filter(h => h.type === 'added').length, removed: hunks.filter(h => h.type === 'removed').length }
    : null;

  return (
    <div>
      <PageTitle sub="line-by-line diff">diff checker</PageTitle>

      {/* Options row */}
      <div className="flex items-center gap-4 mb-5">
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={jsonMode}
            onChange={e => setJsonMode(e.target.checked)}
            className="accent-gray-400 w-3 h-3 cursor-pointer"
          />
          json mode (normalise whitespace before diff)
        </label>
      </div>

      {/* Two panes */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <ColLabel action={left && <ClearBtn onClear={() => setLeft('')} />}>original</ColLabel>
          <TArea value={left} onChange={e => setLeft(e.target.value)} placeholder="paste original text..." rows={18} />
        </div>
        <div>
          <ColLabel action={right && <ClearBtn onClear={() => setRight('')} />}>modified</ColLabel>
          <TArea value={right} onChange={e => setRight(e.target.value)} placeholder="paste modified text..." rows={18} />
        </div>
      </div>

      <Btn onClick={run}>diff</Btn>

      {hunks && (
        <div className="mt-8">
          {/* Stats */}
          {stats && (stats.added > 0 || stats.removed > 0) ? (
            <div className="flex gap-4 mb-4 text-xs">
              <span className="text-green-600">+{stats.added} added</span>
              <span className="text-red-400">-{stats.removed} removed</span>
            </div>
          ) : hunks.length > 0 ? (
            <p className="text-xs text-gray-400 mb-4">no differences — files are identical</p>
          ) : (
            <p className="text-xs text-gray-400 mb-4">both inputs are empty</p>
          )}

          {/* Diff view */}
          <div className="border border-gray-100 overflow-hidden font-mono text-xs">
            {hunks.map((h, i) => {
              const bg  = h.type === 'added'   ? 'bg-green-50'  : h.type === 'removed' ? 'bg-red-50'   : '';
              const col = h.type === 'added'   ? 'text-green-600' : h.type === 'removed' ? 'text-red-400' : 'text-gray-500';
              const sym = h.type === 'added'   ? '+' : h.type === 'removed' ? '-' : ' ';
              return (
                <div key={i} className={`flex px-3 py-0.5 leading-5 ${bg}`}>
                  <span className={`w-4 shrink-0 select-none ${col}`}>{sym}</span>
                  <span className={`whitespace-pre-wrap break-all ${col}`}>{h.line}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
