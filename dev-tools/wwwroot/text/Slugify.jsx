function SlugifyTool() {
  const [input,  setInput]  = React.useState('');
  const [output, setOutput] = React.useState('');

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // strip diacritics
      .replace(/[^a-z0-9\s\-]/g,  '')  // strip non-alphanumeric
      .trim()
      .replace(/[\s\-]+/g, '-');        // spaces/hyphens → single hyphen
  }

  function run() {
    setOutput(slugify(input));
  }

  return (
    <div>
      <PageTitle sub="convert titles to url-friendly slugs">slugify</PageTitle>

      <div className="mb-6">
        <ColLabel>input</ColLabel>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="My Article Title — 2024!"
          className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
        />
      </div>

      <Btn onClick={run}>slugify</Btn>

      {output && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs tracking-widest text-gray-400 uppercase">slug</h2>
            <CopyBtn text={output} />
          </div>
          <p className="font-mono text-gray-700 text-sm border-b border-gray-100 pb-3">{output}</p>
        </div>
      )}
    </div>
  );
}
