// EnvModal.jsx
// Environment variable editor modal — create/edit environments and their variables
window.EnvModal = function EnvModal({ open, environments, activeEnvId, onClose, onSave }) {
  const [selectedEnvId, setSelectedEnvId] = React.useState(activeEnvId || (environments[0]?.id));
  const [localEnvs, setLocalEnvs] = React.useState(() => JSON.parse(JSON.stringify(environments)));

  React.useEffect(() => {
    if (open) {
      setLocalEnvs(JSON.parse(JSON.stringify(environments)));
      setSelectedEnvId(activeEnvId || environments[0]?.id);
    }
  }, [open]);

  if (!open) return null;

  const selectedEnv = localEnvs.find(e => e.id === selectedEnvId);

  function updateVar(i, field, val) {
    setLocalEnvs(prev => prev.map(env =>
      env.id !== selectedEnvId ? env : {
        ...env,
        variables: env.variables.map((v, idx) => idx === i ? { ...v, [field]: val } : v)
      }
    ));
  }

  function addVar() {
    setLocalEnvs(prev => prev.map(env =>
      env.id !== selectedEnvId ? env : {
        ...env,
        variables: [...env.variables, { key: '', initialValue: '', currentValue: '' }]
      }
    ));
  }

  function removeVar(i) {
    setLocalEnvs(prev => prev.map(env =>
      env.id !== selectedEnvId ? env : {
        ...env,
        variables: env.variables.filter((_, idx) => idx !== i)
      }
    ));
  }

  function addNewEnv() {
    const id = 'env_' + Date.now();
    const newEnv = { id, name: 'new environment', variables: [] };
    setLocalEnvs(prev => [...prev, newEnv]);
    setSelectedEnvId(id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.18)' }}>
      <div className="bg-white border border-gray-200 flex flex-col" style={{ width: 520, maxHeight: 440 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <span className="text-[12px] font-medium text-gray-900 tracking-wide" style={{ fontFamily: 'Geist, sans-serif' }}>environments</span>
          <button onClick={onClose} className="text-[11px] text-gray-400 hover:text-gray-900 bg-transparent border-0 cursor-pointer transition-colors" style={{ fontFamily: 'Geist, sans-serif' }}>
            ✕ close
          </button>
        </div>

        {/* Env tab strip */}
        <div className="flex border-b border-gray-200 flex-shrink-0 overflow-x-auto">
          {localEnvs.map(env => (
            <button
              key={env.id}
              onClick={() => setSelectedEnvId(env.id)}
              className={`px-3 py-[7px] text-[11px] tracking-wide bg-transparent border-0 cursor-pointer pb-[6px] whitespace-nowrap transition-colors ${selectedEnvId === env.id ? 'tab-active text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {env.name}
            </button>
          ))}
          <button
            onClick={addNewEnv}
            className="px-3 py-[7px] text-[11px] text-gray-300 hover:text-gray-700 bg-transparent border-0 cursor-pointer tracking-wide"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            + new
          </button>
        </div>

        {/* Variable table */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {selectedEnv && (
            <>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-[9px] tracking-widest text-gray-300 font-normal pb-2 text-left pr-3">variable</th>
                    <th className="text-[9px] tracking-widest text-gray-300 font-normal pb-2 text-left pr-3">initial value</th>
                    <th className="text-[9px] tracking-widest text-gray-300 font-normal pb-2 text-left">current value</th>
                    <th className="w-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEnv.variables.map((v, i) => (
                    <tr key={i} className="border-b border-gray-50 group">
                      <td className="py-[4px] pr-3">
                        <input value={v.key} onChange={e => updateVar(i, 'key', e.target.value)} placeholder="variable" className="border-b border-transparent focus:border-gray-400 pb-[2px] text-[11px] text-gray-900 bg-transparent outline-none w-full font-mono-geist placeholder-gray-300" />
                      </td>
                      <td className="py-[4px] pr-3">
                        <input value={v.initialValue} onChange={e => updateVar(i, 'initialValue', e.target.value)} placeholder="initial value" className="border-b border-transparent focus:border-gray-400 pb-[2px] text-[11px] text-gray-900 bg-transparent outline-none w-full font-mono-geist placeholder-gray-300" />
                      </td>
                      <td className="py-[4px]">
                        <input value={v.currentValue} onChange={e => updateVar(i, 'currentValue', e.target.value)} placeholder="current value" className="border-b border-transparent focus:border-gray-400 pb-[2px] text-[11px] text-gray-900 bg-transparent outline-none w-full font-mono-geist placeholder-gray-300" />
                      </td>
                      <td>
                        <button onClick={() => removeVar(i)} className="text-[9px] text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 bg-transparent border-0 cursor-pointer transition-all">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addVar} className="mt-3 text-[10px] text-gray-400 hover:text-gray-900 bg-transparent border-0 cursor-pointer tracking-wide transition-colors" style={{ fontFamily: 'Geist, sans-serif' }}>
                + add variable
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 flex-shrink-0">
          <button onClick={onClose} className="text-[11px] text-gray-400 hover:text-gray-900 bg-transparent border-0 cursor-pointer transition-colors" style={{ fontFamily: 'Geist, sans-serif' }}>
            cancel
          </button>
          <button onClick={() => onSave(localEnvs)} className="text-[11px] font-medium text-gray-900 bg-transparent border-0 send-emphasis cursor-pointer pb-[2px] tracking-wide hover:opacity-50 transition-opacity" style={{ fontFamily: 'Geist, sans-serif' }}>
            save
          </button>
        </div>
      </div>
    </div>
  );
};
