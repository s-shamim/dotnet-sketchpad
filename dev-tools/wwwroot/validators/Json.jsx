function JsonValidatorTool() {
  const [input,  setInput]  = React.useState('');
  const [result, setResult] = React.useState(null);

  async function run() {
    setResult(null);
    try {
      const data = await api('/api/validators/json', { text: input });
      setResult(data);
    } catch { setResult({ valid: false, error: 'Connection failed.' }); }
  }

  return (
    <div>
      <PageTitle>json validator</PageTitle>

      <div className="mb-5">
        <ColLabel>input</ColLabel>
        <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="paste json here..." rows={10} />
      </div>

      <Btn onClick={run}>validate</Btn>

      {result && (
        <div className={`mt-4 text-sm font-mono ${result.valid ? 'text-gray-500' : 'text-red-400'}`}>
          {result.valid ? '✓ valid json' : `✗ ${result.error}`}
        </div>
      )}
    </div>
  );
}
