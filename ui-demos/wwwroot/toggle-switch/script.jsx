function App() {
  const [isOn, setIsOn] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          light switch
        </h1>

        <div className="py-12 border-b border-gray-100 text-center">
          <div className="text-8xl mb-6">{isOn ? '💡' : '🌙'}</div>
          <p className="text-sm text-gray-400 lowercase">{isOn ? 'on' : 'off'}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setIsOn(!isOn)}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors"
          >
            turn {isOn ? 'off' : 'on'}
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
