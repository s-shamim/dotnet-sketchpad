// ConsolePanel.jsx — collapsible bottom log panel

window.ConsolePanel = function ConsolePanel({ open, onToggle, logs, onClear }) {
  const [expandedIdx, setExpandedIdx] = React.useState(null);
  const [height, setHeight] = React.useState(200);
  const consoleDragging = React.useRef(false);
  const consoleDragStart = React.useRef({ y: 0, h: 0 });

  React.useEffect(() => {
    function onMove(e) {
      if (!consoleDragging.current) return;
      const delta = consoleDragStart.current.y - e.clientY;
      setHeight(Math.max(80, Math.min(500, consoleDragStart.current.h + delta)));
    }
    function onUp() {
      if (!consoleDragging.current) return;
      consoleDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, []);

  function startConsoleDrag(e) {
    consoleDragging.current = true;
    consoleDragStart.current = { y: e.clientY, h: height };
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  function toggleExpand(idx, log) {
    if (!log.detail) return;
    setExpandedIdx(prev => prev === idx ? null : idx);
  }
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
    <div className="flex flex-col border-t border-gray-200 bg-gray-50 flex-shrink-0" style={{ height }}>
      {/* Drag handle */}
      <div
        className="h-[4px] flex-shrink-0 cursor-row-resize bg-gray-200 hover:bg-gray-400 transition-colors"
        onMouseDown={startConsoleDrag}
      />
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
          const hasDetail = !!log.detail;
          const isExpanded = expandedIdx === i;
          return (
            <div key={i}>
              <div
                onClick={() => toggleExpand(i, log)}
                className={`flex items-center gap-2 px-4 py-1 border-b border-gray-100 transition-colors hover:bg-gray-100 ${
                  hasDetail ? 'cursor-pointer' : ''
                } ${isExpanded ? 'bg-gray-50' : ''}`}
              >
                <span className="text-[10px] text-gray-300 font-mono flex-shrink-0">{log.time}</span>
                <Icon name={icon} size={12} className={`${iconClass} flex-shrink-0`} />
                {log.type && (
                  <span className={`text-[9px] uppercase tracking-wider ${iconClass} flex-shrink-0 w-10`}>{log.type}</span>
                )}
                <span className="text-[10px] text-gray-500 font-mono truncate flex-1">{log.message}</span>
                {hasDetail && (
                  <Icon name={isExpanded ? 'caret-up' : 'caret-down'} size={10} className="text-gray-300 flex-shrink-0" />
                )}
              </div>
              {isExpanded && log.detail && (
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex flex-col gap-3">
                  {log.detail.request && (
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">request</div>
                      <div className="text-[10px] font-mono text-gray-600 mb-1">
                        <span className="text-gray-400">{log.detail.request.method}</span> {log.detail.request.url}
                      </div>
                      {log.detail.request.headers && Object.keys(log.detail.request.headers).length > 0 && (
                        <div className="flex flex-col gap-0.5">
                          {Object.entries(log.detail.request.headers).map(([k, v]) => (
                            <div key={k} className="flex gap-2 text-[10px] font-mono">
                              <span className="text-gray-400 w-32 flex-shrink-0 truncate">{k}</span>
                              <span className="text-gray-600 truncate">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {log.detail.response && (
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">response</div>
                      <div className={`text-[10px] font-mono mb-1 ${
                        log.detail.response.status >= 400 ? 'text-red-500' : 'text-green-600'
                      }`}>
                        {log.detail.response.status} {log.detail.response.statusText}
                        <span className="text-gray-400 ml-2">{log.detail.response.duration}ms</span>
                      </div>
                      {log.detail.response.headers && (
                        <div className="flex flex-col gap-0.5 mb-1">
                          {Object.entries(log.detail.response.headers).map(([k, v]) => (
                            <div key={k} className="flex gap-2 text-[10px] font-mono">
                              <span className="text-gray-400 w-32 flex-shrink-0 truncate">{k}</span>
                              <span className="text-gray-600 truncate">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {log.detail.response.body && (
                        <pre className="text-[10px] font-mono text-gray-600 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">{log.detail.response.body}</pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
