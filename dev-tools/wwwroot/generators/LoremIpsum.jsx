function LoremIpsumTool() {
  const [paragraphs, setParagraphs] = React.useState(3);
  const [output,     setOutput]     = React.useState('');
  const [error,      setError]      = React.useState('');

  async function run() {
    setError(''); setOutput('');
    try {
      const data = await api('/api/generators/lorem', { paragraphs });
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle>lorem ipsum</PageTitle>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-xs text-gray-400">paragraphs</span>
        <input
          type="number" value={paragraphs} min={1} max={20}
          onChange={e => setParagraphs(Number(e.target.value))}
          className="w-16 border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-gray-500 text-sm text-center"
        />
        <Btn onClick={run}>generate</Btn>
      </div>

      {output && (
        <div>
          <ColLabel action={<CopyBtn text={output} />}>output</ColLabel>
          <TArea value={output} readOnly rows={12} placeholder="" />
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
