function AesTool() {
  const [keyMode,   setKeyMode]   = React.useState('password'); // 'password' | 'key-iv'
  const [password,  setPassword]  = React.useState('');
  const [showPw,    setShowPw]    = React.useState(false);
  const [key,       setKey]       = React.useState('');
  const [iv,        setIv]        = React.useState('');
  const [input,     setInput]     = React.useState('');
  const [output,    setOutput]    = React.useState('');
  const [error,     setError]     = React.useState('');

  const validKeySizes = [16, 24, 32];
  const keyOk = validKeySizes.includes(key.length);
  const ivOk  = iv.length === 16;

  async function run(mode) {
    setError(''); setOutput('');
    try {
      const url  = mode === 'encrypt' ? '/api/crypto/aes-encrypt' : '/api/crypto/aes-decrypt';
      const body = keyMode === 'key-iv'
        ? { text: input, key, iv }
        : { text: input, password };
      const data = await api(url, body);
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="aes-256-cbc · password (pbkdf2) or raw key / iv">aes</PageTitle>

      <p className="text-xs text-gray-400 mb-6">
        ⚠️ this tool runs on the server — do not encrypt truly sensitive data.
      </p>

      {/* Mode toggle */}
      <div className="flex gap-4 mb-6">
        {['password', 'key-iv'].map(m => (
          <button
            key={m}
            onClick={() => setKeyMode(m)}
            className={`text-xs lowercase transition-colors ${keyMode === m ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {m === 'password' ? 'password (pbkdf2)' : 'key / iv (raw)'}
          </button>
        ))}
      </div>

      {keyMode === 'password' ? (
        /* Password mode */
        <div className="mb-8">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-3">password</h2>
          <div className="flex items-center gap-3">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="enter encryption password..."
              className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
            />
            <button
              onClick={() => setShowPw(v => !v)}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase w-8"
            >
              {showPw ? 'hide' : 'show'}
            </button>
          </div>
        </div>
      ) : (
        /* Key / IV mode */
        <div className="mb-8 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xs tracking-widest text-gray-400 uppercase">key</h2>
              <div className="flex items-center gap-3">
                <span className={`text-xs tabular-nums ${keyOk ? 'text-gray-400' : 'text-gray-300'}`}>
                  {key.length} / 16 · 24 · 32
                </span>
                <button
                  onClick={() => setKey(randomStr(16))}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase"
                >generate</button>
              </div>
            </div>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="16, 24 or 32 characters..."
              className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xs tracking-widest text-gray-400 uppercase">iv</h2>
              <div className="flex items-center gap-3">
                <span className={`text-xs tabular-nums ${ivOk ? 'text-gray-400' : 'text-gray-300'}`}>
                  {iv.length} / 16
                </span>
                <button
                  onClick={() => setIv(randomStr(16))}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase"
                >generate</button>
              </div>
            </div>
            <input
              type="text"
              value={iv}
              onChange={e => setIv(e.target.value)}
              placeholder="exactly 16 characters..."
              className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
            />
          </div>
        </div>
      )}

      <TwoCol
        left={
          <div>
            <ColLabel action={input && <ClearBtn onClear={() => setInput('')} />}>input</ColLabel>
            <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="plaintext or base64 ciphertext..." />
          </div>
        }
        right={
          <div>
            <ColLabel action={output && <CopyBtn text={output} />}>output</ColLabel>
            <TArea value={output} readOnly placeholder="result will appear here..." />
          </div>
        }
      />

      <div className="flex gap-3">
        <Btn onClick={() => run('encrypt')}>encrypt</Btn>
        <Btn onClick={() => run('decrypt')}>decrypt</Btn>
      </div>
      <ErrMsg error={error} />
    </div>
  );
}
