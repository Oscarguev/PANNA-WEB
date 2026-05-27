export default function AmbientLayer() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Film-grain overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="panna-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#panna-grain)" />
      </svg>

      {/* Orb 1 — warm gold, top-left quadrant */}
      <div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          top: '-10%',
          left: '-5%',
          background: 'rgba(197,168,128,0.09)',
          filter: 'blur(120px)',
          animation: 'orbDrift1 14s ease-in-out infinite',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />

      {/* Orb 2 — amber, bottom-right quadrant */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          bottom: '-8%',
          right: '-5%',
          background: 'rgba(160,120,70,0.07)',
          filter: 'blur(140px)',
          animation: 'orbDrift2 11s ease-in-out infinite',
          animationDelay: '-10s',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />

      {/* Orb 3 — faint gold accent, mid-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 450,
          height: 450,
          top: '40%',
          right: '5%',
          background: 'rgba(197,168,128,0.05)',
          filter: 'blur(100px)',
          animation: 'orbDrift3 8s ease-in-out infinite',
          animationDelay: '-5s',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
}
