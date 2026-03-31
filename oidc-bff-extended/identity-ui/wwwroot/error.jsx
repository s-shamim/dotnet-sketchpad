// error.jsx — Identity UI error page

function Icon({ name, size = 14, className = 'text-gray-400' }) {
  return <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />;
}

function ErrorApp() {
  const params  = new URLSearchParams(window.location.search);
  const errorId = params.get('errorId') || '';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-sm">
        <Icon name="warning" size={32} className="text-yellow-500 mb-4" />
        <h1 className="text-xl font-light text-gray-800 tracking-widest lowercase mb-2">authorization error</h1>
        <p className="text-sm text-gray-500 lowercase mb-6">
          something went wrong during the authentication flow.
          {errorId && <span className="block mt-1 font-mono text-xs text-gray-400 break-all">error id: {errorId}</span>}
        </p>
        <a
          href="https://localhost:5201"
          className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-sm hover:border-gray-400 transition-colors lowercase"
        >
          return to app
        </a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ErrorApp />);
