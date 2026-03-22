function WhitespaceRemoverTool() {
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');

  function run(op) {
    let lines = input.split('\n');
    switch (op) {
      case 'trim':
        lines = lines.map(l => l.trim());
        break;
      case 'blank':
        lines = lines.filter(l => l.trim() !== '');
        break;
      case 'dupes':
        lines = [...new Set(lines)];
        break;
      case 'all':
        lines = [...new Set(lines.map(l => l.trim()).filter(l => l !== ''))];
        break;
    }
    setOutput(lines.join('\n'));
  }

  const ops = [
    { id: 'trim',  label: 'trim lines'            },
    { id: 'blank', label: 'remove blank lines'    },
    { id: 'dupes', label: 'remove duplicate lines'},
    { id: 'all',   label: 'all of the above'      },
  ];

  return (
    <div>
      <PageTitle sub="trim · deduplicate · clean">whitespace remover</PageTitle>

      <TwoCol
        left={
          <div>
            <ColLabel action={input && <ClearBtn onClear={() => setInput('')} />}>input</ColLabel>
            <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="paste text here..." />
          </div>
        }
        right={
          <div>
            <ColLabel action={output && <CopyBtn text={output} />}>output</ColLabel>
            <TArea value={output} readOnly placeholder="result will appear here..." />
          </div>
        }
      />

      <div className="flex flex-wrap gap-3 mt-2">
        {ops.map(({ id, label }) => (
          <Btn key={id} onClick={() => run(id)}>{label}</Btn>
        ))}
      </div>
    </div>
  );
}
