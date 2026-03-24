// ── Helpers ───────────────────────────────────────────────────────────────────

function parseJwt(token) {
  try {
    const [header, payload] = token.split('.');
    const decode = (b64) => JSON.parse(atob(b64.replace(/-/g, '+').replace(/_/g, '/')));
    return { header: decode(header), payload: decode(payload), raw: token };
  } catch {
    return null;
  }
}

function getParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    at: p.get('at') ? decodeURIComponent(p.get('at')) : null,
    it: p.get('it') ? decodeURIComponent(p.get('it')) : null,
    rt: p.get('rt') ? decodeURIComponent(p.get('rt')) : null,
  };
}

function timeAgo(exp) {
  if (!exp) return null;
  const secs = exp - Math.floor(Date.now() / 1000);
  if (secs < 0) return 'expired';
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

// ── Design-system primitives ──────────────────────────────────────────────────

function Icon({ name, size = 14, className = 'text-gray-400' }) {
  return <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />;
}

function Badge({ label, variant = 'neutral' }) {
  const styles = {
    neutral: 'text-gray-500 bg-gray-100',
    success: 'text-green-600 bg-green-50',
    error:   'text-red-500 bg-red-50',
    warning: 'text-yellow-600 bg-yellow-50',
    get:     'text-green-600 bg-green-50',
    post:    'text-yellow-600 bg-yellow-50',
  };
  return (
    <span className={`inline-block text-xs font-mono px-1.5 py-0.5 uppercase tracking-wide ${styles[variant] ?? styles.neutral}`}>
      {label}
    </span>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-gray-100">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-xs tracking-wide lowercase transition-colors border-b-2 -mb-px ${
            active === tab.id
              ? 'border-gray-700 text-gray-700'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function CodeBlock({ content, maxHeight = 280 }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative border border-gray-100 bg-gray-50">
      <button onClick={copy}
        className="absolute top-2 right-2 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase">
        {copied ? 'copied' : 'copy'}
      </button>
      <pre style={{ maxHeight }} className="overflow-auto p-4 text-xs text-gray-700 font-mono leading-relaxed whitespace-pre-wrap break-all">
        {content}
      </pre>
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
  const ToastEl = toast ? (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-white border px-4 py-3 shadow-sm text-sm z-50 ${
      { neutral: 'border-gray-200', success: 'border-green-200', error: 'border-red-200' }[toast.variant]
    }`}>
      <span className={`lowercase ${{ neutral: 'text-gray-600', success: 'text-green-600', error: 'text-red-500' }[toast.variant]}`}>
        {toast.message}
      </span>
      <button onClick={() => setToast(null)} className="text-gray-300 hover:text-gray-500 text-xs transition-colors">✕</button>
    </div>
  ) : null;
  return { show, ToastEl };
}

// ── Flow Step Tracker ─────────────────────────────────────────────────────────

const FLOW_STEPS = [
  { id: 'start',    label: 'page visit',         detail: 'Browser hits /dashboard. No session cookie → not authenticated.' },
  { id: 'redirect', label: 'auth redirect',       detail: 'Client builds authorization request: response_type=code, PKCE code_challenge, state, nonce. 302 → /connect/authorize.' },
  { id: 'login',    label: 'login',               detail: 'Duende serves login page. User submits credentials via POST /account/login. IDS validates and issues its own session cookie.' },
  { id: 'consent',  label: 'consent',             detail: 'IDS shows consent screen listing requested scopes (openid, profile, api). User clicks allow.' },
  { id: 'code',     label: 'auth code',           detail: 'IDS generates short-lived (~60s) single-use auth code. 302 → redirect_uri?code=ABC&state=XYZ (front-channel).' },
  { id: 'exchange', label: 'token exchange',      detail: 'Client server POSTs to /connect/token with code + code_verifier + client_secret. Back-channel — browser not involved.' },
  { id: 'tokens',   label: 'tokens issued',       detail: 'IDS mints access_token (JWT, RS256), id_token (JWT), refresh_token (opaque). Client sets encrypted session cookie on browser.' },
  { id: 'done',     label: 'authenticated',       detail: 'Browser redirected to /dashboard. Session established. Tokens stored server-side.' },
];

function FlowTracker({ authenticated }) {
  const completedCount = authenticated ? FLOW_STEPS.length : 0;
  const [expanded, setExpanded] = React.useState(null);

  return (
    <div className="flex flex-col gap-0">
      {FLOW_STEPS.map((step, i) => {
        const done   = i < completedCount;
        const active = i === completedCount && !authenticated;
        const open   = expanded === step.id;
        return (
          <div key={step.id} className="border-b border-gray-100 last:border-0">
            <button
              onClick={() => setExpanded(open ? null : step.id)}
              className="flex items-center gap-3 w-full py-2.5 text-left hover:bg-gray-50 transition-colors px-1 group">
              <span className={`w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 ${
                done   ? 'text-green-600' :
                active ? 'text-yellow-600' :
                         'text-gray-200'
              }`}>
                {done ? <Icon name="check-circle" size={16} className="text-green-600" /> :
                 active ? <Icon name="circle-dashed" size={16} className="text-yellow-600" /> :
                          <Icon name="circle" size={16} className="text-gray-200" />}
              </span>
              <span className={`text-xs lowercase flex-1 ${
                done   ? 'text-gray-600' :
                active ? 'text-gray-700' :
                         'text-gray-300'
              }`}>{step.label}</span>
              <span className={`text-gray-300 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>↓</span>
            </button>
            {open && (
              <p className="text-xs text-gray-500 lowercase pb-3 pl-9 pr-4 leading-relaxed">
                {step.detail}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Token Inspector ───────────────────────────────────────────────────────────

function TokenInspector({ tokens }) {
  const [tab, setTab] = React.useState('access');

  const tokenMap = {
    access:  { label: 'access token',  value: tokens.at, type: 'jwt' },
    id:      { label: 'id token',      value: tokens.it, type: 'jwt' },
    refresh: { label: 'refresh token', value: tokens.rt, type: 'opaque' },
  };

  const current = tokenMap[tab];
  const parsed  = current.type === 'jwt' && current.value ? parseJwt(current.value) : null;

  if (!tokens.at) {
    return (
      <div className="py-8 text-center">
        <Icon name="lock" size={24} className="text-gray-200 block mx-auto mb-3" />
        <p className="text-xs text-gray-300 lowercase">not authenticated — no tokens yet.</p>
        <a href="/login" className="text-xs text-gray-500 hover:text-gray-700 transition-colors lowercase mt-4 block">
          start login flow →
        </a>
      </div>
    );
  }

  const exp = parsed?.payload?.exp;
  const ttl = exp ? timeAgo(exp) : null;

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        tabs={[
          { id: 'access',  label: 'access token' },
          { id: 'id',      label: 'id token' },
          { id: 'refresh', label: 'refresh token' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {parsed ? (
        <div className="flex flex-col gap-4">
          {/* Header row */}
          <div className="flex items-center gap-3">
            <Badge label="JWT" variant="neutral" />
            <Badge label="RS256" variant="neutral" />
            {ttl && (
              <span className={`text-xs font-mono ${ttl === 'expired' ? 'text-red-500' : 'text-green-600'}`}>
                expires in {ttl}
              </span>
            )}
          </div>

          {/* Claims table */}
          <div>
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">claims</p>
            <div className="divide-y divide-gray-100 border border-gray-100">
              {Object.entries(parsed.payload).map(([k, v]) => (
                <div key={k} className="flex gap-3 px-3 py-2 hover:bg-gray-50 transition-colors">
                  <span className="text-xs font-mono text-gray-400 w-28 flex-shrink-0">{k}</span>
                  <span className="text-xs font-mono text-gray-700 break-all">
                    {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw token */}
          <div>
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">raw token</p>
            <CodeBlock content={current.value} maxHeight={120} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Badge label="opaque" variant="neutral" />
            <span className="text-xs text-gray-400 lowercase">not a jwt — cannot decode client-side</span>
          </div>
          <CodeBlock content={current.value ?? '—'} maxHeight={80} />
        </div>
      )}
    </div>
  );
}

// ── API Caller ────────────────────────────────────────────────────────────────

function ApiCaller({ tokens }) {
  const [loading,  setLoading]  = React.useState(false);
  const [response, setResponse] = React.useState(null);
  const [error,    setError]    = React.useState(null);
  const { show, ToastEl }       = useToast();

  const call = async () => {
    if (!tokens.at) { show('no access token — login first.', 'error'); return; }
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res  = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${tokens.at}` }
      });
      const data = await res.json();
      setResponse({ status: res.status, ok: res.ok, data });
      show(`${res.status} received.`, res.ok ? 'success' : 'error');
    } catch (e) {
      setError(String(e));
      show('request failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Request box */}
      <div className="border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge label="GET" variant="get" />
            <span className="text-xs font-mono text-gray-600">/api/me</span>
          </div>
          <button onClick={call} disabled={loading || !tokens.at}
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors lowercase disabled:opacity-30 disabled:cursor-not-allowed">
            {loading ? 'sending...' : 'send →'}
          </button>
        </div>
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">request headers</p>
          <div className="text-xs font-mono text-gray-500 leading-relaxed">
            <span className="text-gray-400">Authorization: </span>
            <span className="text-gray-700">Bearer {tokens.at ? tokens.at.substring(0, 40) + '…' : '—'}</span>
          </div>
          <div className="text-xs font-mono text-gray-500 mt-1">
            <span className="text-gray-400">scheme: </span>
            <span className="text-gray-700">Bearer / JWT</span>
          </div>
        </div>
      </div>

      {/* Response */}
      {response && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge label={`${response.status} ${response.ok ? 'ok' : 'error'}`} variant={response.ok ? 'success' : 'error'} />
            <span className="text-xs text-gray-400 lowercase">api validated the jwt and returned claims</span>
          </div>
          <CodeBlock content={JSON.stringify(response.data, null, 2)} />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 lowercase">{error}</p>
      )}

      {!tokens.at && (
        <p className="text-xs text-gray-300 lowercase">login first to get an access token.</p>
      )}

      {ToastEl}
    </div>
  );
}

// ── Endpoint Explorer ─────────────────────────────────────────────────────────

const ENDPOINTS = [
  { method: 'GET',  path: '/.well-known/openid-configuration', note: 'Discovery document — lists all IDS endpoints, signing keys, supported scopes.' },
  { method: 'GET',  path: '/.well-known/openid-configuration/jwks', note: 'JSON Web Key Set — public keys used to verify JWT signatures.' },
  { method: 'GET',  path: '/connect/authorize',   note: 'Authorization endpoint — starts the OIDC flow. Expects client_id, response_type, scope, redirect_uri, state, code_challenge.' },
  { method: 'POST', path: '/connect/token',        note: 'Token endpoint — back-channel exchange. Accepts code + code_verifier + client_secret → returns access_token, id_token, refresh_token.' },
  { method: 'GET',  path: '/connect/userinfo',     note: 'UserInfo endpoint — accepts Bearer access_token → returns user claims.' },
  { method: 'POST', path: '/connect/revocation',   note: 'Revocation endpoint — invalidates a refresh token or access token.' },
  { method: 'GET',  path: '/connect/endsession',   note: 'End session endpoint — initiates logout, clears IDS session cookie.' },
];

function EndpointExplorer() {
  const [expanded, setExpanded] = React.useState(null);
  const [response, setResponse] = React.useState({});

  const fetch_ = async (path) => {
    try {
      const res  = await fetch(path);
      const text = await res.text();
      let   body;
      try { body = JSON.stringify(JSON.parse(text), null, 2); } catch { body = text; }
      setResponse(r => ({ ...r, [path]: { status: res.status, body } }));
    } catch (e) {
      setResponse(r => ({ ...r, [path]: { status: 0, body: String(e) } }));
    }
  };

  return (
    <div className="flex flex-col gap-0 divide-y divide-gray-100">
      {ENDPOINTS.map(ep => {
        const open = expanded === ep.path;
        const res  = response[ep.path];
        return (
          <div key={ep.path}>
            <button onClick={() => setExpanded(open ? null : ep.path)}
              className="flex items-center gap-3 w-full py-2.5 text-left hover:bg-gray-50 transition-colors px-1">
              <Badge label={ep.method} variant={ep.method === 'GET' ? 'get' : 'post'} />
              <span className="text-xs font-mono text-gray-600 flex-1">{ep.path}</span>
              <span className={`text-gray-300 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>↓</span>
            </button>
            {open && (
              <div className="pb-4 pl-2 pr-1 flex flex-col gap-3">
                <p className="text-xs text-gray-500 lowercase leading-relaxed">{ep.note}</p>
                {ep.method === 'GET' && (
                  <div className="flex items-center gap-4">
                    <button onClick={() => fetch_(ep.path)}
                      className="text-xs text-gray-500 hover:text-gray-800 transition-colors lowercase">
                      fetch →
                    </button>
                    {res && <Badge label={`${res.status}`} variant={res.status === 200 ? 'success' : 'error'} />}
                  </div>
                )}
                {res && <CodeBlock content={res.body} />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

function App() {
  const tokens = getParams();
  const [tab,   setTab]   = React.useState('flow');
  const [auth,  setAuth]  = React.useState(null);   // null = loading

  React.useEffect(() => {
    fetch('/api/whoami')
      .then(r => r.json())
      .then(d => setAuth(d))
      .catch(() => setAuth({ authenticated: false }));
  }, []);

  const authenticated = auth?.authenticated === true || !!tokens.at;

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 border-b border-gray-100 pb-6">
        <div>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">oidc demo</p>
          <h1 className="text-sm text-gray-700 lowercase">duende identity server — auth code + pkce flow</h1>
          {auth?.name && (
            <p className="text-xs text-green-600 mt-1 lowercase">
              <Icon name="user" size={12} className="text-green-600 mr-1" />
              signed in as {auth.name}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {authenticated ? (
            <a href="/logout"
              className="text-xs text-gray-400 hover:text-red-400 transition-colors lowercase">
              sign out
            </a>
          ) : (
            <a href="/login"
              className="text-xs text-gray-600 hover:text-gray-900 transition-colors lowercase">
              sign in →
            </a>
          )}
          <div className={`flex items-center gap-1.5 text-xs ${authenticated ? 'text-green-600' : 'text-gray-300'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${authenticated ? 'bg-green-500' : 'bg-gray-200'}`} />
            {authenticated ? 'authenticated' : 'unauthenticated'}
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <Tabs
        tabs={[
          { id: 'flow',      label: 'flow steps' },
          { id: 'tokens',    label: 'token inspector' },
          { id: 'api',       label: 'api call' },
          { id: 'endpoints', label: 'endpoints' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Content */}
      <div className="mt-6 flex-1">
        {tab === 'flow'      && <FlowTracker authenticated={authenticated} />}
        {tab === 'tokens'    && <TokenInspector tokens={tokens} />}
        {tab === 'api'       && <ApiCaller tokens={tokens} />}
        {tab === 'endpoints' && <EndpointExplorer />}
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-gray-100 pt-4 flex gap-6">
        <a href="/.well-known/openid-configuration" target="_blank"
           className="text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase">
          discovery doc ↗
        </a>
        <a href="/.well-known/openid-configuration/jwks" target="_blank"
           className="text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase">
          jwks ↗
        </a>
        <a href="/login"
           className="text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase">
          login →
        </a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);