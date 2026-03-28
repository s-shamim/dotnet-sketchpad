// InputPane.jsx — tabbed input: params, headers, body, auth, scripts, tests, settings

window.InputPane = function InputPane({ tab, onUpdate }) {
  const [activeInput, setActiveInput] = React.useState('params');

  const inputTabs = [
    { id: 'params', label: 'params' },
    { id: 'headers', label: 'headers' },
    { id: 'body', label: 'body' },
    { id: 'auth', label: 'auth' },
    { id: 'scripts', label: 'scripts' },
    { id: 'tests', label: 'tests' },
    { id: 'settings', label: 'settings' },
  ];

  const bodyTypes = [
    { value: 'none', label: 'none' },
    { value: 'json', label: 'json' },
    { value: 'form-data', label: 'form data' },
    { value: 'raw', label: 'raw' },
  ];

  const authTypes = [
    { value: 'none', label: 'no auth' },
    { value: 'bearer', label: 'bearer token' },
    { value: 'basic', label: 'basic auth' },
    { value: 'api-key', label: 'api key' },
  ];

  return (
    <div className="flex flex-col h-full">
      <Tabs tabs={inputTabs} active={activeInput} onChange={setActiveInput} />

      <div className="flex-1 overflow-y-auto p-4">
        {/* Params */}
        {activeInput === 'params' && (
          <KVEditor
            pairs={tab?.params || []}
            onChange={params => onUpdate({ params })}
          />
        )}

        {/* Headers */}
        {activeInput === 'headers' && (
          <KVEditor
            pairs={tab?.headers || []}
            onChange={headers => onUpdate({ headers })}
          />
        )}

        {/* Body */}
        {activeInput === 'body' && (
          <div className="flex flex-col gap-3">
            <Dropdown
              value={tab?.bodyType || 'none'}
              onChange={bodyType => onUpdate({ bodyType })}
              options={bodyTypes}
              width="w-36"
            />
            {tab?.bodyType !== 'none' && (
              <textarea
                value={tab?.body || ''}
                onChange={e => onUpdate({ body: e.target.value })}
                placeholder={tab?.bodyType === 'json' ? '{\n  "key": "value"\n}' : 'request body...'}
                rows={10}
                className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent resize-none focus:outline-none focus:border-gray-500 font-mono"
              />
            )}
            {tab?.bodyType === 'none' && (
              <p className="text-xs text-gray-300 lowercase">this request does not have a body</p>
            )}
          </div>
        )}

        {/* Auth */}
        {activeInput === 'auth' && (
          <div className="flex flex-col gap-4">
            <Dropdown
              value={tab?.auth?.type || 'none'}
              onChange={type => onUpdate({ auth: { ...tab?.auth, type } })}
              options={authTypes}
              width="w-40"
            />

            {tab?.auth?.type === 'bearer' && (
              <div>
                <label className="text-xs text-gray-400 lowercase mb-1 block">token</label>
                <input
                  value={tab?.auth?.token || ''}
                  onChange={e => onUpdate({ auth: { ...tab?.auth, token: e.target.value } })}
                  placeholder="bearer token..."
                  className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500 font-mono"
                />
              </div>
            )}

            {tab?.auth?.type === 'basic' && (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-gray-400 lowercase mb-1 block">username</label>
                  <input
                    value={tab?.auth?.username || ''}
                    onChange={e => onUpdate({ auth: { ...tab?.auth, username: e.target.value } })}
                    placeholder="username..."
                    className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 lowercase mb-1 block">password</label>
                  <input
                    type="password"
                    value={tab?.auth?.password || ''}
                    onChange={e => onUpdate({ auth: { ...tab?.auth, password: e.target.value } })}
                    placeholder="password..."
                    className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
            )}

            {tab?.auth?.type === 'api-key' && (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-gray-400 lowercase mb-1 block">key name</label>
                  <input
                    value={tab?.auth?.apiKeyName || ''}
                    onChange={e => onUpdate({ auth: { ...tab?.auth, apiKeyName: e.target.value } })}
                    placeholder="X-API-Key..."
                    className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 lowercase mb-1 block">key value</label>
                  <input
                    value={tab?.auth?.apiKeyValue || ''}
                    onChange={e => onUpdate({ auth: { ...tab?.auth, apiKeyValue: e.target.value } })}
                    placeholder="api key value..."
                    className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500 font-mono"
                  />
                </div>
              </div>
            )}

            {tab?.auth?.type === 'none' && (
              <p className="text-xs text-gray-300 lowercase">no authentication</p>
            )}
          </div>
        )}

        {/* Scripts */}
        {activeInput === 'scripts' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 lowercase">pre-request script</label>
            <textarea
              rows={6}
              placeholder="// pre-request script..."
              className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent resize-none focus:outline-none focus:border-gray-500 font-mono"
            />
          </div>
        )}

        {/* Tests */}
        {activeInput === 'tests' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 lowercase">test script</label>
            <textarea
              rows={6}
              placeholder="// test assertions..."
              className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent resize-none focus:outline-none focus:border-gray-500 font-mono"
            />
          </div>
        )}

        {/* Settings */}
        {activeInput === 'settings' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-300 lowercase">request-level settings</p>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-gray-400 w-3.5 h-3.5 cursor-pointer" defaultChecked />
              <span className="text-sm text-gray-600 lowercase">follow redirects</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-gray-400 w-3.5 h-3.5 cursor-pointer" />
              <span className="text-sm text-gray-600 lowercase">verify ssl</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
