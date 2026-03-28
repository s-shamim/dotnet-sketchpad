// EnvModal.jsx — modal for editing/creating environment variables

window.EnvModal = function EnvModal({ environments, editEnvId, onClose, onSave }) {
  const [localEnvs, setLocalEnvs] = React.useState(() => JSON.parse(JSON.stringify(environments)));
  const [selectedEnvId, setSelectedEnvId] = React.useState(editEnvId || environments[0]?.id || null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState(null);

  const selectedEnv = localEnvs.find(e => e.id === selectedEnvId);
  const nextVarId = React.useRef(100);

  function updateVar(varId, field, val) {
    setLocalEnvs(prev => prev.map(env =>
      env.id !== selectedEnvId ? env : {
        ...env,
        variables: env.variables.map(v => v.id === varId ? { ...v, [field]: val } : v),
      }
    ));
  }

  function addVar() {
    nextVarId.current += 1;
    setLocalEnvs(prev => prev.map(env =>
      env.id !== selectedEnvId ? env : {
        ...env,
        variables: [...env.variables, { id: nextVarId.current, key: '', initialValue: '', currentValue: '', enabled: true }],
      }
    ));
  }

  function removeVar(varId) {
    setLocalEnvs(prev => prev.map(env =>
      env.id !== selectedEnvId ? env : {
        ...env,
        variables: env.variables.filter(v => v.id !== varId),
      }
    ));
  }

  function updateEnvName(name) {
    setLocalEnvs(prev => prev.map(env =>
      env.id !== selectedEnvId ? env : { ...env, name }
    ));
  }

  function addNewEnv() {
    const id = 'env-' + Date.now();
    const newEnv = { id, name: 'new environment', variables: [] };
    setLocalEnvs(prev => [...prev, newEnv]);
    setSelectedEnvId(id);
    setConfirmDeleteId(null);
  }

  function deleteEnv(id) {
    const remaining = localEnvs.filter(e => e.id !== id);
    setLocalEnvs(remaining);
    setConfirmDeleteId(null);
    if (selectedEnvId === id) {
      setSelectedEnvId(remaining[0]?.id || null);
    }
  }

  return (
    <Modal
      title="environments"
      size="lg"
      onClose={onClose}
      actions={
        <>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors lowercase">cancel</button>
          <button onClick={() => onSave(localEnvs)} className="text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase">save</button>
        </>
      }
    >
      {/* Env tab strip */}
      <div className="flex gap-1 border-b border-gray-100 mb-4">
        {localEnvs.map(env => (
          <div key={env.id} className="flex items-center group">
            <button
              onClick={() => { setSelectedEnvId(env.id); setConfirmDeleteId(null); }}
              className={`px-3 py-2 text-xs tracking-wide lowercase transition-colors border-b-2 -mb-px flex items-center gap-1 ${
                selectedEnvId === env.id
                  ? 'border-gray-700 text-gray-700'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {env.name}
              {env.isGlobal && <Icon name="globe-simple" size={10} className="" />}
            </button>
            {confirmDeleteId === env.id ? (
              <div className="flex items-center gap-1 pb-px">
                <button
                  onClick={() => deleteEnv(env.id)}
                  className="text-[10px] text-red-500 hover:text-red-700 transition-colors px-1 lowercase"
                >
                  delete
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors px-1 lowercase"
                >
                  cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteId(env.id)}
                className="opacity-0 group-hover:opacity-100 pb-px text-gray-300 hover:text-red-400 transition-all flex items-center"
                aria-label={`delete ${env.name}`}
              >
                <Icon name="x" size={10} className="" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addNewEnv}
          className="px-3 py-2 text-xs text-gray-300 hover:text-gray-600 transition-colors lowercase"
        >
          + new
        </button>
      </div>

      {selectedEnv && (
        <div>
          {/* Env name */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 lowercase mb-1 block">name</label>
            <input
              value={selectedEnv.name}
              onChange={e => updateEnvName(e.target.value)}
              className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Global toggle */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="globe-simple" size={13} className="text-gray-400" />
              <span className="text-xs text-gray-600 lowercase">global environment</span>
              <span className="text-[10px] text-gray-300 lowercase">always merged as base layer</span>
            </div>
            <Toggle
              checked={selectedEnv.isGlobal || false}
              onChange={v => {
                setLocalEnvs(prev => prev.map(env =>
                  env.id === selectedEnvId
                    ? { ...env, isGlobal: v }
                    : v ? { ...env, isGlobal: false } : env
                ));
              }}
            />
          </div>

          {/* Variables table */}
          <div className="mb-2">
            <div className="flex gap-2 mb-2 text-[10px] text-gray-400 uppercase tracking-widest">
              <span className="w-4 flex-shrink-0" />
              <span className="flex-1">variable</span>
              <span className="flex-1">initial value</span>
              <span className="flex-1">current value</span>
              <span className="w-6" />
            </div>
            <div className="divide-y divide-gray-100">
              {selectedEnv.variables.map(v => (
                <div key={v.id} className="flex items-center gap-2 py-1.5 group">
                  <input
                    type="checkbox"
                    checked={v.enabled !== false}
                    onChange={e => updateVar(v.id, 'enabled', e.target.checked)}
                    className="accent-gray-400 w-3.5 h-3.5 cursor-pointer flex-shrink-0"
                    title="enabled"
                  />
                  <input
                    value={v.key}
                    onChange={e => updateVar(v.id, 'key', e.target.value)}
                    placeholder="key"
                    className={`flex-1 border-b border-gray-200 py-1 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent font-mono ${
                      v.enabled === false ? 'text-gray-300 line-through' : 'text-gray-700'
                    }`}
                  />
                  <input
                    value={v.initialValue}
                    onChange={e => updateVar(v.id, 'initialValue', e.target.value)}
                    placeholder="initial"
                    className={`flex-1 border-b border-gray-200 py-1 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent font-mono ${
                      v.enabled === false ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  />
                  <input
                    value={v.currentValue}
                    onChange={e => updateVar(v.id, 'currentValue', e.target.value)}
                    placeholder="current"
                    className={`flex-1 border-b border-gray-200 py-1 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent font-mono ${
                      v.enabled === false ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  />
                  <button
                    onClick={() => removeVar(v.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex items-center w-6"
                  >
                    <Icon name="x" size={12} className="" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addVar} className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase">
              <Icon name="plus" size={12} /> add variable
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
