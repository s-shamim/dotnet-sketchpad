function QrCodeTool() {
  const [text,  setText]  = React.useState('');
  const [png,   setPng]   = React.useState('');
  const [error, setError] = React.useState('');

  async function run() {
    setError(''); setPng('');
    try {
      const data = await api('/api/generators/qrcode', { text });
      if (data.error) setError(data.error);
      else setPng(data.png);
    } catch { setError('Connection failed.'); }
  }

  return (
    <div>
      <PageTitle sub="ecc level q · 10 px/module">qr code generator</PageTitle>

      <div className="mb-6">
        <ColLabel>input</ColLabel>
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="url, text, or any string..."
          rows={3}
          className="w-full border-b border-gray-200 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 text-sm font-mono resize-none leading-relaxed"
        />
      </div>

      <Btn onClick={run}>generate</Btn>

      {png && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-widest text-gray-400 uppercase">qr code</h2>
            <a
              href={png} download="qrcode.png"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase"
            >
              download
            </a>
          </div>
          <img src={png} alt="qr code" className="w-48 h-48 border border-gray-100" />
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
