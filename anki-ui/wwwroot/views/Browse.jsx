function Browse({ anki, api, decks, tags, externalQuery, externalQueryKey }) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [searches, setSearches] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [selected, setSelected] = React.useState(new Set());
  const [previewing, setPreviewing] = React.useState(null);
  const [expanded, setExpanded] = React.useState(null);
  const [editFields, setEditFields] = React.useState({});
  const [undoEntries, setUndoEntries] = React.useState([]);
  const [undoOpen, setUndoOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const debounceRef = React.useRef(null);

  React.useEffect(() => { loadSearches(); loadUndo(); }, []);

  // External query from Tags tab
  React.useEffect(() => {
    if (externalQuery && externalQueryKey > 0) {
      setQuery(externalQuery);
      runSearch(externalQuery);
      setShowSuggestions(false);
    }
  }, [externalQueryKey]);

  // Live search — 500ms debounce
  React.useEffect(() => {
    if (!query.trim()) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 500);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Autocomplete suggestions
  React.useEffect(() => {
    setSuggestions(buildSuggestions(query, decks, tags));
  }, [query, decks, tags]);

  function buildSuggestions(q, deckList, tagList) {
    if (!q) return [];
    const tokens = q.split(/\s+/);
    const last = tokens[tokens.length - 1];
    if (!last) return [];
    if (last.includes(':')) {
      const colon = last.indexOf(':');
      const prefix = last.slice(0, colon + 1);
      const val = last.slice(colon + 1).toLowerCase();
      if (prefix === 'deck:') {
        return deckList.filter(d => d.toLowerCase().includes(val)).slice(0, 7)
          .map(d => ({ label: `deck:${d}`, token: last }));
      }
      if (prefix === 'tag:') {
        return tagList.filter(t => t.toLowerCase().includes(val)).slice(0, 7)
          .map(t => ({ label: `tag:${t}`, token: last }));
      }
      return [];
    }
    const keywords = ['deck:', 'tag:', 'front:', 'back:', 'is:due', 'is:new', 'is:learn', 'rated:1', 'rated:7'];
    return keywords.filter(k => k.startsWith(last.toLowerCase()) && k !== last).slice(0, 6)
      .map(k => ({ label: k, token: last }));
  }

  function applySuggestion(sugg) {
    const tokens = query.split(/\s+/);
    tokens[tokens.length - 1] = sugg.label;
    const newQ = tokens.join(' ');
    setQuery(newQ);
    setShowSuggestions(false);
    if (!sugg.label.endsWith(':')) {
      clearTimeout(debounceRef.current);
      runSearch(newQ);
    }
  }

  async function loadSearches() {
    try { setSearches(await api('GET', '/api/searches')); } catch {}
  }

  async function loadUndo() {
    try { setUndoEntries(await api('GET', '/api/undo')); } catch {}
  }

  async function runSearch(q) {
    if (!q?.trim()) return;
    setError('');
    setLoading(true);
    setSelected(new Set());
    setPreviewing(null);
    setExpanded(null);
    try {
      const ids = await anki('findNotes', { query: q });
      if (!ids || ids.length === 0) { setResults([]); setLoading(false); return; }
      const notes = await anki('notesInfo', { notes: ids });
      setResults(notes || []);
    } catch (e) {
      setError(e.message || 'search failed');
    }
    setLoading(false);
  }

  async function saveSearch() {
    const name = prompt('search name:');
    if (!name?.trim()) return;
    await api('POST', '/api/searches', { name: name.trim(), query });
    loadSearches();
  }

  async function deleteSearch(id) {
    await api('DELETE', `/api/searches/${id}`);
    loadSearches();
  }

  function toggleSelect(noteId, e) {
    e.stopPropagation();
    setSelected(prev => {
      const next = new Set(prev);
      next.has(noteId) ? next.delete(noteId) : next.add(noteId);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === results.length) setSelected(new Set());
    else setSelected(new Set(results.map(n => n.noteId)));
  }

  function openPreview(note) {
    if (previewing === note.noteId && expanded !== note.noteId) { setPreviewing(null); return; }
    setPreviewing(note.noteId);
    setExpanded(null);
  }

  function openEdit(note) {
    const target = results.find(n => n.noteId === note.noteId) || note;
    setExpanded(target.noteId);
    setPreviewing(null);
    setEditFields({
      front: target.fields?.Front?.value || '',
      back: target.fields?.Back?.value || '',
      tags: (target.tags || []).join(', ')
    });
  }

  async function saveEdit(note) {
    const before = {
      front: note.fields?.Front?.value || '',
      back: note.fields?.Back?.value || '',
      tags: note.tags || []
    };
    const after = {
      front: editFields.front,
      back: editFields.back,
      tags: editFields.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      await anki('updateNote', {
        note: { id: note.noteId, fields: { Front: after.front, Back: after.back }, tags: after.tags }
      });
      await api('POST', '/api/undo', {
        action: 'updateNote',
        payload: JSON.stringify({ noteId: note.noteId, before, after })
      });
      setExpanded(null);
      runSearch(query);
      loadUndo();
    } catch (e) { setError(e.message || 'update failed'); }
  }

  async function deleteNote(note, e) {
    e.stopPropagation();
    if (!confirm('delete this note?')) return;
    try {
      await anki('deleteNotes', { notes: [note.noteId] });
      await api('POST', '/api/undo', { action: 'deleteNote', payload: JSON.stringify(note) });
      setPreviewing(null); setExpanded(null);
      runSearch(query);
      loadUndo();
    } catch (e) { setError(e.message || 'delete failed'); }
  }

  async function bulkDelete() {
    if (!confirm(`delete ${selected.size} notes?`)) return;
    try {
      await anki('deleteNotes', { notes: [...selected] });
      setSelected(new Set());
      runSearch(query);
    } catch (e) { setError(e.message || 'delete failed'); }
  }

  async function bulkMove(deck) {
    if (!deck) return;
    try {
      const cardIds = [];
      for (const noteId of selected) {
        const note = results.find(n => n.noteId === noteId);
        if (note?.cards) cardIds.push(...note.cards);
      }
      await anki('changeDeck', { cards: cardIds, deck });
      setSelected(new Set());
      runSearch(query);
    } catch (e) { setError(e.message || 'move failed'); }
  }

  async function undoAction(entry) {
    try {
      const payload = JSON.parse(entry.payload);
      if (entry.action === 'addNote') {
        await anki('deleteNotes', { notes: [payload.noteId] });
      } else if (entry.action === 'deleteNote') {
        await anki('addNote', {
          note: {
            deckName: payload.fields?.Deck?.value || 'Default',
            modelName: payload.modelName || 'Basic',
            fields: {
              Front: payload.fields?.Front?.value || '',
              Back: payload.fields?.Back?.value || ''
            },
            tags: payload.tags || []
          }
        });
      } else if (entry.action === 'updateNote') {
        await anki('updateNote', {
          note: {
            id: payload.noteId,
            fields: { Front: payload.before.front, Back: payload.before.back },
            tags: payload.before.tags
          }
        });
      }
      await api('DELETE', `/api/undo/${entry.id}`);
      loadUndo();
      if (query) runSearch(query);
    } catch (e) { setError(e.message || 'undo failed'); }
  }

  const frontPreview = note => {
    const raw = note.fields?.Front?.value || '';
    const plain = raw.replace(/<[^>]*>/g, '');
    return plain.length > 70 ? plain.slice(0, 70) + '...' : plain;
  };

  return (
    <div>
      {/* Saved search chips */}
      {searches.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searches.map(s => (
            <span key={s.id} className="flex items-center gap-1">
              <button
                onClick={() => { setQuery(s.query); runSearch(s.query); setShowSuggestions(false); }}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase"
              >
                {s.name}
              </button>
              <button
                onClick={() => deleteSearch(s.id)}
                className="text-gray-200 hover:text-red-400 text-xs transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search bar + autocomplete */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') { clearTimeout(debounceRef.current); runSearch(query); setShowSuggestions(false); }
              if (e.key === 'Escape') setShowSuggestions(false);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="search notes... (deck:, tag:, is:due, ...)"
            className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
          />
          <button
            onClick={() => { clearTimeout(debounceRef.current); runSearch(query); setShowSuggestions(false); }}
            className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase"
          >
            search
          </button>
          {query && (
            <button onClick={saveSearch} className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase">
              save
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-16 top-full bg-white border border-gray-100 z-10">
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  onMouseDown={() => applySuggestion(s)}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors font-mono"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <span>{selected.size} selected</span>
          <button onClick={bulkDelete} className="hover:text-red-400 transition-colors lowercase">
            delete selected
          </button>
          <select
            onChange={e => { bulkMove(e.target.value); e.target.value = ''; }}
            className="border-b border-gray-300 text-gray-400 focus:outline-none bg-white text-xs"
          >
            <option value="">move to deck...</option>
            {decks.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      )}

      {loading && <p className="text-gray-300 text-sm py-4">searching...</p>}
      {!loading && results.length === 0 && query && (
        <p className="text-center text-gray-300 text-sm py-8">nothing here yet.</p>
      )}

      {results.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
            <input type="checkbox" checked={selected.size === results.length} onChange={toggleAll} className="accent-gray-400" />
            <span>{results.length} notes</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {results.map(note => (
              <li key={note.noteId} className="group">
                <div
                  className="flex items-center gap-3 py-3 cursor-pointer"
                  onClick={() => openPreview(note)}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(note.noteId)}
                    onChange={e => toggleSelect(note.noteId, e)}
                    onClick={e => e.stopPropagation()}
                    className="accent-gray-400 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-gray-700">{frontPreview(note)}</span>
                    {note.tags?.length > 0 && (
                      <span className="ml-2 text-xs text-gray-300">{note.tags.join(', ')}</span>
                    )}
                  </div>
                  <button
                    onClick={e => deleteNote(note, e)}
                    className="opacity-0 group-hover:opacity-100 text-gray-200 hover:text-red-400 text-xs transition-all"
                  >
                    ✕
                  </button>
                </div>

                {/* Note preview — renders HTML front/back */}
                {previewing === note.noteId && expanded !== note.noteId && (
                  <div className="pb-5 pl-7 pr-2 border-l-2 border-gray-100 ml-7 mb-2">
                    <div className="mb-4">
                      <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">front</p>
                      <div
                        className="text-sm text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: note.fields?.Front?.value || '' }}
                      />
                    </div>
                    <div className="mb-4 pt-3 border-t border-gray-100">
                      <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">back</p>
                      <div
                        className="text-sm text-gray-500 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: note.fields?.Back?.value || '' }}
                      />
                    </div>
                    {note.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map(t => (
                          <span key={t} className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button
                        onClick={() => openEdit(note)}
                        className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase"
                      >
                        edit
                      </button>
                      <button
                        onClick={() => setPreviewing(null)}
                        className="text-gray-300 hover:text-gray-500 text-sm transition-colors lowercase"
                      >
                        close
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit form */}
                {expanded === note.noteId && (
                  <div className="pb-4 pl-7">
                    <div className="mb-3">
                      <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">front</p>
                      <input
                        type="text"
                        value={editFields.front}
                        onChange={e => setEditFields(f => ({ ...f, front: e.target.value }))}
                        className="w-full border-b border-gray-300 py-1 text-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                      />
                    </div>
                    <div className="mb-3">
                      <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">back</p>
                      <textarea
                        value={editFields.back}
                        onChange={e => setEditFields(f => ({ ...f, back: e.target.value }))}
                        rows={3}
                        className="w-full border-b border-gray-300 py-1 text-gray-700 focus:outline-none focus:border-gray-500 text-sm resize-none"
                      />
                    </div>
                    <div className="mb-3">
                      <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">tags</p>
                      <input
                        type="text"
                        value={editFields.tags}
                        onChange={e => setEditFields(f => ({ ...f, tags: e.target.value }))}
                        className="w-full border-b border-gray-300 py-1 text-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                      />
                    </div>
                    <button
                      onClick={() => saveEdit(note)}
                      className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase mr-4"
                    >
                      save
                    </button>
                    <button
                      onClick={() => { setExpanded(null); setPreviewing(note.noteId); }}
                      className="text-gray-300 hover:text-gray-500 text-sm transition-colors lowercase"
                    >
                      cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Undo panel */}
      <div className="mt-10 border-t border-gray-100 pt-6">
        <button
          onClick={() => setUndoOpen(o => !o)}
          className="text-xs tracking-widest text-gray-400 uppercase hover:text-gray-600 transition-colors"
        >
          {undoOpen ? '▾' : '▸'} undo history
        </button>
        {undoOpen && (
          <div className="mt-3">
            {undoEntries.length === 0 && <p className="text-gray-300 text-sm">nothing to undo.</p>}
            <ul className="divide-y divide-gray-100">
              {undoEntries.slice(0, 10).map(entry => (
                <li key={entry.id} className="flex items-center py-2 text-sm gap-4">
                  <span className="text-gray-600 lowercase">{entry.action}</span>
                  <span className="text-gray-300 text-xs flex-1">{new Date(entry.createdAt).toLocaleTimeString()}</span>
                  <button onClick={() => undoAction(entry)} className="text-gray-400 hover:text-gray-700 text-xs transition-colors lowercase">
                    undo
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
