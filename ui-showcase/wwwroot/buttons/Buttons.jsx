function ButtonsSection() {
  const [loading, setLoading] = React.useState(false);
  const [loadingId, setLoadingId] = React.useState(null);

  function simulateLoad(id) {
    setLoadingId(id);
    setTimeout(() => setLoadingId(null), 1800);
  }

  return (
    <div>
      <SectionTitle sub="text, ghost, outline, icon, loading, sizes, states">buttons</SectionTitle>

      <DemoBlock title="text buttons — primary, secondary, muted">
        <div className="flex flex-wrap items-center gap-5">
          <button className="text-sm text-gray-700 hover:text-gray-900 transition-colors lowercase">
            primary action
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors lowercase">
            secondary action
          </button>
          <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors lowercase">
            muted action
          </button>
          <button className="text-sm text-red-400 hover:text-red-600 transition-colors lowercase">
            destructive
          </button>
        </div>
      </DemoBlock>

      <DemoBlock title="ghost buttons — bordered, no fill">
        <div className="flex flex-wrap items-center gap-3">
          <button className="text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm hover:border-gray-500 transition-colors lowercase">
            default
          </button>
          <button className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 hover:text-gray-700 transition-colors lowercase">
            secondary
          </button>
          <button className="text-sm text-red-400 border border-red-200 px-3 py-1.5 rounded-sm hover:border-red-400 hover:text-red-600 transition-colors lowercase">
            destructive
          </button>
          <button className="text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-sm hover:border-blue-400 transition-colors lowercase">
            info
          </button>
        </div>
      </DemoBlock>

      <DemoBlock title="sizes">
        <div className="flex flex-wrap items-end gap-4">
          <button className="text-[10px] text-gray-500 border border-gray-200 px-2 py-1 rounded-sm hover:border-gray-400 transition-colors lowercase">
            xs
          </button>
          <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-sm hover:border-gray-400 transition-colors lowercase">
            small
          </button>
          <button className="text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 transition-colors lowercase">
            medium
          </button>
          <button className="text-base text-gray-600 border border-gray-200 px-4 py-2 rounded-sm hover:border-gray-400 transition-colors lowercase">
            large
          </button>
        </div>
      </DemoBlock>

      <DemoBlock title="icon buttons">
        <div className="flex flex-wrap items-center gap-3">
          {/* icon-only */}
          <button aria-label="copy" className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-sm">
            <Icon name="copy" size={16} className="" />
          </button>
          <button aria-label="edit" className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors border border-gray-200 rounded-sm">
            <Icon name="pencil" size={16} className="" />
          </button>
          <button aria-label="delete" className="p-1.5 text-gray-400 hover:text-red-400 transition-colors border border-gray-200 rounded-sm">
            <Icon name="trash" size={16} className="" />
          </button>
          {/* icon + label */}
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase">
            <Icon name="plus" size={14} className="" /> new item
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase">
            <Icon name="download" size={14} className="" /> export
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase">
            settings <Icon name="caret-down" size={12} className="" />
          </button>
        </div>
      </DemoBlock>

      <DemoBlock title="loading state">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => simulateLoad('a')}
            disabled={loadingId === 'a'}
            className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 transition-colors lowercase disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingId === 'a' ? <><Spinner size={12} /> saving...</> : 'save changes'}
          </button>
          <button
            onClick={() => simulateLoad('b')}
            disabled={loadingId === 'b'}
            className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 transition-colors lowercase disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingId === 'b' ? <><Spinner size={12} /> loading...</> : 'fetch data'}
          </button>
        </div>
        <p className="text-xs text-gray-300 mt-2 lowercase">click to simulate — auto-resets after 1.8s</p>
      </DemoBlock>

      <DemoBlock title="states — disabled, focus ring">
        <div className="flex flex-wrap items-center gap-3">
          <button
            disabled
            className="text-sm text-gray-300 border border-gray-100 px-3 py-1.5 rounded-sm cursor-not-allowed lowercase"
          >
            disabled
          </button>
          <button
            className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors lowercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1"
          >
            tab to focus
          </button>
          <button
            className="flex items-center gap-2 text-sm text-gray-400 border border-dashed border-gray-200 px-3 py-1.5 rounded-sm hover:border-gray-400 hover:text-gray-600 transition-colors lowercase"
          >
            <Icon name="plus" size={14} className="" /> dashed / add
          </button>
        </div>
      </DemoBlock>
    </div>
  );
}
