// ActivityBar.jsx — thin icon rail on the far left

window.ActivityBar = function ActivityBar({ activePanel, onPanelChange }) {
  const items = [
    { id: 'collections', icon: 'folder-simple', label: 'collections' },
    { id: 'environments', icon: 'globe-simple', label: 'environments' },
    { id: 'history', icon: 'clock-counter-clockwise', label: 'history' },
  ];

  return (
    <div className="w-10 flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50">
      {items.map(item => (
        <button
          key={item.id}
          aria-label={item.label}
          onClick={() => onPanelChange(item.id)}
          className={`w-full h-10 flex items-center justify-center transition-colors relative ${
            activePanel === item.id
              ? 'text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {activePanel === item.id && (
            <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-gray-900 rounded-r" />
          )}
          <Icon name={item.icon} size={18} className="" />
        </button>
      ))}
    </div>
  );
};
