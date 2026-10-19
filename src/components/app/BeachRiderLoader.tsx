export default function BeachRiderLoader({ visible = true }: { visible?: boolean }) {
  return (
    <div className={`beach-loader ${visible ? 'is-visible' : 'is-hidden'}`} role="status" aria-live="polite" aria-label="Menyiapkan halaman">
      <div className="beach-loader__content">
        <div className="beach-loader__brand"><span>Rider Horse</span><small>Banyuwangi</small></div>
        <svg className="beach-loader__scene" viewBox="0 0 360 190" aria-hidden="true">
          <defs>
            <linearGradient id="loader-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#f8e89b" />
              <stop offset="1" stopColor="#f7f3e8" />
            </linearGradient>
            <linearGradient id="loader-sea" x1="0" x2="1">
              <stop offset="0" stopColor="#83a89a" />
              <stop offset="1" stopColor="#3c6b5a" />
            </linearGradient>
          </defs>
          <rect width="360" height="190" rx="28" fill="url(#loader-sky)" />
          <circle cx="287" cy="49" r="23" fill="#dfbe36" opacity=".95" />
          <path d="M0 100c43-8 71 9 112 2 43-8 79-2 118 4 49 7 82-9 130-4v88H0z" fill="url(#loader-sea)" />
          <g className="beach-loader__waves" fill="none" stroke="#f7f3e8" strokeLinecap="round" opacity=".7">
            <path d="M-15 119c34-9 52 7 84 0s52 7 84 0 52 7 84 0 52 7 84 0 52 7 84 0" />
            <path d="M-30 142c34-9 52 7 84 0s52 7 84 0 52 7 84 0 52 7 84 0 52 7 84 0" />
          </g>
          <path d="M0 154c62-10 98 3 148 4 80 2 127-17 212-8v40H0z" fill="#e9d7ad" />
          <path d="M0 163c70-6 122 6 184 4 67-2 116-17 176-10" fill="none" stroke="#fff9e9" strokeWidth="4" opacity=".7" />
          <g className="beach-loader__rider" fill="#132a21" stroke="#132a21" strokeLinecap="round" strokeLinejoin="round">
            <path d="M87 119c-9-3-14-10-18-16 1 9 4 18 14 23" fill="none" strokeWidth="5" />
            <ellipse cx="128" cy="117" rx="42" ry="22" />
            <path d="M157 113c8-24 14-38 28-43 8 7 9 22 2 31-6 8-8 15-8 27z" />
            <path d="m181 72 9-7-3 12m-4-7 1-10 6 9" fill="none" strokeWidth="4" />
            <ellipse cx="190" cy="80" rx="10" ry="7" transform="rotate(-20 190 80)" />
            <circle cx="194" cy="78" r="1.5" fill="#f5d65b" stroke="none" />
            <path d="M168 92c-15 3-30 7-43 4" fill="none" stroke="#dfbe36" strokeWidth="2" />
            <g className="beach-loader__legs" fill="none" strokeWidth="7">
              <path d="M105 130 93 151l-14 7" />
              <path d="M121 133 125 153l13 8" />
              <path d="M148 131 158 151l13 5" />
              <path d="M161 126 177 143l-2 15" />
            </g>
            <path d="M99 110c13-10 30-13 48-6" fill="none" stroke="#e4c340" strokeWidth="3" />
            <circle cx="133" cy="65" r="8" />
            <path d="M124 62c4-9 16-10 20-1-7-2-14-1-20 1z" fill="#dfbe36" stroke="none" />
            <path d="M129 74 119 96l24 4-3-24z" />
            <path d="m121 82-13 14m30-14 17 12" fill="none" strokeWidth="5" />
            <path d="m126 97-10 21m17-19 17 17" fill="none" strokeWidth="6" />
          </g>
        </svg>
        <div className="beach-loader__copy">
          <strong>Menyiapkan perjalananmu</strong>
          <span>Langkah kecil menuju petualangan besar</span>
        </div>
        <div className="beach-loader__progress" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}
