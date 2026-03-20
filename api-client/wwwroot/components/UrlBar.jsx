// UrlBar.jsx
// Top bar: HTTP method selector, URL input, environment selector, send button
window.UrlBar = function UrlBar({ method, onMethodChange, url, onUrlChange, environment, environments, onEnvChange, onSend, loading }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-white flex-shrink-0">
      {/* Method */}
      <select
        value={method}
        onChange={e => onMethodChange(e.target.value)}
        className="border-b border-gray-400 pb-1 text-xs font-medium text-gray-900 bg-transparent outline-none cursor-pointer min-w-[58px]"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        {['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* URL */}
      <input
        type="text"
        value={url}
        onChange={e => onUrlChange(e.target.value)}
        placeholder="enter url..."
        className="flex-1 border-b border-gray-400 focus:border-gray-900 pb-1 text-xs text-gray-900 bg-transparent outline-none placeholder-gray-300"
        style={{ fontFamily: 'Geist Mono, monospace' }}
      />

      {/* Environment */}
      <select
        value={environment}
        onChange={e => onEnvChange(e.target.value)}
        className="border-b border-gray-400 pb-1 text-xs text-gray-500 bg-transparent outline-none cursor-pointer"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        {environments.map(env => (
          <option key={env.id} value={env.id}>{env.name}</option>
        ))}
      </select>

      {/* Send */}
      <button
        onClick={onSend}
        disabled={loading}
        className="text-xs font-medium text-gray-900 bg-transparent border-0 send-emphasis pb-1 cursor-pointer tracking-wide hover:opacity-50 transition-opacity disabled:opacity-40"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        {loading ? 'sending...' : 'send'}
      </button>
    </div>
  );
};
