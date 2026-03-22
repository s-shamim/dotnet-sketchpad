function JsonStringifyTool() {
  const [mode,   setMode]   = React.useState('stringify');
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error,  setError]  = React.useState('');

  async function run() {
    setError(''); setOutput('');
    const endpoint = mode === 'stringify' ? 'json-stringify' : 'json-parse';
    try {
      const data = await api('/api/formatters/' + endpoint, { text: input });
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="escape ↔ unescape json string literals">json stringify / parse</PageTitle>

      <div className="flex gap-4 mb-8">
        {['stringify', 'parse'].map(m => (
          <button key={m}
            onClick={() => { setMode(m); setInput(''); setOutput(''); setError(''); }}
            className={`text-sm lowercase transition-colors ${mode === m ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <TwoCol
        left={
          <div>
            <ColLabel action={input && <ClearBtn onClear={() => setInput('')} />}>{mode === 'stringify' ? 'json object' : 'string literal'}</ColLabel>
            <TArea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={mode === 'stringify' ? '{"name":"Alice","age":30}' : '"{\\\"name\\\":\\\"Alice\\\",\\\"age\\\":30}"'}
            />
          </div>
        }
        right={
          <div>
            <ColLabel action={output && <CopyBtn text={output} />}>
              {mode === 'stringify' ? 'string literal' : 'json object'}
            </ColLabel>
            <TArea value={output} readOnly placeholder="result will appear here..." />
          </div>
        }
      />

      <Btn onClick={run}>{mode}</Btn>
      <ErrMsg error={error} />
    </div>
  );
}
