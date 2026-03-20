// RequestPane.jsx
// Tabs: params, headers, body, auth — each with relevant inputs
window.KVTable = function KVTable({ rows, onChange, onAdd, onRemove, keyPlaceholder = 'key', valuePlaceholder = 'value' }) {
  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-3"></th>
            <th className="text-[9px] tracking-widest text-gray-300 font-normal pb-2 text-left pr-2">{keyPlaceholder}</th>
            <th className="text-[9px] tracking-widest text-gray-300 font-normal pb-2 text-left pr-2">{valuePlaceholder}</th>
            <th className="w-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 group">
              <td className="pr-2 py-[3px]">
                <input
                  type="checkbox"
                  checked={row.enabled}
                  onChange={e => onChange(i, 'enabled', e.target.checked)}
                  className="w-[10px] h-[10px] cursor-pointer accent-gray-400"
                />
              </td>
              <td className="py-[3px] pr-2">
                <input
                  value={row.key}
                  onChange={e => onChange(i, 'key', e.target.value)}
                  placeholder={keyPlaceholder}
                  className="border-0 py-[2px] text-[11px] text-gray-900 bg-transparent outline-none w-full placeholder-gray-300 font-mono-geist focus:border-b focus:border-gray-400"
                />
              </td>
              <td className="py-[3px] pr-2">
                <input
                  value={row.value}
                  onChange={e => onChange(i, 'value', e.target.value)}
                  placeholder={valuePlaceholder}
                  className="border-0 py-[2px] text-[11px] text-gray-900 bg-transparent outline-none w-full placeholder-gray-300 font-mono-geist focus:border-b focus:border-gray-400"
                />
              </td>
              <td className="py-[3px]">
                <button
                  onClick={() => onRemove(i)}
                  className="text-[9px] text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-transparent border-0 cursor-pointer"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={onAdd}
        className="mt-3 text-[10px] text-gray-400 hover:text-gray-900 transition-colors bg-transparent border-0 cursor-pointer tracking-wide"
        style={{ fontFamily: 'Geist, sans-serif' }}
      >
        + add row
      </button>
    </div>
  );
};

