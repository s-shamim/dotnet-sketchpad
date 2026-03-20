function AesTool() {
  const [key,    setKey]    = React.useState('');
  const [iv,     setIv]     = React.useState('');
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error,  setError]  = React.useState('');

  async function run(mode) {
    setError(''); setOutput('');
    try {
      const url  = mode === 'encrypt' ? '/api/crypto/aes-encrypt' : '/api/crypto/aes-decrypt';
      const body = mode === 'encrypt'
        ? { text: input, key, iv }
        : { cipherText: input, key, iv };
      const data = await api(url, body);
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="aes-cbc · pkcs7 · utf-8">aes</PageTitle>

      {/* Key & IV */}
      <div className="mb-8 space-y-4">
        <h2 className="text-xs tracking-widest text-gray-400 uppercase">parameters</h2>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-5">key</span>
          <input
            type="text" value={key} onChange={e => setKey(e.target.value)}
            placeholder="16, 24 or 32 chars..."
            className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
          />
          <span className={`text-xs tabular-nums w-4 text-right ${[16,24,32].includes(key.length) ? 'text-gray-400' : 'text-gray-300'}`}>{key.length}</span>
          <Btn onClick={() => setKey(randomStr(16))}>generate</Btn>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-5">iv</span>
          <input
            type="text" value={iv} onChange={e => setIv(e.target.value)}
            placeholder="exactly 16 chars..."
            className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
          />
          <span className={`text-xs tabular-nums w-4 text-right ${iv.length === 16 ? 'text-gray-400' : 'text-gray-300'}`}>{iv.length}</span>
          <Btn onClick={() => setIv(randomStr(16))}>generate</Btn>
        </div>
      </div>

      <TwoCol
        left={
          <div>
            <ColLabel>input</ColLabel>
            <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="plaintext or base64..." />
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
