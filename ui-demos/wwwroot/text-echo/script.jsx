function App() {
  const [text, setText] = React.useState('');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          text echo
        </h1>

        <div className="flex items-center border-b border-gray-300 mb-8">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="start typing..."
            className="flex-1 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none"
          />
        </div>

        <div className="border-b border-gray-100 py-4 min-h-[60px]">
          {text
            ? <p className="text-sm text-gray-700">{text}</p>
            : <p className="text-sm text-gray-300">your text will appear here...</p>
          }
        </div>

        <p className="mt-4 text-xs text-gray-400">{text.length} characters</p>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
