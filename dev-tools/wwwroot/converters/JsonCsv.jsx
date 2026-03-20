function JsonCsvTool() {
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error,  setError]  = React.useState('');

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
      <PageTitle>json  csv</PageTitle>

      <TwoCol
        left={
          <div>
            <ColLabel>input</ColLabel>
            <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="paste json array or csv here..." />
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
        <Btn onClick={() => run('json-to-csv')}>json → csv</Btn>
        <Btn onClick={() => run('csv-to-json')}>csv → json</Btn>
      </div>
      <ErrMsg error={error} />
    </div>
  );
}
