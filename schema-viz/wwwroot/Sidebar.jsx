// ── Sidebar ───────────────────────────────────────────────────────────────────
// Two-tab panel: "import" (DDL paste) and "inspector" (selected table editor).

function Sidebar({ schema, selectedTableId, onSelectTable, actions }) {
  const [tab, setTab] = React.useState('import');
  const [ddl, setDdl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [parseError, setParseError] = React.useState('');
  const [clearConfirm, setClearConfirm] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [validating, setValidating] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState(null);
  const [exportModal, setExportModal] = React.useState(false);

  // New column form
  const [newColName, setNewColName] = React.useState('');
  const [newColType, setNewColType] = React.useState('VARCHAR(255)');
  const [newColNullable, setNewColNullable] = React.useState(true);
  const [newColIsPK, setNewColIsPK] = React.useState(false);

  // New FK form
  const [fkFromCol, setFkFromCol] = React.useState('');
  const [fkToTable, setFkToTable] = React.useState('');
  const [fkToCol, setFkToCol] = React.useState('');

  const selectedTable = schema.tables.find(t => t.id === selectedTableId) || null;

  // Auto-switch to inspector when a table is selected
  React.useEffect(() => {
    if (selectedTableId) setTab('inspector');
  }, [selectedTableId]);

  // Reset FK form when selected table changes
  React.useEffect(() => {
    setFkFromCol(''); setFkToTable(''); setFkToCol('');
  }, [selectedTableId]);

  // ── Import ────────────────────────────────────────────────────────────────

  async function handleParse() {
    if (!ddl.trim()) return;
    setLoading(true);
    setParseError('');
    setValidationResult(null);
    try {
      const res = await fetch('/api/parse-ddl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: ddl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'parse failed');
      if (!data.tables || data.tables.length === 0) {
        setParseError('no CREATE TABLE statements found.');
        return;
      }
      actions.importSchema(data.tables);
    } catch (e) {
      setParseError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleValidate() {
    if (!ddl.trim()) return;
    setValidating(true);
    setParseError('');
    setValidationResult(null);
    try {
      const res = await fetch('/api/validate-ddl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: ddl }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.error) || `server error (${res.status})`);
      if (!data) throw new Error('invalid response from server');
      setValidationResult(data);
    } catch (e) {
      setValidationResult({ valid: false, tableCount: 0, errors: [e.message], warnings: [] });
    } finally {
      setValidating(false);
    }
  }

  function buildExportSql() {
    return schema.tables.map(t => {
      const lines = [];
      for (const col of t.columns) {
        let def = `  ${col.name} ${col.type.toUpperCase()}`;
        if (col.isPK) def += ' PRIMARY KEY';
        else if (!col.nullable) def += ' NOT NULL';
        lines.push(def);
      }
      for (const fk of t.foreignKeys) {
        lines.push(`  FOREIGN KEY (${fk.fromColumn}) REFERENCES ${fk.toTable}(${fk.toColumn})`);
      }
      return `CREATE TABLE ${t.name} (\n${lines.join(',\n')}\n);`;
    }).join('\n\n');
  }

  // ── Column CRUD ───────────────────────────────────────────────────────────

  function handleAddColumn() {
    if (!newColName.trim() || !selectedTableId) return;
    actions.addColumn(selectedTableId, {
      id: generateId(),
      name: newColName.trim().toLowerCase().replace(/\s+/g, '_'),
      type: newColType.trim() || 'VARCHAR(255)',
      nullable: newColNullable,
      isPK: newColIsPK,
    });
    setNewColName('');
    setNewColType('VARCHAR(255)');
    setNewColNullable(true);
    setNewColIsPK(false);
  }

  // ── FK CRUD ───────────────────────────────────────────────────────────────

  function handleAddFK() {
    if (!fkFromCol || !fkToTable || !fkToCol || !selectedTableId) return;
    actions.addForeignKey(selectedTableId, {
      id: generateId(),
      fromColumn: fkFromCol,
      toTable: fkToTable,
      toColumn: fkToCol,
    });
    setFkFromCol(''); setFkToTable(''); setFkToCol('');
  }

  const fkToTableObj = schema.tables.find(t => t.name === fkToTable) || null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <aside
      className="flex flex-col shrink-0 border-r border-gray-200 h-full overflow-hidden"
      style={{ width: 280, background: 'var(--color-white)' }}
    >
      <Tabs
        tabs={[
          { id: 'import', label: 'import' },
          { id: 'inspector', label: selectedTable ? selectedTable.name : 'inspector' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

        {/* ── Import tab ── */}
        {tab === 'import' && (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">sql ddl</span>
              <textarea
                rows={14}
                value={ddl}
                onChange={e => { setDdl(e.target.value); setParseError(''); setValidationResult(null); }}
                placeholder={"CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  role_id INT,\n  FOREIGN KEY (role_id)\n    REFERENCES roles(id)\n);"}
                className="w-full border border-gray-200 rounded-sm p-2 text-xs font-mono text-gray-700 placeholder-gray-300 bg-white focus:outline-none focus:border-gray-400 resize-none leading-relaxed"
              />
              {(validationResult || parseError) && (
                <div className="flex flex-col gap-1">
                  {validationResult && (
                    <div className={`text-xs rounded-sm p-2 flex flex-col gap-1.5 border ${
                      validationResult.errors.length > 0
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-green-50 border-green-200 text-green-700'
                    }`}>
                      {validationResult.errors.length > 0
                        ? validationResult.errors.map((e, i) => <span key={i}>{e}</span>)
                        : <span className="flex items-center gap-1">
                            <Icon name="check-circle" size={12} className="" />
                            {validationResult.tableCount} table{validationResult.tableCount !== 1 ? 's' : ''} found
                          </span>
                      }
                      {validationResult.warnings.map((w, i) => (
                        <span key={i} className="flex items-center gap-0.5 text-yellow-600">
                          <Icon name="warning" size={11} className="" /> {w}
                        </span>
                      ))}
                    </div>
                  )}
                  {parseError && <p className="text-xs text-red-500 lowercase">{parseError}</p>}
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleValidate}
                  disabled={validating || !ddl.trim()}
                  className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validating
                    ? <><Spinner size={12} /> checking...</>
                    : <><Icon name="check-circle" size={14} className="" /> validate</>
                  }
                </button>
                <button
                  onClick={handleParse}
                  disabled={loading || !ddl.trim()}
                  className="flex items-center gap-1.5 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><Spinner size={12} /> parsing...</>
                    : <><Icon name="play" size={14} className="" /> parse & import</>
                  }
                </button>
                {ddl && (
                  <button
                    onClick={() => { setDdl(''); setParseError(''); setValidationResult(null); }}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors lowercase"
                  >
                    clear
                  </button>
                )}
              </div>
            </div>

            {schema.tables.length > 0 && (
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <p className="text-xs text-gray-400 lowercase">
                  {schema.tables.length} table{schema.tables.length !== 1 ? 's' : ''} on canvas
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportModal(true)}
                    className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase"
                  >
                    <Icon name="export" size={14} className="" /> export sql
                  </button>
                  <button
                    onClick={() => setClearConfirm(true)}
                    className="text-sm text-red-400 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-sm hover:border-red-400 transition-colors lowercase"
                  >
                    clear canvas
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Inspector tab ── */}
        {tab === 'inspector' && (
          <>
            {!selectedTable ? (
              <p className="text-xs text-gray-400 lowercase mt-1">
                click a table on the canvas to inspect it.
              </p>
            ) : (
              <>
                {/* Table name */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">table name</span>
                  <input
                    value={selectedTable.name}
                    onChange={e => actions.updateTableName(selectedTableId, e.target.value)}
                    className="w-full border-b border-gray-300 py-1.5 text-sm text-gray-700 bg-transparent focus:outline-none focus:border-gray-500 lowercase"
                  />
                </div>

                {/* Columns */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">columns</span>

                  {selectedTable.columns.length === 0 && (
                    <p className="text-xs text-gray-300 lowercase">no columns yet.</p>
                  )}

                  <div className="flex flex-col divide-y divide-gray-100">
                    {selectedTable.columns.map(col => (
                      <div key={col.id} className="py-2 group flex flex-col gap-1.5">
                        <div className="flex items-center gap-1">
                          <input
                            value={col.name}
                            onChange={e => actions.updateColumn(selectedTableId, col.id, { name: e.target.value })}
                            className="flex-1 border-b border-gray-200 py-0.5 text-xs text-gray-700 bg-transparent focus:outline-none focus:border-gray-400 min-w-0 lowercase"
                            placeholder="name"
                          />
                          <input
                            value={col.type}
                            onChange={e => actions.updateColumn(selectedTableId, col.id, { type: e.target.value })}
                            className="w-20 border-b border-gray-200 py-0.5 text-xs text-gray-500 font-mono bg-transparent focus:outline-none focus:border-gray-400 text-right uppercase"
                            placeholder="TYPE"
                          />
                          <button
                            onClick={() => actions.deleteColumn(selectedTableId, col.id)}
                            className="opacity-0 group-hover:opacity-100 ml-1 text-gray-300 hover:text-red-400 transition-all flex items-center"
                            aria-label="delete column"
                          >
                            <Icon name="x" size={11} className="" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={col.isPK}
                              onChange={e => actions.updateColumn(selectedTableId, col.id, {
                                isPK: e.target.checked,
                                nullable: e.target.checked ? false : col.nullable,
                              })}
                              className="accent-gray-500 w-3 h-3"
                            />
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">PK</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!col.nullable}
                              onChange={e => actions.updateColumn(selectedTableId, col.id, { nullable: !e.target.checked })}
                              className="accent-gray-500 w-3 h-3"
                            />
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">NOT NULL</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add column form */}
                  <div className="pt-2 border-t border-dashed border-gray-200 flex flex-col gap-2">
                    <div className="flex gap-1">
                      <input
                        value={newColName}
                        onChange={e => setNewColName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddColumn()}
                        placeholder="column name..."
                        className="flex-1 border-b border-gray-200 py-1 text-xs text-gray-700 bg-transparent focus:outline-none focus:border-gray-400 min-w-0 placeholder-gray-300"
                      />
                      <input
                        value={newColType}
                        onChange={e => setNewColType(e.target.value)}
                        placeholder="TYPE"
                        className="w-[72px] border-b border-gray-200 py-1 text-xs text-gray-500 font-mono bg-transparent focus:outline-none focus:border-gray-400 text-right uppercase placeholder-gray-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={newColIsPK} onChange={e => setNewColIsPK(e.target.checked)} className="accent-gray-500 w-3 h-3" />
                          <span className="text-[10px] text-gray-400 uppercase tracking-wide">PK</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={!newColNullable} onChange={e => setNewColNullable(!e.target.checked)} className="accent-gray-500 w-3 h-3" />
                          <span className="text-[10px] text-gray-400 uppercase tracking-wide">NOT NULL</span>
                        </label>
                      </div>
                      <button
                        onClick={handleAddColumn}
                        disabled={!newColName.trim()}
                        className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-2.5 py-1 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors lowercase"
                      >
                        add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Foreign keys */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">foreign keys</span>

                  {selectedTable.foreignKeys.length === 0 && (
                    <p className="text-xs text-gray-300 lowercase">none</p>
                  )}
                  <div className="flex flex-col divide-y divide-gray-100">
                    {selectedTable.foreignKeys.map(fk => (
                      <div key={fk.id} className="py-1.5 flex items-center justify-between group text-xs">
                        <span className="text-gray-600 lowercase truncate flex-1 mr-2">
                          <span className="font-mono text-gray-800">{fk.fromColumn}</span>
                          <span className="text-gray-400 mx-1">→</span>
                          <span className="font-mono text-gray-700">{fk.toTable}.{fk.toColumn}</span>
                        </span>
                        <button
                          onClick={() => actions.deleteForeignKey(selectedTableId, fk.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex items-center shrink-0"
                          aria-label="delete fk"
                        >
                          <Icon name="x" size={11} className="" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add FK form */}
                  {selectedTable.columns.length > 0 && schema.tables.length > 1 && (
                    <div className="pt-2 border-t border-dashed border-gray-200 flex flex-col gap-2">
                      <div className="flex gap-1 items-center">
                        <select
                          value={fkFromCol}
                          onChange={e => setFkFromCol(e.target.value)}
                          className="flex-1 min-w-0 border-b border-gray-200 py-1 text-xs text-gray-700 bg-transparent focus:outline-none focus:border-gray-400"
                        >
                          <option value="">from col…</option>
                          {selectedTable.columns.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <Icon name="arrow-right" size={11} className="text-gray-300 shrink-0 mx-0.5" />
                        <select
                          value={fkToTable}
                          onChange={e => { setFkToTable(e.target.value); setFkToCol(''); }}
                          className="flex-1 min-w-0 border-b border-gray-200 py-1 text-xs text-gray-700 bg-transparent focus:outline-none focus:border-gray-400"
                        >
                          <option value="">table…</option>
                          {schema.tables.filter(t => t.id !== selectedTableId).map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-1 items-center">
                        <select
                          value={fkToCol}
                          onChange={e => setFkToCol(e.target.value)}
                          disabled={!fkToTableObj}
                          className="flex-1 min-w-0 border-b border-gray-200 py-1 text-xs text-gray-700 bg-transparent focus:outline-none focus:border-gray-400 disabled:opacity-40"
                        >
                          <option value="">to col…</option>
                          {fkToTableObj && fkToTableObj.columns.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={handleAddFK}
                          disabled={!fkFromCol || !fkToTable || !fkToCol}
                          className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-2.5 py-1 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors lowercase shrink-0"
                        >
                          add fk
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete table */}
                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="text-sm text-red-400 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-sm hover:border-red-400 transition-colors lowercase"
                  >
                    delete table
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {exportModal && (
        <Modal title="export sql" size="lg" onClose={() => setExportModal(false)}>
          <div className="flex flex-col gap-3">
            <textarea
              readOnly
              rows={16}
              value={buildExportSql()}
              className="w-full border border-gray-200 rounded-sm p-2 text-xs font-mono text-gray-700 bg-gray-50 focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(buildExportSql())}
                className="flex items-center gap-1.5 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase"
              >
                <Icon name="copy" size={14} className="" /> copy
              </button>
              <button
                onClick={() => setExportModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm lowercase"
              >
                close
              </button>
            </div>
          </div>
        </Modal>
      )}
      {clearConfirm && (
        <ConfirmModal
          message="remove all tables from the canvas?"
          confirmLabel="clear all"
          onConfirm={() => { actions.clearSchema(); setClearConfirm(false); }}
          onCancel={() => setClearConfirm(false)}
        />
      )}
      {deleteConfirm && selectedTable && (
        <ConfirmModal
          message={`delete table "${selectedTable.name}" and all its data?`}
          onConfirm={() => {
            actions.deleteTable(selectedTableId);
            onSelectTable(null);
            setDeleteConfirm(false);
            setTab('import');
          }}
          onCancel={() => setDeleteConfirm(false)}
        />
      )}
    </aside>
  );
}
