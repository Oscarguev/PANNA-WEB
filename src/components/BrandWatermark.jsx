import logo from '../assets/logo.png';

export default function BrandWatermark({
  className = 'right-8 top-1/2 -translate-y-1/2',
  opacity = 0.04,
  vertical = true,
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none z-0 flex flex-col items-center gap-3 ${className}`}
      style={{ opacity }}
    >
      <img
        src={logo}
        alt=""
        className="h-12 w-auto object-contain filter brightness-150 mix-blend-screen"
      />

      <span
        className="font-brand text-[11px] tracking-[0.5em] uppercase text-brand-textMuted"
        style={vertical ? { writingMode: 'vertical-rl', textOrientation: 'mixed' } : {}}
      >
        PANNA &amp; POMODORO
      </span>
    </div>
  );
}
