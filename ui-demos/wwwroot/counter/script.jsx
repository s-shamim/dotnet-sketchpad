function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          counter
        </h1>

        <div className="py-8 border-b border-gray-100">
          <p className="text-6xl font-light text-gray-700 tabular-nums">{count}</p>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setCount(count - 1)}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors"
          >
            − decrement
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors"
          >
            + increment
          </button>
          <button
            onClick={() => setCount(0)}
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