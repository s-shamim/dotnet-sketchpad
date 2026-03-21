function Stats({ anki, decks }) {
  const [stats, setStats] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (decks.length > 0) loadStats();
  }, [decks]);

  async function loadStats() {
    setLoading(true);
    setError('');
    try {
      const result = await anki('getDeckStats', { decks });
      setStats(result || {});
    } catch (e) {
      setError(e.message || 'failed to load stats');
    }
    setLoading(false);
  }

  const statList = Object.values(stats);

  return (
    <div>
      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}
      {loading && <p className="text-gray-300 text-sm py-4">loading...</p>}
      {!loading && statList.length === 0 && (
        <p className="text-center text-gray-300 text-sm py-8">nothing here yet.</p>
      )}
      {statList.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 text-left border-b border-gray-100">
              <th className="pb-2 font-normal">deck</th>
              <th className="pb-2 font-normal">new</th>
              <th className="pb-2 font-normal">learning</th>
              <th className="pb-2 font-normal">due</th>
              <th className="pb-2 font-normal">total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {statList.map(s => (
              <tr key={s.deck_id}>
                <td className="py-3 pr-4 text-gray-700">{s.name}</td>
                <td className="py-3 pr-4 text-gray-400">{s.new_count}</td>
                <td className="py-3 pr-4 text-gray-400">{s.learn_count}</td>
                <td className="py-3 pr-4 text-gray-400">{s.due_count ?? s.review_count ?? '—'}</td>
                <td className="py-3 text-gray-400">{s.total_in_deck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
