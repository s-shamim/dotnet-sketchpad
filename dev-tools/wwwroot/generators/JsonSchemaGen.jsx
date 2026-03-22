function JsonSchemaGenTool() {
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error,  setError]  = React.useState('');

  async function run() {
    setError(''); setOutput('');
    try {
      const data = await api('/api/generators/json-schema', { text: input });
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="infer schema from a json example">json schema generator</PageTitle>

      <TwoCol
        left={
          <div>
            <ColLabel action={input && <ClearBtn onClear={() => setInput('')} />}>json example</ColLabel>
            <TArea value={input} onChange={e => setInput(e.target.value)} placeholder={'{\n  "id": 1,\n  "name": "Alice",\n  "active": true\n}'} />
          </div>
        }
        right={
          <div>
            <ColLabel action={output && <CopyBtn text={output} />}>generated schema</ColLabel>
            <TArea value={output} readOnly placeholder="schema will appear here..." />
          </div>
        }
      />

      <Btn onClick={run}>generate schema</Btn>
      <ErrMsg error={error} />
    </div>
  );
}
