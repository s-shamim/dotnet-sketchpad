// ─────────────────────────────────────────────────────────
// Shared primitives — defined before ReactDOM.createRoot so
// all globally-loaded section files can call them at render time.
// ─────────────────────────────────────────────────────────

function Icon({ name, size = 14, className = "text-gray-400" }) {
  return (
    <i className={`ph-light ph-${name} ${className}`} style={{ fontSize: size }} />
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-light tracking-widest text-gray-800 lowercase">{children}</h1>
      {sub && <p className="text-xs text-gray-400 tracking-widest mt-1 lowercase">{sub}</p>}
    </div>
  );
}

function DemoBlock({ title, children }) {
  return (
    <div className="mb-10">
      <h3 className="text-xs tracking-widest text-gray-400 uppercase mb-4 pb-2 border-b border-gray-100">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// ── Shared Dropdown ─────────────────────────────────────────

function Dropdown({ value, onChange, options, placeholder = 'select...', width = 'w-48' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = options.find(o => (o.value ?? o) === value);
  const label = selected ? (selected.label ?? selected) : placeholder;

  return (
    <div className={`relative ${width}`} ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
      >
        <span className={`lowercase ${!value ? 'text-gray-400' : ''}`}>{label}</span>
        <Icon name="caret-down" size={12} className={`text-gray-400 transition-transform ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full border border-gray-200 bg-white shadow-sm rounded-sm z-20">
          {options.map(opt => {
            const v = opt.value ?? opt;
            const l = opt.label  ?? opt;
            return (
              <button
                key={v}
                onClick={() => { onChange(v); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors lowercase ${
                  value === v
                    ? 'text-gray-800 bg-gray-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Sections registry ─────────────────────────────────────

const SECTIONS = [
  { id: 'typography', label: 'typography',    component: TypographySection  },
  { id: 'icons',      label: 'icons',          component: IconsSection        },
  { id: 'buttons',    label: 'buttons',        component: ButtonsSection      },
  { id: 'forms',      label: 'forms',          component: FormsSection        },
  { id: 'navigation', label: 'navigation',     component: NavigationSection   },
  { id: 'feedback',   label: 'feedback',       component: FeedbackSection     },
  { id: 'overlays',   label: 'overlays',       component: OverlaysSection     },
  { id: 'data',       label: 'data display',   component: DataSection         },
  { id: 'charts',     label: 'charts',         component: ChartsSection       },
  { id: 'layout',     label: 'layout',         component: LayoutSection       },
  { id: 'media',      label: 'media',          component: MediaSection        },
  { id: 'actions',    label: 'actions',        component: ActionsSection      },
  { id: 'wizard',     label: 'wizard',         component: WizardSection       },
];

// ── App shell ─────────────────────────────────────────────

function App() {
  const [active, setActive] = React.useState('typography');
  const [theme, setTheme]   = React.useState(() => localStorage.getItem('ui-theme') || 'zinc');
  const [mode,  setMode]    = React.useState(() => localStorage.getItem('ui-mode')  || 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${theme}-${mode}`);
    localStorage.setItem('ui-theme', theme);
    localStorage.setItem('ui-mode',  mode);
  }, [theme, mode]);

  const section = SECTIONS.find(s => s.id === active);

  return (
    <div className="min-h-screen bg-white flex">

      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-gray-100 pt-10 px-5 pb-6 flex flex-col sticky top-0 h-screen">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-5">ui showcase</p>

        {/* Theme controls */}
        <div className="flex flex-col gap-3 mb-6 pb-5 border-b border-gray-100">
          <Dropdown
            value={theme}
            onChange={setTheme}
            width="w-full"
            options={[
              { value: 'zinc',     label: 'zinc'     },
              { value: 'arctic',   label: 'arctic'   },
              { value: 'stone',    label: 'stone'    },
              { value: 'hc',       label: 'contrast' },
              { value: 'navy',     label: 'navy'     },
              { value: 'oxblood',  label: 'oxblood'  },
              { value: 'racing',   label: 'racing'   },
              { value: 'fuchsia',  label: 'fuchsia'  },
              { value: 'amber',    label: 'amber'    },
              { value: 'teal',     label: 'teal'     },
              { value: 'crimson',  label: 'crimson'  },
              { value: 'peach',    label: 'peach'    },
              { value: 'sky',      label: 'sky'      },
              { value: 'sage',     label: 'sage'     },
              { value: 'lavender', label: 'lavender' },
              { value: 'sand',     label: 'sand'     },
            ]}
          />
          <Toggle
            checked={mode === 'dark'}
            onChange={v => setMode(v ? 'dark' : 'light')}
            label="dark mode"
          />
        </div>

        <SidebarNav
          items={SECTIONS.map(s => ({ id: s.id, label: s.label }))}
          active={active}
          onChange={setActive}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 px-12 py-10 max-w-3xl">
        {section && React.createElement(section.component)}
      </main>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
