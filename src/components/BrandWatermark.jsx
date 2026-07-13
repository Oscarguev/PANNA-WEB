import logo from '../assets/logo.png';

export default function BrandWatermark({
  className = 'right-8 top-1/2 -translate-y-1/2',
  opacity = 0.05,
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
        className="h-12 w-auto object-contain"
      />

      <span
        className="font-wordmark uppercase text-[12px] tracking-[0.18em] text-brand-textSubtle"
        style={vertical ? { writingMode: 'vertical-rl', textOrientation: 'mixed' } : {}}
      >
        Panna &amp; Pomodoro
      </span>
    </div>
  );
}