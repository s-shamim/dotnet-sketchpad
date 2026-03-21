function Decks({ anki, api, decks, onMutate }) {
  const [newDeck, setNewDeck] = React.useState('');
  const [error, setError] = React.useState('');
  const [counts, setCounts] = React.useState({}); // deckName -> total_in_deck

  React.useEffect(() => {
    if (decks.length > 0) loadCounts();
  }, [decks]);

  async function loadCounts() {
    try {
      const stats = await anki('getDeckStats', { decks });
      const byName = {};
      Object.values(stats || {}).forEach(s => { byName[s.name] = s.total_in_deck; });
      setCounts(byName);
    } catch {}
  }

  async function createDeck() {
    const name = newDeck.trim();
    if (!name) return;
    setError('');
    try {
      await anki('createDeck', { deck: name });
      await api('POST', '/api/undo', { action: 'createDeck', payload: JSON.stringify({ name }) });
      setNewDeck('');
      onMutate();
    } catch (e) { setError(e.message || 'failed to create deck'); }
  }

  async function deleteDeck(name) {
    if (!confirm(`delete deck "${name}" and all its cards?`)) return;
    setError('');
    try {
      await anki('deleteDecks', { decks: [name], cardsToo: true });
      await api('POST', '/api/undo', { action: 'deleteDeck', payload: JSON.stringify({ name }) });
      onMutate();
    } catch (e) { setError(e.message || 'failed to delete deck'); }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newDeck}
          onChange={e => setNewDeck(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createDeck()}
          placeholder="new deck name..."
          className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
        />
        <button
          onClick={createDeck}
          className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase"
        >
          create
        </button>
      </div>

      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}

      {decks.length === 0
        ? <p className="text-center text-gray-300 text-sm py-8">nothing here yet.</p>
        : (
          <ul className="divide-y divide-gray-100">
            {decks.map(d => (
              <li key={d} className="flex items-center py-3 group">
                <span className="text-sm text-gray-700 flex-1">{d}</span>
                {counts[d] !== undefined && (
                  <span className="text-xs text-gray-300 mr-4">{counts[d]} notes</span>
                )}
                <button
                  onClick={() => deleteDeck(d)}
                  className="opacity-0 group-hover:opacity-100 text-gray-200 hover:text-red-400 text-xs transition-all"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
