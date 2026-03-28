// CollectionModal.jsx — modal for collection settings, import

window.CollectionModal = function CollectionModal({ collections, editColId, onClose, onSave }) {
  const isNew = !editColId;
  const [localCols, setLocalCols] = React.useState(() => JSON.parse(JSON.stringify(collections)));
  const [selectedColId, setSelectedColId] = React.useState(editColId || collections[0]?.id || null);
  const [activeSection, setActiveSection] = React.useState('settings');

  const selectedCol = isNew && !localCols.find(c => c.id === selectedColId)
    ? null
    : localCols.find(c => c.id === selectedColId);

  function updateCol(field, val) {
    setLocalCols(prev => prev.map(c =>
      c.id !== selectedColId ? c : { ...c, [field]: val }
    ));
  }

  function addNewCol() {
    const id = 'col-' + Date.now();
    const newCol = { id, name: 'new collection', description: '', requests: [] };
    setLocalCols(prev => [...prev, newCol]);
    setSelectedColId(id);
  }

  React.useEffect(() => {
    if (isNew && !selectedCol) addNewCol();
  }, []);

  const sectionTabs = [
    { id: 'settings', label: 'settings' },
    { id: 'import', label: 'import' },
  ];

  return (
    <Modal
      title={isNew ? 'new collection' : 'collection settings'}
      size="lg"
      onClose={onClose}
      actions={
        <>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors lowercase">cancel</button>
          <button onClick={() => onSave(localCols)} className="text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase">save</button>
        </>
      }
    >
      {/* Collection tab strip (for editing existing collections) */}
      {!isNew && (
        <div className="flex gap-1 border-b border-gray-100 mb-4">
          {localCols.map(col => (
            <button
              key={col.id}
              onClick={() => setSelectedColId(col.id)}
              className={`px-3 py-2 text-xs tracking-wide lowercase transition-colors border-b-2 -mb-px ${
                selectedColId === col.id
                  ? 'border-gray-700 text-gray-700'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      )}

      {selectedCol && (
        <div>
          {/* Settings / Import tabs */}
          <Tabs tabs={sectionTabs} active={activeSection} onChange={setActiveSection} />

          <div className="mt-4">
            {activeSection === 'settings' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-400 lowercase mb-1 block">collection name</label>
                  <input
                    value={selectedCol.name}
                    onChange={e => updateCol('name', e.target.value)}
                    placeholder="my collection"
                    className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 lowercase mb-1 block">description</label>
                  <textarea
                    value={selectedCol.description || ''}
                    onChange={e => updateCol('description', e.target.value)}
                    placeholder="collection description..."
                    rows={3}
                    className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent resize-none focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-400 lowercase block mb-1">requests</span>
                  <span className="text-sm text-gray-600">{selectedCol.requests?.length || 0} requests</span>
                </div>
              </div>
            )}

            {activeSection === 'import' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-400 lowercase">import a collection from json or other formats</p>
                <textarea
                  placeholder='paste collection json here...'
                  rows={8}
                  className="w-full border border-gray-200 rounded-sm py-2 px-3 text-sm text-gray-700 placeholder-gray-300 bg-transparent resize-none focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 font-mono"
                />
                <button className="self-start text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 hover:text-gray-700 transition-colors lowercase">
                  import
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
