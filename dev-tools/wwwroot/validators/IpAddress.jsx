function IpValidatorTool() {
  const [input,  setInput]  = React.useState('');
  const [result, setResult] = React.useState(null);

  async function run() {
    setResult(null);
    try {
      const data = await api('/api/validators/ip', { text: input });
      setResult(data);
    } catch { setResult({ valid: false, error: 'Connection failed.' }); }
  }

  return (
    <div>
      <PageTitle sub="ipv4 · ipv6">ip address validator</PageTitle>

      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="192.168.1.1  or  2001:db8::1..."
          className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm font-mono"
        />
        <Btn onClick={run}>validate</Btn>
      </div>

      {result && (
        <div className={`text-sm font-mono ${result.valid ? 'text-gray-500' : 'text-red-400'}`}>
          {result.valid
            ? `✓ valid ${result.version}`
            : `✗ ${result.error}`
          }
        </div>
      )}
    </div>
  );
}
