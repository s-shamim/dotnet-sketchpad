function AesTool() {
  const [password,  setPassword]  = React.useState('');
  const [showPw,    setShowPw]    = React.useState(false);
  const [input,     setInput]     = React.useState('');
  const [output,    setOutput]    = React.useState('');
  const [error,     setError]     = React.useState('');

  async function run(mode) {
    setError(''); setOutput('');
    try {
      const url  = mode === 'encrypt' ? '/api/crypto/aes-encrypt' : '/api/crypto/aes-decrypt';
      const data = await api(url, { text: input, password });
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="aes-256-cbc · pbkdf2-sha256 · 100k iterations">aes</PageTitle>

      <p className="text-xs text-gray-400 mb-6">
        ⚠️ this tool runs on the server — do not encrypt truly sensitive data.
      </p>

      {/* Password */}
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
