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
        <ColLabel action={text && <ClearBtn onClear={() => setText('')} />}>input</ColLabel>
        <TArea value={text} onChange={e => setText(e.target.value)} placeholder="url, text, or any string..." rows={3} />
      </div>

      <Btn onClick={run}>generate</Btn>

      {png && (
        <div className="mt-8">
          <ColLabel action={<a href={png} download="qrcode.png" className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase">download</a>}>qr code</ColLabel>
          <img src={png} alt="qr code" className="w-48 h-48 border border-gray-100" />
        </div>
      )}

      <ErrMsg error={error} />
    </div>
  );
}
