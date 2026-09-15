export default function NuezCorazonIcon({ className = "w-8 h-8", title = "NuezBandida" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label={title}
      role="img"
    >
      <defs>
        {/* Sombra suave */}
        <filter id="iconShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" floodColor="#210208" />
        </filter>

        {/* Gradiente para la cáscara de nuez externa */}
        <linearGradient id="walnutOuter" x1="10" y1="10" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8a6242" />
          <stop offset="50%" stopColor="#6f4e37" />
          <stop offset="100%" stopColor="#4b3621" />
        </linearGradient>

        {/* Gradiente para el borde interior / labio de la nuez tallada */}
        <linearGradient id="walnutInnerRim" x1="16" y1="14" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#cfae86" />
          <stop offset="50%" stopColor="#b1875e" />
          <stop offset="100%" stopColor="#7a5332" />
        </linearGradient>

        {/* Brillo y profundidad de la cavidad interior */}
        <linearGradient id="cavityBg" x1="32" y1="20" x2="32" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#450410" />
          <stop offset="100%" stopColor="#210208" />
        </linearGradient>

        {/* Corazón de rubí / burdeos luminoso */}
        <radialGradient id="rubyHeartGlow" cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#e2738f" />
          <stop offset="35%" stopColor="#b85068" />
          <stop offset="70%" stopColor="#6d071a" />
          <stop offset="100%" stopColor="#450410" />
        </radialGradient>

        {/* Brillo especular en la cáscara */}
        <linearGradient id="shellHighlight" x1="20" y1="10" x2="25" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g filter="url(#iconShadow)">
        {/* Silueta exterior de la nuez con forma de corazón */}
        <path
          d="M32 20.5
             C27 11.5 13 10.5 8.5 24
             C5.5 33 11 44.5 32 58
             C53 44.5 58.5 33 55.5 24
             C51 10.5 37 11.5 32 20.5 Z"
          fill="url(#walnutOuter)"
          stroke="#3b2b1a"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Texturas orgánicas de cáscara de nuez (arrugas características) */}
        <path
          d="M11 27 C13 32 10 37 13 44
             M14 23 C17 28 15 34 19 41
             M18 19 C20 23 18 29 23 35"
          stroke="#4b3621"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M53 27 C51 32 54 37 51 44
             M50 23 C47 28 49 34 45 41
             M46 19 C44 23 46 29 41 35"
          stroke="#4b3621"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Borde tallado interior de la nuez (labio claro) */}
        <path
          d="M32 24
             C28 16 16.5 15.5 13.5 25.5
             C11.5 32.5 17 41 32 52.5
             C47 41 52.5 32.5 50.5 25.5
             C47.5 15.5 36 16 32 24 Z"
          fill="url(#walnutInnerRim)"
          stroke="#4b3621"
          strokeWidth="1"
        />

        {/* Cavidad oscura detrás del corazón */}
        <path
          d="M32 26
             C29 19.5 19.5 19 17 27
             C15 33 20 40 32 49
             C44 40 49 33 47 27
             C44.5 19 35 19.5 32 26 Z"
          fill="url(#cavityBg)"
        />

        {/* Corazón interior luminoso (Burdeos / Gema) */}
        <path
          d="M32 27
             C29.5 20.5 21 20 18.5 27.5
             C16.8 33 21.5 39.5 32 48
             C42.5 39.5 47.2 33 45.5 27.5
             C43 20 34.5 20.5 32 27 Z"
          fill="url(#rubyHeartGlow)"
          stroke="#fbebee"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />

        {/* Reflejo / brillo especular interior del corazón */}
        <path
          d="M23 24 C20 25 19 28 20 30 C21 28 24 25.5 27 25 C25.5 24.3 24.2 24.1 23 24 Z"
          fill="#ffffff"
          opacity="0.5"
        />

        {/* Costura base de la nuez donde se abrazan las dos mitades */}
        <path
          d="M32 48 L32 58"
          stroke="#3b2b1a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
