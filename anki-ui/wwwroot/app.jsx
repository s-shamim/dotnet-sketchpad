// AnkiConnect helper — talks to Anki on port 8765
async function anki(action, params = {}) {
  const res = await fetch('http://localhost:8765', {
    method: 'POST',
    body: JSON.stringify({ action, version: 6, params })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// Local API helper — talks to App.cs on same origin
async function api(method, path, body = null) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : null
  });
  return res.json();
}

const TABS = ['add note', 'all notes', 'browse', 'decks', 'tags', 'quick add', 'bulk import', 'stats'];

function App() {
  const [activeTab, setActiveTab] = React.useState('add note');
  const [decks, setDecks] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [ankiError, setAnkiError] = React.useState(false);
  const [browseExternal, setBrowseExternal] = React.useState({ query: '', key: 0 });
  const [editNote, setEditNote] = React.useState(null); // { note, returnTab }

  React.useEffect(() => {
    api('GET', '/api/preferences')
      .then(prefs => { if (prefs?.activeTab) setActiveTab(prefs.activeTab); })
      .catch(() => {});
    loadDecksAndTags();
  }, []);

  async function loadDecksAndTags() {
    try {
      const [d, t] = await Promise.all([anki('deckNames'), anki('getTags')]);
      setDecks(d || []);
      setTags(t || []);
      setAnkiError(false);
    } catch {
      setAnkiError(true);
    }
  }

  function switchTab(tab, query = '') {
    setActiveTab(tab);
    if (tab !== 'add note') setEditNote(null);
    if (tab === 'browse' && query) setBrowseExternal(prev => ({ query, key: prev.key + 1 }));
    api('POST', '/api/preferences', { key: 'activeTab', value: tab }).catch(() => {});
  }

  function openEditNote(note, returnTab) {
    setEditNote({ note, returnTab });
    setActiveTab('add note');
  }

  const viewProps = { anki, api, decks, tags, onMutate: loadDecksAndTags, onTabChange: switchTab, onEditNote: openEditNote };

  const views = {
    'add note':    <AddNote {...viewProps} editNote={editNote} onBack={() => { setEditNote(null); switchTab(editNote?.returnTab || 'all notes'); }} />,
    'all notes':   <AllNotes {...viewProps} />,
    'browse':      <Browse {...viewProps} externalQuery={browseExternal.query} externalQueryKey={browseExternal.key} />,
    'decks':       <Decks {...viewProps} />,
    'tags':        <Tags {...viewProps} />,
    'quick add':   <QuickAdd {...viewProps} />,
    'bulk import': <BulkImport {...viewProps} />,
    'stats':       <Stats {...viewProps} />,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-2 lowercase">anki</h1>

        {ankiError && (
          <p className="text-red-300 text-sm mb-4">anki is not running</p>
        )}

        <nav className="flex gap-5 mb-10 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`text-sm lowercase transition-colors ${
                activeTab === tab ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'add note' && editNote ? 'edit note' : tab}
            </button>
          ))}
        </nav>

        {views[activeTab]}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
