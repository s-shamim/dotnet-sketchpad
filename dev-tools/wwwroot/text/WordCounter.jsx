function WordCounterTool() {
  const [text, setText] = React.useState('');

  const lines              = text === '' ? 0 : text.split('\n').length;
  const words              = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charsWithSpaces    = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;

  const stats = [
    { label: 'words',                    value: words              },
    { label: 'characters (with spaces)', value: charsWithSpaces    },
    { label: 'characters (no spaces)',   value: charsWithoutSpaces },
    { label: 'lines',                    value: lines              },
  ];

  return (
    <div>
      <PageTitle sub="live word · character · line counter">word counter</PageTitle>

      <div className="mb-6">
        <ColLabel>text</ColLabel>
        <TArea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="paste or type text here..."
          rows={12}
        />
      </div>

      <ul className="divide-y divide-gray-100">
        {stats.map(({ label, value }) => (
          <li key={label} className="flex items-center justify-between py-3">
            <span className="text-xs tracking-widest text-gray-400 uppercase">{label}</span>
            <span className="font-mono text-gray-700 text-sm">{value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
