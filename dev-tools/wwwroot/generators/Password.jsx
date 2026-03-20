function PasswordTool() {
  const [length,  setLength]  = React.useState(16);
  const [upper,   setUpper]   = React.useState(true);
  const [lower,   setLower]   = React.useState(true);
  const [digits,  setDigits]  = React.useState(true);
  const [symbols, setSymbols] = React.useState(false);
  const [output,  setOutput]  = React.useState('');
  const [error,   setError]   = React.useState('');

  async function run() {
    setError(''); setOutput('');
    try {
      const data = await api('/api/generators/password', { length, upper, lower, digits, symbols });
      if (data.error) setError(data.error);
      else setOutput(data.result);
    } catch { setError('Connection failed.'); }
  }

  function CheckRow({ label, checked, onChange }) {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
          className="accent-gray-400 w-4 h-4 cursor-pointer" />
        <span className="text-sm text-gray-600 lowercase">{label}</span>
      </label>
    );
  }

  return (
    <div>
      <PageTitle sub="cryptographically random">password generator</PageTitle>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 w-14">length</span>
          <input
            type="number" value={length} min={4} max={128}
            onChange={e => setLength(Number(e.target.value))}
            className="w-16 border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-gray-500 text-sm text-center"
          />
        </div>
        <div className="space-y-2 ml-0">
          <CheckRow label="uppercase (A–Z)"  checked={upper}   onChange={setUpper} />
          <CheckRow label="lowercase (a–z)"  checked={lower}   onChange={setLower} />
          <CheckRow label="digits (0–9)"     checked={digits}  onChange={setDigits} />
          <CheckRow label="symbols (!@#…)"   checked={symbols} onChange={setSymbols} />
        </div>
      </div>

      <Btn onClick={run}>generate</Btn>

      {output && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs tracking-widest text-gray-400 uppercase">result</h2>
            <CopyBtn text={output} />
          </div>
          <p className="font-mono text-gray-700 text-base border-b border-gray-100 pb-3 break-all">{output}</p>
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
