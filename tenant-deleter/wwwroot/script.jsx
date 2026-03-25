const { useState, useRef, useEffect, useCallback } = React;

// - Helpers -
function Icon({ name, size = 14, className = "text-gray-400" }) {
  return (
    <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-colors ${checked ? "bg-gray-600" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

const STATUS_META = {
  pending:    { label: "pending",    icon: "clock",         textClass: "text-gray-500",  rowClass: "bg-white" },
  processing: { label: "processing", icon: "spinner",       textClass: "text-yellow-600", rowClass: "bg-yellow-50" },
  success:    { label: "success",    icon: "check-circle",  textClass: "text-green-600",  rowClass: "bg-green-50" },
  error:      { label: "error",      icon: "x-circle",      textClass: "text-red-500",    rowClass: "bg-red-50" },
};

function StatusCell({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <div className="flex items-center gap-1.5">
      <Icon
        name={meta.icon}
        size={13}
        className={`${meta.textClass} ${status === "processing" ? "animate-spin" : ""}`}
      />
      <span className={`text-xs font-medium ${meta.textClass}`}>{meta.label}</span>
    </div>
  );
}

// - Main App -
function BatchTenantDeletion() {
  const [tenants,     setTenants]     = useState([]);
  const [summary,     setSummary]     = useState({ pending: 0, processing: 0, success: 0, error: 0, total: 0 });
  const [batchStatus, setBatchStatus] = useState({ status: "idle", dummyMode: false });
  const [authToken,   setAuthToken]   = useState("");
  const [delayMs,     setDelayMs]     = useState(500);
  const [dummyMode,   setDummyMode]   = useState(false);
  const [csvContent,  setCsvContent]  = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [loadMsg,     setLoadMsg]     = useState(null); // { type: "ok"|"err", text }
  const pollingRef = useRef(null);

  // - Fetch tenant list + batch status -
  const refresh = useCallback(async () => {
    try {
      const [tenantsRes, statusRes] = await Promise.all([
        fetch("/api/tenants"),
        fetch("/api/batch/status"),
      ]);
      if (tenantsRes.ok) {
        const data = await tenantsRes.json();
        setTenants(data.tenants ?? []);
        setSummary(data.summary ?? {});
      }
      if (statusRes.ok) {
        const data = await statusRes.json();
        setBatchStatus(data);
      }
    } catch (e) {
      console.error("Refresh error:", e);
    }
  }, []);

  // - Initial load -
  useEffect(() => { refresh(); }, [refresh]);

  // - Polling while active -
  useEffect(() => {
    const active = batchStatus.status === "running" || batchStatus.status === "paused" || batchStatus.status === "stopping";
    if (active) {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(refresh, 500);
      }
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        // One final refresh to get terminal state
        refresh();
      }
    }
    return () => {};
  }, [batchStatus.status, refresh]);

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  // - CSV file upload (just reads content, doesn't POST yet) -
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFileName(file.name);
    setLoadMsg(null);
    const reader = new FileReader();
    reader.onload = (ev) => setCsvContent(ev.target.result);
    reader.readAsText(file);
  };

  // - Load CSV into SQLite -
  const handleLoadCsv = async () => {
    if (!csvContent.trim()) return;
    setLoadMsg(null);
    try {
      const res = await fetch("/api/tenants/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent }),
      });
      if (!res.ok) {
        const err = await res.text();
        setLoadMsg({ type: "err", text: err });
        return;
      }
      const data = await res.json();
      setLoadMsg({ type: "ok", text: `Loaded ${data.loaded} new tenant(s). ${data.skipped} already existed. Total: ${data.total}.` });
      await refresh();
    } catch (e) {
      setLoadMsg({ type: "err", text: e.message });
    }
  };

  // - Start batch -
  const handleStart = async () => {
    try {
      const res = await fetch("/api/batch/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authToken, delayMs, dummyMode }),
      });
      if (!res.ok) { alert(await res.text()); return; }
      setBatchStatus(prev => ({ ...prev, status: "running" }));
      if (!pollingRef.current) pollingRef.current = setInterval(refresh, 500);
    } catch (e) { alert(e.message); }
  };

  const handlePause  = async () => { await fetch("/api/batch/pause",  { method: "POST" }); setBatchStatus(p => ({ ...p, status: "paused" })); };
  const handleResume = async () => { await fetch("/api/batch/resume", { method: "POST" }); setBatchStatus(p => ({ ...p, status: "running" })); if (!pollingRef.current) pollingRef.current = setInterval(refresh, 500); };
  const handleStop   = async () => { await fetch("/api/batch/stop",   { method: "POST" }); setBatchStatus(p => ({ ...p, status: "stopping" })); };

  // - Clear all data -
  const handleClearData = async () => {
    if (!confirm("Clear all tenant data from the database? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/tenants", { method: "DELETE" });
      if (!res.ok) { alert(await res.text()); return; }
      setTenants([]);
      setSummary({ pending: 0, processing: 0, success: 0, error: 0, total: 0 });
      setBatchStatus({ status: "idle", dummyMode: false });
      setCsvContent("");
      setCsvFileName("");
      setLoadMsg(null);
    } catch (e) { alert(e.message); }
  };

  // - Derived -
  const isActive     = batchStatus.status === "running" || batchStatus.status === "stopping";
  const isRunning    = batchStatus.status === "running";
  const isPaused     = batchStatus.status === "paused";
  const isBusy       = isActive || isPaused;
  const isCompleted  = batchStatus.status === "completed";
  const done         = (summary.success ?? 0) + (summary.error ?? 0);
  const progressPct  = summary.total > 0 ? Math.round((done / summary.total) * 100) : 0;
  const canStart     = summary.pending > 0 && !isBusy && (dummyMode || authToken.trim().length > 0);
  const canClear     = summary.total > 0 && !isBusy;

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* - Config panel - */}
      <div className="flex-shrink-0 overflow-y-auto p-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-normal text-gray-900 mb-1">Batch Tenant Deletion</h1>
            <p className="text-sm text-gray-500">Upload a CSV, load tenants into the database, then start the batch.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">

            {/* Dummy mode toggle */}
            <Toggle
              checked={dummyMode}
              onChange={setDummyMode}
              label="Dummy mode (simulates deletion locally — no real API calls)"
            />

            {/* Auth token - hidden in dummy mode */}
            {!dummyMode && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Authentication Token</label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  disabled={isBusy}
                  placeholder="Paste your Bearer token"
                  className="w-full border-b border-gray-300 py-2 text-gray-900 text-sm bg-transparent focus:outline-none focus:border-gray-500 disabled:opacity-50"
                />
              </div>
            )}

            {/* Delay slider */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Delay between calls: <span className="font-medium">{delayMs}ms</span>
              </label>
              <input
                type="range" min="100" max="5000" step="50"
                value={delayMs}
                onChange={(e) => setDelayMs(parseInt(e.target.value))}
                disabled={isBusy}
                className="w-full disabled:opacity-50"
              />
            </div>

            {/* CSV upload + Load button */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">CSV File</label>
              <div className="flex items-center gap-3">
                <input
                  type="file" accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isBusy}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleLoadCsv}
                  disabled={isBusy || !csvContent.trim()}
                  className="flex-shrink-0 py-1.5 px-4 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="database" size={13} className="text-gray-500 mr-1 inline" />
                  Load into DB
                </button>
              </div>
              {csvFileName && (
                <p className="text-xs text-gray-400 mt-1.5">
                  <Icon name="paperclip" size={11} className="text-gray-400" /> {csvFileName}
                </p>
              )}
              {loadMsg && (
                <p className={`text-xs mt-1.5 ${loadMsg.type === "ok" ? "text-green-600" : "text-red-500"}`}>
                  {loadMsg.text}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleStart}
                disabled={!canStart}
                className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="play" size={13} className="text-white mr-2 inline" />
                Start Deletion
              </button>
              <button
                onClick={handleClearData}
                disabled={!canClear}
                className="py-2.5 px-4 border border-gray-200 text-gray-600 text-sm rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="trash" size={13} className="text-gray-500 mr-1 inline" />
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* - Progress + Results - */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* Status / progress bar */}
          {(isBusy || isCompleted) && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Progress</span>
                  <span className="text-sm text-gray-900 font-medium tabular-nums">
                    {done} / {summary.total}
                    {summary.error > 0 && (
                      <span className="text-red-500 ml-2">({summary.error} err)</span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded h-1.5">
                  <div
                    className="bg-gray-800 h-1.5 rounded transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isRunning && <Icon name="spinner" size={13} className="text-gray-600 animate-spin" />}
                  {isPaused  && <Icon name="pause-circle" size={13} className="text-yellow-600" />}
                  {isCompleted && <Icon name="check-circle" size={13} className="text-green-600" />}
                  <span className="text-sm text-gray-700 capitalize">
                    {batchStatus.status === "stopping" ? "Stopping..." : batchStatus.status}
                    {batchStatus.dummyMode && <span className="ml-2 text-xs text-gray-400">(dummy mode)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isRunning && (
                    <>
                      <button
                        onClick={handlePause}
                        className="py-1.5 px-3 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
                      >
                        <Icon name="pause" size={12} className="text-gray-600 mr-1 inline" />
                        Pause
                      </button>
                      <button
                        onClick={handleStop}
                        className="py-1.5 px-3 border border-red-200 text-red-500 text-xs rounded hover:bg-red-50 transition-colors"
                      >
                        <Icon name="stop-circle" size={12} className="text-red-400 mr-1 inline" />
                        Stop
                      </button>
                    </>
                  )}
                  {isPaused && (
                    <>
                      <button
                        onClick={handleResume}
                        className="py-1.5 px-3 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors"
                      >
                        <Icon name="play" size={12} className="text-white mr-1 inline" />
                        Resume
                      </button>
                      <button
                        onClick={handleStop}
                        className="py-1.5 px-3 border border-red-200 text-red-500 text-xs rounded hover:bg-red-50 transition-colors"
                      >
                        <Icon name="stop-circle" size={12} className="text-red-400 mr-1 inline" />
                        Stop
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Summary chips */}
          {summary.total > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { key: "total",      label: "total",      cls: "bg-gray-100 text-gray-600" },
                { key: "pending",    label: "pending",    cls: "bg-gray-100 text-gray-500" },
                { key: "processing", label: "processing", cls: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
                { key: "success",    label: "success",    cls: "bg-green-50 text-green-700 border border-green-200" },
                { key: "error",      label: "errors",     cls: "bg-red-50 text-red-500 border border-red-200" },
              ].map(({ key, label, cls }) => summary[key] > 0 && (
                <span key={key} className={`text-xs px-2.5 py-1 rounded-full font-medium ${cls}`}>
                  {summary[key]} {label}
                </span>
              ))}
            </div>
          )}

          {/* Tenant table */}
          {tenants.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-600">Tenant ID</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-600">Status</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-600">Duration</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-600">HTTP</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-600">Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tenants.map((t) => {
                      const meta = STATUS_META[t.status] ?? STATUS_META.pending;
                      return (
                        <tr key={t.tenantId} className={meta.rowClass}>
                          <td className="px-5 py-2.5 font-mono text-xs text-gray-900">{t.tenantId}</td>
                          <td className="px-5 py-2.5"><StatusCell status={t.status} /></td>
                          <td className="px-5 py-2.5 text-xs text-gray-500 tabular-nums">
                            {t.durationMs != null ? `${t.durationMs}ms` : "--"}
                          </td>
                          <td className="px-5 py-2.5 text-xs text-gray-500 tabular-nums">
                            {t.statusCode ?? "--"}
                          </td>
                          <td className="px-5 py-2.5 text-xs text-gray-500 max-w-xs truncate" title={t.errorDetail ?? ""}>
                            {t.errorDetail ?? "--"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty state */}
          {tenants.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Icon name="file-csv" size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Upload a CSV and click "Load into DB" to get started</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<BatchTenantDeletion />);
