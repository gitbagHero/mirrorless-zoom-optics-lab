export function LensExterior() {
  return (
    <svg
      className="lens-exterior"
      viewBox="0 0 960 380"
      role="img"
      aria-label="NIKKOR Z 24-200mm f/4-6.3 VR 外观重绘"
    >
      <defs>
        <linearGradient id="lx-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4a525c" />
          <stop offset="0.12" stopColor="#252b33" />
          <stop offset="0.46" stopColor="#0b0f14" />
          <stop offset="0.78" stopColor="#080b10" />
          <stop offset="1" stopColor="#010203" />
        </linearGradient>
        <linearGradient id="lx-zoom" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#59616b" />
          <stop offset="0.1" stopColor="#2a313a" />
          <stop offset="0.42" stopColor="#0c1015" />
          <stop offset="0.82" stopColor="#080b0f" />
          <stop offset="1" stopColor="#010203" />
        </linearGradient>
        <linearGradient id="lx-focus" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#555e69" />
          <stop offset="0.13" stopColor="#242b34" />
          <stop offset="0.5" stopColor="#0a0e13" />
          <stop offset="0.88" stopColor="#12171d" />
          <stop offset="1" stopColor="#020304" />
        </linearGradient>
        <linearGradient id="lx-front" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#020304" />
          <stop offset="0.42" stopColor="#1b222a" />
          <stop offset="0.72" stopColor="#3a434d" />
          <stop offset="1" stopColor="#080b10" />
        </linearGradient>
        <linearGradient id="lx-rear" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#222a32" />
          <stop offset="0.35" stopColor="#0b0f14" />
          <stop offset="0.74" stopColor="#151b22" />
          <stop offset="1" stopColor="#05070a" />
        </linearGradient>
        <linearGradient id="lx-metal" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#080c10" />
          <stop offset="0.25" stopColor="#4d5964" />
          <stop offset="0.45" stopColor="#1d252d" />
          <stop offset="0.7" stopColor="#727e8a" />
          <stop offset="0.88" stopColor="#222a32" />
          <stop offset="1" stopColor="#070a0e" />
        </linearGradient>
        <radialGradient id="lx-glass" cx="36%" cy="32%" r="72%">
          <stop offset="0" stopColor="#f4e6c8" stopOpacity="0.88" />
          <stop offset="0.12" stopColor="#c7d2dc" stopOpacity="0.48" />
          <stop offset="0.34" stopColor="#536c7b" />
          <stop offset="0.62" stopColor="#15242d" />
          <stop offset="0.86" stopColor="#050b10" />
          <stop offset="1" stopColor="#010203" />
        </radialGradient>
        <radialGradient id="lx-coating" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7ef0e3" stopOpacity="0.4" />
          <stop offset="0.52" stopColor="#6d7fce" stopOpacity="0.12" />
          <stop offset="1" stopColor="#6d7fce" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lx-gloss" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <pattern id="lx-zoom-ribs" width="8" height="320" patternUnits="userSpaceOnUse">
          <rect width="4" height="320" fill="#1a2027" />
          <rect x="4" width="1" height="320" fill="#040608" />
          <rect x="5" width="1" height="320" fill="#3a434d" opacity="0.5" />
        </pattern>
        <pattern id="lx-focus-ribs" width="4" height="304" patternUnits="userSpaceOnUse">
          <rect width="2" height="304" fill="#1a2028" />
          <rect x="2" width="1" height="304" fill="#040608" />
        </pattern>
        <filter id="lx-contact" x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>

      <ellipse cx="480" cy="356" rx="385" ry="13" fill="#08111f" opacity="0.25" filter="url(#lx-contact)" />

      {/* Main barrel silhouette */}
      <rect x="70" y="44" width="724" height="292" rx="20" fill="url(#lx-body)" stroke="#4b555f" strokeWidth="1.2" />

      {/* Front filter ring and barrel shoulder */}
      <rect x="70" y="44" width="58" height="292" rx="17" fill="url(#lx-front)" stroke="#48525c" strokeWidth="1.1" />
      <rect x="84" y="54" width="40" height="272" rx="12" fill="url(#lx-front)" stroke="#646f7a" strokeWidth="1" />
      <rect x="126" y="54" width="60" height="272" rx="12" fill="url(#lx-body)" />
      <line x1="126" y1="58" x2="126" y2="322" stroke="#05070a" strokeWidth="2" />
      <line x1="182" y1="58" x2="182" y2="322" stroke="#6f7a85" strokeOpacity="0.32" strokeWidth="1" />

      {/* Zoom ring */}
      <rect x="184" y="30" width="318" height="320" rx="16" fill="url(#lx-zoom)" stroke="#626c76" strokeWidth="1.2" />
      <rect x="184" y="30" width="318" height="320" rx="16" fill="url(#lx-zoom-ribs)" opacity="0.88" />
      <rect x="184" y="30" width="318" height="320" rx="16" fill="url(#lx-gloss)" opacity="0.7" />
      <rect x="184" y="30" width="318" height="24" rx="16" fill="#020304" opacity="0.45" />
      <rect x="184" y="326" width="318" height="24" rx="16" fill="#010203" opacity="0.62" />
      <rect x="184" y="30" width="12" height="320" rx="6" fill="#05070a" opacity="0.8" />
      <rect x="490" y="30" width="12" height="320" rx="6" fill="#030405" opacity="0.8" />
      <rect x="194" y="34" width="10" height="312" rx="5" fill="#ffffff" opacity="0.035" />
      <rect x="482" y="34" width="5" height="312" rx="3" fill="#ffffff" opacity="0.06" />

      {/* Focal length scale on the zoom ring */}
      <g fill="#e4ebf2" fillOpacity="0.72" fontSize="10" fontFamily="SFMono-Regular, Menlo, monospace" fontWeight="700">
        <text x="455" y="95">24</text>
        <text x="455" y="123">35</text>
        <text x="455" y="151">50</text>
        <text x="455" y="179">70</text>
        <text x="455" y="207">105</text>
        <text x="455" y="235">135</text>
        <text x="455" y="263">200</text>
      </g>
      <line x1="446" y1="76" x2="446" y2="278" stroke="#e4ebf2" strokeOpacity="0.25" strokeWidth="1" />

      {/* Smooth transition and focus ring */}
      <rect x="502" y="46" width="24" height="288" fill="url(#lx-body)" />
      <rect x="504" y="46" width="2" height="288" fill="#77828d" opacity="0.3" />
      <rect x="526" y="38" width="48" height="304" rx="9" fill="url(#lx-focus)" stroke="#5c6670" strokeWidth="1" />
      <rect x="526" y="38" width="48" height="304" rx="9" fill="url(#lx-focus-ribs)" opacity="0.9" />
      <rect x="526" y="38" width="48" height="304" rx="9" fill="url(#lx-gloss)" opacity="0.55" />

      {/* Rear barrel */}
      <rect x="574" y="44" width="218" height="292" rx="10" fill="url(#lx-rear)" />
      <rect x="574" y="44" width="218" height="292" rx="10" fill="url(#lx-gloss)" opacity="0.55" />
      <line x1="574" y1="48" x2="574" y2="332" stroke="#05070a" strokeWidth="2" />
      <line x1="790" y1="48" x2="790" y2="332" stroke="#59636d" strokeOpacity="0.4" strokeWidth="1" />

      {/* White rear marking */}
      <text
        x="710"
        y="190"
        fill="#edf3f8"
        fillOpacity="0.9"
        fontSize="21"
        fontFamily="SFMono-Regular, Menlo, monospace"
        fontWeight="700"
        letterSpacing="2.8"
        transform="rotate(-90 710 190)"
        textAnchor="middle"
      >
        24-200/4-6.3
      </text>

      {/* Switch and white index dot */}
      <rect x="760" y="104" width="11" height="62" rx="4" fill="#05070a" stroke="#7d8893" strokeWidth="0.8" />
      <rect x="762" y="110" width="7" height="18" rx="2" fill="#cbd5df" />
      <circle cx="768" cy="216" r="2.5" fill="#f5f8fa" fillOpacity="0.9" />

      {/* Rear mount: dark mount housing + restrained metal bayonet */}
      <rect x="792" y="38" width="48" height="304" fill="#0d1218" stroke="#4c5863" strokeWidth="1" />
      <ellipse cx="840" cy="190" rx="21" ry="152" fill="url(#lx-metal)" fillOpacity="0.58" stroke="#4f5b66" strokeWidth="1" />
      <ellipse cx="840" cy="190" rx="12" ry="132" fill="#04070a" />
      <ellipse cx="840" cy="190" rx="8" ry="112" fill="#0d1319" stroke="#37424d" strokeWidth="1" />
      <path d="M826 108h18M826 272h18" stroke="#c6d0da" strokeOpacity="0.45" strokeWidth="2" />

      {/* Front glass, filter thread and coating */}
      <ellipse cx="102" cy="190" rx="32" ry="112" fill="#04070a" stroke="#56616c" strokeWidth="2" />
      <ellipse cx="102" cy="190" rx="26" ry="101" fill="url(#lx-glass)" stroke="#111b23" strokeWidth="2" />
      <ellipse cx="102" cy="190" rx="26" ry="101" fill="url(#lx-coating)" />
      <ellipse cx="96" cy="152" rx="9" ry="25" fill="#fff3d7" fillOpacity="0.3" transform="rotate(-17 96 152)" />
      <ellipse cx="102" cy="190" rx="18" ry="79" fill="none" stroke="#9ba8b6" strokeOpacity="0.34" />
      <ellipse cx="102" cy="190" rx="10" ry="53" fill="none" stroke="#72808e" strokeOpacity="0.26" />
      <text
        x="86"
        y="190"
        fill="#d8e0e8"
        fillOpacity="0.6"
        fontSize="8"
        fontFamily="SFMono-Regular, Menlo, monospace"
        fontWeight="700"
        letterSpacing="1.3"
        transform="rotate(-90 86 190)"
        textAnchor="middle"
      >
        NIKKOR Z
      </text>

      {/* Cylinder lighting */}
      <rect x="126" y="54" width="664" height="48" fill="url(#lx-gloss)" opacity="0.55" />
      <rect x="70" y="314" width="770" height="22" rx="8" fill="#000" opacity="0.32" />
      <line x1="70" y1="46" x2="840" y2="46" stroke="#c2ccd5" strokeOpacity="0.2" strokeWidth="1.5" />
    </svg>
  )
}
