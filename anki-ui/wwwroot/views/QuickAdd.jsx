function QuickAdd({ anki, api, decks }) {
  const [deck, setDeck] = React.useState('');
  const [front, setFront] = React.useState('');
  const [back, setBack] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [log, setLog] = React.useState([]);
  const [error, setError] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    api('GET', '/api/preferences').then(prefs => {
      if (prefs?.lastDeck_quick) setDeck(prefs.lastDeck_quick);
    }).catch(() => {});
    api('GET', '/api/quicklog').then(setLog).catch(() => {});
  }, []);

  function saveDeck(val) {
    setDeck(val);
    api('POST', '/api/preferences', { key: 'lastDeck_quick', value: val }).catch(() => {});
  }

  async function save() {
    if (!deck || !front.trim() || !back.trim()) {
      setError('deck, front, and back are required');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      await anki('addNote', {
        note: {
          deckName: deck,
          modelName: 'Basic',
          fields: { Front: front, Back: back },
          tags: tagList
        }
      });
      await api('POST', '/api/quicklog', { deck, front, back });
      setFront(''); setBack(''); setTags('');
      const newLog = await api('GET', '/api/quicklog');
      setLog(newLog);
    } catch (e) {
      setError(e.message || 'failed to add note');
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="mb-6">
        <select
          value={deck}
          onChange={e => saveDeck(e.target.value)}
          className="w-full border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-gray-500 text-sm bg-white mb-4"
        >
          <option value="">select deck...</option>
          {decks.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <input
          type="text"
          value={front}
          onChange={e => setFront(e.target.value)}
          placeholder="front..."
          className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm mb-4"
        />

        <input
          type="text"
          value={back}
          onChange={e => setBack(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="back..."
          className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm mb-4"
        />

        <input
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="tags..."
          className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
        />
      </div>

      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}

      <button
        onClick={save}
        disabled={saving}
        className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase disabled:opacity-30 mb-8"
      >
        {saving ? 'saving...' : 'save'}
      </button>

      {log.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-3">
            {log.length} card{log.length !== 1 ? 's' : ''} added today
          </p>
          <ul className="divide-y divide-gray-100">
            {log.map(entry => (
              <li key={entry.id} className="py-2">
                <span className="text-sm text-gray-600">{entry.front}</span>
                <span className="text-xs text-gray-300 ml-2">→ {entry.deck}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
