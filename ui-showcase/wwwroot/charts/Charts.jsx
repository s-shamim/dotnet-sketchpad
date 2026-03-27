function ChartsSection() {
  // ── Bar chart data ───────────────────────────────────────
  const barData = [
    { label: 'jan', value: 42 },
    { label: 'feb', value: 68 },
    { label: 'mar', value: 55 },
    { label: 'apr', value: 80 },
    { label: 'may', value: 63 },
    { label: 'jun', value: 91 },
    { label: 'jul', value: 74 },
  ];
  const barMax = Math.max(...barData.map(d => d.value));

  // ── Line chart data ─────────────────────────────────────
  const lineData = [12, 28, 22, 45, 38, 60, 52, 75, 68, 84, 72, 95];
  const lineMax  = Math.max(...lineData);
  const lineMin  = Math.min(...lineData);
  const W = 480, H = 120, PAD = 8;
  const normalize = v => H - PAD - ((v - lineMin) / (lineMax - lineMin)) * (H - PAD * 2);
  const points = lineData.map((v, i) => [
    PAD + (i / (lineData.length - 1)) * (W - PAD * 2),
    normalize(v),
  ]);
  const polyline = points.map(([x, y]) => `${x},${y}`).join(' ');
  const area = [
    `M ${points[0][0]},${H - PAD}`,
    ...points.map(([x, y]) => `L ${x},${y}`),
    `L ${points[points.length - 1][0]},${H - PAD}`,
    'Z',
  ].join(' ');

  // ── Donut chart data ────────────────────────────────────
  const donutData = [
    { label: 'api',      value: 45, color: 'var(--gray-700)' },
    { label: 'web',      value: 30, color: 'var(--gray-400)' },
    { label: 'mobile',   value: 15, color: 'var(--gray-200)' },
    { label: 'other',    value: 10, color: 'var(--gray-100)' },
  ];
  const total = donutData.reduce((s, d) => s + d.value, 0);
  const CX = 56, CY = 56, R = 40, INNER = 24;
  let angle = -Math.PI / 2;
  const donutSlices = donutData.map(d => {
    const sweep = (d.value / total) * Math.PI * 2;
    const x1 = CX + R * Math.cos(angle);
    const y1 = CY + R * Math.sin(angle);
    angle += sweep;
    const x2 = CX + R * Math.cos(angle);
    const y2 = CY + R * Math.sin(angle);
    const xi1 = CX + INNER * Math.cos(angle - sweep);
    const yi1 = CY + INNER * Math.sin(angle - sweep);
    const xi2 = CX + INNER * Math.cos(angle);
    const yi2 = CY + INNER * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      ...d,
      path: `M ${xi1} ${yi1} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${INNER} ${INNER} 0 ${large} 0 ${xi1} ${yi1} Z`,
    };
  });

  // ── Sparklines ──────────────────────────────────────────
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

  const sparkSets = [
    { label: 'requests',  data: [20, 35, 28, 45, 38, 52, 47, 60], delta: '+18%', up: true  },
    { label: 'errors',    data: [8,  12, 6,  14, 9,  5,  3,  7 ], delta: '-22%', up: false },
    { label: 'latency',   data: [55, 48, 62, 45, 58, 42, 50, 44], delta: '-6ms', up: false },
    { label: 'uptime',    data: [99, 100, 99, 98, 100, 99, 100, 100], delta: '99.9%', up: true },
  ];

  return (
    <div>
      <SectionTitle sub="bar, line, donut, sparkline — svg, no library">charts</SectionTitle>

      <DemoBlock title="bar chart — vertical">
        <div className="flex items-end gap-2 h-28 max-w-sm">
          {barData.map(d => (
            <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] text-gray-400">{d.value}</span>
              <div
                className="w-full bg-gray-200 rounded-sm transition-all"
                style={{ height: `${(d.value / barMax) * 72}px` }}
              />
              <span className="text-[10px] text-gray-400 lowercase">{d.label}</span>
            </div>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="line chart — area fill">
        <div className="max-w-lg border border-gray-100 bg-gray-50 rounded-sm p-4">
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 120 }}>
            {/* grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(t => (
              <line
                key={t}
                x1={PAD} y1={PAD + t * (H - PAD * 2)}
                x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
                stroke="var(--gray-200)" strokeWidth="0.5"
              />
            ))}
            {/* area fill */}
            <path d={area} fill="var(--gray-200)" fillOpacity="0.5" />
            {/* line */}
            <polyline
              points={polyline}
              fill="none"
              stroke="var(--gray-600)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* data points */}
            {points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2.5" fill="var(--gray-600)" />
            ))}
          </svg>
          <div className="flex justify-between mt-2">
            {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(m => (
              <span key={m} className="text-[10px] text-gray-300">{m}</span>
            ))}
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="donut chart">
        <div className="flex items-center gap-8">
          <svg width={112} height={112}>
            {donutSlices.map((s, i) => (
              <path key={i} d={s.path} fill={s.color} />
            ))}
            <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: 11, fill: 'var(--gray-600)', fontFamily: 'Inter, sans-serif' }}>
              {total}
            </text>
            <text x={CX} y={CY + 14} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: 8, fill: 'var(--gray-400)', fontFamily: 'Inter, sans-serif' }}>
              total
            </text>
          </svg>
          <div className="flex flex-col gap-2">
            {donutData.map(d => (
              <div key={d.label} className="flex items-center gap-2.5 text-xs text-gray-500 lowercase">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                <span className="w-12">{d.label}</span>
                <span className="text-gray-400">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="sparklines — stat cards">
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
