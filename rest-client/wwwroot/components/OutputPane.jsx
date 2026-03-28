// OutputPane.jsx — response status bar + tabbed body/headers/test results

window.OutputPane = function OutputPane({ response }) {
  const [activeOutput, setActiveOutput] = React.useState('body');
  const [viewMode, setViewMode] = React.useState('pretty');

  const outputTabs = [
    { id: 'body', label: 'body' },
    { id: 'headers', label: 'headers' },
    { id: 'tests', label: 'test results' },
  ];

  if (!response) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Icon name="paper-plane-tilt" size={32} className="text-gray-200 mb-3" />
        <p className="text-sm text-gray-300 lowercase">send a request to see the response</p>
      </div>
    );
  }

  const statusColor = response.status >= 500 ? 'text-red-500' :
    response.status >= 400 ? 'text-red-400' :
    response.status >= 300 ? 'text-yellow-600' :
    response.status >= 200 ? 'text-green-600' : 'text-gray-500';

  let prettyBody = response.body;
  try {
    const parsed = JSON.parse(response.body);
    prettyBody = JSON.stringify(parsed, null, 2);
  } catch { /* not JSON, show raw */ }

  const responseHeaders = response.headers ? Object.entries(response.headers) : [];

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <span className={`text-xs font-mono font-medium ${statusColor}`}>
          {response.status} {response.statusText}
        </span>
        <span className="text-[10px] text-gray-400">{response.duration}ms</span>
        <span className="text-[10px] text-gray-400">{response.size}</span>
      </div>

      <Tabs tabs={outputTabs} active={activeOutput} onChange={setActiveOutput} />

      <div className="flex-1 overflow-y-auto p-4">
        {/* Body */}
        {activeOutput === 'body' && (
          <div className="flex flex-col gap-2">
            {/* View mode toggle */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setViewMode('pretty')}
                className={`text-xs px-2 py-1 rounded-sm transition-colors lowercase ${
                  viewMode === 'pretty' ? 'text-gray-700 bg-gray-100' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                pretty
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`text-xs px-2 py-1 rounded-sm transition-colors lowercase ${
                  viewMode === 'raw' ? 'text-gray-700 bg-gray-100' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                raw
              </button>
              {/* Copy */}
              <button
                onClick={() => navigator.clipboard.writeText(response.body)}
                className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
              >
                <Icon name="copy" size={12} className="" /> copy
              </button>
            </div>

            <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-all leading-relaxed">
              {viewMode === 'pretty' ? prettyBody : response.body}
            </pre>
          </div>
        )}

        {/* Headers */}
        {activeOutput === 'headers' && (
          <div className="divide-y divide-gray-100">
            {responseHeaders.map(([key, value]) => (
              <div key={key} className="flex items-start gap-3 py-2">
                <span className="text-xs text-gray-500 font-mono w-40 flex-shrink-0 break-all">{key}</span>
                <span className="text-xs text-gray-700 font-mono break-all">{value}</span>
              </div>
            ))}
            {responseHeaders.length === 0 && (
              <p className="text-xs text-gray-300 lowercase">no response headers</p>
            )}
          </div>
        )}

        {/* Test Results */}
        {activeOutput === 'tests' && (
          <div className="flex flex-col items-center justify-center py-8">
            <Icon name="test-tube" size={24} className="text-gray-200 mb-2" />
            <p className="text-xs text-gray-300 lowercase">no tests configured</p>
          </div>
        )}
      </div>
    </div>
  );
};
