function NavigationSection() {
  const [activeTab, setActiveTab] = React.useState('params');
  const [activeSideNav, setActiveSideNav] = React.useState('general');

  return (
    <div>
      <SectionTitle sub="tabs, breadcrumbs, sidebar nav">navigation</SectionTitle>

      <DemoBlock title="tabs">
        <Tabs
          tabs={[
            { id: 'params',  label: 'params'  },
            { id: 'headers', label: 'headers' },
            { id: 'body',    label: 'body'    },
            { id: 'auth',    label: 'auth'    },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
        <div className="pt-4 text-sm text-gray-400 lowercase">active: {activeTab}</div>
      </DemoBlock>

      <DemoBlock title="breadcrumbs">
        <div className="flex flex-col gap-4">
          <Breadcrumbs crumbs={[
            { label: 'home',     href: '#' },
            { label: 'settings', href: '#' },
            { label: 'profile' },
          ]} />
          <Breadcrumbs crumbs={[
            { label: 'docs',       href: '#' },
            { label: 'components', href: '#' },
            { label: 'navigation', href: '#' },
            { label: 'breadcrumbs' },
          ]} />
        </div>
      </DemoBlock>

      <DemoBlock title="sidebar nav (embedded demo)">
        <div className="flex gap-8 border border-gray-100 p-5">
          <SidebarNav
            items={[
              { id: 'general',       label: 'general'       },
              { id: 'appearance',    label: 'appearance'    },
              { id: 'security',      label: 'security'      },
              { id: 'notifications', label: 'notifications' },
              { id: 'billing',       label: 'billing'       },
            ]}
            active={activeSideNav}
            onChange={setActiveSideNav}
          />
          <div className="text-sm text-gray-400 pt-1.5 lowercase">
            active section: <span className="text-gray-600">{activeSideNav}</span>
          </div>
        </div>
      </DemoBlock>
    </div>
  );
}

// ── Navigation components ──────────────────────────────────
// Note: SidebarNav is defined in shared.jsx (used by app shell too).

function Tabs({ tabs, active, onChange }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-gray-100">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-xs tracking-wide lowercase transition-colors border-b-2 -mb-px ${
            active === tab.id
              ? 'border-gray-700 text-gray-700'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function Breadcrumbs({ crumbs }) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-gray-400">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.label}>
          {i > 0 && <Icon name="caret-right" size={10} className="text-gray-300" />}
          {crumb.href
            ? <a href={crumb.href} className="hover:text-gray-600 transition-colors lowercase">{crumb.label}</a>
            : <span aria-current="page" className="text-gray-600 lowercase">{crumb.label}</span>
          }
        </React.Fragment>
      ))}
    </nav>
  );
}

