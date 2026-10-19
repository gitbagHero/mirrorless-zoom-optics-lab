export function LensExterior() {
  return (
    <svg
      className="lens-exterior"
      viewBox="0 0 920 360"
      role="img"
      aria-label="NIKKOR Z 24-200mm f/4-6.3 VR 外观重绘"
    >
      <defs>
        <linearGradient id="le-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3b424b" />
          <stop offset="0.16" stopColor="#1b2027" />
          <stop offset="0.54" stopColor="#090c11" />
          <stop offset="0.82" stopColor="#12171e" />
          <stop offset="1" stopColor="#040608" />
        </linearGradient>
        <linearGradient id="le-zoom" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#39414b" />
          <stop offset="0.16" stopColor="#171d25" />
          <stop offset="0.62" stopColor="#06090d" />
          <stop offset="0.88" stopColor="#141a21" />
          <stop offset="1" stopColor="#030507" />
        </linearGradient>
        <linearGradient id="le-focus" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#424a54" />
          <stop offset="0.2" stopColor="#1a2028" />
          <stop offset="0.6" stopColor="#070a0e" />
          <stop offset="1" stopColor="#030507" />
        </linearGradient>
        <linearGradient id="le-front" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#020305" />
          <stop offset="0.55" stopColor="#181e26" />
          <stop offset="0.82" stopColor="#323a44" />
          <stop offset="1" stopColor="#080b10" />
        </linearGradient>
        <linearGradient id="le-rear" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#1b222a" />
          <stop offset="0.42" stopColor="#090c11" />
          <stop offset="0.78" stopColor="#171d25" />
          <stop offset="1" stopColor="#05070a" />
        </linearGradient>
        <linearGradient id="le-metal" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0c1116" />
          <stop offset="0.3" stopColor="#697582" />
          <stop offset="0.55" stopColor="#262e37" />
          <stop offset="0.78" stopColor="#8d99a6" />
          <stop offset="1" stopColor="#0a0e13" />
        </linearGradient>
        <radialGradient id="le-glass" cx="38%" cy="34%" r="68%">
          <stop offset="0" stopColor="#f7ecd1" stopOpacity="0.9" />
          <stop offset="0.18" stopColor="#96a8b8" stopOpacity="0.5" />
          <stop offset="0.48" stopColor="#314453" />
          <stop offset="0.78" stopColor="#0c141b" />
          <stop offset="1" stopColor="#020406" />
        </radialGradient>
        <radialGradient id="le-glass-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#8de8df" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#6478c8" stopOpacity="0.12" />
          <stop offset="1" stopColor="#6478c8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="le-gloss" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <pattern id="le-ribs" width="7" height="280" patternUnits="userSpaceOnUse">
          <rect width="3" height="280" fill="#202730" />
          <rect x="3" width="1" height="280" fill="#05070a" />
          <rect x="4" width="1" height="280" fill="#343d47" opacity="0.65" />
        </pattern>
        <pattern id="le-focus-ribs" width="4" height="250" patternUnits="userSpaceOnUse">
          <rect width="2" height="250" fill="#1b222b" />
          <rect x="2" width="1" height="250" fill="#05070a" />
        </pattern>
        <filter id="le-shadow" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <ellipse cx="455" cy="334" rx="360" ry="17" fill="#08111f" opacity="0.26" filter="url(#le-shadow)" />

      <g filter="url(#le-shadow)" opacity="0.55">
        <path d="M78 72h760v226H78z" fill="#030507" />
      </g>

      {/* Main barrel silhouette */}
      <rect x="58" y="64" width="792" height="232" rx="24" fill="url(#le-body)" stroke="#3a424b" strokeWidth="1" />

      {/* Rear body section */}
      <rect x="598" y="64" width="230" height="232" fill="url(#le-rear)" />
      <rect x="598" y="64" width="230" height="44" fill="url(#le-gloss)" opacity="0.6" />

      {/* Front ring */}
      <rect x="58" y="58" width="86" height="244" rx="18" fill="url(#le-front)" stroke="#3b434d" strokeWidth="1" />
      <rect x="72" y="62" width="58" height="236" rx="12" fill="url(#le-front)" stroke="#59626d" strokeWidth="1" />
      <text
        x="86"
        y="180"
        fill="#d7dde5"
        fontSize="8"
        fontFamily="SFMono-Regular, Menlo, monospace"
        fontWeight="700"
        letterSpacing="1.4"
        transform="rotate(-90 86 180)"
        textAnchor="middle"
      >
        NIKKOR Z
      </text>

      {/* Zoom ring */}
      <rect x="170" y="48" width="360" height="264" rx="14" fill="url(#le-zoom)" stroke="#4a535e" strokeWidth="1" />
      <rect x="170" y="48" width="360" height="264" rx="14" fill="url(#le-ribs)" opacity="0.92" />
      <rect x="170" y="48" width="360" height="264" rx="14" fill="url(#le-gloss)" opacity="0.6" />
      <rect x="170" y="48" width="360" height="30" rx="14" fill="#05070a" opacity="0.38" />
      <rect x="170" y="282" width="360" height="30" rx="14" fill="#010203" opacity="0.55" />

      {/* Focal scale on the zoom ring */}
      <g fill="#dbe4ee" fillOpacity="0.68" fontSize="9" fontFamily="SFMono-Regular, Menlo, monospace" fontWeight="700">
        <text x="512" y="108">24</text>
        <text x="512" y="132">35</text>
        <text x="512" y="156">50</text>
        <text x="512" y="180">70</text>
        <text x="512" y="204">105</text>
        <text x="512" y="228">135</text>
        <text x="512" y="252">200</text>
      </g>
      <line x1="503" y1="90" x2="503" y2="262" stroke="#dbe4ee" strokeOpacity="0.28" strokeWidth="1" />

      {/* Focus ring */}
      <rect x="548" y="60" width="46" height="240" rx="8" fill="url(#le-focus)" stroke="#4b545f" strokeWidth="1" />
      <rect x="548" y="60" width="46" height="240" rx="8" fill="url(#le-focus-ribs)" opacity="0.9" />
      <rect x="548" y="60" width="46" height="240" rx="8" fill="url(#le-gloss)" opacity="0.55" />

      {/* Rear marking and switch */}
      <text
        x="778"
        y="180"
        fill="#e6edf5"
        fillOpacity="0.9"
        fontSize="19"
        fontFamily="SFMono-Regular, Menlo, monospace"
        fontWeight="700"
        letterSpacing="2.5"
        transform="rotate(-90 778 180)"
        textAnchor="middle"
      >
        24-200/4-6.3
      </text>
      <rect x="810" y="118" width="10" height="58" rx="4" fill="#05070a" stroke="#77818d" strokeWidth="0.8" />
      <rect x="812" y="124" width="6" height="16" rx="2" fill="#c9d3dd" />
      <circle cx="818" cy="222" r="2.2" fill="#f4f7fa" fillOpacity="0.85" />

      {/* Rear mount: chrome bayonet ring and inner throat */}
      <rect x="828" y="64" width="44" height="232" fill="#11171e" stroke="#4d5864" strokeWidth="1" />
      <ellipse cx="872" cy="180" rx="22" ry="116" fill="url(#le-metal)" fillOpacity="0.72" stroke="#6e7b88" strokeWidth="1" />
      <ellipse cx="872" cy="180" rx="12" ry="96" fill="#05080c" />
      <ellipse cx="872" cy="180" rx="7" ry="76" fill="#0d1218" stroke="#3c4652" strokeWidth="1" />
      <path d="M858 94h20M858 266h20" stroke="#d8e0e8" strokeOpacity="0.5" strokeWidth="2" />

      {/* Front glass and filter thread */}
      <ellipse cx="104" cy="180" rx="31" ry="106" fill="#05080b" stroke="#4b5560" strokeWidth="2" />
      <ellipse cx="104" cy="180" rx="25" ry="96" fill="url(#le-glass)" stroke="#141d25" strokeWidth="2" />
      <ellipse cx="104" cy="180" rx="25" ry="96" fill="url(#le-glass-glow)" />
      <ellipse cx="98" cy="146" rx="9" ry="24" fill="#fff5dc" fillOpacity="0.32" transform="rotate(-18 98 146)" />
      <ellipse cx="104" cy="180" rx="17" ry="76" fill="none" stroke="#8e9baa" strokeOpacity="0.36" />
      <ellipse cx="104" cy="180" rx="10" ry="52" fill="none" stroke="#6d7b89" strokeOpacity="0.28" />

      {/* Cylinder gloss and lower shadow */}
      <rect x="144" y="64" width="684" height="44" fill="url(#le-gloss)" opacity="0.5" />
      <rect x="58" y="280" width="770" height="16" rx="8" fill="#000" opacity="0.35" />
    </svg>
  )
}
