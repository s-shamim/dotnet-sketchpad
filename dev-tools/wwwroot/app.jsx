// ─────────────────────────────────────────────────────────
// Shared helpers — defined before ReactDOM.render so all
// globally-loaded component files can call them at render time.
// ─────────────────────────────────────────────────────────

async function api(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function apiGet(url) {
  const res = await fetch(url);
  return res.json();
}

function randomStr(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ── Shared UI primitives ──────────────────────────────────

function Btn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors disabled:opacity-30 lowercase"
    >
      {children}
    </button>
  );
}

function TArea({ value, onChange, placeholder, readOnly, rows = 8 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      rows={rows}
      className="w-full border-b border-gray-200 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 text-sm font-mono resize-none leading-relaxed bg-white"
    />
  );
}

function TwoCol({ left, right }) {
  return (
    <div className="grid grid-cols-2 gap-8 mb-4">
      {left}
      {right}
    </div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = React.useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button onClick={copy} className="text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase">
      {copied ? 'copied!' : 'copy'}
    </button>
  );
}

function ColLabel({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs tracking-widest text-gray-400 uppercase">{children}</h2>
      {action}
    </div>
  );
}

function ErrMsg({ error }) {
  if (!error) return null;
  return <p className="text-red-400 text-xs mt-3">{error}</p>;
}

function PageTitle({ children, sub }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-light tracking-widest text-gray-800 lowercase">{children}</h1>
      {sub && <p className="text-xs text-gray-400 tracking-widest mt-1 lowercase">{sub}</p>}
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────

const TOOLS = [
  {
    category: 'crypto',
    tools: [
      { id: 'aes', label: 'aes', component: AesTool },
    ],
  },
  {
    category: 'converters',
    tools: [
      { id: 'json-yaml',   label: 'json ↔ yaml',      component: JsonYamlTool       },
      { id: 'json-csv',    label: 'json ↔ csv',       component: JsonCsvTool        },
      { id: 'unix-ts',     label: 'unix timestamp',  component: UnixTimestampTool  },
      { id: 'base64',      label: 'base64',           component: Base64Tool         },
      { id: 'number-base', label: 'number base',      component: NumberBaseTool     },
      { id: 'color-code',  label: 'color code',       component: ColorCodeTool      },
    ],
  },
  {
    category: 'encoders',
    tools: [
      { id: 'url',   label: 'url',   component: UrlCodecTool   },
      { id: 'html',  label: 'html',  component: HtmlCodecTool  },
      { id: 'jwt',   label: 'jwt',   component: JwtCodecTool   },
      { id: 'morse', label: 'morse', component: MorseCodeTool  },
    ],
  },
  {
    category: 'formatters',
    tools: [
      { id: 'fmt-json',      label: 'json',              component: JsonFormatterTool   },
      { id: 'fmt-xml',       label: 'xml',               component: XmlFormatterTool   },
      { id: 'fmt-csv',       label: 'csv',               component: CsvFormatterTool   },
      { id: 'fmt-sql',       label: 'sql',               component: SqlFormatterTool   },
      { id: 'json-stringify',label: 'json stringify',    component: JsonStringifyTool  },
    ],
  },
  {
    category: 'validators',
    tools: [
      { id: 'vld-json',        label: 'json',        component: JsonValidatorTool       },
      { id: 'vld-xml',         label: 'xml',         component: XmlValidatorTool        },
      { id: 'vld-regex',       label: 'regex',       component: RegexValidatorTool      },
      { id: 'vld-json-schema', label: 'json schema', component: JsonSchemaValidatorTool },
      { id: 'vld-ip',          label: 'ip address',  component: IpValidatorTool         },
    ],
  },
  {
    category: 'generators',
    tools: [
      { id: 'lorem',     label: 'lorem ipsum',   component: LoremIpsumTool    },
      { id: 'password',  label: 'password',      component: PasswordTool      },
      { id: 'uuid',      label: 'uuid',          component: UuidTool          },
      { id: 'qrcode',    label: 'qr code',       component: QrCodeTool        },
      { id: 'hash',      label: 'hash',          component: HashTool          },
      { id: 'fake-data', label: 'fake data',     component: FakeDataTool      },
      { id: 'jwt-gen',   label: 'jwt generator', component: JwtGeneratorTool  },
    ],
  },
  {
    category: 'text',
    tools: [
      { id: 'word-counter',  label: 'word counter',       component: WordCounterTool       },
      { id: 'case-converter',label: 'case converter',     component: CaseConverterTool     },
      { id: 'str-escape',    label: 'string escape',      component: StringEscapeTool      },
      { id: 'whitespace',    label: 'whitespace remover', component: WhitespaceRemoverTool },
      { id: 'slugify',       label: 'slugify',            component: SlugifyTool           },
    ],
  },
];

// ── App shell ────────────────────────────────────────────

function App() {
  const [active, setActive] = React.useState('aes');
  const allTools = TOOLS.flatMap(c => c.tools);
  const tool = allTools.find(t => t.id === active);

  return (
    <div className="min-h-screen bg-white flex">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-gray-100 pt-10 px-5 pb-10 flex flex-col gap-6 sticky top-0 h-screen overflow-y-auto">

        <div className="mb-2">
          <span className="text-xs tracking-widest text-gray-300 lowercase font-light">dev tools</span>
        </div>

        {TOOLS.map(cat => (
          <div key={cat.category} className="mb-6">
            <div className="text-xs tracking-widest text-gray-400 uppercase mb-2">{cat.category}</div>
            <ul className="space-y-1">
              {cat.tools.map(t => (
                <li key={t.id}>
                  <button
                    onClick={() => setActive(t.id)}
                    className={`block w-full text-left text-sm lowercase py-0.5 transition-colors ${active === t.id ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* </nav> */}
      </aside>

      {/* Main content */}
      <main className="flex-1 pt-10 px-12 pb-16 overflow-y-auto">
        {tool && <tool.component />}
      </main>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
