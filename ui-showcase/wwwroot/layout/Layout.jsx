function LayoutSection() {
  return (
    <div>
      <SectionTitle sub="collapsible, labeled divider, card">layout</SectionTitle>

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
