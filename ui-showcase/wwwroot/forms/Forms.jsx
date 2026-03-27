function FormsSection() {
  const [toggleA, setToggleA] = React.useState(false);
  const [toggleB, setToggleB] = React.useState(true);
  const [radio, setRadio] = React.useState('b');
  const [selectVal, setSelectVal] = React.useState('');
  const [kvPairs, setKvPairs] = React.useState([
    { key: 'Authorization', value: 'Bearer token123', enabled: true },
    { key: 'Content-Type',  value: 'application/json', enabled: true },
    { key: 'X-Request-Id',  value: '', enabled: false },
  ]);
  const [cb1, setCb1] = React.useState(false);
  const [cb2, setCb2] = React.useState(true);
  const [searchVal, setSearchVal] = React.useState('');
  const [errorTouched, setErrorTouched] = React.useState(false);
  const [textareaVal, setTextareaVal] = React.useState('');
  const [textareaCopied, setTextareaCopied] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);

  return (
    <div>
      <SectionTitle sub="input, select, toggle, radio, textarea, kv editor, checkbox, search, date picker">forms</SectionTitle>

      <DemoBlock title="text input">
        <div className="flex flex-col gap-5 max-w-sm">
          <input
            placeholder="placeholder text..."
            className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 text-sm bg-transparent focus:outline-none focus:border-gray-500"
          />
          <input
            defaultValue="with a prefilled value"
            className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 text-sm bg-transparent focus:outline-none focus:border-gray-500"
          />
          <div>
            <input
              placeholder="required — blur to trigger validation..."
              className={`w-full border-b py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-transparent ${
                errorTouched ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-gray-500'
              }`}
              onBlur={() => setErrorTouched(true)}
            />
            {errorTouched && (
              <p className="text-xs text-red-500 mt-1 lowercase">this field is required.</p>
            )}
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="select / dropdown">
        <Dropdown
          value={selectVal}
          onChange={setSelectVal}
          placeholder="select an option"
          width="w-48"
          options={[
            { value: 'get',    label: 'GET'    },
            { value: 'post',   label: 'POST'   },
            { value: 'put',    label: 'PUT'    },
            { value: 'delete', label: 'DELETE' },
          ]}
        />
      </DemoBlock>

      <DemoBlock title="toggle / switch">
        <div className="flex flex-col gap-5">
          <Toggle checked={toggleA} onChange={setToggleA} label="enable notifications" />
          <Toggle checked={toggleB} onChange={setToggleB} label="dark mode" />
          <Toggle checked={false} onChange={() => {}} />
        </div>
      </DemoBlock>

      <DemoBlock title="radio group">
        <RadioGroup
          name="demo-radio"
          value={radio}
          onChange={setRadio}
          options={[
            { value: 'a', label: 'option a' },
            { value: 'b', label: 'option b' },
            { value: 'c', label: 'option c' },
          ]}
        />
      </DemoBlock>

      <DemoBlock title="textarea — with shoulder actions">
        <div className="max-w-sm">
          <div className="flex items-center justify-end gap-2 mb-1">
            <button
              onClick={() => {
                navigator.clipboard.writeText(textareaVal);
                setTextareaCopied(true);
                setTimeout(() => setTextareaCopied(false), 1500);
              }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
            >
              <Icon name="copy" size={12} className="" />
              {textareaCopied ? 'copied' : 'copy'}
            </button>
            <button
              onClick={() => setTextareaVal('')}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
            >
              <Icon name="x" size={12} className="" /> clear
            </button>
          </div>
          <textarea
            rows={4}
            value={textareaVal}
            onChange={e => setTextareaVal(e.target.value)}
            placeholder="paste or type here..."
            className="w-full border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 text-sm bg-transparent resize-none focus:outline-none focus:border-gray-500"
          />
        </div>
      </DemoBlock>

      <DemoBlock title="date picker">
        <div className="max-w-xs">
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
          {selectedDate && (
            <p className="text-xs text-gray-400 mt-2 lowercase">
              selected: {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
      </DemoBlock>

      <DemoBlock title="key-value pair editor">
        <KVEditor pairs={kvPairs} onChange={setKvPairs} />
      </DemoBlock>

      <DemoBlock title="checkbox">
        <div className="flex flex-col gap-3">
          <Checkbox checked={cb1} onChange={setCb1} label="unchecked by default" />
          <Checkbox checked={cb2} onChange={setCb2} label="checked by default" />
          <Checkbox checked={false} onChange={() => {}} label="disabled unchecked" disabled />
          <Checkbox checked={true}  onChange={() => {}} label="disabled checked"   disabled />
        </div>
      </DemoBlock>

      <DemoBlock title="search input">
        <div className="max-w-sm">
          <SearchInput value={searchVal} onChange={setSearchVal} placeholder="search anything..." />
        </div>
      </DemoBlock>

      <DemoBlock title="states — disabled, read-only, focus ring">
        <div className="flex flex-col gap-5 max-w-sm">
          <div>
            <input
              disabled
              defaultValue="disabled input"
              className="w-full border-b border-gray-200 py-2 text-gray-300 text-sm bg-transparent cursor-not-allowed focus:outline-none"
            />
            <p className="text-[10px] text-gray-300 mt-1 lowercase">disabled — cursor-not-allowed, text-gray-300, border-gray-200</p>
          </div>
          <div>
            <input
              readOnly
              defaultValue="read-only value"
              className="w-full border-b border-gray-200 py-2 text-gray-400 text-sm bg-transparent cursor-default focus:outline-none"
            />
            <p className="text-[10px] text-gray-300 mt-1 lowercase">read-only — cursor-default, text-gray-400</p>
          </div>
          <div>
            <button
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1"
            >
              tab here to see focus ring
            </button>
            <p className="text-[10px] text-gray-300 mt-1 lowercase">focus-visible — ring-1 ring-gray-400 ring-offset-1</p>
          </div>
          <div>
            <button
              disabled
              className="text-sm text-gray-300 border border-gray-100 px-3 py-1.5 rounded-sm cursor-not-allowed lowercase"
            >
              disabled button
            </button>
            <p className="text-[10px] text-gray-300 mt-1 lowercase">disabled button — text-gray-300, border-gray-100</p>
          </div>
        </div>
      </DemoBlock>
    </div>
  );
}

// ── Form components ───────────────────────────────────────

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-colors ${
          checked ? 'bg-gray-600' : 'bg-gray-200'
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`} style={{ backgroundColor: 'var(--toggle-thumb)' }} />
      </button>
      {label && (
        <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors lowercase">
          {label}
        </span>
      )}
    </label>
  );
}

function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-gray-500 w-3.5 h-3.5 cursor-pointer"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors lowercase">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function KVEditor({ pairs, onChange }) {
  const update = (i, field, val) => {
    const next = pairs.map((p, idx) => idx === i ? { ...p, [field]: val } : p);
    onChange(next);
  };
  const add = () => onChange([...pairs, { key: '', value: '', enabled: true }]);
  const remove = (i) => onChange(pairs.filter((_, idx) => idx !== i));

  return (
    <div className="divide-y divide-gray-100">
      {pairs.map((pair, i) => (
        <div key={i} className="flex items-center gap-2 py-2 group">
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={e => update(i, 'enabled', e.target.checked)}
            className="accent-gray-400 w-3.5 h-3.5 cursor-pointer flex-shrink-0"
          />
          <input
            value={pair.key}
            onChange={e => update(i, 'key', e.target.value)}
            placeholder="key"
            className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent"
          />
          <input
            value={pair.value}
            onChange={e => update(i, 'value', e.target.value)}
            placeholder="value"
            className="flex-1 border-b border-gray-200 py-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 bg-transparent"
          />
          <button
            onClick={() => remove(i)}
            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex items-center"
          ><Icon name="x" size={12} className="" /></button>
        </div>
      ))}
      <button
        onClick={add}
        className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors lowercase"
      >
        <Icon name="plus" size={12} /> add row
      </button>
    </div>
  );
}

function Checkbox({ checked, onChange, label, disabled = false }) {
  return (
    <label className={`flex items-center gap-2.5 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        className="accent-gray-500 w-3.5 h-3.5 cursor-pointer"
      />
      {label && (
        <span className="text-sm text-gray-600 lowercase">{label}</span>
      )}
    </label>
  );
}

function SearchInput({ value, onChange, placeholder = 'search...', width = 'w-full' }) {
  return (
    <div className={`relative flex items-center ${width}`}>
      <Icon name="magnifying-glass" size={14} className="absolute left-0 text-gray-300 pointer-events-none" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-gray-300 py-2 pl-5 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none focus:border-gray-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-0 text-gray-300 hover:text-gray-500 transition-colors flex items-center"
        >
          <Icon name="x" size={12} className="" />
        </button>
      )}
    </div>
  );
}

