function JwtGeneratorTool() {
  const [payload, setPayload] = React.useState('{\n  "sub": "1234567890",\n  "name": "Alice",\n  "iat": 1700000000\n}');
  const [secret,  setSecret]  = React.useState('');
  const [token,   setToken]   = React.useState('');
  const [error,   setError]   = React.useState('');

  async function generate() {
    setError(''); setToken('');
    try {
      const data = await api('/api/encoders/jwt-encode', { payload, secret });
      if (data.error) setError(data.error);
      else setToken(data.token);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="hs256 signed jwt">jwt generator</PageTitle>

      <div className="mb-5">
        <ColLabel action={payload && <ClearBtn onClear={() => setPayload('')} />}>payload (json)</ColLabel>
        <TArea value={payload} onChange={e => setPayload(e.target.value)} rows={6} />
      </div>

      <div className="mb-6">
        <ColLabel>secret</ColLabel>
        <input
          type="text"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          placeholder="signing secret..."
          className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
        />
      </div>

      <Btn onClick={generate}>generate</Btn>

      {token && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs tracking-widest text-gray-400 uppercase">token</h2>
            <CopyBtn text={token} />
          </div>
          <p className="font-mono text-gray-700 text-sm border-b border-gray-100 pb-3 break-all">{token}</p>
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
