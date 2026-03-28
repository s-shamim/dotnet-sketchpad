// ConsolePanel.jsx — collapsible bottom log panel

window.ConsolePanel = function ConsolePanel({ open, onToggle, logs, onClear }) {
  if (!open) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-1 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase flex-shrink-0 cursor-pointer"
      >
        <Icon name="caret-up" size={10} className="" />
        console
        {logs.length > 0 && (
          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-sm">{logs.length}</span>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col border-t border-gray-200 bg-gray-50 flex-shrink-0" style={{ maxHeight: 200 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 lowercase">console</span>
          {logs.length > 0 && (
            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-sm">{logs.length}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors lowercase"
          >
            clear
          </button>
          <button
            onClick={onToggle}
            aria-label="close console"
            className="text-gray-300 hover:text-gray-500 transition-colors flex items-center"
          >
            <Icon name="x" size={12} className="" />
          </button>
        </div>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto">
        {logs.length === 0 && (
          <p className="text-center text-gray-300 text-xs py-4 lowercase">no log entries</p>
        )}
        {logs.map((log, i) => {
          let icon, iconClass;
          switch (log.type) {
            case 'test':
              icon = log.ok ? 'check-circle' : 'x-circle';
              iconClass = log.ok ? 'text-green-600' : 'text-red-400';
              break;
            case 'log':
              icon = 'info';
              iconClass = 'text-gray-400';
              break;
            case 'warning':
              icon = 'warning';
              iconClass = 'text-yellow-500';
              break;
            case 'request':
            default:
              icon = log.ok ? 'check-circle' : 'x-circle';
              iconClass = log.ok ? 'text-green-600' : 'text-red-400';
              break;
          }
          return (
            <div key={i} className="flex items-center gap-2 px-4 py-1 border-b border-gray-100 hover:bg-gray-100 transition-colors">
              <span className="text-[10px] text-gray-300 font-mono flex-shrink-0">{log.time}</span>
              <Icon name={icon} size={12} className={`${iconClass} flex-shrink-0`} />
              {log.type && (
                <span className={`text-[9px] uppercase tracking-wider ${iconClass} flex-shrink-0 w-10`}>{log.type}</span>
              )}
              <span className="text-[10px] text-gray-500 font-mono truncate">{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
