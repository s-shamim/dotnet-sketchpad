// BottomBar.jsx
// Console output + layout/sidebar/console toggle buttons
window.BottomBar = function BottomBar({ logs, layout, onToggleLayout, sidebarOpen, onToggleSidebar, consoleOpen, onToggleConsole }) {
  return (
    <div className="border-t border-gray-200 flex-shrink-0 bg-gray-50">
      {/* Header row */}
      <div className="flex items-center px-4 py-[5px] gap-3">
        <span
          className="flex items-center gap-[5px] text-[10px] tracking-wider text-gray-400"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          console
          <span style={{ fontSize: 7, display: 'inline-block', transition: 'transform 0.2s', transform: consoleOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▲</span>
        </span>

        {/* Right side buttons */}
        <div className="ml-auto flex items-center border-l border-gray-200">
          <button
            onClick={onToggleLayout}
            className="text-[10px] text-gray-400 hover:text-gray-900 bg-transparent border-0 border-l border-gray-200 cursor-pointer px-3 py-[5px] tracking-wide transition-colors"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {layout === 'stacked' ? '⇔ split' : '⇕ stack'}
          </button>
          <button
            onClick={onToggleConsole}
            className={`text-[10px] hover:text-gray-900 bg-transparent border-0 border-l border-gray-200 cursor-pointer px-3 py-[5px] tracking-wide transition-colors ${consoleOpen ? 'text-gray-900' : 'text-gray-400'}`}
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {consoleOpen ? '⊟' : '⊞'} console
          </button>
          <button
            onClick={onToggleSidebar}
            className={`text-[10px] hover:text-gray-900 bg-transparent border-0 border-l border-gray-200 cursor-pointer px-3 py-[5px] tracking-wide transition-colors ${sidebarOpen ? 'text-gray-900' : 'text-gray-400'}`}
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {sidebarOpen ? '⊟' : '⊞'} sidebar
          </button>
        </div>
      </div>

      {/* Console log body */}
      {consoleOpen && (
        <div className="border-t border-gray-200 px-4 py-2" style={{ maxHeight: 110, overflowY: 'auto' }}>
          {logs.length === 0 && (
            <p className="text-[10px] text-gray-300 py-1">no requests yet.</p>
          )}
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 py-[2px]">
              <span className="text-[10px] text-gray-300 min-w-[54px] font-mono-geist">{log.time}</span>
              <span className={`text-[10px] font-mono-geist ${log.ok ? 'text-gray-500' : 'text-red-400'}`}>{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
