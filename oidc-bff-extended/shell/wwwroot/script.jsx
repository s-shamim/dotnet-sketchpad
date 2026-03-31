// script.jsx — Shell SPA
// Checks authentication state via BFF /bff/user (credentials:include).
// If authenticated: shows user info card + inventory table with add/delete.
// If not: shows landing page with a login button.

const BFF = 'https://bff.localhost:5205';

// ── Primitives ────────────────────────────────────────────────────────────────

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

function Spinner({ size = 16 }) {
  return (
    <span
      role="status" aria-label="loading"
      style={{ width: size, height: size }}
      className="inline-block border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin"
    />
  );
}

function Badge({ label, variant = 'neutral' }) {
  const styles = {
    neutral: 'text-gray-500 bg-gray-50 border-gray-200',
    success: 'text-green-600 bg-green-50 border-green-200',
    error:   'text-red-500 bg-red-50 border-red-200',
    info:    'text-blue-600 bg-blue-50 border-blue-200',
  };
  return (
    <span className={`inline-flex items-center border text-xs px-2 py-0.5 rounded-sm font-mono lowercase ${styles[variant] ?? styles.neutral}`}>
      {label}
    </span>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function useToast() {
  const [toasts, setToasts] = React.useState([]);
  const add = React.useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return { toasts, add };
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  const colors = {
    success: 'border-green-200 text-green-700',
    error:   'border-red-200 text-red-600',
    info:    'border-gray-200 text-gray-600',
  };
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {toasts.map(t => (
        <div key={t.id} className={`border bg-white rounded-sm px-4 py-2.5 text-sm shadow-sm lowercase ${colors[t.type] ?? colors.info}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Add Item Form ─────────────────────────────────────────────────────────────

function AddItemForm({ onAdd }) {
  const [name,     setName]     = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [price,    setPrice]    = React.useState('');
  const [loading,  setLoading]  = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await onAdd({ name, quantity: parseInt(quantity, 10), category, price: parseFloat(price) });
    setName(''); setQuantity(''); setCategory(''); setPrice('');
    setLoading(false);
  }

  const inputCls = 'w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500';

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
      <div>
        <label className="block text-xs tracking-widest text-gray-400 uppercase mb-1">name</label>
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="item name..." className={inputCls} />
      </div>
      <div>
        <label className="block text-xs tracking-widest text-gray-400 uppercase mb-1">category</label>
        <input value={category} onChange={e => setCategory(e.target.value)} required placeholder="electronics, furniture..." className={inputCls} />
      </div>
      <div>
        <label className="block text-xs tracking-widest text-gray-400 uppercase mb-1">quantity</label>
        <input type="number" min={0} value={quantity} onChange={e => setQuantity(e.target.value)} required placeholder="0" className={inputCls} />
      </div>
      <div>
        <label className="block text-xs tracking-widest text-gray-400 uppercase mb-1">price ($)</label>
        <input type="number" min={0} step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.00" className={inputCls} />
      </div>
      <div className="col-span-2 flex justify-end pt-2">
        <button
          type="submit" disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 px-4 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <><Spinner size={12} /> adding...</> : <><Icon name="plus" size={13} className="" /> add item</>}
        </button>
      </div>
    </form>
  );
}

// ── Inventory Table ───────────────────────────────────────────────────────────

function InventoryTable({ items, onDelete }) {
  const [deleting, setDeleting] = React.useState(null);

  async function handleDelete(id) {
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
  }

  if (!items.length) {
    return (
      <div className="py-10 text-center">
        <Icon name="package" size={28} className="text-gray-200 mb-3" />
        <p className="text-sm text-gray-400 lowercase">no items yet. add one above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-xs tracking-widest text-gray-400 uppercase pb-3 pr-6 font-normal">name</th>
            <th className="text-left text-xs tracking-widest text-gray-400 uppercase pb-3 pr-6 font-normal">category</th>
            <th className="text-right text-xs tracking-widest text-gray-400 uppercase pb-3 pr-6 font-normal">qty</th>
            <th className="text-right text-xs tracking-widest text-gray-400 uppercase pb-3 pr-6 font-normal">price</th>
            <th className="pb-3 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
              <td className="py-3 pr-6 text-gray-800">{item.name}</td>
              <td className="py-3 pr-6">
                <Badge label={item.category.toLowerCase()} variant="neutral" />
              </td>
              <td className="py-3 pr-6 text-right font-mono text-gray-600">{item.quantity}</td>
              <td className="py-3 pr-6 text-right font-mono text-gray-600">${item.price.toFixed(2)}</td>
              <td className="py-3 text-right">
                <button
                  aria-label={`delete ${item.name}`}
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-colors rounded-sm disabled:opacity-40"
                >
                  {deleting === item.id
                    ? <Spinner size={12} />
                    : <Icon name="trash" size={14} className="" />
                  }
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Landing Page (unauthenticated) ────────────────────────────────────────────

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
      <div className="mb-3">
        <Icon name="package" size={40} className="text-gray-200" />
      </div>
      <h1 className="text-3xl font-light text-gray-800 tracking-widest lowercase mb-3">
        inventory manager
      </h1>
      <p className="text-sm text-gray-400 max-w-sm lowercase mb-8">
        a demo of the oidc bff extended pattern — authentication is managed by the bff,
        access tokens never reach the browser.
      </p>
      <a
        href={`${BFF}/bff/login`}
        className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 px-5 py-2.5 rounded-sm hover:border-gray-500 transition-colors lowercase"
      >
        <Icon name="sign-in" size={14} className="" />
        sign in
      </a>

      {/* Architecture summary */}
      <div className="mt-14 w-full max-w-lg text-left border-t border-gray-100 pt-8">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">auth flow</p>
        <ol className="flex flex-col gap-2">
          {[
            ['shell (5201)',           'click sign in → navigate to BFF /bff/login'],
            ['bff (5205)',             'issues OIDC challenge → redirects to identity server'],
            ['identity server (5203)', 'redirects browser to identity ui for login'],
            ['identity ui (5204)',     'user enters credentials → POST to identity server API'],
            ['identity server (5203)', 'validates credentials → 302 to BFF callback'],
            ['bff (5205)',             'exchanges code for tokens → creates GUID session → sets HttpOnly cookie'],
            ['shell (5201)',           'reads session from BFF → renders inventory'],
          ].map(([app, desc], i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="shrink-0 w-5 h-5 rounded-full border border-gray-200 text-xs text-gray-400 flex items-center justify-center font-mono">{i + 1}</span>
              <span className="text-gray-500 lowercase">
                <span className="text-gray-700 font-mono text-xs">{app}</span>
                {' — '}{desc}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ── Authenticated View ────────────────────────────────────────────────────────

function AuthenticatedView({ user, toast }) {
  const [items,   setItems]   = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch(`${BFF}/bff/api/items`, { credentials: 'include' });
      if (!res.ok) throw new Error(`${res.status}`);
      setItems(await res.json());
    } catch (e) {
      toast.add(`failed to load items: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(input) {
    try {
      const res = await fetch(`${BFF}/bff/api/items`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const item = await res.json();
      setItems(prev => [...prev, item]);
      toast.add('item added.', 'success');
    } catch (e) {
      toast.add(`failed to add item: ${e.message}`, 'error');
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${BFF}/bff/api/items/${id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.add('item deleted.', 'success');
    } catch (e) {
      toast.add(`failed to delete item: ${e.message}`, 'error');
    }
  }

  return (
    <div className="flex-1 px-12 py-10 max-w-3xl">
      {/* User info card */}
      <div className="flex items-start justify-between mb-10 pb-8 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-light text-gray-800 tracking-widest lowercase mb-1">
            inventory
          </h1>
          <p className="text-sm text-gray-400 lowercase">
            signed in as <span className="text-gray-600">{user.name}</span>
            <span className="font-mono text-xs text-gray-300 ml-2">{user.sub}</span>
          </p>
        </div>
        <a
          href={`${BFF}/bff/logout`}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors lowercase"
        >
          <Icon name="sign-out" size={14} className="" />
          sign out
        </a>
      </div>

      {/* Add item */}
      <div className="mb-8">
        <h3 className="text-xs tracking-widest text-gray-400 uppercase mb-4 pb-2 border-b border-gray-100">
          add item
        </h3>
        <AddItemForm onAdd={handleAdd} />
      </div>

      {/* Inventory table */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <h3 className="text-xs tracking-widest text-gray-400 uppercase">
            items <span className="font-mono normal-case ml-1">({items.length})</span>
          </h3>
          <button
            onClick={loadItems} disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
          >
            <Icon name="arrow-clockwise" size={12} className="" /> refresh
          </button>
        </div>

        {loading
          ? <div className="flex justify-center py-10"><Spinner /></div>
          : <InventoryTable items={items} onDelete={handleDelete} />
        }
      </div>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────

function App() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
  const [mode,  setMode]  = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

  const [authState, setAuthState] = React.useState('loading'); // 'loading' | 'authenticated' | 'anonymous'
  const [user, setUser] = React.useState(null);
  const toast = useToast();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode',  mode);
  }, [theme, mode]);

  React.useEffect(() => {
    fetch(`${BFF}/bff/user`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.authenticated) { setUser(d); setAuthState('authenticated'); }
        else                  setAuthState('anonymous');
      })
      .catch(() => setAuthState('anonymous'));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <header className="shrink-0 border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <span className="text-xs tracking-widest text-gray-400 lowercase">oidc bff extended</span>
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

      {/* Main content */}
      <div className="flex flex-1">
        {authState === 'loading' && (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size={20} />
          </div>
        )}
        {authState === 'anonymous' && <LandingPage />}
        {authState === 'authenticated' && <AuthenticatedView user={user} toast={toast} />}
      </div>

      <ToastContainer toasts={toast.toasts} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
