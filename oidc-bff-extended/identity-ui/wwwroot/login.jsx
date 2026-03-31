// login.jsx — Identity UI login form
// Fetches context from IDS, validates credentials, and redirects the browser to complete the auth flow.

function Icon({ name, size = 14, className = 'text-gray-400' }) {
  return <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />;
}

function Toggle({ checked, onChange, label }) {
  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(!checked); }
  }
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
      <button
        type="button" role="switch" aria-checked={checked} tabIndex={0} onKeyDown={handleKeyDown}
        onClick={e => e.stopPropagation()}
        className={`relative w-8 h-4 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1 ${checked ? 'bg-gray-600' : 'bg-gray-200'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}
          style={{ backgroundColor: 'var(--toggle-thumb)' }}
        />
      </button>
      {label && <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors lowercase select-none">{label}</span>}
    </div>
  );
}

function Dropdown({ value, onChange, options, width = 'w-36' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    function out(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', out);
    return () => document.removeEventListener('mousedown', out);
  }, []);
  const selected = options.find(o => o.value === value);
  return (
    <div className={`relative ${width}`} ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
      >
        <span className="lowercase">{selected?.label ?? value}</span>
        <Icon name="caret-down" size={11} className={`text-gray-400 transition-transform ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full border border-gray-200 bg-white shadow-sm rounded-sm z-20">
          {options.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors lowercase ${value === opt.value ? 'text-gray-800 bg-gray-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getReturnUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('returnUrl') || params.get('ReturnUrl') || '';
}

// ── LoginApp ──────────────────────────────────────────────────────────────────

function LoginApp() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
  const [mode,  setMode]  = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

  const [username,    setUsername]    = React.useState('');
  const [password,    setPassword]    = React.useState('');
  const [error,       setError]       = React.useState('');
  const [loading,     setLoading]     = React.useState(false);
  const [clientName,  setClientName]  = React.useState('');
  const [contextReady, setContextReady] = React.useState(false);

  const returnUrl = React.useRef(getReturnUrl());

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode',  mode);
  }, [theme, mode]);

  // Load login context from IDS on mount
  React.useEffect(() => {
    if (!returnUrl.current) { setContextReady(true); return; }
    const url = `https://localhost:5203/api/ids/login?returnUrl=${encodeURIComponent(returnUrl.current)}`;
    fetch(url, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.clientName) setClientName(d.clientName);
        if (d.loginHint)  setUsername(d.loginHint);
        setContextReady(true);
      })
      .catch(() => setContextReady(true));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://localhost:5203/api/ids/login', {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ username, password, returnUrl: returnUrl.current }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'login failed.');
        setLoading(false);
        return;
      }
      // Redirect back to IDS to complete the authorize flow
      window.location.href = data.redirectUrl;
    } catch {
      setError('unable to reach identity server. ensure it is running on port 5203.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar — theme controls */}
      <header className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <span className="text-xs tracking-widest text-gray-400 lowercase">identity server</span>
        <div className="flex items-center gap-4">
          <Dropdown
            value={theme} onChange={setTheme} width="w-32"
            options={[
              { value: 'zinc',   label: 'zinc'     },
              { value: 'arctic', label: 'arctic'   },
              { value: 'stone',  label: 'stone'    },
              { value: 'hc',     label: 'contrast' },
            ]}
          />
          <Toggle checked={mode === 'dark'} onChange={v => setMode(v ? 'dark' : 'light')} label="dark" />
        </div>
      </header>

      {/* Login card */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-light text-gray-800 tracking-widest lowercase mb-1">sign in</h1>
            {clientName
              ? <p className="text-sm text-gray-400 lowercase">to continue to <span className="text-gray-600">{clientName}</span></p>
              : <p className="text-sm text-gray-400 lowercase">enter your credentials to continue</p>
            }
          </div>

          {!contextReady ? (
            <div className="flex justify-center py-8">
              <span className="inline-block w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-xs tracking-widest text-gray-400 uppercase mb-2">username</label>
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  autoComplete="username" required
                  placeholder="alice or bob..."
                  className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest text-gray-400 uppercase mb-2">password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password" required
                  placeholder="same as username..."
                  className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 lowercase">{error}</p>
              )}

              <button
                type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 text-sm text-gray-700 border border-gray-300 px-4 py-2 rounded-sm hover:border-gray-500 transition-colors lowercase disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> signing in...</>
                  : 'sign in'
                }
              </button>
            </form>
          )}

          {/* Test credentials hint */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">test accounts</p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { setUsername('alice'); setPassword('alice'); }}
                className="text-left text-sm text-gray-500 hover:text-gray-700 transition-colors lowercase"
              >
                alice / alice — alice smith
              </button>
              <button
                onClick={() => { setUsername('bob'); setPassword('bob'); }}
                className="text-left text-sm text-gray-500 hover:text-gray-700 transition-colors lowercase"
              >
                bob / bob — bob jones
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LoginApp />);
