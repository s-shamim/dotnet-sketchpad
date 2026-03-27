function DataSection() {
  const [tags, setTags] = React.useState(['react', 'tailwind', 'dotnet', 'typescript', 'csharp']);
  const [page, setPage] = React.useState(2);

  const sampleJson = JSON.stringify({
    id: "usr_abc123",
    name: "Jane Smith",
    email: "jane@example.com",
    roles: ["admin", "editor"],
    createdAt: "2026-01-15T08:32:00Z",
    metadata: { plan: "pro", seats: 5 }
  }, null, 2);

  const columns = [
    { key: 'method', label: 'method' },
    { key: 'path',   label: 'path'   },
    { key: 'status', label: 'status' },
    { key: 'ms',     label: 'time'   },
  ];
  const rows = [
    { method: 'GET',    path: '/api/users',    status: '200', ms: '48ms'  },
    { method: 'POST',   path: '/api/users',    status: '201', ms: '112ms' },
    { method: 'GET',    path: '/api/users/42', status: '404', ms: '12ms'  },
    { method: 'PATCH',  path: '/api/users/17', status: '200', ms: '87ms'  },
    { method: 'DELETE', path: '/api/users/5',  status: '204', ms: '63ms'  },
  ];

  return (
    <div>
      <SectionTitle sub="code block, data table, tags, progress bar, empty state, pagination">data display</SectionTitle>

      <DemoBlock title="code block">
        <CodeBlock content={sampleJson} language="json" maxHeight={220} />
      </DemoBlock>

      <DemoBlock title="data table">
        <DataTable columns={columns} rows={rows} />
      </DemoBlock>

      <DemoBlock title="empty table state">
        <DataTable columns={columns} rows={[]} />
      </DemoBlock>

      <DemoBlock title="tags / chips">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Tag key={tag} label={tag} onRemove={() => setTags(t => t.filter(x => x !== tag))} />
          ))}
          <Tag label="read only" />
        </div>
        {tags.length === 0 && (
          <p className="text-xs text-gray-300 mt-2">all tags removed.</p>
        )}
      </DemoBlock>

      <DemoBlock title="progress bar">
        <div className="flex flex-col gap-5 max-w-sm">
          <ProgressBar value={20}  label="uploading..."   />
          <ProgressBar value={60}  label="processing"     />
          <ProgressBar value={100} label="complete"       />
          <ProgressBar value={7}   max={10} label="7 of 10 tasks" />
        </div>
      </DemoBlock>

      <DemoBlock title="empty state — standalone">
        <div className="border border-gray-100 max-w-sm">
          <EmptyState
            icon="magnifying-glass"
            title="no results found."
            sub="try a different search term or clear the filters."
            action={
              <button className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase">
                clear filters
              </button>
            }
          />
        </div>
      </DemoBlock>

      <DemoBlock title="pagination">
        <div className="max-w-sm">
          <Pagination page={page} totalPages={5} onChange={setPage} />
        </div>
      </DemoBlock>
    </div>
  );
}

// ── Data display components ───────────────────────────────

function CodeBlock({ content, language = 'json', maxHeight = 320 }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative border border-gray-100 bg-gray-50 rounded-sm">
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
      >
        {copied ? 'copied' : 'copy'}
      </button>
      <pre
        style={{ maxHeight }}
        className="overflow-auto p-4 text-xs text-gray-700 font-mono leading-relaxed"
      >
        {content}
      </pre>
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map(col => (
              <th key={col.key} className="text-left py-2 pr-4 text-xs tracking-widest text-gray-400 uppercase font-normal">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className="group hover:bg-gray-50 transition-colors"> {/* use a stable row id in real data */}
              {columns.map(col => (
                <td key={col.key} className="py-2.5 pr-4 text-gray-700">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <EmptyState title="no results." />}
    </div>
  );
}

function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 border border-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded-sm lowercase">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors flex items-center"><Icon name="x" size={12} className="" /></button>
      )}
    </span>
  );
}

function ProgressBar({ value, max = 100, label }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-gray-400 lowercase">{label}</span>}
      <div className="w-full h-1 bg-gray-100 rounded-sm">
        <div
          className="h-full bg-gray-500 transition-all rounded-sm"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 text-right">{pct}%</span>
    </div>
  );
}

function EmptyState({ icon = 'folder-open', title = 'nothing here yet.', sub, action }) {
  return (
    <div className="flex flex-col items-center py-10 gap-3 text-center">
      <Icon name={icon} size={28} className="text-gray-200" />
      <p className="text-sm text-gray-400 lowercase">{title}</p>
      {sub && <p className="text-xs text-gray-300 lowercase">{sub}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-between text-xs text-gray-400 py-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 hover:text-gray-600 transition-colors lowercase disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Icon name="arrow-left" size={12} /> prev
      </button>
      <span>{page} / {totalPages}</span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 hover:text-gray-600 transition-colors lowercase disabled:opacity-30 disabled:cursor-not-allowed"
      >
        next <Icon name="arrow-right" size={12} />
      </button>
    </div>
  );
}
