const { useState, useMemo } = React;

function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }

function modInverse(e, phi) {
  let [or, r] = [e, phi], [os, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(or / r);
    [or, r] = [r, or - q * r];
    [os, s] = [s, os - q * s];
  }
  return ((os % phi) + phi) % phi;
}

function modPow(base, exp, mod) {
  let res = 1n, b = BigInt(base) % BigInt(mod), e = BigInt(exp), m = BigInt(mod);
  while (e > 0n) {
    if (e % 2n === 1n) res = res * b % m;
    e = e / 2n; b = b * b % m;
  }
  return Number(res);
}

function buildKeys(p, q) {
  const n = p * q, phi = (p - 1) * (q - 1);
  let e = 2; while (e < phi && gcd(e, phi) !== 1) e++;
  const d = modInverse(e, phi);
  return { p, q, n, phi, e, d };
}

const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41];

function StepHeader({ n, label, sub, disabled }) {
  return (
    <div className={`flex items-start gap-3 mb-5 ${disabled ? 'opacity-40' : ''}`}>
      <span className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400 flex-shrink-0 mt-0.5">{n}</span>
      <div>
        <div className="text-sm text-gray-700 lowercase">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5 font-mono">{sub}</div>}
      </div>
    </div>
  );
}

function KeyGenPanel({ keys, setKeys, needsN }) {
  const [p, setP] = useState(13);
  const [q, setQ] = useState(17);
  const [err, setErr] = useState('');

  const generate = () => {
    setErr('');
    if (p === q) { setErr('p and q must be different primes.'); return; }
    const k = buildKeys(p, q);
    if (needsN && k.n <= 126) { setErr(`n = ${k.n} is too small — need n > 126 for ascii. pick larger primes.`); return; }
    setKeys(k);
  };

  return (
    <div className="border-b border-gray-100 pb-6 mb-6">
      <StepHeader n="1" label="bob generates his key pair" sub={needsN ? 'need n > 126 for ascii' : 'choose two small primes'} />
      <div className="ml-8 flex flex-wrap gap-6 mb-4">
        {[['p', p, setP], ['q', q, setQ]].map(([label, val, setter]) => (
          <div key={label}>
            <div className="text-xs text-gray-400 mb-1">prime {label}</div>
            <select
              value={val}
              onChange={e => setter(Number(e.target.value))}
              className="border-b border-gray-300 text-gray-700 text-sm py-1 bg-transparent focus:outline-none focus:border-gray-500"
            >
              {PRIMES.map(pr => <option key={pr} value={pr}>{pr}</option>)}
            </select>
          </div>
        ))}
        <div className="flex items-end">
          <button onClick={generate} className="text-gray-400 hover:text-gray-700 text-sm transition-colors">
            generate →
          </button>
        </div>
      </div>
      {err && <p className="ml-8 text-xs text-gray-400 mb-3">{err}</p>}
      {keys && (
        <div className="ml-8">
          <div className="grid grid-cols-4 gap-4 mb-3">
            {[['n = p×q', keys.n], ['φ(n)', keys.phi], ['e (public)', keys.e], ['d (private)', keys.d]].map(([label, val]) => (
              <div key={label} className="border-b border-gray-100 pb-2">
                <div className="text-xs text-gray-400 mb-1">{label}</div>
                <div className="text-xl font-light text-gray-700">{val}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-6 text-xs text-gray-400 font-mono">
            <span>public: (e={keys.e}, n={keys.n})</span>
            <span>private: (d={keys.d}, n={keys.n})</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SingleNumberDemo() {
  const [keys, setKeys] = useState(null);
  const [msg, setMsg] = useState('');
  const [cipher, setCipher] = useState(null);
  const [decrypted, setDecrypted] = useState(null);
  const [err, setErr] = useState('');

  const encrypt = () => {
    setErr(''); setDecrypted(null);
    const m = parseInt(msg);
    if (isNaN(m) || m < 1 || m >= keys.n) { setErr(`enter a whole number between 1 and ${keys.n - 1}.`); return; }
    setCipher({ m, c: modPow(m, keys.e, keys.n) });
  };

  const decrypt = () => {
    if (!cipher) return;
    setDecrypted(modPow(cipher.c, keys.d, keys.n));
  };

  return (
    <div>
      <KeyGenPanel keys={keys} setKeys={k => { setKeys(k); setCipher(null); setDecrypted(null); setMsg(''); }} needsN={false} />

      <div className={`border-b border-gray-100 pb-6 mb-6 ${!keys ? 'opacity-40 pointer-events-none' : ''}`}>
        <StepHeader n="2" label="alice encrypts a number" sub={keys ? `using bob's public key (e=${keys.e}, n=${keys.n})` : ''} />
        <div className="ml-8 flex items-center gap-3 mb-3">
          <input
            type="text" value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && encrypt()}
            placeholder={keys ? `1 – ${keys.n - 1}` : ''}
            className="border-b border-gray-300 py-1 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm w-28"
          />
          <button onClick={encrypt} className="text-gray-400 hover:text-gray-700 text-sm transition-colors">encrypt →</button>
        </div>
        {err && <p className="ml-8 text-xs text-gray-400 mb-2">{err}</p>}
        {cipher && (
          <div className="ml-8 text-xs text-gray-400 font-mono">
            c = {cipher.m}<sup>{keys.e}</sup> mod {keys.n} = <span className="text-gray-700">{cipher.c}</span>
          </div>
        )}
      </div>

      <div className={`border-b border-gray-100 pb-6 mb-6 ${!cipher ? 'opacity-40 pointer-events-none' : ''}`}>
        <StepHeader n="3" label="bob decrypts with his private key" sub={keys ? `using (d=${keys.d}, n=${keys.n})` : ''} />
        <div className="ml-8">
          {cipher && <div className="text-xs text-gray-400 font-mono mb-3">ciphertext: <span className="text-gray-700">{cipher.c}</span></div>}
          <button onClick={decrypt} className="text-gray-400 hover:text-gray-700 text-sm transition-colors mb-3">decrypt →</button>
          {decrypted !== null && (
            <div className="text-xs text-gray-400 font-mono">
              m = {cipher.c}<sup>{keys.d}</sup> mod {keys.n} = <span className="text-gray-700">{decrypted}</span>
              {decrypted === cipher.m
                ? <span className="ml-2 text-gray-500">✓ matches original</span>
                : <span className="ml-2 text-gray-400">✗ mismatch</span>}
            </div>
          )}
        </div>
      </div>

      {keys && (
        <div>
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-3">key math</h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-gray-400 font-normal">step</th>
                <th className="text-left py-2 pr-4 text-gray-400 font-normal">formula</th>
                <th className="text-left py-2 text-gray-400 font-normal">value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ['n = p × q', `${keys.p} × ${keys.q}`, keys.n],
                ['φ(n) = (p−1)(q−1)', `(${keys.p - 1}) × (${keys.q - 1})`, keys.phi],
                ['e coprime to φ(n)', `gcd(${keys.e}, ${keys.phi}) = 1`, keys.e],
                ['d = e⁻¹ mod φ', `${keys.e} × ${keys.d} mod ${keys.phi} = 1`, keys.d],
              ].map(([step, formula, val]) => (
                <tr key={step}>
                  <td className="py-2 pr-4 text-gray-400">{step}</td>
                  <td className="py-2 pr-4 text-gray-500 font-mono">{formula}</td>
                  <td className="py-2 text-gray-700">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StringDemo() {
  const [keys, setKeys] = useState(null);
  const [text, setText] = useState('');
  const [cipherArr, setCipherArr] = useState(null);
  const [decryptedArr, setDecryptedArr] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [err, setErr] = useState('');

  const encryptStr = () => {
    setErr(''); setDecryptedArr(null);
    const t = text || 'Hello Bob!';
    const bad = [...t].filter(ch => ch.charCodeAt(0) >= keys.n);
    if (bad.length) {
      setErr(`character(s) ${[...new Set(bad)].map(c => `'${c}'`).join(', ')} have ascii ≥ n=${keys.n}. pick larger primes.`);
      return;
    }
    setCipherArr([...t].map(ch => ({ ch, m: ch.charCodeAt(0), c: modPow(ch.charCodeAt(0), keys.e, keys.n) })));
  };

  const decryptStr = () => {
    if (!cipherArr) return;
    setDecryptedArr(cipherArr.map(({ c }) => {
      const m2 = modPow(c, keys.d, keys.n);
      return { c, m: m2, ch: String.fromCharCode(m2) };
    }));
  };

  return (
    <div>
      <p className="text-xs text-gray-400 mb-6 pb-4 border-b border-gray-100">
        real-world rsa encrypts a symmetric key, not individual characters. this demo is for learning only.
      </p>

      <KeyGenPanel keys={keys} setKeys={k => { setKeys(k); setCipherArr(null); setDecryptedArr(null); }} needsN={true} />

      <div className={`border-b border-gray-100 pb-6 mb-6 ${!keys ? 'opacity-40 pointer-events-none' : ''}`}>
        <StepHeader n="2" label="alice writes a message" sub="each character → ascii code → encrypted individually" />
        <div className="ml-8">
          <input
            type="text" value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Hello Bob!"
            className="border-b border-gray-300 py-1 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm w-full mb-3"
          />
          {text && (
            <div className="flex flex-wrap gap-1 mb-3">
              {[...text].map((ch, i) => (
                <span key={i} className="flex flex-col items-center border border-gray-100 px-1 py-0.5">
                  <span className="text-xs text-gray-600 font-mono">{ch === ' ' ? '␣' : ch}</span>
                  <span className="text-xs text-gray-300 font-mono">{ch.charCodeAt(0)}</span>
                </span>
              ))}
            </div>
          )}
          {err && <p className="text-xs text-gray-400 mb-2">{err}</p>}
          <button onClick={encryptStr} className="text-gray-400 hover:text-gray-700 text-sm transition-colors">
            encrypt with bob's public key →
          </button>
        </div>
      </div>

      <div className={`border-b border-gray-100 pb-6 mb-6 ${!cipherArr ? 'opacity-40 pointer-events-none' : ''}`}>
        <StepHeader n="3" label="ciphertext transmitted" sub="an eavesdropper sees only these numbers" />
        {cipherArr && (
          <div className="ml-8">
            <div className="flex flex-wrap gap-1 mb-3">
              {cipherArr.map((x, i) => (
                <span key={i} className="text-xs text-gray-400 font-mono border border-gray-100 px-1 py-0.5">{x.c}</span>
              ))}
            </div>
            <div className="text-xs text-gray-300 font-mono break-all">[{cipherArr.map(x => x.c).join(', ')}]</div>
          </div>
        )}
      </div>

      <div className={`border-b border-gray-100 pb-6 mb-6 ${!cipherArr ? 'opacity-40 pointer-events-none' : ''}`}>
        <StepHeader n="4" label="bob decrypts with his private key" />
        <div className="ml-8">
          <button onClick={decryptStr} className="text-gray-400 hover:text-gray-700 text-sm transition-colors mb-3">
            decrypt all characters →
          </button>
          {decryptedArr && (
            <div>
              <div className="flex flex-wrap gap-1 mb-3">
                {decryptedArr.map((x, i) => (
                  <span key={i} className="flex flex-col items-center border border-gray-100 px-1 py-0.5">
                    <span className="text-xs text-gray-600 font-mono">{x.ch === ' ' ? '␣' : x.ch}</span>
                    <span className="text-xs text-gray-300 font-mono">{x.m}</span>
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-700">{decryptedArr.map(x => x.ch).join('')}</div>
            </div>
          )}
        </div>
      </div>

      {cipherArr && (
        <div>
          <button
            onClick={() => setShowTable(v => !v)}
            className="text-xs tracking-widest text-gray-400 uppercase hover:text-gray-700 transition-colors mb-4"
          >
            per-character math {showTable ? '▼' : '▶'}
          </button>
          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['char', 'ascii', 'cipher', 'decrypted', 'recovered'].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-gray-400 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cipherArr.map((x, i) => {
                    const m2 = decryptedArr ? decryptedArr[i].m : modPow(x.c, keys.d, keys.n);
                    return (
                      <tr key={i}>
                        <td className="py-2 pr-4 text-gray-700 font-mono">{x.ch === ' ' ? '␣' : x.ch}</td>
                        <td className="py-2 pr-4 text-gray-500 font-mono">{x.m}</td>
                        <td className="py-2 pr-4 text-gray-700 font-mono">{x.c}</td>
                        <td className="py-2 pr-4 text-gray-500 font-mono">{m2}</td>
                        <td className="py-2 pr-4 text-gray-700 font-mono">{x.ch === ' ' ? '␣' : x.ch}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const [tab, setTab] = useState('number');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto pt-20 px-4 pb-16">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-2 lowercase">rsa encryption</h1>
        <p className="text-xs text-gray-400 mb-8">alice sends a secret to bob — built on modular arithmetic & prime numbers</p>

        <div className="border-b border-gray-100 pb-5 mb-8">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-3">how it works</h2>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
            {[
              ['key generation', 'pick primes p, q. compute n=p×q, φ(n). choose e, find d=e⁻¹ mod φ(n).'],
              ['encrypt', 'anyone with public key (e, n): c = mᵉ mod n'],
              ['decrypt', 'only private key (d, n): m = cᵈ mod n'],
            ].map(([title, body]) => (
              <div key={title}>
                <div className="text-gray-600 mb-1 lowercase">{title}</div>
                <div className="font-mono leading-relaxed">{body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-6 mb-8 border-b border-gray-100 pb-4">
          {[['number', 'single number'], ['string', 'full string']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-sm transition-colors lowercase ${tab === key ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'number' ? <SingleNumberDemo /> : <StringDemo />}

        <p className="text-xs text-gray-300 text-center mt-8">
          real rsa uses 2048–4096 bit keys. tiny primes are for learning only.
        </p>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
