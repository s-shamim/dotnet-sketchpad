function JsonYamlTool() {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');

  async function run(endpoint) {
    setError(''); setOutput('');
    try {
      const data = await api('/api/converters/' + endpoint, { text: input });
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle>json ↔ yaml</PageTitle>

      <TwoCol
        left={
          <div>
            <ColLabel action={input && <ClearBtn onClear={() => setInput('')} />}>input</ColLabel>
            <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="paste json or yaml here..." />
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
        <Btn onClick={() => run('json-to-yaml')}>json → yaml</Btn>
        <Btn onClick={() => run('yaml-to-json')}>yaml → json</Btn>
      </div>
      <ErrMsg error={error} />
    </div>
  );
}
