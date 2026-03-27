function JwtCodecTool() {
  const [mode,      setMode]      = React.useState('decode');
  const [token,     setToken]     = React.useState('');
  const [payload,   setPayload]   = React.useState('');
  const [secret,    setSecret]    = React.useState('');
  const [header,    setHeader]    = React.useState('');
  const [decoded,   setDecoded]   = React.useState('');
  const [signature, setSignature] = React.useState('');
  const [encoded,   setEncoded]   = React.useState('');
  const [error,     setError]     = React.useState('');

  async function decode() {
    setError(''); setHeader(''); setDecoded(''); setSignature('');
    try {
      const data = await api('/api/encoders/jwt-decode', { text: token });
      if (data.error) { setError(data.error); return; }
      setHeader(JSON.stringify(JSON.parse(data.header), null, 2));
      setDecoded(JSON.stringify(JSON.parse(data.payload), null, 2));
      setSignature(data.signature);
    } catch { setError('Connection failed.'); }
  }

  async function encode() {
    setError(''); setEncoded('');
    try {
      const data = await api('/api/encoders/jwt-encode', { payload, secret });
      if (data.error) setError(data.error);
      else setEncoded(data.token);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="hs256 · no signature verification on decode">jwt</PageTitle>

      {/* Mode toggle */}
      <div className="flex gap-4 mb-8">
        {['decode', 'encode'].map(m => (
          <button key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={`text-sm lowercase transition-colors ${mode === m ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'decode' && (
        <div>
          <div className="mb-4">
            <ColLabel action={token && <ClearBtn onClear={() => setToken('')} />}>token</ColLabel>
            <TArea value={token} onChange={e => setToken(e.target.value)} placeholder="paste jwt here..." rows={3} />
          </div>
          <Btn onClick={decode}>decode</Btn>

          {header && (
            <div className="mt-6 space-y-5">
              {[
                { label: 'header',    val: header },
                { label: 'payload',   val: decoded },
                { label: 'signature', val: signature },
              ].map(({ label, val }) => (
                <div key={label}>
                  <ColLabel action={<CopyBtn text={val} />}>{label}</ColLabel>
                  <pre className="text-sm font-mono text-gray-700 border-b border-gray-100 pb-3 whitespace-pre-wrap break-all">{val}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === 'encode' && (
        <div>
          <div className="mb-5">
            <ColLabel action={payload && <ClearBtn onClear={() => setPayload('')} />}>payload (json)</ColLabel>
            <TArea value={payload} onChange={e => setPayload(e.target.value)} placeholder='{"sub":"1234","name":"Alice","iat":1700000000}' rows={5} />
          </div>
          <div className="mb-5">
            <ColLabel>secret</ColLabel>
            <input
              type="text" value={secret} onChange={e => setSecret(e.target.value)}
              placeholder="signing secret..."
              className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
            />
          </div>
          <Btn onClick={encode}>encode</Btn>

          {encoded && (
            <div className="mt-6">
              <ColLabel action={<CopyBtn text={encoded} />}>token</ColLabel>
              <p className="text-sm font-mono text-gray-700 break-all border-b border-gray-100 pb-3">{encoded}</p>
            </div>
          )}
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
