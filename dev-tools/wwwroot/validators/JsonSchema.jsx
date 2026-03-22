function JsonSchemaValidatorTool() {
  const [schema, setSchema] = React.useState('');
  const [json,   setJson]   = React.useState('');
  const [result, setResult] = React.useState(null);

  async function run() {
    setResult(null);
    try {
      const data = await api('/api/validators/json-schema', { schema, json });
      setResult(data);
    } catch { setResult({ valid: false, errors: ['Connection failed.'] }); }
  }

  return (
    <div>
      <PageTitle sub="validate a json document against a json schema">json schema validator</PageTitle>

      <TwoCol
        left={
          <div>
            <ColLabel action={schema && <ClearBtn onClear={() => setSchema('')} />}>json schema</ColLabel>
            <TArea
              value={schema}
              onChange={e => setSchema(e.target.value)}
              placeholder={'{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" }\n  },\n  "required": ["name"]\n}'}
              rows={12}
            />
          </div>
        }
        right={
          <div>
            <ColLabel action={json && <ClearBtn onClear={() => setJson('')} />}>json document</ColLabel>
            <TArea
              value={json}
              onChange={e => setJson(e.target.value)}
              placeholder={'{\n  "name": "Alice"\n}'}
              rows={12}
            />
          </div>
        }
      />

      <Btn onClick={run}>validate</Btn>

      {result && (
        <div className={`mt-4 text-sm font-mono ${result.valid ? 'text-gray-500' : 'text-red-400'}`}>
          {result.valid
            ? '✓ valid'
            : (
              <ul className="space-y-1">
                {result.errors.map((e, i) => <li key={i}>✗ {e}</li>)}
              </ul>
            )
          }
        </div>
      )}
    </div>
  );
}
