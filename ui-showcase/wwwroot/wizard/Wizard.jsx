function WizardSection() {
  const [completed, setCompleted] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [key, setKey] = React.useState(0);

  const steps = [
    { label: 'account', component: AccountStep  },
    { label: 'details', component: DetailsStep  },
    { label: 'confirm', component: ConfirmStep  },
  ];

  if (completed) {
    return (
      <div>
        <SectionTitle sub="multi-step form / wizard">wizard</SectionTitle>
        <div className="max-w-sm flex flex-col gap-4">
          <p className="text-sm text-green-600 lowercase">completed successfully.</p>
          <div className="border border-gray-100 p-4">
            <pre className="text-xs text-gray-700 font-mono leading-relaxed">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
          <button
            onClick={() => { setCompleted(false); setResult(null); setKey(k => k + 1); }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase self-start"
          >
            <Icon name="arrow-left" size={12} /> restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle sub="multi-step form / wizard">wizard</SectionTitle>
      <div className="max-w-sm">
        <Wizard
          key={key}
          steps={steps}
          onComplete={(data) => { setResult(data); setCompleted(true); }}
        />
      </div>
    </div>
  );
}

// ── Wizard components ─────────────────────────────────────

function Wizard({ steps, onComplete }) {
  const [current, setCurrent] = React.useState(0);
  const [data, setData] = React.useState({});

  const next = (stepData) => {
    const merged = { ...data, ...stepData };
    setData(merged);
    if (current < steps.length - 1) setCurrent(c => c + 1);
    else onComplete(merged);
  };
  const back = () => setCurrent(c => c - 1);

  return (
    <div>
      {/* step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <span className={`flex items-center gap-1 text-xs lowercase transition-colors ${
              i === current ? 'text-gray-700' : i < current ? 'text-gray-400' : 'text-gray-200'
            }`}>
              {i < current && <Icon name="check" size={10} className="text-gray-400" />}
              {step.label}
            </span>
            {i < steps.length - 1 && <Icon name="arrow-right" size={10} className="text-gray-200" />}
          </React.Fragment>
        ))}
      </div>

      {React.createElement(steps[current].component, {
        onNext: next,
        onBack: back,
        isFirst: current === 0,
        data,
      })}
    </div>
  );
}

function AccountStep({ onNext }) {
  const [email,    setEmail]    = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email address..."
          className="border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password..."
          className="border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent"
        />
      </div>
      <button
        onClick={() => onNext({ email, password })}
        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm transition-colors lowercase self-start"
      >
        next <Icon name="arrow-right" size={12} />
      </button>
    </div>
  );
}

function DetailsStep({ onNext, onBack }) {
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('developer');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="full name..."
          className="border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent"
        />
        <Dropdown
          value={role}
          onChange={setRole}
          width="w-full"
          options={[
            { value: 'developer', label: 'developer' },
            { value: 'designer',  label: 'designer'  },
            { value: 'manager',   label: 'manager'   },
            { value: 'other',     label: 'other'     },
          ]}
        />
      </div>
      <div className="flex gap-4">
        <button onClick={onBack}                className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition-colors lowercase"><Icon name="arrow-left" size={12} /> back</button>
        <button onClick={() => onNext({ name, role })} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm transition-colors lowercase">next <Icon name="arrow-right" size={12} /></button>
      </div>
    </div>
  );
}

function ConfirmStep({ onNext, onBack, data }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="border border-gray-100 p-4 flex flex-col gap-3">
        {[
          { label: 'email',    value: data.email    },
          { label: 'name',     value: data.name     },
          { label: 'role',     value: data.role     },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-gray-400 lowercase">{row.label}</span>
            <span className="text-gray-700">{row.value || '—'}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={onBack}      className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition-colors lowercase"><Icon name="arrow-left" size={12} /> back</button>
        <button onClick={() => onNext({})} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm transition-colors lowercase">create account <Icon name="arrow-right" size={12} /></button>
      </div>
    </div>
  );
}
