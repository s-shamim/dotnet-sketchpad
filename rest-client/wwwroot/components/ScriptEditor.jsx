// ScriptEditor.jsx — textarea with trigger-based autocomplete dropdown for DSL scripting

window.ScriptEditor = function ScriptEditor({ value, onChange, placeholder, environments, lastResponse }) {
  const textareaRef = React.useRef(null);
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [replaceLen, setReplaceLen] = React.useState(0);
  const [dropdownPos, setDropdownPos] = React.useState(null);

  const COMMON_REQ_HEADERS = ['Authorization', 'Content-Type', 'Accept', 'X-Request-Id', 'X-API-Key', 'X-Timestamp', 'Cache-Control'];
  const COMMON_RESP_HEADERS = ['content-type', 'authorization', 'x-request-id', 'cache-control', 'x-ratelimit-remaining'];

  function getEnvVars() {
    if (!environments || environments.length === 0) return [];
    return environments
      .flatMap(env => (env.variables || []).filter(v => v.enabled !== false).map(v => v.key))
      .filter((k, i, arr) => k && arr.indexOf(k) === i);
  }

  function getBodyKeys() {
    if (!lastResponse?.body) return [];
    try {
      const parsed = JSON.parse(lastResponse.body);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') return Object.keys(parsed[0]);
      if (typeof parsed === 'object' && parsed !== null) return Object.keys(parsed);
    } catch {}
    return [];
  }

  function getResponseHeaders() {
    if (!lastResponse?.headers) return [];
    return Object.keys(lastResponse.headers);
  }

  function filterSugs(items, prefix) {
    if (!prefix) return items.slice(0, 8);
    const p = prefix.toLowerCase();
    return items.filter(s => s.label.toLowerCase().startsWith(p) || s.label.toLowerCase().includes(p)).slice(0, 8);
  }

  function computeSuggestions(text, cursorPos) {
    const before = text.slice(0, cursorPos);
    const lines = before.split('\n');
    const currentLine = lines[lines.length - 1];

    // Skip comments
    if (currentLine.trimStart().startsWith('#')) return { suggestions: [], replaceLen: 0 };

    // response.body.<partial>
    const bodyDotMatch = currentLine.match(/response\.body\.(\w*)$/);
    if (bodyDotMatch) {
      const prefix = bodyDotMatch[1];
      return {
        suggestions: filterSugs(getBodyKeys().map(k => ({ label: k, detail: 'body key', insert: k })), prefix),
        replaceLen: prefix.length,
      };
    }

    // response.header.<partial>
    const headerDotMatch = currentLine.match(/response\.header\.([-\w]*)$/);
    if (headerDotMatch) {
      const prefix = headerDotMatch[1];
      return {
        suggestions: filterSugs(getResponseHeaders().map(h => ({ label: h, detail: 'response header', insert: h })), prefix),
        replaceLen: prefix.length,
      };
    }

    // response.<partial>
    const responseDotMatch = currentLine.match(/response\.(\w*)$/);
    if (responseDotMatch) {
      const prefix = responseDotMatch[1];
      const opts = [
        { label: 'body', detail: 'response body', insert: 'body' },
        { label: 'body.', detail: 'body path →', insert: 'body.' },
        { label: 'header.', detail: 'header value →', insert: 'header.' },
        { label: 'status', detail: 'status code', insert: 'status' },
        { label: 'statusText', detail: 'status text', insert: 'statusText' },
        { label: 'duration', detail: 'response ms', insert: 'duration' },
      ];
      return { suggestions: filterSugs(opts, prefix), replaceLen: prefix.length };
    }

    // env.<partial>
    const envDotMatch = currentLine.match(/\benv\.(\w*)$/);
    if (envDotMatch) {
      const prefix = envDotMatch[1];
      return {
        suggestions: filterSugs(getEnvVars().map(k => ({ label: k, detail: 'env var', insert: k })), prefix),
        replaceLen: prefix.length,
      };
    }

    // set env <name> = <partial RHS>
    const setEnvAssignMatch = currentLine.match(/^set env \w+ = (.*)$/);
    if (setEnvAssignMatch) {
      const prefix = setEnvAssignMatch[1];
      const opts = [
        { label: 'response.body.', detail: 'body path', insert: 'response.body.' },
        { label: 'response.header.', detail: 'header value', insert: 'response.header.' },
        { label: 'response.status', detail: 'status code', insert: 'response.status' },
        { label: 'env.', detail: 'env var', insert: 'env.' },
        { label: 'uuid()', detail: 'random UUID', insert: 'uuid()' },
        { label: 'now()', detail: 'ISO timestamp', insert: 'now()' },
        { label: 'timestamp()', detail: 'unix epoch', insert: 'timestamp()' },
        { label: 'jwt_payload()', detail: 'decode JWT', insert: 'jwt_payload(' },
        { label: 'base64_encode()', detail: 'base64 encode', insert: 'base64_encode(' },
        { label: 'base64_decode()', detail: 'base64 decode', insert: 'base64_decode(' },
        { label: 'sha256()', detail: 'SHA-256 hash', insert: 'sha256(' },
      ];
      return { suggestions: filterSugs(opts, prefix), replaceLen: prefix.length };
    }

    // set header <name> = <partial RHS>
    const setHeaderAssignMatch = currentLine.match(/^set header [\w-]+ = (.*)$/);
    if (setHeaderAssignMatch) {
      const prefix = setHeaderAssignMatch[1];
      const opts = [
        { label: 'env.', detail: 'env var', insert: 'env.' },
        { label: 'uuid()', detail: 'random UUID', insert: 'uuid()' },
        { label: 'now()', detail: 'ISO timestamp', insert: 'now()' },
        { label: 'base64_encode()', detail: 'base64 encode', insert: 'base64_encode(' },
      ];
      return { suggestions: filterSugs(opts, prefix), replaceLen: prefix.length };
    }

    // set env <partial name>
    const setEnvMatch = currentLine.match(/^set env (\w*)$/);
    if (setEnvMatch) {
      const prefix = setEnvMatch[1];
      return {
        suggestions: filterSugs(getEnvVars().map(k => ({ label: k, detail: 'env var name', insert: k + ' = ' })), prefix),
        replaceLen: prefix.length,
      };
    }

    // set header <partial name>
    const setHeaderMatch = currentLine.match(/^set header ([\w-]*)$/);
    if (setHeaderMatch) {
      const prefix = setHeaderMatch[1];
      return {
        suggestions: filterSugs(COMMON_REQ_HEADERS.map(h => ({ label: h, detail: 'request header', insert: h + ' = ' })), prefix),
        replaceLen: prefix.length,
      };
    }

    // header <partial> (assertion — response header names)
    const headerAssertionMatch = currentLine.match(/^header ([-\w]*)$/);
    if (headerAssertionMatch) {
      const prefix = headerAssertionMatch[1];
      const unique = [...new Set([...COMMON_RESP_HEADERS, ...getResponseHeaders()])];
      return {
        suggestions: filterSugs(unique.map(h => ({ label: h, detail: 'response header', insert: h + ' ' })), prefix),
        replaceLen: prefix.length,
      };
    }

    // Line start — base keywords
    const word = currentLine.trimStart();
    if (word.length < 1) return { suggestions: [], replaceLen: 0 };

    const BASE_KEYWORDS = [
      { label: 'set env', detail: 'set env variable', insert: 'set env ' },
      { label: 'set header', detail: 'set request header', insert: 'set header ' },
      { label: 'status', detail: 'status assertion', insert: 'status ' },
      { label: 'header', detail: 'header assertion', insert: 'header ' },
      { label: 'body', detail: 'body assertion', insert: 'body.' },
      { label: 'duration', detail: 'duration assertion', insert: 'duration ' },
      { label: 'log', detail: 'log value', insert: 'log ' },
    ];

    return { suggestions: filterSugs(BASE_KEYWORDS, word), replaceLen: word.length };
  }

  function handleInput(e) {
    const newValue = e.target.value;
    onChange(newValue);
    const cursorPos = e.target.selectionStart;
    const { suggestions: sugs, replaceLen: rLen } = computeSuggestions(newValue, cursorPos);
    if (sugs.length > 0) {
      setSuggestions(sugs);
      setReplaceLen(rLen);
      setSelectedIdx(0);
      updateDropdownPosition(e.target, cursorPos);
    } else {
      closeSuggestions();
    }
  }

  function updateDropdownPosition(textarea, cursorPos) {
    if (!textarea) return;
    const rect = textarea.getBoundingClientRect();
    const textBefore = textarea.value.slice(0, cursorPos);
    const lines = textBefore.split('\n');
    const lineIdx = lines.length - 1;
    const colIdx = lines[lines.length - 1].length;
    setDropdownPos({
      top: rect.top + (lineIdx + 1) * 20 + 4,
      left: rect.left + colIdx * 7.5,
    });
  }

  function acceptSuggestion(sug) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const cursorPos = textarea.selectionStart;
    const before = value.slice(0, cursorPos - replaceLen);
    const after = value.slice(cursorPos);
    const newValue = before + sug.insert + after;
    onChange(newValue);
    closeSuggestions();
    requestAnimationFrame(() => {
      const newPos = before.length + sug.insert.length;
      textarea.selectionStart = newPos;
      textarea.selectionEnd = newPos;
      textarea.focus();
    });
  }

  function closeSuggestions() {
    setSuggestions([]);
    setSelectedIdx(0);
    setReplaceLen(0);
    setDropdownPos(null);
  }

  function handleKeyDown(e) {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(prev => (prev + 1) % suggestions.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(prev => (prev - 1 + suggestions.length) % suggestions.length); }
    else if (e.key === 'Tab' || e.key === 'Enter') { if (suggestions.length > 0) { e.preventDefault(); acceptSuggestion(suggestions[selectedIdx]); } }
    else if (e.key === 'Escape') { e.preventDefault(); closeSuggestions(); }
  }

  function handleBlur() {
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
                idx === selectedIdx ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50'
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
