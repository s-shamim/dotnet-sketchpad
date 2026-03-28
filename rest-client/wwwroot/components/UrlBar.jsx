// UrlBar.jsx — method dropdown + URL input + send button

window.UrlBar = function UrlBar({ method, onMethodChange, url, onUrlChange }) {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-white flex-shrink-0">
      {/* Method */}
      <Dropdown
        value={method}
        onChange={onMethodChange}
        options={methods.map(m => ({ value: m, label: m }))}
        width="w-24"
      />

      {/* URL */}
      <input
        type="text"
        value={url}
        onChange={e => onUrlChange(e.target.value)}
        placeholder="enter url..."
        className="flex-1 border-b border-gray-300 focus:border-gray-500 pb-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-300 font-mono"
      />

      {/* Send */}
      <button
        className="text-sm text-gray-700 border border-gray-300 px-4 py-1.5 rounded-sm hover:border-gray-500 hover:text-gray-900 transition-colors lowercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
      >
        send
      </button>
    </div>
  );
};
