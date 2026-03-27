function TypographySection() {
  return (
    <div>
      <SectionTitle sub="scale, weight, color, mono, prose">typography</SectionTitle>

      <DemoBlock title="type scale">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] text-gray-300 w-12 shrink-0">10px</span>
            <p className="text-[10px] text-gray-700 lowercase">the quick brown fox jumps over the lazy dog</p>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] text-gray-300 w-12 shrink-0">xs 12px</span>
            <p className="text-xs text-gray-700 lowercase">the quick brown fox jumps over the lazy dog</p>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] text-gray-300 w-12 shrink-0">sm 14px</span>
            <p className="text-sm text-gray-700 lowercase">the quick brown fox jumps over the lazy dog</p>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] text-gray-300 w-12 shrink-0">base 16px</span>
            <p className="text-base text-gray-700 lowercase">the quick brown fox jumps over the lazy dog</p>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] text-gray-300 w-12 shrink-0">lg 18px</span>
            <p className="text-lg text-gray-700 lowercase">the quick brown fox jumps</p>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] text-gray-300 w-12 shrink-0">xl 20px</span>
            <p className="text-xl text-gray-700 lowercase">the quick brown fox</p>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] text-gray-300 w-12 shrink-0">2xl 24px</span>
            <p className="text-2xl font-light text-gray-700 lowercase">the quick brown fox</p>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] text-gray-300 w-12 shrink-0">3xl 30px</span>
            <p className="text-3xl font-light text-gray-700 lowercase">heading level</p>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="weights — 300 / 400 / 500">
        <div className="flex flex-col gap-3 text-base text-gray-700">
          <p className="font-light">font-light (300) — section titles, large headings</p>
          <p className="font-normal">font-normal (400) — body copy, default</p>
          <p className="font-medium">font-medium (500) — active nav items only</p>
        </div>
      </DemoBlock>

      <DemoBlock title="gray scale — text tones">
        <div className="flex flex-col gap-2">
          {[
            ['text-gray-900', 'gray-900 — primary content, highest contrast'],
            ['text-gray-800', 'gray-800 — headings, section titles'],
            ['text-gray-700', 'gray-700 — body text, labels'],
            ['text-gray-600', 'gray-600 — secondary text, descriptions'],
            ['text-gray-500', 'gray-500 — tertiary, captions'],
            ['text-gray-400', 'gray-400 — placeholders, hints, icons'],
            ['text-gray-300', 'gray-300 — disabled text, very muted'],
          ].map(([cls, label]) => (
            <p key={cls} className={`text-sm ${cls} lowercase`}>{label}</p>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="monospace — code and identifiers">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-mono text-gray-700">font-mono — api keys, ids, code snippets</p>
          <p className="text-xs font-mono text-gray-500">usr_abc123 · req_7f3a9d · 2026-01-15T08:32:00Z</p>
          <div className="border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm">
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              {`const result = await fetch('/api/users', {\n  method: 'POST',\n  body: JSON.stringify(payload),\n});`}
            </p>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="heading hierarchy">
        <div className="flex flex-col gap-4 max-w-sm">
          <h1 className="text-2xl font-light tracking-widest text-gray-800 lowercase">page title</h1>
          <h2 className="text-base text-gray-700 lowercase">section heading</h2>
          <h3 className="text-xs tracking-widest text-gray-400 uppercase">subsection label</h3>
          <p className="text-sm text-gray-600 lowercase">body paragraph — this is the main content text at the default size. it should be readable and comfortable at 14px with normal line height.</p>
          <p className="text-xs text-gray-400 lowercase">caption or helper text — used for hints, validation notes, and supplemental context.</p>
        </div>
      </DemoBlock>

      <DemoBlock title="truncation and wrapping">
        <div className="flex flex-col gap-3 max-w-xs">
          <p className="text-sm text-gray-700 truncate lowercase">this is a very long string that will be truncated at the container boundary with an ellipsis</p>
          <p className="text-sm text-gray-700 break-all font-mono text-xs">eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfYWJjMTIzIiwibmFtZSI6IkphbmUgU21pdGgifQ</p>
          <p className="text-xs text-gray-400 lowercase">use truncate for single-line overflow, break-all for long tokens</p>
        </div>
      </DemoBlock>
    </div>
  );
}
