const { useState } = React;

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [history, setHistory] = useState([]);

  const pushDigit = (d) => {
    if (display === 'Error') return;
    setDisplay(display === '0' ? d : display + d);
  };

  const chooseOp = (o) => {
    if (display === 'Error') return;
    setPrev(parseFloat(display));
    setOp(o);
    setDisplay('0');
  };

  const compute = () => {
    if (prev === null || op === null || display === 'Error') return;
    const cur = parseFloat(display);
    let result;
    switch (op) {
      case '+': result = prev + cur; break;
      case '-': result = prev - cur; break;
      case '×': result = prev * cur; break;
      case '÷': result = cur !== 0 ? prev / cur : 'Error'; break;
      default: return;
    }
    if (result !== 'Error') {
      setHistory(h => [`${prev} ${op} ${cur} = ${result}`, ...h].slice(0, 10));
    }
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
  };

  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); };

  const Btn = ({ v, onClick, dim }) => (
    <button
      onClick={onClick || (() => pushDigit(v))}
      className={`py-3 text-sm border-b border-r border-gray-100 hover:bg-gray-50 transition-colors ${
        dim
          ? op === v ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      {v}
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          calculator
        </h1>

        <div className="flex gap-8 items-start">
          <div className="flex-1">
            <div className="border-b border-gray-200 pb-3 text-right mb-0">
              {prev !== null && op && (
                <div className="text-xs text-gray-300 mb-1 font-mono">{prev} {op}</div>
              )}
              <div className="text-4xl font-light text-gray-700 tabular-nums overflow-hidden">{display}</div>
            </div>

            <div className="grid grid-cols-4 border-t border-l border-gray-100">
              <button
                onClick={clear}
                className="col-span-4 py-2 text-xs tracking-widest text-gray-400 uppercase hover:text-gray-700 border-b border-r border-gray-100 hover:bg-gray-50 transition-colors text-left px-2"
              >
                clear
              </button>
              <Btn v="7" /><Btn v="8" /><Btn v="9" />
              <Btn v="÷" onClick={() => chooseOp('÷')} dim />
              <Btn v="4" /><Btn v="5" /><Btn v="6" />
              <Btn v="×" onClick={() => chooseOp('×')} dim />
              <Btn v="1" /><Btn v="2" /><Btn v="3" />
              <Btn v="-" onClick={() => chooseOp('-')} dim />
              <Btn v="0" />
              <Btn v="." onClick={() => { if (!display.includes('.')) setDisplay(display + '.'); }} />
              <Btn v="=" onClick={compute} />
              <Btn v="+" onClick={() => chooseOp('+')} dim />
            </div>
          </div>

          <div className="w-36 flex-shrink-0 pt-2">
            <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">history</h2>
            {history.length === 0 ? (
              <p className="text-gray-300 text-xs">nothing yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {history.map((e, i) => (
                  <li key={i} className="py-2 text-xs text-gray-400 font-mono leading-relaxed">{e}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<Calculator />, document.getElementById('root'));
