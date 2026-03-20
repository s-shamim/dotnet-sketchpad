function XmlFormatterTool() {
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error,  setError]  = React.useState('');

  async function run() {
    setError(''); setOutput('');
    try {
      const data = await api('/api/formatters/xml', { text: input });
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle>xml formatter</PageTitle>

      <TwoCol
        left={
          <div>
            <ColLabel>input</ColLabel>
            <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="paste xml here..." />
          </div>
        }
        right={
          <div>
            <ColLabel action={output && <CopyBtn text={output} />}>output</ColLabel>
            <TArea value={output} readOnly placeholder="formatted xml will appear here..." />
          </div>
        }
      />

      <Btn onClick={run}>format</Btn>
      <ErrMsg error={error} />
    </div>
  );
}
