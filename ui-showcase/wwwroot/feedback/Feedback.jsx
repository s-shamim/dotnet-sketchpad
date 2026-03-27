function FeedbackSection() {
  const { show, ToastEl } = useToast();
  const [alertDismissed, setAlertDismissed] = React.useState(false);

  return (
    <div>
      <SectionTitle sub="badge, alert, toast, spinner, skeleton">feedback</SectionTitle>

      <DemoBlock title="status badges — semantic">
        <div className="flex flex-wrap gap-2">
          <Badge label="neutral" variant="neutral" />
          <Badge label="info"    variant="info"    />
          <Badge label="success" variant="success" />
          <Badge label="warning" variant="warning" />
          <Badge label="error"   variant="error"   />
        </div>
      </DemoBlock>

      <DemoBlock title="status badges — http methods">
        <div className="flex flex-wrap gap-2">
          <Badge label="GET"    variant="get"    />
          <Badge label="POST"   variant="post"   />
          <Badge label="PUT"    variant="put"    />
          <Badge label="DELETE" variant="delete" />
          <Badge label="PATCH"  variant="patch"  />
        </div>
      </DemoBlock>

      <DemoBlock title="status badges — response codes">
        <div className="flex flex-wrap gap-2">
          <Badge label="200 OK"           variant="success" />
          <Badge label="201 Created"      variant="success" />
          <Badge label="400 Bad Request"  variant="warning" />
          <Badge label="404 Not Found"    variant="error"   />
          <Badge label="500 Server Error" variant="error"   />
        </div>
      </DemoBlock>

      <DemoBlock title="alert / banner">
        <div className="flex flex-col gap-3 max-w-md">
          <Alert variant="info">your session will expire in 15 minutes.</Alert>
          <Alert variant="success">changes saved successfully.</Alert>
          <Alert variant="warning">this action will affect all users in the workspace.</Alert>
          <Alert variant="error">failed to connect to the server. check your network.</Alert>
          {alertDismissed
            ? <button onClick={() => setAlertDismissed(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase self-start">show dismissible →</button>
            : <Alert variant="neutral" onClose={() => setAlertDismissed(true)}>a dismissible banner with a close button.</Alert>
          }
        </div>
      </DemoBlock>

      <DemoBlock title="toast notifications">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => show('new version available.', 'info')}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase"
          >info</button>
          <button
            onClick={() => show('request saved successfully.', 'success')}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase"
          >success</button>
          <button
            onClick={() => show('something went wrong.', 'error')}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase"
          >error</button>
          <button
            onClick={() => show('this action cannot be undone.', 'warning')}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase"
          >warning</button>
          <button
            onClick={() => show('copied to clipboard.', 'neutral')}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase"
          >neutral</button>
        </div>
        {ToastEl}
      </DemoBlock>

      <DemoBlock title="spinner">
        <div className="flex items-end gap-8">
          {[12, 16, 20, 28, 36].map(sz => (
            <div key={sz} className="flex flex-col items-center gap-2">
              <Spinner size={sz} />
              <span className="text-xs text-gray-300">{sz}</span>
            </div>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="skeleton loader">
        <div className="max-w-sm">
          <Skeleton lines={4} />
        </div>
      </DemoBlock>
    </div>
  );
}

// ── Feedback components ───────────────────────────────────

function Badge({ label, variant = 'neutral' }) {
  const styles = {
    neutral: 'text-gray-500 bg-gray-100',
    info:    'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    error:   'text-red-500 bg-red-50',
    get:     'text-green-600 bg-green-50',
    post:    'text-yellow-600 bg-yellow-50',
    put:     'text-blue-600 bg-blue-50',
    delete:  'text-red-500 bg-red-50',
    patch:   'text-purple-600 bg-purple-50',
  };
  return (
    <span className={`inline-block text-xs font-mono px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${styles[variant] ?? styles.neutral}`}>
      {label}
    </span>
  );
}

function Toast({ message, variant = 'neutral', onClose }) {
  const border = {
    neutral: 'border-gray-200',
    info:    'border-blue-200',
    success: 'border-green-200',
    error:   'border-red-200',
    warning: 'border-yellow-200',
  };
  const text = {
    neutral: 'text-gray-600',
    info:    'text-blue-600',
    success: 'text-green-600',
    error:   'text-red-500',
    warning: 'text-yellow-600',
  };
  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 bg-white border ${border[variant]} px-4 py-3 shadow-sm rounded-sm text-sm z-50`}>
      <span className={`lowercase ${text[variant]}`}>{message}</span>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors flex items-center"><Icon name="x" size={12} className="" /></button>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = React.useState(null);
  const show = (message, variant = 'neutral', duration = 3000) => {
    setToast({ message, variant, duration });
  };
  React.useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), toast.duration ?? 3000);
    return () => clearTimeout(id);
  }, [toast]);
  const ToastEl = toast
    ? <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
    : null;
  return { show, ToastEl };
}

function Alert({ variant = 'neutral', children, onClose }) {
  const styles = {
    neutral: { border: 'border-gray-200',   bg: 'bg-gray-50',    text: 'text-gray-600',  icon: 'info'         },
    info:    { border: 'border-blue-200',   bg: 'bg-blue-50',    text: 'text-blue-600',  icon: 'info'         },
    success: { border: 'border-green-200',  bg: 'bg-green-50',   text: 'text-green-600', icon: 'check-circle' },
    warning: { border: 'border-yellow-200', bg: 'bg-yellow-50',  text: 'text-yellow-600', icon: 'warning'     },
    error:   { border: 'border-red-200',    bg: 'bg-red-50',     text: 'text-red-500',   icon: 'x-circle'     },
  };
  const s = styles[variant] ?? styles.neutral;
  return (
    <div className={`flex items-start gap-3 border ${s.border} ${s.bg} px-4 py-3 rounded-sm`}>
      <Icon name={s.icon} size={14} className={`${s.text} mt-0.5 shrink-0`} />
      <span className={`text-sm lowercase flex-1 ${s.text}`}>{children}</span>
      {onClose && (
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors flex items-center shrink-0 self-center">
          <Icon name="x" size={12} className="" />
        </button>
      )}
    </div>
  );
}

function Skeleton({ lines = 3 }) {
  const widths = [85, 65, 92, 74, 80];
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-100 rounded-sm"
          style={{ width: `${widths[i % widths.length]}%` }}
        />
      ))}
    </div>
  );
}
