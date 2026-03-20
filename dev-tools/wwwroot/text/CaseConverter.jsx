function CaseConverterTool() {
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');
  const [active, setActive] = React.useState('');

  function applyCase(type) {
    setActive(type);
    const words = input.trim().split(/[\s\-_]+/).filter(Boolean);
    let result = '';
    switch (type) {
      case 'camel':
        result = words.map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
        break;
      case 'pascal':
        result = words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
        break;
      case 'snake':
        result = words.map(w => w.toLowerCase()).join('_');
        break;
      case 'kebab':
        result = words.map(w => w.toLowerCase()).join('-');
        break;
      case 'upper':
        result = input.toUpperCase();
        break;
      case 'lower':
        result = input.toLowerCase();
        break;
      case 'title':
        result = input.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
        break;
      default:
        result = input;
    }
    setOutput(result);
  }

  const cases = [
    { id: 'camel',  label: 'camelCase'  },
    { id: 'pascal', label: 'PascalCase' },
    { id: 'snake',  label: 'snake_case' },
    { id: 'kebab',  label: 'kebab-case' },
    { id: 'upper',  label: 'UPPERCASE'  },
    { id: 'lower',  label: 'lowercase'  },
    { id: 'title',  label: 'Title Case' },
  ];

  return (
    <div>
      <PageTitle>case converter</PageTitle>

      <div className="mb-5">
        <ColLabel>input</ColLabel>
        <TArea
          value={input}
          onChange={e => { setInput(e.target.value); setOutput(''); setActive(''); }}
          placeholder="paste text or identifier here..."
          rows={5}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {cases.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => applyCase(id)}
            className={`text-sm py-0.5 px-2 transition-colors border-b ${active === id ? 'text-gray-700 border-gray-400' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {output && (
        <div>
          <ColLabel action={<CopyBtn text={output} />}>output</ColLabel>
          <TArea value={output} readOnly rows={5} />
        </div>
      )}
    </div>
  );
}
