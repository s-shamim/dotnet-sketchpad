// ScriptEditor.jsx — textarea with trigger-based autocomplete dropdown for DSL scripting

window.ScriptEditor = function ScriptEditor({ value, onChange, placeholder, environments }) {
  const textareaRef = React.useRef(null);
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [triggerPos, setTriggerPos] = React.useState(null);
  const [dropdownPos, setDropdownPos] = React.useState(null);

  // Static DSL keywords
  const KEYWORDS = [
    // Assertions
    { label: 'status', detail: 'response status code', insert: 'status ' },
    { label: 'duration', detail: 'response time in ms', insert: 'duration ' },
    { label: 'body', detail: 'response body value', insert: 'body.' },
    { label: 'body.length', detail: 'body array length', insert: 'body.length ' },
    { label: 'header', detail: 'response header', insert: 'header ' },
    // Operators
    { label: '==', detail: 'equals', insert: '== ' },
    { label: '!=', detail: 'not equals', insert: '!= ' },
    { label: 'contains', detail: 'string contains', insert: 'contains ' },
    { label: 'exists', detail: 'value exists', insert: 'exists' },
    // Actions
    { label: 'set env', detail: 'set environment variable', insert: 'set env ' },
    { label: 'set header', detail: 'set request header', insert: 'set header ' },
    // Logging
    { label: 'log', detail: 'log a value to console', insert: 'log ' },
    // Functions
    { label: 'uuid()', detail: 'generate UUID', insert: 'uuid()' },
    { label: 'now()', detail: 'current ISO timestamp', insert: 'now()' },
    { label: 'timestamp()', detail: 'unix epoch seconds', insert: 'timestamp()' },
    { label: 'base64_encode()', detail: 'base64 encode', insert: 'base64_encode(' },
    { label: 'base64_decode()', detail: 'base64 decode', insert: 'base64_decode(' },
    { label: 'sha256()', detail: 'SHA-256 hash', insert: 'sha256(' },
    { label: 'jwt_payload()', detail: 'decode JWT payload', insert: 'jwt_payload(' },
    { label: 'length()', detail: 'string length or array count', insert: 'length(' },
  ];

  function getEnvSuggestions() {
    if (!environments || environments.length === 0) return [];
    return environments
      .flatMap(env => (env.variables || []).map(v => v.key))
      .filter((k, i, arr) => k && arr.indexOf(k) === i)
      .map(key => ({
        label: `{{${key}}}`,
        detail: 'env variable',
        insert: `{{${key}}}`,
      }));
  }

  function getCurrentWord(text, cursorPos) {
    const before = text.slice(0, cursorPos);
    const match = before.match(/[\w.{}]+$/);
    return match ? match[0] : '';
  }

  function computeSuggestions(text, cursorPos) {
    const word = getCurrentWord(text, cursorPos).toLowerCase();
    if (word.length < 1) return [];

    const allSuggestions = [...KEYWORDS, ...getEnvSuggestions()];
    return allSuggestions
      .filter(s => s.label.toLowerCase().includes(word) && s.label.toLowerCase() !== word)
      .slice(0, 8);
  }

  function handleInput(e) {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPos = e.target.selectionStart;
    const matches = computeSuggestions(newValue, cursorPos);

    if (matches.length > 0) {
      setSuggestions(matches);
      setSelectedIdx(0);
      setTriggerPos(cursorPos);
      updateDropdownPosition(e.target, cursorPos);
    } else {
      closeSuggestions();
    }
  }

  function updateDropdownPosition(textarea, cursorPos) {
    if (!textarea) return;
    const rect = textarea.getBoundingClientRect();
    // Rough estimate: char width ~7.5px, line height ~20px
    const textBefore = textarea.value.slice(0, cursorPos);
    const lines = textBefore.split('\n');
    const currentLine = lines.length - 1;
    const currentCol = lines[lines.length - 1].length;
    setDropdownPos({
      top: rect.top + (currentLine + 1) * 20 + 4,
      left: rect.left + currentCol * 7.5,
    });
  }

  function acceptSuggestion(suggestion) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const word = getCurrentWord(value, cursorPos);
    const before = value.slice(0, cursorPos - word.length);
    const after = value.slice(cursorPos);
    const newValue = before + suggestion.insert + after;
    onChange(newValue);
    closeSuggestions();

    // Move cursor to end of inserted text
    requestAnimationFrame(() => {
      const newPos = before.length + suggestion.insert.length;
      textarea.selectionStart = newPos;
      textarea.selectionEnd = newPos;
      textarea.focus();
    });
  }

  function closeSuggestions() {
    setSuggestions([]);
    setSelectedIdx(0);
    setTriggerPos(null);
    setDropdownPos(null);
  }

  function handleKeyDown(e) {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      if (suggestions.length > 0) {
        e.preventDefault();
        acceptSuggestion(suggestions[selectedIdx]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSuggestions();
    }
  }

  function handleBlur() {
    // Delay to allow clicking on suggestions
    setTimeout(closeSuggestions, 150);
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder || '# enter dsl script...'}
        rows={6}
        spellCheck={false}
        className="w-full border border-gray-200 rounded-sm py-2 px-3 text-sm text-gray-700 placeholder-gray-300 bg-transparent resize-y focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 font-mono leading-5"
      />

      {/* Autocomplete dropdown */}
      {suggestions.length > 0 && dropdownPos && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-sm shadow-lg py-1 min-w-48 max-h-48 overflow-y-auto"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {suggestions.map((s, idx) => (
            <button
              key={s.label}
              onMouseDown={e => { e.preventDefault(); acceptSuggestion(s); }}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between gap-4 text-xs transition-colors ${
                idx === selectedIdx
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="font-mono truncate">{s.label}</span>
              <span className="text-[10px] text-gray-400 flex-shrink-0">{s.detail}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
