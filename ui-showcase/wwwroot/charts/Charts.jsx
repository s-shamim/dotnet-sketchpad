function ChartsSection() {
  // ── Bar chart ─────────────────────────────────────────────
  const barLabels = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul'];
  const [barValues, setBarValues] = React.useState([42, 68, 55, 80, 63, 91, 74]);
  const barMax = Math.max(...barValues);
  const updateBar = (i, v) => setBarValues(prev => prev.map((x, idx) => idx === i ? v : x));
  const randomizeBar = () => setBarValues(barLabels.map(() => Math.floor(Math.random() * 85) + 10));

  // ── Line chart ────────────────────────────────────────────
  const baseLineData = [12, 28, 22, 45, 38, 60, 52, 75, 68, 84, 72, 95];
  const allMonths    = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const [lineCount, setLineCount] = React.useState(12);
  const lineData = baseLineData.slice(0, lineCount);
  const lineMax  = Math.max(...lineData);
  const lineMin  = Math.min(...lineData);
  const W = 480, H = 120, PAD = 8;
  const normalize = v => H - PAD - ((v - lineMin) / ((lineMax - lineMin) || 1)) * (H - PAD * 2);
  const points = lineData.map((v, i) => [
    PAD + (i / Math.max(lineData.length - 1, 1)) * (W - PAD * 2),
    normalize(v),
  ]);
  const polyline = points.map(([x, y]) => `${x},${y}`).join(' ');
  const area = [
    `M ${points[0][0]},${H - PAD}`,
    ...points.map(([x, y]) => `L ${x},${y}`),
    `L ${points[points.length - 1][0]},${H - PAD}`,
    'Z',
  ].join(' ');

  // ── Donut chart ───────────────────────────────────────────
  const donutMeta = [
    { label: 'api',    color: 'var(--gray-700)' },
    { label: 'web',    color: 'var(--gray-400)' },
    { label: 'mobile', color: 'var(--gray-200)' },
    { label: 'other',  color: 'var(--gray-100)' },
  ];
  const [donutValues, setDonutValues] = React.useState([45, 30, 15, 10]);
  const donutTotal = donutValues.reduce((s, v) => s + v, 0);
  const adjustDonut = (idx, delta) =>
    setDonutValues(prev => prev.map((v, i) => i === idx ? Math.max(5, Math.min(80, v + delta)) : v));

  const CX = 56, CY = 56, R = 40, INNER = 24;
  const donutSlices = (() => {
    let a = -Math.PI / 2;
    return donutMeta.map((d, i) => {
      const sweep = (donutValues[i] / donutTotal) * Math.PI * 2;
      const x1  = CX + R     * Math.cos(a);
      const y1  = CY + R     * Math.sin(a);
      a += sweep;
      const x2  = CX + R     * Math.cos(a);
      const y2  = CY + R     * Math.sin(a);
      const xi1 = CX + INNER * Math.cos(a - sweep);
      const yi1 = CY + INNER * Math.sin(a - sweep);
      const xi2 = CX + INNER * Math.cos(a);
      const yi2 = CY + INNER * Math.sin(a);
      const large = sweep > Math.PI ? 1 : 0;
      return {
        ...d,
        value: donutValues[i],
        path: `M ${xi1} ${yi1} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${INNER} ${INNER} 0 ${large} 0 ${xi1} ${yi1} Z`,
      };
    });
  })();

  // ── Sparklines ────────────────────────────────────────────
  const [live, setLive] = React.useState(false);
  const [sparkSets, setSparkSets] = React.useState([
    { label: 'requests', data: [20, 35, 28, 45, 38, 52, 47, 60], delta: '+18%', up: true  },
    { label: 'errors',   data: [8,  12, 6,  14, 9,  5,  3,  7 ], delta: '-22%', up: false },
    { label: 'latency',  data: [55, 48, 62, 45, 58, 42, 50, 44], delta: '-6ms', up: false },
    { label: 'uptime',   data: [99, 100, 99, 98, 100, 99, 100, 100], delta: '99.9%', up: true },
  ]);
  React.useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setSparkSets(prev => prev.map(s => {
        const last = s.data[s.data.length - 1];
        const next = Math.max(0, Math.min(100, last + Math.round((Math.random() - 0.45) * 12)));
        const newData = [...s.data.slice(1), next];
        const first = newData[0];
        const pct = first === 0 ? 0 : Math.round((next - first) / first * 100);
        const up = next >= last;
        return { ...s, data: newData, delta: `${up ? '+' : ''}${pct}%`, up };
      }));
    }, 800);
    return () => clearInterval(id);
  }, [live]);

  return (
    <div>
      <SectionTitle sub="bar, line, donut, sparkline — svg, no library">charts</SectionTitle>

      {/* ── Bar chart ── */}
      <DemoBlock title="bar chart — vertical">
        <div className="flex items-end gap-2 h-28 max-w-sm">
          {barValues.map((v, i) => (
            <div key={barLabels[i]} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] text-gray-400">{v}</span>
              <div
                className="w-full bg-gray-200 rounded-sm transition-all duration-150"
                style={{ height: `${(v / barMax) * 72}px` }}
              />
              <span className="text-[10px] text-gray-400 lowercase">{barLabels[i]}</span>
            </div>
          ))}
        </div>
        {/* vertical sliders aligned to each bar */}
        <div className="mt-3 flex gap-2 max-w-sm items-center">
          {barValues.map((v, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <input
                type="range" min="5" max="100" value={v}
                onChange={e => updateBar(i, Number(e.target.value))}
                style={{ writingMode: 'vertical-lr', direction: 'rtl', height: 56, width: 4, accentColor: 'var(--gray-400)' }}
                className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
          <button
            onClick={randomizeBar}
            className="ml-3 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase shrink-0"
          >
            <Icon name="shuffle" size={12} /> shuffle
          </button>
        </div>
      </DemoBlock>

      {/* ── Line chart ── */}
      <DemoBlock title="line chart — area fill">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-gray-400 lowercase shrink-0">
            data points: <span className="font-mono text-gray-600">{lineCount}</span>
          </span>
          <input
            type="range" min="4" max="12" value={lineCount}
            onChange={e => setLineCount(Number(e.target.value))}
            style={{ accentColor: 'var(--gray-400)', height: 2 }}
            className="cursor-pointer w-32 opacity-60 hover:opacity-100 transition-opacity"
          />
        </div>
        <div className="max-w-lg border border-gray-100 bg-gray-50 rounded-sm p-4">
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 120 }}>
            {[0, 0.25, 0.5, 0.75, 1].map(t => (
              <line
                key={t}
                x1={PAD} y1={PAD + t * (H - PAD * 2)}
                x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
                stroke="var(--gray-200)" strokeWidth="0.5"
              />
            ))}
            <path d={area} fill="var(--gray-200)" fillOpacity="0.5" />
            <polyline
              points={polyline}
              fill="none"
              stroke="var(--gray-600)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2.5" fill="var(--gray-600)" />
            ))}
          </svg>
          <div className="flex justify-between mt-2">
            {allMonths.slice(0, lineCount).map(m => (
              <span key={m} className="text-[10px] text-gray-300">{m}</span>
            ))}
          </div>
        </div>
      </DemoBlock>

      {/* ── Donut chart ── */}
      <DemoBlock title="donut chart">
        <div className="flex items-center gap-8">
          <svg width={112} height={112}>
            {donutSlices.map((s, i) => (
              <path key={i} d={s.path} fill={s.color} />
            ))}
            <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: 11, fill: 'var(--gray-600)', fontFamily: 'Inter, sans-serif' }}>
              {donutTotal}
            </text>
            <text x={CX} y={CY + 14} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: 8, fill: 'var(--gray-400)', fontFamily: 'Inter, sans-serif' }}>
              total
            </text>
          </svg>
          <div className="flex flex-col gap-2.5">
            {donutMeta.map((d, i) => (
              <div key={d.label} className="flex items-center gap-2 text-xs text-gray-500 lowercase">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                <span className="w-12">{d.label}</span>
                <button
                  onClick={() => adjustDonut(i, -5)}
                  disabled={donutValues[i] <= 5}
                  className="text-gray-300 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed w-4 text-center"
                >−</button>
                <span className="text-gray-500 w-6 text-right tabular-nums">{donutValues[i]}</span>
                <button
                  onClick={() => adjustDonut(i, +5)}
                  disabled={donutValues[i] >= 80}
                  className="text-gray-300 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed w-4 text-center"
                >+</button>
              </div>
            ))}
          </div>
        </div>
      </DemoBlock>

      {/* ── Sparklines ── */}
      <DemoBlock title="sparklines — stat cards">
        <div className="flex items-center gap-3 mb-3">
          <Toggle checked={live} onChange={setLive} label="simulate live data" />
          {live && <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />}
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-lg">
          {sparkSets.map(s => (
            <div key={s.label} className="border border-gray-100 rounded-sm p-3 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{s.label}</span>
                <span className={`text-xs font-mono ${s.up ? 'text-green-600' : 'text-red-500'}`}>{s.delta}</span>
              </div>
              <Sparkline data={s.data} color={s.up ? 'var(--gray-500)' : 'var(--gray-400)'} />
            </div>
          ))}
        </div>
      </DemoBlock>
    </div>
  );
}

// ── Charts components ──────────────────────────────────────

function Sparkline({ data, color = 'var(--gray-500)', height = 32, width = 80 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const py = v => height - 2 - ((v - min) / ((max - min) || 1)) * (height - 4);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${py(v)}`).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
