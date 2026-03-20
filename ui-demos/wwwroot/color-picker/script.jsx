function ColorPicker() {
  const [red, setRed] = React.useState(100);
  const [green, setGreen] = React.useState(150);
  const [blue, setBlue] = React.useState(200);
  const [copied, setCopied] = React.useState(null);

  const hex = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  const rgb = `rgb(${red}, ${green}, ${blue})`;

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const Slider = ({ label, value, onChange }) => (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs tracking-widest text-gray-400 uppercase">{label}</span>
        <span className="text-xs text-gray-400">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="255"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gray-400 cursor-pointer"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          color picker
        </h1>

        <div
          className="w-full h-32 border border-gray-200 mb-8 transition-colors duration-150"
          style={{ backgroundColor: rgb }}
        />

        <div className="space-y-5 mb-8">
          <Slider label="red"   value={red}   onChange={setRed} />
          <Slider label="green" value={green} onChange={setGreen} />
          <Slider label="blue"  value={blue}  onChange={setBlue} />
        </div>

        <ul className="divide-y divide-gray-100">
          <li className="flex items-center justify-between py-3">
            <span className="text-xs tracking-widest text-gray-400 uppercase">hex</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-gray-700">{hex}</span>
              <button
                onClick={() => copy(hex, 'hex')}
                className="text-gray-400 hover:text-gray-700 text-xs transition-colors"
              >
                {copied === 'hex' ? 'copied' : 'copy'}
              </button>
            </div>
          </li>
          <li className="flex items-center justify-between py-3">
            <span className="text-xs tracking-widest text-gray-400 uppercase">rgb</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-gray-700">{rgb}</span>
              <button
                onClick={() => copy(rgb, 'rgb')}
                className="text-gray-400 hover:text-gray-700 text-xs transition-colors"
              >
                {copied === 'rgb' ? 'copied' : 'copy'}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

ReactDOM.render(<ColorPicker />, document.getElementById('root'));