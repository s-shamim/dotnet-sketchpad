function StringEscapeTool() {
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error,  setError]  = React.useState('');

  function run(op) {
    setError(''); setOutput('');
    try {
      let result = '';
      switch (op) {
        case 'js-escape':
          result = input
            .replace(/\\/g,  '\\\\')
            .replace(/'/g,   "\\'")
            .replace(/"/g,   '\\"')
            .replace(/\n/g,  '\\n')
            .replace(/\r/g,  '\\r')
            .replace(/\t/g,  '\\t');
          break;
        case 'js-unescape':
          result = input
            .replace(/\\n/g,  '\n')
            .replace(/\\r/g,  '\r')
            .replace(/\\t/g,  '\t')
            .replace(/\\"/g,  '"')
            .replace(/\\'/g,  "'")
            .replace(/\\\\/g, '\\');
          break;
        case 'json-escape':
          // JSON.stringify wraps in quotes — strip the outer quotes
          result = JSON.stringify(input).slice(1, -1);
          break;
        case 'json-unescape':
          result = JSON.parse('"' + input.replace(/(?<!\\)"/g, '\\"') + '"');
          break;
        case 'sql-escape':
          result = input.replace(/'/g, "''");
          break;
        case 'sql-unescape':
          result = input.replace(/''/g, "'");
          break;
        default:
          result = input;
      }
      setOutput(result);
    } catch (e) {
      setError(e.message);
    }
  }

  const ops = [
    { id: 'js-escape',    label: 'js escape'     },
    { id: 'js-unescape',  label: 'js unescape'   },
    { id: 'json-escape',  label: 'json escape'   },
    { id: 'json-unescape',label: 'json unescape' },
    { id: 'sql-escape',   label: 'sql escape'    },
    { id: 'sql-unescape', label: 'sql unescape'  },
  ];

  return (
    <div>
      <PageTitle sub="js · json · sql">string escape</PageTitle>

      <TwoCol
        left={
          <div>
            <ColLabel action={input && <ClearBtn onClear={() => setInput('')} />}>input</ColLabel>
            <TArea value={input} onChange={e => setInput(e.target.value)} placeholder="paste string here..." />
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

      <ErrMsg error={error} />
    </div>
  );
}
