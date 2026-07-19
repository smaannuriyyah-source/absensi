"use client";

export default function LoginAnimation() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <svg
        viewBox="0 0 500 400"
        className="w-full max-w-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glass blur filter */}
          <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <filter id="glassBlurHeavy" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>

          {/* Glass gradient fills */}
          <linearGradient id="glassLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="50%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="glassDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="50%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="white" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="greenTint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="greenGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="blueTint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="refractionBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="40%" stopColor="white" stopOpacity="0.3" />
            <stop offset="60%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="phoneScreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#dcfce7" stopOpacity="0.7" />
          </linearGradient>

          {/* Top highlight for glass */}
          <linearGradient id="topHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="30%" stopColor="white" stopOpacity="0.7" />
            <stop offset="70%" stopColor="white" stopOpacity="0.7" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background ambient glow */}
        <circle cx="250" cy="200" r="160" fill="url(#greenGlow)" opacity="0.15" filter="url(#glassBlurHeavy)" />

        {/* Floating glass particles */}
        <g className="animate-float-slow">
          <circle cx="60" cy="60" r="18" fill="url(#glassLight)" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
        </g>
        <g className="animate-float-medium">
          <circle cx="440" cy="90" r="14" fill="url(#glassLight)" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
        </g>
        <g className="animate-float-fast">
          <circle cx="90" cy="340" r="10" fill="url(#glassLight)" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
        </g>
        <g className="animate-float-gentle">
          <circle cx="420" cy="310" r="16" fill="url(#glassLight)" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
        </g>
        <g className="animate-pulse-slow">
          <circle cx="250" cy="35" r="6" fill="#4ade80" opacity="0.4" />
        </g>

        {/* Decorative dot grid */}
        <g opacity="0.12">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <circle
                key={`dot-${row}-${col}`}
                cx={90 + col * 22}
                cy={55 + row * 22}
                r="1.5"
                fill="#16a34a"
              />
            ))
          )}
        </g>
        <g opacity="0.08">
          {Array.from({ length: 3 }).map((_, row) =>
            Array.from({ length: 3 }).map((_, col) => (
              <circle
                key={`dot2-${row}-${col}`}
                cx={370 + col * 22}
                cy={260 + row * 22}
                r="1.5"
                fill="#16a34a"
              />
            ))
          )}
        </g>

        {/* Light refraction beam */}
        <g className="animate-[refractionMove_6s_ease-in-out_infinite]">
          <rect x="80" y="175" width="340" height="3" rx="1.5" fill="url(#refractionBeam)" opacity="0.4" />
        </g>

        {/* ============ MAIN SMARTPHONE (GLASS) ============ */}
        <g className="animate-float-gentle">
          {/* Phone outer glass body */}
          <rect x="175" y="100" width="150" height="260" rx="22" ry="22" fill="url(#glassLight)" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
          <rect x="175" y="100" width="150" height="260" rx="22" ry="22" fill="none" stroke="url(#topHighlight)" strokeWidth="1" />

          {/* Phone inner frame */}
          <rect x="183" y="115" width="134" height="225" rx="6" ry="6" fill="url(#phoneScreen)" />

          {/* Phone notch glass */}
          <rect x="225" y="105" width="50" height="10" rx="5" ry="5" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />

          {/* Screen header bar */}
          <rect x="193" y="125" width="114" height="22" rx="8" fill="white" fillOpacity="0.5" stroke="#16a34a" strokeWidth="0.5" strokeOpacity="0.3" />
          <rect x="203" y="130" width="55" height="10" rx="4" fill="#16a34a" fillOpacity="0.7" />
          <circle cx="280" cy="136" r="5" fill="white" fillOpacity="0.5" stroke="#16a34a" strokeWidth="0.5" strokeOpacity="0.4" />

          {/* Attendance list item 1 - Glass card */}
          <g>
            <rect x="193" y="155" width="114" height="30" rx="10" fill="white" fillOpacity="0.45" stroke="white" strokeWidth="0.5" strokeOpacity="0.4" />
            {/* Top highlight */}
            <line x1="200" y1="155.5" x2="300" y2="155.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
            <circle cx="207" cy="170" r="8" fill="#dcfce7" fillOpacity="0.8" />
            <path d="M203 170 L206 173 L211 167" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="220" y="164" width="48" height="4" rx="2" fill="#6b7280" fillOpacity="0.3" />
            <rect x="220" y="172" width="32" height="3" rx="1.5" fill="#9ca3af" fillOpacity="0.25" />
          </g>

          {/* Attendance list item 2 - Glass card */}
          <g>
            <rect x="193" y="192" width="114" height="30" rx="10" fill="white" fillOpacity="0.45" stroke="white" strokeWidth="0.5" strokeOpacity="0.4" />
            <line x1="200" y1="192.5" x2="300" y2="192.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
            <circle cx="207" cy="207" r="8" fill="#dcfce7" fillOpacity="0.8" />
            <path d="M203 207 L206 210 L211 204" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="220" y="201" width="48" height="4" rx="2" fill="#6b7280" fillOpacity="0.3" />
            <rect x="220" y="209" width="32" height="3" rx="1.5" fill="#9ca3af" fillOpacity="0.25" />
          </g>

          {/* Attendance list item 3 - Glass card (absent) */}
          <g>
            <rect x="193" y="229" width="114" height="30" rx="10" fill="white" fillOpacity="0.45" stroke="white" strokeWidth="0.5" strokeOpacity="0.4" />
            <line x1="200" y1="229.5" x2="300" y2="229.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
            <circle cx="207" cy="244" r="8" fill="#fef9c3" fillOpacity="0.8" />
            <path d="M204 241 L210 247 M204 247 L210 241" stroke="#ca8a04" strokeWidth="2" fill="none" strokeLinecap="round" />
            <rect x="220" y="238" width="48" height="4" rx="2" fill="#6b7280" fillOpacity="0.3" />
            <rect x="220" y="246" width="32" height="3" rx="1.5" fill="#9ca3af" fillOpacity="0.25" />
          </g>

          {/* Big checkmark - Glass badge */}
          <g className="animate-check-draw">
            <circle cx="250" cy="292" r="18" fill="url(#greenTint)" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="250" cy="292" r="18" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.4" />
            <path
              d="M240 292 L247 299 L262 284"
              stroke="#16a34a"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-stroke-draw"
            />
          </g>

          {/* Screen bottom nav glass */}
          <rect x="193" y="312" width="114" height="18" rx="8" fill="white" fillOpacity="0.35" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
          <circle cx="220" cy="321" r="3" fill="#16a34a" fillOpacity="0.6" />
          <circle cx="237" cy="321" r="3" fill="#9ca3af" fillOpacity="0.4" />
          <circle cx="254" cy="321" r="3" fill="#9ca3af" fillOpacity="0.4" />
          <circle cx="271" cy="321" r="3" fill="#9ca3af" fillOpacity="0.4" />
        </g>

        {/* ============ FLOATING GLASS CARD - STAT 1 ============ */}
        <g className="animate-float-medium">
          <g transform="translate(70, 140)">
            {/* Card glass */}
            <rect x="0" y="0" width="70" height="55" rx="14" fill="url(#glassLight)" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" />
            {/* Top highlight */}
            <line x1="8" y1="0.5" x2="62" y2="0.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.6" />
            {/* Icon circle */}
            <circle cx="22" cy="20" r="10" fill="#dcfce7" fillOpacity="0.7" />
            <path d="M18 20 L21 23 L26 17" stroke="#16a34a" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Text lines */}
            <rect x="37" y="16" width="22" height="4" rx="2" fill="#16a34a" fillOpacity="0.5" />
            <rect x="37" y="23" width="16" height="3" rx="1.5" fill="#6b7280" fillOpacity="0.25" />
            {/* Number */}
            <text x="12" y="46" fontSize="11" fontWeight="bold" fill="#16a34a" fillOpacity="0.8">98%</text>
          </g>
        </g>

        {/* ============ FLOATING GLASS CARD - STAT 2 ============ */}
        <g className="animate-float-slow">
          <g transform="translate(360, 130)">
            <rect x="0" y="0" width="70" height="55" rx="14" fill="url(#glassLight)" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="8" y1="0.5" x2="62" y2="0.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.6" />
            {/* Bar chart icon */}
            <rect x="12" y="22" width="6" height="12" rx="2" fill="#86efac" fillOpacity="0.7" />
            <rect x="21" y="15" width="6" height="19" rx="2" fill="#4ade80" fillOpacity="0.7" />
            <rect x="30" y="10" width="6" height="24" rx="2" fill="#16a34a" fillOpacity="0.7" />
            <rect x="45" y="16" width="18" height="4" rx="2" fill="#16a34a" fillOpacity="0.5" />
            <rect x="45" y="23" width="14" height="3" rx="1.5" fill="#6b7280" fillOpacity="0.25" />
            <text x="12" y="46" fontSize="11" fontWeight="bold" fill="#16a34a" fillOpacity="0.8">350</text>
          </g>
        </g>

        {/* ============ FLOATING GLASS BOOK ============ */}
        <g className="animate-float-medium">
          <g transform="translate(65, 260)">
            {/* Book body glass */}
            <rect x="0" y="0" width="52" height="42" rx="8" fill="url(#blueTint)" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" />
            <line x1="5" y1="0.5" x2="47" y2="0.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
            {/* Book spine */}
            <rect x="0" y="0" width="6" height="42" rx="3" fill="#3b82f6" fillOpacity="0.3" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
            {/* Pages */}
            <rect x="10" y="6" width="35" height="30" rx="4" fill="white" fillOpacity="0.4" />
            {/* Lines */}
            <line x1="14" y1="14" x2="38" y2="14" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
            <line x1="14" y1="20" x2="34" y2="20" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
            <line x1="14" y1="26" x2="30" y2="26" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
          </g>
        </g>

        {/* ============ FLOATING GLASS GRADUATION CAP ============ */}
        <g className="animate-float-slow">
          <g transform="translate(370, 230)">
            {/* Cap glass */}
            <polygon points="30,5 58,20 30,33 2,20" fill="url(#glassDark)" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" />
            <polygon points="30,5 58,20 30,24 2,20" fill="white" fillOpacity="0.1" />
            {/* Tassel */}
            <line x1="58" y1="20" x2="58" y2="38" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.7" />
            <circle cx="58" cy="40" r="3" fill="#f59e0b" fillOpacity="0.7" />
            {/* Cap board */}
            <rect x="10" y="20" width="40" height="4" rx="2" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
          </g>
        </g>

        {/* ============ FLOATING GLASS CLIPBOARD ============ */}
        <g className="animate-float-gentle">
          <g transform="translate(55, 180)">
            {/* Clipboard glass */}
            <rect x="0" y="8" width="48" height="58" rx="10" fill="url(#glassLight)" stroke="white" strokeWidth="0.8" strokeOpacity="0.35" />
            <line x1="6" y1="8.5" x2="42" y2="8.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
            {/* Clip */}
            <rect x="14" y="3" width="20" height="10" rx="5" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
            <rect x="18" y="0" width="12" height="6" rx="3" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
            {/* Check items */}
            <g>
              <rect x="8" y="20" width="9" height="9" rx="3" fill="#dcfce7" fillOpacity="0.6" stroke="#16a34a" strokeWidth="0.8" strokeOpacity="0.4" />
              <path d="M10.5 24.5 L12 26 L16 21.5" stroke="#16a34a" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeOpacity="0.6" />
              <rect x="21" y="22" width="18" height="3" rx="1.5" fill="#6b7280" fillOpacity="0.2" />
            </g>
            <g>
              <rect x="8" y="34" width="9" height="9" rx="3" fill="#dcfce7" fillOpacity="0.6" stroke="#16a34a" strokeWidth="0.8" strokeOpacity="0.4" />
              <path d="M10.5 38.5 L12 40 L16 35.5" stroke="#16a34a" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeOpacity="0.6" />
              <rect x="21" y="36" width="18" height="3" rx="1.5" fill="#6b7280" fillOpacity="0.2" />
            </g>
            <g>
              <rect x="8" y="48" width="9" height="9" rx="3" fill="#fef9c3" fillOpacity="0.5" stroke="#ca8a04" strokeWidth="0.8" strokeOpacity="0.3" />
              <rect x="21" y="50" width="18" height="3" rx="1.5" fill="#6b7280" fillOpacity="0.2" />
            </g>
          </g>
        </g>

        {/* ============ FLOATING GLASS CHART CARD ============ */}
        <g className="animate-float-medium">
          <g transform="translate(390, 180)">
            <rect x="0" y="0" width="50" height="42" rx="10" fill="url(#glassLight)" stroke="white" strokeWidth="0.8" strokeOpacity="0.35" />
            <line x1="6" y1="0.5" x2="44" y2="0.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
            {/* Mini line chart */}
            <path d="M8 30 L16 22 L24 16 L32 20 L42 12" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="8" cy="30" r="2" fill="#16a34a" fillOpacity="0.6" />
            <circle cx="16" cy="22" r="2" fill="#16a34a" fillOpacity="0.6" />
            <circle cx="24" cy="16" r="2" fill="#16a34a" fillOpacity="0.6" />
            <circle cx="32" cy="20" r="2" fill="#16a34a" fillOpacity="0.6" />
            <circle cx="42" cy="12" r="2" fill="#16a34a" fillOpacity="0.6" />
          </g>
        </g>

        {/* Connection lines (glass dashed) */}
        <g opacity="0.15">
          <path d="M140 170 Q 175 155 175 165" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeDasharray="4 4" className="animate-dash" />
          <path d="M325 195 Q 345 185 360 195" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeDasharray="4 4" className="animate-dash" />
          <path d="M115 275 Q 145 260 175 270" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeDasharray="4 4" className="animate-dash" />
        </g>

        {/* Small glass stars */}
        <g className="animate-pulse-slow">
          <path d="M150 95 L152 100 L157 100 L153 103 L155 108 L150 105 L145 108 L147 103 L143 100 L148 100 Z" fill="#fbbf24" fillOpacity="0.5" />
        </g>
        <g className="animate-pulse-medium">
          <path d="M358 82 L360 87 L365 87 L361 90 L363 95 L358 92 L353 95 L355 90 L351 87 L356 87 Z" fill="#fbbf24" fillOpacity="0.4" />
        </g>
        <g className="animate-pulse-slow">
          <path d="M420 345 L422 350 L427 350 L423 353 L425 358 L420 355 L415 358 L417 353 L413 350 L418 350 Z" fill="#4ade80" fillOpacity="0.4" />
        </g>
      </svg>
    </div>
  );
}
