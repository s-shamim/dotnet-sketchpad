function ColorCodeTool() {
  const [input,  setInput]  = React.useState('');
  const [format, setFormat] = React.useState('hex');
  const [result, setResult] = React.useState(null);
  const [error,  setError]  = React.useState('');

  const formats = ['hex', 'rgb', 'hsl', 'cmyk'];

  async function convert() {
    setError(''); setResult(null);
    try {
      const data = await api('/api/converters/color', { format, value: input });
      if (data.error) setError(data.error);
      else setResult(data);
    } catch { setError('Connection failed.'); }
  }

  const rows = result ? [
    { label: 'hex',  value: result.hex  },
    { label: 'rgb',  value: result.rgb  },
    { label: 'hsl',  value: result.hsl  },
    { label: 'cmyk', value: result.cmyk },
  ] : [];

  return (
    <div>
      <PageTitle sub="hex · rgb · hsl · cmyk">color code</PageTitle>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && convert()}
          placeholder="#ff5733  or  255, 87, 51  or  14, 100%, 60%..."
          className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-xs text-gray-400 tracking-widest">input format</span>
        <div className="flex gap-3">
          {formats.map(f => (
            <button key={f}
              onClick={() => setFormat(f)}
              className={`text-sm lowercase transition-colors ${format === f ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <Btn onClick={convert}>convert</Btn>
      </div>

      {rows.length > 0 && (
        <>
          <ul className="divide-y divide-gray-100 mt-4">
            {rows.map(({ label, value }) => (
              <li key={label} className="flex items-center gap-4 py-3">
                <span className="w-12 text-xs tracking-widest text-gray-400 uppercase">{label}</span>
                <span className="flex-1 font-mono text-sm text-gray-700">{value}</span>
                <CopyBtn text={value} />
              </li>
            ))}
          </ul>
          <div
            className="mt-6 w-16 h-16 border border-gray-100"
            style={{ backgroundColor: result.hex }}
            title={result.hex}
          />
        </>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
