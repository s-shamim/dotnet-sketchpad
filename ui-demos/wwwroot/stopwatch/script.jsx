function App() {
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = () => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          stopwatch
        </h1>

        <div className="py-8 border-b border-gray-100">
          <p className="text-5xl font-mono font-light text-gray-700 tabular-nums">
            {formatTime()}
          </p>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors"
          >
            {isRunning ? 'pause' : 'start'}
          </button>
          <button
            onClick={handleReset}
            className="text-gray-200 hover:text-gray-500 text-sm px-2 transition-colors ml-auto"
          >
            reset
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
