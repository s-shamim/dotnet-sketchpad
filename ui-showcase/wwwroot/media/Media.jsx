function MediaSection() {
  // ── Carousel ─────────────────────────────────────────────
  const slides = [
    { id: 1, bg: 'bg-gray-100', label: 'slide one',   sub: 'use cases: hero banners, feature highlights'     },
    { id: 2, bg: 'bg-gray-200', label: 'slide two',   sub: 'swipe or arrow to advance, dot indicators below' },
    { id: 3, bg: 'bg-gray-100', label: 'slide three', sub: 'auto-advance disabled — user controls only'       },
    { id: 4, bg: 'bg-gray-200', label: 'slide four',  sub: 'touch / pointer events also work'                 },
  ];
  const [slide, setSlide] = React.useState(0);
  function prev() { setSlide(i => (i - 1 + slides.length) % slides.length); }
  function next() { setSlide(i => (i + 1) % slides.length); }

  // ── Image grid ───────────────────────────────────────────
  const gridItems = [
    { id: 1, aspect: 'aspect-square',     label: 'photo 01' },
    { id: 2, aspect: 'aspect-video',      label: 'photo 02' },
    { id: 3, aspect: 'aspect-square',     label: 'photo 03' },
    { id: 4, aspect: 'aspect-square',     label: 'photo 04' },
    { id: 5, aspect: 'aspect-video',      label: 'photo 05' },
    { id: 6, aspect: 'aspect-square',     label: 'photo 06' },
  ];
  const [selectedImg, setSelectedImg] = React.useState(null);

  // ── Gallery lightbox ─────────────────────────────────────
  React.useEffect(() => {
    if (!selectedImg) return;
    function onKey(e) { if (e.key === 'Escape') setSelectedImg(null); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedImg]);

  return (
    <div>
      <SectionTitle sub="carousel, image grid, lightbox">media</SectionTitle>

      <DemoBlock title="carousel / slider">
        <div className="max-w-md">
          <div className="relative overflow-hidden rounded-sm border border-gray-100">
            {/* slides */}
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >
              {slides.map(s => (
                <div
                  key={s.id}
                  className={`${s.bg} shrink-0 w-full h-40 flex flex-col items-center justify-center gap-1 px-6`}
                >
                  <p className="text-sm text-gray-700 lowercase">{s.label}</p>
                  <p className="text-xs text-gray-400 lowercase text-center">{s.sub}</p>
                </div>
              ))}
            </div>
            {/* prev/next */}
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-gray-200 rounded-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors shadow-sm"
            >
              <Icon name="arrow-left" size={12} className="" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-gray-200 rounded-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors shadow-sm"
            >
              <Icon name="arrow-right" size={12} className="" />
            </button>
          </div>
          {/* dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === slide ? 'bg-gray-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="image grid — placeholder tiles">
        <div className="grid grid-cols-3 gap-2 max-w-md">
          {gridItems.map(img => (
            <button
              key={img.id}
              onClick={() => setSelectedImg(img)}
              className={`${img.aspect} bg-gray-100 rounded-sm overflow-hidden relative group hover:bg-gray-200 transition-colors border border-gray-100 hover:border-gray-300`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <Icon name="image" size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                <span className="text-[10px] text-gray-300 group-hover:text-gray-400 transition-colors lowercase">{img.label}</span>
              </div>
              <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-colors" />
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-300 mt-3 lowercase">click any tile to open lightbox</p>
      </DemoBlock>

      {/* Lightbox overlay */}
      {selectedImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setSelectedImg(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative bg-white rounded-sm border border-gray-200 w-80 h-52 flex flex-col items-center justify-center gap-2 shadow-sm"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors flex items-center"
            >
              <Icon name="x" size={14} className="" />
            </button>
            <Icon name="image" size={32} className="text-gray-200" />
            <p className="text-sm text-gray-500 lowercase">{selectedImg.label}</p>
            <p className="text-xs text-gray-300 lowercase">esc or click outside to close</p>
          </div>
        </div>
      )}
    </div>
  );
}
