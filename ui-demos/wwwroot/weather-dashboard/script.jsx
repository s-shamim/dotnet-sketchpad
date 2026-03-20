const { useState } = React;

const CITIES = {
  'san francisco': { temp: 18, condition: 'cloudy',        humidity: 65, wind: 12 },
  'new york':      { temp: 22, condition: 'sunny',         humidity: 55, wind: 8  },
  'london':        { temp: 12, condition: 'rainy',         humidity: 80, wind: 15 },
  'tokyo':         { temp: 25, condition: 'clear',         humidity: 60, wind: 10 },
  'sydney':        { temp: 20, condition: 'partly cloudy', humidity: 70, wind: 14 },
};

const FORECAST = [
  { day: 'mon', high: 20, low: 15 },
  { day: 'tue', high: 22, low: 16 },
  { day: 'wed', high: 19, low: 14 },
  { day: 'thu', high: 21, low: 15 },
  { day: 'fri', high: 23, low: 17 },
];

function toF(c) { return Math.round(c * 9 / 5 + 32); }

function WeatherDashboard() {
  const [city, setCity] = useState('san francisco');
  const [unit, setUnit] = useState('C');

  const current = CITIES[city];
  const display = t => unit === 'F' ? toF(t) : t;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4 pb-16">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">weather</h1>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 pb-6 border-b border-gray-100">
          {Object.keys(CITIES).map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`text-sm transition-colors lowercase ${city === c ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-6xl font-light text-gray-700 tabular-nums mb-1">
                {display(current.temp)}°{unit}
              </div>
              <div className="text-sm text-gray-400 lowercase">{current.condition}</div>
            </div>
            <div className="flex gap-3">
              {['C', 'F'].map(u => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`text-sm transition-colors ${unit === u ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  °{u}
                </button>
              ))}
            </div>
          </div>

          <ul className="divide-y divide-gray-100">
            <li className="flex justify-between py-3">
              <span className="text-xs tracking-widest text-gray-400 uppercase">humidity</span>
              <span className="text-sm text-gray-700">{current.humidity}%</span>
            </li>
            <li className="flex justify-between py-3">
              <span className="text-xs tracking-widest text-gray-400 uppercase">wind</span>
              <span className="text-sm text-gray-700">{current.wind} km/h</span>
            </li>
            <li className="flex justify-between py-3">
              <span className="text-xs tracking-widest text-gray-400 uppercase">feels like</span>
              <span className="text-sm text-gray-700">{display(current.temp - 2)}°{unit}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">5-day forecast</h2>
          <ul className="divide-y divide-gray-100">
            {FORECAST.map(day => (
              <li key={day.day} className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-400 w-10 lowercase">{day.day}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-700">{display(day.high)}°</span>
                  <span className="text-gray-300">{display(day.low)}°</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<WeatherDashboard />, document.getElementById('root'));