function DatePicker({ value, onChange }) {
  const today = new Date();
  const [view, setView] = React.useState({ year: today.getFullYear(), month: today.getMonth() });
  const [open, setOpen] = React.useState(false);
  const ref  = React.useRef(null);

  React.useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  const firstDay  = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

  function prevMonth() {
    setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  }
  function nextMonth() {
    setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  }
  function select(day) {
    onChange(new Date(view.year, view.month, day));
    setOpen(false);
  }
  function isSelected(day) {
    return value &&
      value.getFullYear() === view.year &&
      value.getMonth()    === view.month &&
      value.getDate()     === day;
  }
  function isToday(day) {
    return today.getFullYear() === view.year &&
           today.getMonth()    === view.month &&
           today.getDate()     === day;
  }

  const displayLabel = value
    ? `${MONTHS[value.getMonth()]} ${value.getDate()}, ${value.getFullYear()}`
    : 'select a date...';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full border-b border-gray-300 py-2 text-sm text-left hover:border-gray-500 transition-colors focus:outline-none"
      >
        <span className={value ? 'text-gray-700' : 'text-gray-300'}>{displayLabel}</span>
        <Icon name="calendar" size={14} className="text-gray-300" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-sm z-20 p-3 w-56">
          {/* header */}
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="caret-left" size={12} className="" />
            </button>
            <span className="text-xs text-gray-600 lowercase">{MONTHS[view.month]} {view.year}</span>
            <button onClick={nextMonth} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="caret-right" size={12} className="" />
            </button>
          </div>
          {/* weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <span key={d} className="text-center text-[10px] text-gray-300 uppercase">{d}</span>
            ))}
          </div>
          {/* days grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              return (
                <button
                  key={day}
                  onClick={() => select(day)}
                  className={`text-xs py-1 rounded-sm transition-colors ${
                    isSelected(day)
                      ? 'bg-gray-700 text-white'
                      : isToday(day)
                        ? 'text-gray-700 underline'
                        : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
