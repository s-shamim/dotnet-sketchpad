function Tags({ anki, tags, onTabChange, onMutate }) {
  const [renaming, setRenaming] = React.useState(null);
  const [renameVal, setRenameVal] = React.useState('');
  const [error, setError] = React.useState('');
  const [counts, setCounts] = React.useState({});

  React.useEffect(() => {
    if (tags.length > 0) loadCounts();
  }, [tags]);

  async function loadCounts() {
    const c = {};
    await Promise.all(tags.slice(0, 100).map(async tag => {
      try {
        const ids = await anki('findNotes', { query: `tag:${tag}` });
        c[tag] = ids?.length || 0;
      } catch { c[tag] = 0; }
    }));
    setCounts(c);
  }

  async function renameTag(oldTag) {
    const newTag = renameVal.trim();
    if (!newTag || newTag === oldTag) { setRenaming(null); return; }
    setError('');
    try {
      const notes = await anki('findNotes', { query: `tag:${oldTag}` });
      if (notes && notes.length > 0) {
        await anki('replaceTags', {
          notes,
          tag_to_replace: oldTag,
          replace_with_tag: newTag
        });
      }
      setRenaming(null);
      onMutate();
    } catch (e) { setError(e.message || 'rename failed'); }
  }

  return (
    <div>
      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}

      {tags.length === 0
        ? <p className="text-center text-gray-300 text-sm py-8">nothing here yet.</p>
        : (
          <ul className="divide-y divide-gray-100">
            {tags.map(tag => (
              <li key={tag} className="flex items-center justify-between py-3 group">
                {renaming === tag
                  ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={renameVal}
                        onChange={e => setRenameVal(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') renameTag(tag);
                          if (e.key === 'Escape') setRenaming(null);
                        }}
                        className="flex-1 border-b border-gray-300 py-1 text-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => renameTag(tag)}
                        className="text-gray-400 hover:text-gray-700 text-xs transition-colors lowercase"
                      >
                        save
                      </button>
                      <button
                        onClick={() => setRenaming(null)}
                        className="text-gray-300 hover:text-gray-500 text-xs transition-colors lowercase"
                      >
                        cancel
                      </button>
                    </div>
                  )
                  : (
                  <>
                      <button
                        onClick={() => onTabChange('browse', `tag:${tag}`)}
                        className="text-sm text-gray-700 hover:text-gray-500 transition-colors lowercase flex-1 text-left"
                      >
                        {tag}
                      </button>
                      {counts[tag] !== undefined && (
                        <span className="text-xs text-gray-300 mr-4">{counts[tag]}</span>
                      )}
                      <button
                        onClick={() => { setRenaming(tag); setRenameVal(tag); }}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-600 text-xs transition-all lowercase"
                      >
                        rename
                      </button>
                    </>
                  )
                }
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
