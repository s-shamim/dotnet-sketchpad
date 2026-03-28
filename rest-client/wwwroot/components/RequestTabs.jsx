// RequestTabs.jsx — browser-style request tabs with close/add

window.RequestTabs = function RequestTabs({ tabs, activeTabId, onSelectTab, onCloseTab, onAddTab }) {
  return (
    <div className="flex items-center border-b border-gray-100 bg-white flex-shrink-0 overflow-x-auto">
      {tabs.map(tab => (
        <div
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-2 cursor-pointer border-b-2 -mb-px text-xs transition-colors group min-w-0 ${
            activeTabId === tab.id
              ? 'border-gray-700 text-gray-700'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Badge label={tab.method} variant={tab.method.toLowerCase()} />
          <span className="truncate lowercase max-w-[120px]">{tab.name}</span>
          {!tab.saved && <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" title="unsaved" />}
          <button
            onClick={e => { e.stopPropagation(); onCloseTab(tab.id); }}
            className="ml-1 text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 flex items-center flex-shrink-0"
            aria-label="close tab"
          >
            <Icon name="x" size={10} className="" />
          </button>
        </div>
      ))}

      {/* Add tab */}
      <button
        onClick={onAddTab}
        aria-label="new tab"
        className="px-2 py-2 text-gray-300 hover:text-gray-600 transition-colors flex items-center flex-shrink-0"
      >
        <Icon name="plus" size={14} className="" />
      </button>
    </div>
  );
};
