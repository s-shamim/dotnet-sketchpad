function SqlFormatterTool() {
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error,  setError]  = React.useState('');

  async function run() {
    setError(''); setOutput('');
    try {
      const data = await api('/api/formatters/sql', { text: input });
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="uppercase keywords · newline per clause">sql formatter</PageTitle>

      <TwoCol
        left={
          <div>
            <ColLabel>input</ColLabel>
            <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="paste sql here..." />
          </div>
        }
        right={
          <div>
            <ColLabel action={output && <CopyBtn text={output} />}>output</ColLabel>
            <TArea value={output} readOnly placeholder="formatted sql will appear here..." />
          </div>
        }
      />

      <Btn onClick={run}>format</Btn>
      <ErrMsg error={error} />
    </div>
  );
}
