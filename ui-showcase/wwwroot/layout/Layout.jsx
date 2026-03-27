function LayoutSection() {
  const [expandedGroup, setExpandedGroup] = React.useState(null);

  return (
    <div>
      <SectionTitle sub="collapsible, divider, card, field group, panel, list group, split pane, inline group">layout</SectionTitle>

      <DemoBlock title="collapsible / accordion">
        <div className="max-w-sm">
          <Collapsible title="general settings" defaultOpen={true}>
            <p className="text-gray-500 text-sm">configure default behavior, language preferences, and timezone settings for your account.</p>
          </Collapsible>
          <Collapsible title="notifications">
            <p className="text-gray-500 text-sm">manage email, push, and in-app notification preferences.</p>
          </Collapsible>
          <Collapsible title="security & privacy">
            <p className="text-gray-500 text-sm">two-factor authentication, active sessions, connected apps, and data export.</p>
          </Collapsible>
          <Collapsible title="billing">
            <p className="text-gray-500 text-sm">current plan, payment methods, and invoice history.</p>
          </Collapsible>
        </div>
      </DemoBlock>

      <DemoBlock title="labeled divider">
        <div className="max-w-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 lowercase">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 lowercase">continue with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 lowercase">section break</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="cards — minimal, square, border only">
        <div className="grid grid-cols-2 gap-3 max-w-xl">
          {[
            { title: 'requests',  meta: '1,204',  detail: 'total api calls this month'  },
            { title: 'errors',    meta: '12',     detail: '0.99% error rate'             },
            { title: 'latency',   meta: '87ms',   detail: 'avg. response time'           },
            { title: 'uptime',    meta: '99.9%',  detail: 'last 30 days'                 },
          ].map(card => (
            <div key={card.title} className="border border-gray-100 rounded-sm p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-700 lowercase">{card.title}</p>
                <span className="text-xs text-gray-400">{card.meta}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 lowercase">{card.detail}</p>
            </div>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="field group — labeled sections">
        <div className="max-w-sm flex flex-col gap-6">
          <div>
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">account</p>
            <div className="flex flex-col gap-4">
              <input placeholder="display name..." className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500" />
              <input placeholder="email address..." className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500" />
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">preferences</p>
            <div className="flex flex-col gap-4">
              <input placeholder="timezone..." className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500" />
              <input placeholder="language..." className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500" />
            </div>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="panel — bordered content block">
        <div className="max-w-sm flex flex-col gap-3">
          {/* info panel */}
          <div className="border border-gray-100 rounded-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-xs text-gray-700 lowercase">api key</span>
              <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase flex items-center gap-1">
                <Icon name="copy" size={12} className="" /> copy
              </button>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs font-mono text-gray-500 break-all">sk-proj-abc123xyz789·····</p>
            </div>
          </div>
          {/* stat panel */}
          <div className="border border-gray-100 rounded-sm divide-y divide-gray-100">
            {[
              { label: 'plan',    value: 'pro'          },
              { label: 'seats',   value: '5 / 10'       },
              { label: 'renewal', value: 'apr 15, 2027' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-gray-400 lowercase">{row.label}</span>
                <span className="text-gray-700">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="list group — bordered item list">
        <div className="max-w-sm border border-gray-100 rounded-sm divide-y divide-gray-100">
          {[
            { icon: 'user',        label: 'profile',      meta: 'jane smith'  },
            { icon: 'bell',        label: 'notifications', meta: '3 unread'   },
            { icon: 'shield',      label: 'security',      meta: '2fa active' },
            { icon: 'credit-card', label: 'billing',       meta: 'pro plan'   },
          ].map(item => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <Icon name={item.icon} size={14} className="text-gray-400 group-hover:text-gray-500 transition-colors" />
                <span className="text-sm text-gray-600 lowercase">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 lowercase">{item.meta}</span>
                <Icon name="caret-right" size={10} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="split pane layout">
        <div className="flex border border-gray-100 rounded-sm overflow-hidden max-w-lg h-48">
          {/* left nav pane */}
          <div className="w-36 shrink-0 border-r border-gray-100 flex flex-col divide-y divide-gray-100 bg-gray-50">
            {['general', 'editor', 'terminal', 'extensions'].map(item => (
              <button
                key={item}
                onClick={() => setExpandedGroup(item)}
                className={`px-3 py-2.5 text-xs text-left transition-colors lowercase ${
                  expandedGroup === item ? 'text-gray-800 bg-gray-100 font-medium' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {/* right content pane */}
          <div className="flex-1 flex items-center justify-center">
            {expandedGroup
              ? <p className="text-sm text-gray-500 lowercase">{expandedGroup} settings</p>
              : <p className="text-xs text-gray-300 lowercase">select a section →</p>
            }
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="inline group — horizontally connected inputs">
        <div className="max-w-sm flex flex-col gap-4">
          {/* input group with prefix */}
          <div className="flex items-center border-b border-gray-300 focus-within:border-gray-500">
            <span className="text-sm text-gray-400 pr-2 shrink-0">https://</span>
            <input
              placeholder="your-domain.com"
              className="flex-1 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none"
            />
          </div>
          {/* input group with suffix */}
          <div className="flex items-center border-b border-gray-300 focus-within:border-gray-500">
            <input
              placeholder="amount"
              className="flex-1 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none"
            />
            <span className="text-sm text-gray-400 pl-2 shrink-0">USD</span>
          </div>
          {/* inline number range */}
          <div className="flex items-center gap-2">
            <input placeholder="min" className="w-24 border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500 text-center" />
            <span className="text-xs text-gray-300">—</span>
            <input placeholder="max" className="w-24 border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500 text-center" />
          </div>
        </div>
      </DemoBlock>
    </div>
  );
}

// ── Layout components ─────────────────────────────────────

function Collapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors lowercase"
      >
        <span>{title}</span>
        <span className={`text-gray-400 transition-transform inline-flex ${open ? 'rotate-180' : ''}`}><Icon name="caret-down" size={12} /></span>
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
}
