// RequestShoulder.jsx — request name, breadcrumb, save button

window.RequestShoulder = function RequestShoulder({ name, collectionName, saved }) {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-gray-700 truncate lowercase">{name || 'untitled request'}</span>
        {collectionName && (
          <>
            <Icon name="caret-right" size={10} className="text-gray-300 flex-shrink-0" />
            <span className="text-xs text-gray-400 truncate lowercase">{collectionName}</span>
          </>
        )}
      </div>
      <button
        className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase flex-shrink-0"
      >
        {saved ? 'save' : 'save as'}
      </button>
    </div>
  );
};
