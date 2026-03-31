const { useState } = React;

function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function Icon({ name, size = 14, className = 'text-gray-400' }) {
  return <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />;
}

function Spinner({ size = 16 }) {
  return (
    <span
      role="status"
      aria-label="loading"
      style={{ width: size, height: size }}
      className="inline-block border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin"
    />
  );
}

function Toggle({ checked, onChange, label }) {
  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  }
  return (
    <div
      className="flex items-center gap-3 cursor-pointer group"
      onClick={() => onChange(!checked)}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={e => e.stopPropagation()}
        className={`relative w-8 h-4 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1 ${
          checked ? 'bg-gray-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
          style={{ backgroundColor: 'var(--toggle-thumb)' }}
        />
      </button>
      {label && (
        <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors lowercase select-none">
          {label}
        </span>
      )}
    </div>
  );
}

function Dropdown({ value, onChange, options, placeholder = 'select...', width = 'w-48' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = options.find(o => (o.value ?? o) === value);
  const label = selected ? (selected.label ?? selected) : placeholder;

  return (
    <div className={`relative ${width}`} ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
      >
        <span className={`lowercase ${!value ? 'text-gray-400' : ''}`}>{label}</span>
        <Icon name="caret-down" size={12} className={`text-gray-400 transition-transform ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full border border-gray-200 bg-white shadow-sm rounded-sm z-20">
          {options.map(opt => {
            const v = opt.value ?? opt;
            const l = opt.label  ?? opt;
            return (
              <button
                key={v}
                onClick={() => { onChange(v); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors lowercase ${
                  value === v ? 'text-gray-800 bg-gray-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Toast({ message, variant = 'neutral', onClose }) {
  const border = { neutral: 'border-gray-200', success: 'border-green-200', error: 'border-red-200', warning: 'border-yellow-200' };
  const text   = { neutral: 'text-gray-600',   success: 'text-green-600',  error: 'text-red-500',  warning: 'text-yellow-600'  };
  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-white border ${border[variant]} px-4 py-3 shadow-sm text-sm z-50`}>
      <span className={`lowercase ${text[variant]}`}>{message}</span>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xs transition-colors">✕</button>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = React.useState(null);
  const show = (message, variant = 'neutral', duration = 3000) => setToast({ message, variant, duration });
  React.useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), toast.duration ?? 3000);
    return () => clearTimeout(id);
  }, [toast]);
  const ToastEl = toast
    ? <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
    : null;
  return { show, ToastEl };
}

function App() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
  const [mode,  setMode]  = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode',  mode);
  }, [theme, mode]);

  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { show, ToastEl } = useToast();

  async function run(mode) {
    setError('');
    setOutput('');
    setLoading(true);

    try {
      const url = mode === 'encrypt' ? '/api/encrypt' : '/api/decrypt';
      const body = mode === 'encrypt'
        ? { text: input, key, iv }
        : { cipherText: input, key, iv };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'An error occurred.');
      } else {
        setOutput(data.result);
      }
    } catch (e) {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    show('copied to clipboard.', 'success');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Settings corner */}
      <div className="fixed top-4 right-4 flex items-center gap-3 z-10">
        <Toggle
          checked={mode === 'dark'}
          onChange={v => setMode(v ? 'dark' : 'light')}
          label="dark"
        />
        <Dropdown
          value={theme}
          onChange={setTheme}
          width="w-32"
          options={[
            { value: 'zinc',   label: 'zinc'     },
            { value: 'arctic', label: 'arctic'   },
            { value: 'stone',  label: 'stone'    },
            { value: 'hc',     label: 'contrast' },
          ]}
        />
      </div>
      <div className="max-w-3xl mx-auto pt-16 px-4 pb-12">

        {/* Title */}
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-2 lowercase">
          aes utility
        </h1>
        <p className="text-xs text-gray-400 tracking-widest mb-10 lowercase">
          aes-cbc · pkcs7 · utf-8
        </p>

        {/* Key & IV */}
        <div className="mb-8 space-y-4">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-3">
            parameters
          </h2>

          {/* Key */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-6 tracking-widest lowercase">key</span>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="16, 24, or 32 characters..."
              className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
            />
            <span className={`text-xs tabular-nums w-6 text-right ${key.length === 16 || key.length === 24 || key.length === 32 ? 'text-gray-400' : 'text-gray-300'}`}>
              {key.length}
            </span>
            <button
              onClick={() => setKey(randomString(16))}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs px-2 transition-colors lowercase"
            >
              <Icon name="arrows-clockwise" size={12} />
              generate
            </button>
          </div>

          {/* IV */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-6 tracking-widest lowercase">iv</span>
            <input
              type="text"
              value={iv}
              onChange={e => setIv(e.target.value)}
              placeholder="exactly 16 characters..."
              className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
            />
            <span className={`text-xs tabular-nums w-6 text-right ${iv.length === 16 ? 'text-gray-400' : 'text-gray-300'}`}>
              {iv.length}
            </span>
            <button
              onClick={() => setIv(randomString(16))}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs px-2 transition-colors lowercase"
            >
              <Icon name="arrows-clockwise" size={12} />
              generate
            </button>
          </div>
        </div>

        {/* Input / Output side-by-side */}
        <div className="grid grid-cols-2 gap-6 mb-5">
          {/* Input */}
          <div>
            <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-3">input</h2>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="paste text or base64 here..."
              rows={8}
              className="w-full border-b border-gray-200 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 text-sm font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs tracking-widest text-gray-400 uppercase">output</h2>
              {output && (
                <button
                  onClick={copyOutput}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase"
                >
                  <Icon name="clipboard" size={12} />
                  copy
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="result will appear here..."
              rows={8}
              className="w-full border-b border-gray-200 py-2 text-gray-600 placeholder-gray-300 focus:outline-none text-sm font-mono resize-none leading-relaxed bg-white cursor-default"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 mb-4 lowercase">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => run('encrypt')}
            disabled={loading}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase disabled:opacity-30"
          >
            {loading ? <Spinner size={13} /> : <Icon name="lock" size={14} />}
            encrypt
          </button>
          <button
            onClick={() => run('decrypt')}
            disabled={loading}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase disabled:opacity-30"
          >
            {loading ? <Spinner size={13} /> : <Icon name="lock-open" size={14} />}
            decrypt
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="flex items-center gap-1.5 text-gray-300 hover:text-gray-500 text-sm px-2 transition-colors lowercase ml-auto"
          >
            <Icon name="x" size={13} />
            clear
          </button>
        </div>
      </div>
      {ToastEl}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
