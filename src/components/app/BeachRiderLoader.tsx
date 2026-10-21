'use client';

import { useLanguage } from '@/lib/i18n/context';

export default function BeachRiderLoader({ visible = true }: { visible?: boolean }) {
  const { locale } = useLanguage();
  return (
    <div className={`beach-loader ${visible ? 'is-visible' : 'is-hidden'}`} role="status" aria-live="polite" aria-label={locale === 'id' ? 'Menyiapkan halaman' : 'Preparing page'}>
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
            <g className="beach-loader__tail" fill="none" strokeWidth="5">
              <path d="M91 112c-14-3-23-10-28-20 1 13 7 25 21 31" />
              <path d="M88 118c-13 2-22-2-29-10 5 12 13 18 26 19" opacity=".72" />
            </g>
            <ellipse cx="128" cy="116" rx="43" ry="22" />
            <path d="M157 113c4-18 10-34 22-44 7 2 14 10 16 18-5 9-9 17-11 29z" />
            <path d="m177 71 3-13 7 11m1 3 8-10-2 14" fill="none" strokeWidth="3.5" />
            <ellipse cx="194" cy="82" rx="12" ry="7.5" transform="rotate(-18 194 82)" />
            <path d="M199 87c5 1 9 0 12-2" fill="none" strokeWidth="3" />
            <circle cx="198" cy="79" r="1.6" fill="#f5d65b" stroke="none" />
            <path className="beach-loader__mane" d="M178 72c-9 8-12 16-13 27" fill="none" stroke="#dfbe36" strokeWidth="4" />
            <path d="M171 91c-15 2-28 5-43 3" fill="none" stroke="#dfbe36" strokeWidth="2" />
            <g className="beach-loader__leg beach-loader__leg--back-one" fill="none" strokeWidth="7"><path d="M104 130 92 149l-15 8" /></g>
            <g className="beach-loader__leg beach-loader__leg--back-two" fill="none" strokeWidth="7"><path d="M120 132 126 152l15 8" /></g>
            <g className="beach-loader__leg beach-loader__leg--front-one" fill="none" strokeWidth="7"><path d="M150 131 161 150l14 5" /></g>
            <g className="beach-loader__leg beach-loader__leg--front-two" fill="none" strokeWidth="7"><path d="M164 126 179 143l-2 16" /></g>
            <path d="M98 107c15-9 32-10 49-3" fill="none" stroke="#e4c340" strokeWidth="3" />
            <g className="beach-loader__human">
              <circle cx="132" cy="64" r="8" />
              <path d="M123 61c4-9 17-10 22-1-8-2-15-1-22 1z" fill="#dfbe36" stroke="none" />
              <path d="M128 73 119 96l25 4-4-25z" />
              <path d="m123 80-12 15m28-14 18 11" fill="none" strokeWidth="5" />
              <path d="m126 97-10 20m18-18 17 17" fill="none" strokeWidth="6" />
            </g>
          </g>
        </svg>
        <div className="beach-loader__copy">
          <strong>{locale === 'id' ? 'Menyiapkan perjalananmu' : 'Preparing your journey'}</strong>
          <span>{locale === 'id' ? 'Langkah kecil menuju petualangan besar' : 'A small step toward a great adventure'}</span>
        </div>
        <div className="beach-loader__progress" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}
