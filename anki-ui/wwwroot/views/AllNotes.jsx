function AllNotes({ anki, api, decks, onEditNote }) {
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [previewing, setPreviewing] = React.useState(null);
  const PAGE_SIZE = 50;

  React.useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const ids = await anki('findNotes', { query: 'deck:*' });
      if (!ids || ids.length === 0) { setNotes([]); setLoading(false); return; }
      // Load in batches of 100 to avoid huge payloads
      const chunks = [];
      for (let i = 0; i < ids.length; i += 100) chunks.push(ids.slice(i, i + 100));
      const results = await Promise.all(chunks.map(c => anki('notesInfo', { notes: c })));
      setNotes(results.flat());
    } catch (e) {
      setError(e.message || 'failed to load notes');
    }
    setLoading(false);
  }

  async function deleteNote(note) {
    if (!confirm('delete this note?')) return;
    try {
      await anki('deleteNotes', { notes: [note.noteId] });
      await api('POST', '/api/undo', { action: 'deleteNote', payload: JSON.stringify(note) });
      setNotes(prev => prev.filter(n => n.noteId !== note.noteId));
      if (previewing === note.noteId) setPreviewing(null);
    } catch (e) { setError(e.message || 'delete failed'); }
  }

  function frontText(note) {
    const raw = note.fields?.Front?.value || '';
    const plain = raw.replace(/<[^>]*>/g, '');
    return plain.length > 80 ? plain.slice(0, 80) + '...' : plain;
  }

  const totalPages = Math.ceil(notes.length / PAGE_SIZE);
  const pageNotes = notes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-gray-400">
          {loading ? 'loading...' : `${notes.length} notes`}
        </p>
        <button
          onClick={loadAll}
          className="text-xs text-gray-300 hover:text-gray-600 transition-colors lowercase"
        >
          refresh
        </button>
      </div>

      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}

      {!loading && notes.length === 0 && (
        <p className="text-center text-gray-300 text-sm py-8">nothing here yet.</p>
      )}

      {pageNotes.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {pageNotes.map(note => (
            <li key={note.noteId} className="group">
              <div
                className="flex items-center gap-3 py-3 cursor-pointer"
                onClick={() => setPreviewing(previewing === note.noteId ? null : note.noteId)}
              >
                <div className="flex-1">
                  <span className="text-sm text-gray-700">{frontText(note)}</span>
                  {note.tags?.length > 0 && (
                    <span className="ml-2 text-xs text-gray-300">{note.tags.join(', ')}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={e => { e.stopPropagation(); onEditNote(note, 'all notes'); }}
                    className="text-gray-300 hover:text-gray-600 text-xs transition-colors lowercase"
                  >
                    edit
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note); }}
                    className="text-gray-200 hover:text-red-400 text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Preview panel */}
              {previewing === note.noteId && (
                <div className="pb-5 pl-4 pr-2 border-l-2 border-gray-100 ml-4 mb-2">
                  <div className="mb-3">
                    <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">front</p>
                    <div
                      className="text-sm text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: note.fields?.Front?.value || '' }}
                    />
                  </div>
                  <div className="mb-3 pt-3 border-t border-gray-100">
                    <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">back</p>
                    <div
                      className="text-sm text-gray-500 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: note.fields?.Back?.value || '' }}
                    />
                  </div>
                  {note.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {note.tags.map(t => (
                        <span key={t} className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button
                      onClick={() => onEditNote(note, 'all notes')}
                      className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => deleteNote(note)}
                      className="text-gray-300 hover:text-red-400 text-sm transition-colors lowercase"
                    >
                      delete
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
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-xs text-gray-400">
          <button
            onClick={() => { setPage(p => Math.max(0, p - 1)); setPreviewing(null); }}
            disabled={page === 0}
            className="hover:text-gray-700 transition-colors lowercase disabled:opacity-30"
          >
            ← prev
          </button>
          <span>{page + 1} / {totalPages}</span>
          <button
            onClick={() => { setPage(p => Math.min(totalPages - 1, p + 1)); setPreviewing(null); }}
            disabled={page === totalPages - 1}
            className="hover:text-gray-700 transition-colors lowercase disabled:opacity-30"
          >
            next →
          </button>
        </div>
      )}
    </div>
  );
}
