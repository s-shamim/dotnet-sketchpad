function DataSection() {
  const [tags, setTags] = React.useState(['react', 'tailwind', 'dotnet', 'typescript', 'csharp']);
  const [page, setPage] = React.useState(2);
  const [tableSearch, setTableSearch] = React.useState('');
  const [methodFilter, setMethodFilter] = React.useState('all');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [appliedConditions, setAppliedConditions] = React.useState([]);
  const [codeLanguage, setCodeLanguage] = React.useState('json');

  const codeSamples = {
    json: JSON.stringify({
      id: "usr_abc123",
      name: "Jane Smith",
      email: "jane@example.com",
      roles: ["admin", "editor"],
      createdAt: "2026-01-15T08:32:00Z",
      metadata: { plan: "pro", seats: 5 }
    }, null, 2),
    javascript: [
      '// async fetch helper',
      'async function getUsers(page = 1) {',
      "  const res = await fetch('/api/users?page=' + page);",
      "  if (!res.ok) throw new Error('HTTP ' + res.status);",
      '  return res.json();',
      '}',
    ].join('\n'),
    sql: [
      'SELECT u.id, u.name, u.email,',
      '  COUNT(o.id) AS order_count',
      'FROM users u',
      'LEFT JOIN orders o ON o.user_id = u.id',
      'WHERE u.active = true',
      'GROUP BY u.id',
      'ORDER BY order_count DESC;',
    ].join('\n'),
  };

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
      <SectionTitle sub="code block, data table with sort + conditions, tags, progress bar, empty state, pagination">data display</SectionTitle>

      <DemoBlock title="code block">
        <CodeBlock
          content={codeSamples[codeLanguage]}
          language={codeLanguage}
          languages={['json', 'javascript', 'sql']}
          onLanguageChange={setCodeLanguage}
          maxHeight={220}
        />
      </DemoBlock>

      <DemoBlock title="data table — sortable + condition filter">
        <div className="flex items-center gap-3 mb-3">
          {/* search — reuses the shared SearchInput from FormsSection */}
          <SearchInput
            value={tableSearch}
            onChange={setTableSearch}
            placeholder="search path..."
            width="flex-1 max-w-xs"
          />
          {/* method pills */}
          <div className="flex gap-1 text-xs">
            {['all', 'GET', 'POST', 'PATCH', 'DELETE'].map(m => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-2 py-1 rounded-sm transition-colors lowercase ${
                  methodFilter === m ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'
                }`}
              >{m}</button>
            ))}
          </div>
          {/* condition filter trigger */}
          <button
            onClick={() => setFilterOpen(true)}
            className={`flex items-center gap-1.5 text-xs border px-2 py-1 rounded-sm transition-colors lowercase shrink-0 ${
              appliedConditions.length > 0
                ? 'border-gray-400 text-gray-600'
                : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon name="funnel" size={12} className="" />
            {appliedConditions.length > 0
              ? `${appliedConditions.length} condition${appliedConditions.length > 1 ? 's' : ''}`
              : 'conditions'}
          </button>
          {appliedConditions.length > 0 && (
            <button
              onClick={() => setAppliedConditions([])}
              className="text-xs text-gray-300 hover:text-gray-500 transition-colors lowercase shrink-0"
            >clear</button>
          )}
        </div>
        <DataTable
          columns={columns}
          rows={applyConditions(
            rows.filter(r =>
              (methodFilter === 'all' || r.method === methodFilter) &&
              (!tableSearch || r.path.toLowerCase().includes(tableSearch.toLowerCase()))
            ),
            appliedConditions
          )}
        />
        {filterOpen && (
          <FilterModal
            columns={columns}
            conditions={appliedConditions}
            onApply={setAppliedConditions}
            onClose={() => setFilterOpen(false)}
          />
        )}
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

function CodeBlock({ content, language = 'json', languages, onLanguageChange, maxHeight = 320 }) {
  const [copied, setCopied] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const langRef = React.useRef(null);

  React.useEffect(() => {
    if (!langOpen) return;
    function onOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [langOpen]);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border border-gray-100 rounded-sm overflow-hidden">
      {/* header — both sides use the same text-xs, no-border style for visual balance */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-gray-100">
        {/* language picker — compact inline trigger, no border */}
        {languages && onLanguageChange ? (
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(o => !o)}
              className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-gray-600 transition-colors lowercase"
            >
              {language}
              <Icon name="caret-down" size={10} className={`text-gray-300 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full left-0 mt-1 border border-gray-200 bg-white rounded-sm shadow-sm z-20 overflow-hidden">
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => { onLanguageChange(lang); setLangOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors lowercase ${
                      lang === language ? 'text-gray-700 bg-gray-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                  >{lang}</button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs font-mono text-gray-400">{language}</span>
        )}
        {/* copy button — same text-xs weight as the language picker */}
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
        >
          <Icon name={copied ? 'check' : 'copy'} size={12} className={copied ? 'text-green-600' : ''} />
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre
        style={{ maxHeight }}
        className="overflow-auto p-4 text-xs text-gray-700 font-mono leading-relaxed bg-gray-50"
      >
        {content}
      </pre>
    </div>
  );
}

function DataTable({ columns, rows }) {
  const [sortKey, setSortKey] = React.useState(null);
  const [sortDir, setSortDir] = React.useState('asc');

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const sorted = sortKey ? [...rows].sort((a, b) => {
    const cmp = String(a[sortKey] ?? '').localeCompare(
      String(b[sortKey] ?? ''), undefined, { numeric: true, sensitivity: 'base' }
    );
    return sortDir === 'asc' ? cmp : -cmp;
  }) : rows;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map(col => (
              <th key={col.key} className="text-left py-2 pr-4 font-normal">
                <button
                  onClick={() => handleSort(col.key)}
                  className="flex items-center gap-1 text-xs tracking-widest text-gray-400 uppercase hover:text-gray-600 transition-colors group"
                >
                  {col.label}
                  <span className={`transition-opacity ${
                    sortKey === col.key ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                  }`}>
                    <Icon
                      name={sortKey === col.key && sortDir === 'desc' ? 'sort-descending' : 'sort-ascending'}
                      size={11}
                      className=""
                    />
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((row, i) => (
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

function FilterModal({ columns, conditions, onApply, onClose }) {
  const OPERATORS = [
    'contains', 'does not contain', 'is', 'is not',
    'starts with', 'ends with', 'is empty', 'is not empty',
  ];
  const [local, setLocal] = React.useState(
    conditions.length > 0
      ? conditions
      : [{ id: 1, connector: 'where', field: columns[0]?.key ?? '', operator: 'contains', value: '' }]
  );
  const nextId = React.useRef(conditions.length > 0 ? Math.max(...conditions.map(c => c.id)) + 1 : 2);

  const addRow = () => {
    const id = nextId.current++;
    setLocal(prev => [...prev, { id, connector: 'and', field: columns[0]?.key ?? '', operator: 'contains', value: '' }]);
  };
  const update = (id, field, val) => setLocal(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  const remove = (id) => setLocal(prev => prev.filter(c => c.id !== id));

  function handleApply() {
    // only keep rows that have a value, or use value-free operators
    const active = local.filter(c =>
      c.value.trim() !== '' || c.operator === 'is empty' || c.operator === 'is not empty'
    );
    onApply(active);
    onClose();
  }

  return (
    <Modal
      title="customize table"
      onClose={onClose}
      size="lg"
      actions={<>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors lowercase">cancel</button>
        <button onClick={handleApply} className="text-sm text-gray-700 hover:text-gray-900 border border-gray-300 px-4 py-1.5 rounded-sm transition-colors lowercase">apply</button>
      </>}
    >
      <p className="text-xs text-gray-400 mb-4 lowercase">select and add conditions</p>
      <div className="flex flex-col gap-2">
        {local.map((cond, i) => (
          <div key={cond.id} className="flex items-center gap-2 min-w-0">
            {/* drag handle (visual only) */}
            <Icon name="dots-six-vertical" size={14} className="text-gray-300 shrink-0 cursor-grab" />
            {/* connector — static "where" for first row, dropdown for rest */}
            {i === 0
              ? <span className="text-sm text-gray-500 w-20 shrink-0 lowercase">where</span>
              : <Dropdown
                  value={cond.connector}
                  onChange={v => update(cond.id, 'connector', v)}
                  options={['and', 'or']}
                  width="w-20"
                />
            }
            {/* field */}
            <Dropdown
              value={cond.field}
              onChange={v => update(cond.id, 'field', v)}
              options={columns.map(c => ({ value: c.key, label: c.label }))}
              width="w-28"
            />
            {/* operator */}
            <Dropdown
              value={cond.operator}
              onChange={v => update(cond.id, 'operator', v)}
              options={OPERATORS}
              width="w-40"
            />
            {/* value — hidden for value-free operators */}
            {cond.operator !== 'is empty' && cond.operator !== 'is not empty'
              ? <input
                  value={cond.value}
                  onChange={e => update(cond.id, 'value', e.target.value)}
                  placeholder="value..."
                  className="flex-1 min-w-0 border-b border-gray-300 py-1 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
                />
              : <span className="flex-1 min-w-0" />
            }
            {/* remove */}
            <button
              onClick={() => remove(cond.id)}
              disabled={local.length === 1}
              className="text-gray-300 hover:text-red-400 transition-colors flex items-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Icon name="trash" size={13} className="" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addRow}
        className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
      >
        <Icon name="plus" size={12} /> add condition
      </button>
    </Modal>
  );
}

// ── Filter logic ──────────────────────────────────────────

function checkCond(row, cond) {
  const cell = String(row[cond.field] ?? '').toLowerCase();
  const val  = (cond.value ?? '').toLowerCase();
  switch (cond.operator) {
    case 'contains':         return cell.includes(val);
    case 'does not contain': return !cell.includes(val);
    case 'is':               return cell === val;
    case 'is not':           return cell !== val;
    case 'starts with':      return cell.startsWith(val);
    case 'ends with':        return cell.endsWith(val);
    case 'is empty':         return cell === '';
    case 'is not empty':     return cell !== '';
    default:                 return true;
  }
}

function applyConditions(rows, conditions) {
  if (!conditions.length) return rows;
  return rows.filter(row => {
    let result = checkCond(row, conditions[0]);
    for (let i = 1; i < conditions.length; i++) {
      const match = checkCond(row, conditions[i]);
      result = conditions[i].connector === 'or' ? result || match : result && match;
    }
    return result;
  });
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
