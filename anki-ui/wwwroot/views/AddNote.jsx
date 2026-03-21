// Shared markdown field component: plain textarea or split MD/preview
function MdField({ label, value, onChange, onBlur, placeholder, rows = 4 }) {
  const [mdMode, setMdMode] = React.useState(false);
  const preview = React.useMemo(() => {
    try { return mdMode ? marked.parse(value || '') : ''; } catch { return ''; }
  }, [value, mdMode]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs tracking-widest text-gray-400 uppercase">{label}</p>
        <button
          type="button"
          onClick={() => setMdMode(m => !m)}
          className={`text-xs transition-colors lowercase ${mdMode ? 'text-gray-600' : 'text-gray-300 hover:text-gray-500'}`}
        >
          md
        </button>
      </div>

      {mdMode ? (
        <div className="grid grid-cols-2 gap-4">
          <textarea
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm resize-none font-mono"
          />
          <div
            className="text-sm text-gray-600 leading-relaxed border-b border-gray-100 py-2 overflow-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: preview || '<span class="text-gray-300">preview...</span>' }}
          />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm resize-none"
        />
      )}
    </div>
  );
}

function mdToHtml(text) {
  if (!text) return '';
  try { return marked.parse(text); } catch { return text; }
}

function AddNote({ anki, api, decks, editNote, onBack, onMutate }) {
  const isEdit = !!editNote;

  const [deck, setDeck] = React.useState('');
  const [models, setModels] = React.useState([]);
  const [model, setModel] = React.useState('');
  const [front, setFront] = React.useState('');
  const [back, setBack] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [dupWarning, setDupWarning] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  // Populate fields when entering edit mode
  React.useEffect(() => {
    if (isEdit && editNote.note) {
      const n = editNote.note;
      setFront(n.fields?.Front?.value || '');
      setBack(n.fields?.Back?.value || '');
      setTags((n.tags || []).join(', '));
    }
  }, [editNote]);

  React.useEffect(() => {
    if (!isEdit) {
      api('GET', '/api/preferences').then(prefs => {
        if (prefs?.lastDeck_add) setDeck(prefs.lastDeck_add);
        if (prefs?.lastModel) setModel(prefs.lastModel);
      }).catch(() => {});
    }
    anki('modelNames').then(m => setModels(m || [])).catch(() => {});
  }, [isEdit]);

  function saveDeck(val) {
    setDeck(val);
    if (!isEdit) api('POST', '/api/preferences', { key: 'lastDeck_add', value: val }).catch(() => {});
  }

  function saveModel(val) {
    setModel(val);
    if (!isEdit) api('POST', '/api/preferences', { key: 'lastModel', value: val }).catch(() => {});
  }

  async function checkDuplicate() {
    if (!front.trim() || isEdit) return;
    try {
      const results = await anki('findNotes', { query: `front:"${front.trim()}"` });
      setDupWarning(results && results.length > 0);
    } catch { setDupWarning(false); }
  }

  async function save() {
    setError('');
    setSuccess(false);
    const frontHtml = mdToHtml(front);
    const backHtml = mdToHtml(back);
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    if (isEdit) {
      // Edit mode — updateNote
      if (!frontHtml.trim() && !front.trim()) { setError('front is required'); return; }
      try {
        const note = editNote.note;
        const before = { front: note.fields?.Front?.value || '', back: note.fields?.Back?.value || '', tags: note.tags || [] };
        const after = { front: frontHtml, back: backHtml, tags: tagList };
        await anki('updateNote', {
          note: { id: note.noteId, fields: { Front: frontHtml, Back: backHtml }, tags: tagList }
        });
        await api('POST', '/api/undo', {
          action: 'updateNote',
          payload: JSON.stringify({ noteId: note.noteId, before, after })
        });
        setSuccess(true);
        setTimeout(() => { setSuccess(false); onBack(); }, 1200);
      } catch (e) { setError(e.message || 'failed to update note'); }
    } else {
      // Add mode
      if (!deck || !front.trim() || !back.trim()) { setError('deck, front, and back are required'); return; }
      try {
        const noteId = await anki('addNote', {
          note: {
            deckName: deck,
            modelName: model || models[0] || 'Basic',
            fields: { Front: frontHtml, Back: backHtml },
            tags: tagList
          }
        });
        await api('POST', '/api/undo', {
          action: 'addNote',
          payload: JSON.stringify({ noteId, deck, front: frontHtml, back: backHtml, tags: tagList })
        });
        setFront(''); setBack(''); setTags('');
        setDupWarning(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (e) { setError(e.message || 'failed to add note'); }
    }
  }

  return (
    <div>
      {/* Back button in edit mode */}
      {isEdit && (
        <button onClick={onBack} className="text-gray-300 hover:text-gray-600 text-sm transition-colors lowercase mb-6">
          ← back
        </button>
      )}

      {!isEdit && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">deck</p>
            <select value={deck} onChange={e => saveDeck(e.target.value)}
              className="w-full border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-gray-500 text-sm bg-white">
              <option value="">select deck...</option>
              {decks.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">note type</p>
            <select value={model} onChange={e => saveModel(e.target.value)}
              className="w-full border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-gray-500 text-sm bg-white">
              <option value="">select type...</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      )}

      <MdField
        label="front"
        value={front}
        onChange={e => { setFront(e.target.value); setDupWarning(false); }}
        onBlur={checkDuplicate}
        placeholder="front of card..."
        rows={3}
      />
      {dupWarning && (
        <p className="text-yellow-400 text-xs -mt-3 mb-4">duplicate detected — a note with this front already exists</p>
      )}

      <MdField
        label="back"
        value={back}
        onChange={e => setBack(e.target.value)}
        placeholder="back of card..."
        rows={4}
      />

      <div className="mb-6">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">tags</p>
        <input
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="comma-separated tags..."
          className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
        />
      </div>

      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}
      {success && <p className="text-gray-400 text-sm mb-3">{isEdit ? 'note updated.' : 'note added.'}</p>}

      <button onClick={save} className="text-gray-400 hover:text-gray-700 text-sm transition-colors lowercase">
        {isEdit ? 'save changes' : 'add note'}
      </button>
    </div>
  );
}
