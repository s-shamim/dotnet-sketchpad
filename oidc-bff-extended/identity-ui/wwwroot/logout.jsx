// logout.jsx — Identity UI logout completion page
// Calls IDS to complete server-side sign-out then redirects.

function LogoutApp() {
  const [status, setStatus] = React.useState('signing out...');

  React.useEffect(() => {
    const params   = new URLSearchParams(window.location.search);
    const logoutId = params.get('logoutId') || '';
    const url      = `https://localhost:5203/api/ids/logout${logoutId ? `?logoutId=${encodeURIComponent(logoutId)}` : ''}`;

    fetch(url, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setStatus('signed out. redirecting...');
        setTimeout(() => { window.location.href = d.redirectUrl || 'https://localhost:5201'; }, 800);
      })
      .catch(() => {
        setStatus('sign-out complete.');
        setTimeout(() => { window.location.href = 'https://localhost:5201'; }, 1200);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-gray-400 lowercase tracking-widest">{status}</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LogoutApp />);
