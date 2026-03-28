// UrlBar.jsx — method dropdown + URL input + send button

window.UrlBar = function UrlBar({ method, onMethodChange, url, onUrlChange, onSend, baseUrl }) {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  const isAbsolute = url.startsWith('http://') || url.startsWith('https://');
  const showPrefix = baseUrl && !isAbsolute;

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-white flex-shrink-0">
      {/* Method */}
      <Dropdown
        value={method}
        onChange={onMethodChange}
        options={methods.map(m => ({ value: m, label: m }))}
        width="w-24"
      />

      {/* URL with optional base URL prefix */}
      <div className="flex-1 flex items-center border-b border-gray-300 focus-within:border-gray-500 pb-1">
        {showPrefix && (
          <span className="text-sm text-gray-300 font-mono flex-shrink-0 pr-0.5 select-none" title={baseUrl}>
            {baseUrl.length > 30 ? '…' + baseUrl.slice(-28) : baseUrl}
          </span>
        )}
        <input
          type="text"
          value={url}
          onChange={e => onUrlChange(e.target.value)}
          placeholder={showPrefix ? '/path...' : 'enter url...'}
          className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-300 font-mono"
        />
      </div>

      {/* Send */}
      <button
        onClick={onSend}
        className="text-sm text-gray-700 border border-gray-300 px-4 py-1.5 rounded-sm hover:border-gray-500 hover:text-gray-900 transition-colors lowercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
      >
        send
      </button>
    </div>
  );
};
