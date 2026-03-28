function IconsSection() {
  const icons = [
    'house', 'gear', 'bell', 'user', 'magnifying-glass', 'x', 'check', 'plus',
    'minus', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
    'caret-down', 'caret-up', 'caret-left', 'caret-right',
    'copy', 'clipboard', 'pencil', 'trash', 'floppy-disk', 'upload', 'download',
    'eye', 'eye-slash', 'lock', 'lock-open', 'key', 'shield', 'warning',
    'info', 'question', 'check-circle', 'x-circle', 'dots-three-outline',
    'list', 'grid-four', 'rows', 'sidebar',
    'folder', 'file', 'file-text', 'image', 'video',
    'code', 'terminal', 'database', 'cloud', 'wifi', 'link', 'globe',
    'envelope', 'chat', 'phone', 'map-pin', 'calendar', 'clock',
    'chart-line', 'chart-bar', 'chart-pie', 'trend-up', 'trend-down',
    'arrow-clockwise', 'arrow-counter-clockwise', 'funnel', 'sort-ascending', 'sort-descending',
    'star', 'heart', 'bookmark', 'tag', 'flag',
    'shuffle', 'dots-six-vertical', 'credit-card',
  ];

  return (
    <div>
      <SectionTitle sub="phosphor icons — ph-light weight only">icons</SectionTitle>

      <DemoBlock title="icon library (ph-light)">
        <div className="flex flex-wrap gap-3">
          {icons.map(name => (
            <div key={name} title={name} className="flex flex-col items-center gap-1.5 w-24 text-center">
              <Icon name={name} size={20} />
              <span className="text-[10px] text-gray-300 leading-tight">{name}</span>
            </div>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="sizes">
        <div className="flex items-end gap-8">
          {[10, 14, 16, 20, 24, 32, 48].map(sz => (
            <div key={sz} className="flex flex-col items-center gap-2">
              <Icon name="star" size={sz} className="text-gray-400" />
              <span className="text-xs text-gray-300">{sz}px</span>
            </div>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="status colors — only permitted use of color on icons">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-1.5">
            <Icon name="check-circle" size={20} className="text-green-600" />
            <span className="text-xs text-gray-400">success</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Icon name="x-circle" size={20} className="text-red-500" />
            <span className="text-xs text-gray-400">error</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Icon name="warning" size={20} className="text-yellow-600" />
            <span className="text-xs text-gray-400">warning</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Icon name="info" size={20} className="text-blue-600" />
            <span className="text-xs text-gray-400">info</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Icon name="minus" size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400">neutral</span>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="usage pattern in jsx">
        <div className="border border-gray-100 bg-gray-50 p-4">
          <pre className="text-xs text-gray-600 font-mono leading-relaxed">{`function Icon({ name, size = 14, className = "text-gray-400" }) {
  return (
    <i
      className={\`ph-light ph-\${name} \${className}\`}
      style={{ fontSize: size }}
    />
  );
}

// usage
<Icon name="copy" />
<Icon name="check-circle" size={16} className="text-green-600" />
<Icon name="warning" className="text-yellow-600" />`}</pre>
        </div>
      </DemoBlock>
    </div>
  );
}
