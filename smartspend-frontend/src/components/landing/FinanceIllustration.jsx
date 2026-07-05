
export const FinanceIllustration = () => (
  <svg viewBox="0 0 560 460" className="h-full w-full max-w-md" role="img" aria-label="Illustration of a person reviewing a rising finance chart next to a stack of coins">
    <defs>
      <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#0F9856" />
        <stop offset="100%" stopColor="#34E29A" />
      </linearGradient>
      <linearGradient id="coinGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34E29A" />
        <stop offset="100%" stopColor="#0F9856" />
      </linearGradient>
    </defs>

    <circle cx="280" cy="230" r="200" fill="#1FD67A" opacity="0.08" />

    <g opacity="0.15" stroke="rgb(var(--c-ink-400))" strokeWidth="2" fill="none">
      <path d="M60 90 C 40 130, 40 170, 70 200" />
      <path d="M60 90 C 90 110, 100 150, 70 200" />
      <path d="M500 320 C 480 360, 480 400, 510 430" />
      <path d="M500 320 C 530 340, 540 380, 510 430" />
    </g>

    <line x1="60" y1="410" x2="500" y2="410" stroke="rgb(var(--c-base-600))" strokeWidth="2" />

    <rect x="290" y="120" width="200" height="290" rx="18" fill="rgb(var(--c-base-800))" stroke="rgb(var(--c-base-600))" strokeWidth="2" />
    <rect x="312" y="145" width="90" height="14" rx="7" fill="rgb(var(--c-base-600))" />

    <g>
      <rect x="312" y="330" width="26" height="50" rx="5" fill="url(#barGrad)" opacity="0.55" />
      <rect x="348" y="300" width="26" height="80" rx="5" fill="url(#barGrad)" opacity="0.75" />
      <rect x="384" y="260" width="26" height="120" rx="5" fill="url(#barGrad)" opacity="0.9" />
      <rect x="420" y="210" width="26" height="170" rx="5" fill="url(#barGrad)" />
    </g>

    <polyline points="312,300 348,270 384,235 420,180 452,165" fill="none" stroke="#1FD67A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <polygon points="452,165 440,168 449,178" fill="#1FD67A" />

    <g>
      <ellipse cx="150" cy="395" rx="46" ry="14" fill="url(#coinGrad)" />
      <ellipse cx="150" cy="378" rx="46" ry="14" fill="url(#coinGrad)" />
      <ellipse cx="150" cy="361" rx="46" ry="14" fill="url(#coinGrad)" />
      <ellipse cx="150" cy="344" rx="46" ry="14" fill="#34E29A" />
      <text x="150" y="350" textAnchor="middle" fontSize="18" fontWeight="700" fill="#062017">₹</text>
    </g>

    <g>
      <rect x="195" y="330" width="16" height="80" rx="8" fill="rgb(var(--c-base-600))" />
      <rect x="225" y="330" width="16" height="80" rx="8" fill="rgb(var(--c-base-600))" />
      <path d="M188 260 Q 218 240 248 260 L 244 340 Q 218 355 192 340 Z" fill="#1FD67A" />
      <rect x="238" y="255" width="55" height="14" rx="7" fill="#1FD67A" transform="rotate(-18 238 262)" />
      <circle cx="216" cy="225" r="26" fill="rgb(var(--c-base-500))" />
    </g>

    <g>
      <circle cx="255" cy="195" r="16" fill="rgb(var(--c-base-800))" stroke="#1FD67A" strokeWidth="2" />
      <text x="255" y="200" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1FD67A">+</text>
    </g>
  </svg>
);