// ResponsePane.jsx
// Shows response status, body (pretty/raw), and response headers
window.ResponsePane = function ResponsePane({ response, loading }) {
  const [tab, setTab] = React.useState('body');
  const [bodyView, setBodyView] = React.useState('pretty');

  const statusColor = !response ? 'text-gray-300'
    : response.status < 300 ? 'text-gray-700'
    : response.status < 400 ? 'text-yellow-600'
    : 'text-red-500';

  function formatBody(raw) {
    try { return JSON.stringify(JSON.parse(raw), null, 2); }
    catch { return raw; }
  }

  return (
    <div className="flex flex-col overflow-hidden" style={{ flex: 1, minHeight: 0 }}>
      {/* Status bar */}
      <div className="flex items-center gap-3 px-3 py-[7px] border-b border-gray-200 flex-shrink-0 bg-gray-50">
        {loading ? (
          <span className="text-[11px] text-gray-400 font-mono-geist">sending...</span>
        ) : response ? (
          <>
            <span className={`text-[11px] font-medium font-mono-geist ${statusColor}`}>{response.status} {response.statusText?.toLowerCase()}</span>
            <span className="text-[10px] text-gray-400 font-mono-geist">{response.duration}ms</span>
            <span className="text-[10px] text-gray-400 font-mono-geist">{response.size}</span>
          </>
        ) : (
          <span className="text-[11px] text-gray-300">no response yet</span>
        )}
        <div className="ml-auto flex gap-3">
          {['body','headers'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] pb-[2px] tracking-wide transition-colors bg-transparent border-0 cursor-pointer ${tab === t ? 'tab-active text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      {tab === 'body' && (
        <div className="flex flex-col flex-1 overflow-hidden p-3 bg-white">
          <div className="flex justify-between items-center mb-2 flex-shrink-0">
            <p className="text-[9px] tracking-widest text-gray-300">response body</p>
            <div className="flex gap-3">
              {['pretty','raw'].map(v => (
                <button
                  key={v}
                  onClick={() => setBodyView(v)}
                  className={`text-[10px] pb-[2px] tracking-wide transition-colors bg-transparent border-0 cursor-pointer ${bodyView === v ? 'tab-active text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          {response ? (
            <textarea
              readOnly
              value={bodyView === 'pretty' ? formatBody(response.body) : response.body}
              className="flex-1 w-full border-b border-gray-100 outline-none text-[11px] text-gray-600 bg-transparent resize-none leading-relaxed font-mono-geist"
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[12px] text-gray-300 tracking-wide">nothing here yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Headers */}
      {tab === 'headers' && (
        <div className="flex-1 overflow-y-auto p-3 bg-white">
          <p className="text-[9px] tracking-widest text-gray-300 mb-3">response headers</p>
          {response && response.headers ? (
            <div className="border-t border-gray-50">
              {Object.entries(response.headers).map(([k, v]) => (
                <div key={k} className="flex gap-3 py-[5px] border-b border-gray-50">
                  <span className="text-[10px] text-gray-400 min-w-[140px] font-mono-geist">{k}</span>
                  <span className="text-[10px] text-gray-600 font-mono-geist">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-gray-300 text-center py-6">nothing here yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