window.RequestPane = function RequestPane({ params, onParamsChange, headers, onHeadersChange, body, onBodyChange, bodyType, onBodyTypeChange, auth, onAuthChange }) {
  const [tab, setTab] = React.useState('params');
  const tabs = [
    { id: 'params', label: `params ${params.filter(p => p.key).length > 0 ? params.filter(p => p.key).length : ''}` },
    { id: 'headers', label: `headers ${headers.filter(h => h.key).length > 0 ? headers.filter(h => h.key).length : ''}` },
    { id: 'body', label: 'body' },
    { id: 'auth', label: 'auth' },
  ];

  function addRow(list, setter) {
    setter([...list, { key: '', value: '', enabled: true }]);
  }
  function removeRow(list, setter, i) {
    setter(list.filter((_, idx) => idx !== i));
  }
  function changeRow(list, setter, i, field, val) {
    const updated = list.map((row, idx) => idx === i ? { ...row, [field]: val } : row);
    setter(updated);
  }

  const bodyTypes = ['none', 'json', 'form-data', 'x-www-form-urlencoded', 'raw'];

  return (
    <div className="flex flex-col overflow-hidden" style={{ flex: 1, minHeight: 0 }}>
      {/* Tab strip */}
      <div className="flex items-center border-b border-gray-200 px-3 flex-shrink-0 bg-gray-50">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-2 px-[10px] text-[10px] tracking-wider lowercase transition-colors bg-transparent border-0 cursor-pointer pb-[6px] whitespace-nowrap ${tab === t.id ? 'tab-active text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="flex-1 overflow-y-auto p-3 bg-white">
        {tab === 'params' && (
          <div>
            <p className="text-[9px] tracking-widest text-gray-300 mb-3">query parameters</p>
            <KVTable
              rows={params}
              onChange={(i, f, v) => changeRow(params, onParamsChange, i, f, v)}
              onAdd={() => addRow(params, onParamsChange)}
              onRemove={i => removeRow(params, onParamsChange, i)}
            />
          </div>
        )}

        {tab === 'headers' && (
          <div>
            <p className="text-[9px] tracking-widest text-gray-300 mb-3">request headers</p>
            <KVTable
              rows={headers}
              onChange={(i, f, v) => changeRow(headers, onHeadersChange, i, f, v)}
              onAdd={() => addRow(headers, onHeadersChange)}
              onRemove={i => removeRow(headers, onHeadersChange, i)}
            />
          </div>
        )}

        {tab === 'body' && (
          <div className="flex flex-col h-full">
            {/* Body type selector */}
            <div className="flex gap-4 mb-3 flex-shrink-0">
              {bodyTypes.map(bt => (
                <button
                  key={bt}
                  onClick={() => onBodyTypeChange(bt)}
                  className={`text-[10px] pb-[2px] tracking-wide transition-colors bg-transparent border-0 cursor-pointer ${bodyType === bt ? 'tab-active text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  {bt}
                </button>
              ))}
            </div>
            {bodyType !== 'none' && (
              <textarea
                value={body}
                onChange={e => onBodyChange(e.target.value)}
                className="flex-1 w-full border-b border-gray-200 focus:border-gray-400 outline-none text-[11px] text-gray-700 bg-transparent resize-none leading-relaxed font-mono-geist"
                style={{ minHeight: 120 }}
                placeholder={bodyType === 'json' ? '{\n  "key": "value"\n}' : ''}
              />
            )}
          </div>
        )}

        {tab === 'auth' && (
          <div>
            <p className="text-[9px] tracking-widest text-gray-300 mb-3">authorization</p>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="text-[10px] text-gray-300 py-2 pr-4 w-16">type</td>
                  <td>
                    <select
                      value={auth.type}
                      onChange={e => onAuthChange({ ...auth, type: e.target.value })}
                      className="border-b border-gray-200 pb-1 text-[11px] text-gray-900 bg-transparent outline-none w-full cursor-pointer"
                      style={{ fontFamily: 'Geist, sans-serif' }}
                    >
                      <option>bearer token</option>
                      <option>basic auth</option>
                      <option>api key</option>
                      <option>no auth</option>
                    </select>
                  </td>
                </tr>
                {auth.type === 'bearer token' && (
                  <tr>
                    <td className="text-[10px] text-gray-300 py-2 pr-4">token</td>
                    <td>
                      <input
                        value={auth.token || ''}
                        onChange={e => onAuthChange({ ...auth, token: e.target.value })}
                        placeholder="{{api_key}}"
                        className="border-0 border-b border-transparent focus:border-gray-400 pb-1 text-[11px] text-gray-900 bg-transparent outline-none w-full font-mono-geist placeholder-gray-300"
                      />
                    </td>
                  </tr>
                )}
                {auth.type === 'basic auth' && (
                  <>
                    <tr className="border-b border-gray-50">
                      <td className="text-[10px] text-gray-300 py-2 pr-4">username</td>
                      <td><input value={auth.username || ''} onChange={e => onAuthChange({ ...auth, username: e.target.value })} className="border-0 border-b border-transparent focus:border-gray-400 pb-1 text-[11px] text-gray-900 bg-transparent outline-none w-full font-mono-geist placeholder-gray-300" placeholder="username" /></td>
                    </tr>
                    <tr>
                      <td className="text-[10px] text-gray-300 py-2 pr-4">password</td>
                      <td><input type="password" value={auth.password || ''} onChange={e => onAuthChange({ ...auth, password: e.target.value })} className="border-0 border-b border-transparent focus:border-gray-400 pb-1 text-[11px] text-gray-900 bg-transparent outline-none w-full font-mono-geist placeholder-gray-300" placeholder="password" /></td>
                    </tr>
                  </>
                )}
                {auth.type === 'api key' && (
                  <>
                    <tr className="border-b border-gray-50">
                      <td className="text-[10px] text-gray-300 py-2 pr-4">key</td>
                      <td><input value={auth.apiKeyName || ''} onChange={e => onAuthChange({ ...auth, apiKeyName: e.target.value })} className="border-0 border-b border-transparent focus:border-gray-400 pb-1 text-[11px] text-gray-900 bg-transparent outline-none w-full font-mono-geist placeholder-gray-300" placeholder="X-API-Key" /></td>
                    </tr>
                    <tr>
                      <td className="text-[10px] text-gray-300 py-2 pr-4">value</td>
                      <td><input value={auth.apiKeyValue || ''} onChange={e => onAuthChange({ ...auth, apiKeyValue: e.target.value })} className="border-0 border-b border-transparent focus:border-gray-400 pb-1 text-[11px] text-gray-900 bg-transparent outline-none w-full font-mono-geist placeholder-gray-300" placeholder="{{api_key}}" /></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
