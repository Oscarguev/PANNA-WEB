import logo from '../assets/logo.png';

// ── EDITABLE: Textos del banner deslizante (credibility strip) ───────────
// Agrega, elimina o cambia cualquier texto. Aparece en bucle bajo el hero.
const ITEMS = [
  'Est. 2018 — Sonsonate, El Salvador',       // ✏️ año de fundación / ciudad
  'Masa Madre Fermentada 48 Horas',
  'Café de Especialidad — Proceso Natural Anaeróbico',
  'Finca El Ángel · Rafael Silva · Chalchuapa', // ✏️ nombre de finca y productor
  'Horneado Artesanal Diariamente',
  'Finca La Fany · Bicafe · El Salvador',
  'Pizza Napolitana a la Piedra',
  'Club PANNA Rewards',
];

function StripItem({ text }) {
  return (
    <span className="inline-flex items-center gap-5 px-5">
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="object-contain mix-blend-screen shrink-0"
        style={{ width: 14, height: 14, opacity: 0.35 }}
      />
      <span className="font-body text-[11px] tracking-[0.28em] uppercase text-brand-textMuted/50 whitespace-nowrap">
        {text}
      </span>
    </span>
  );
}

export default function CredibilityStrip() {
  return (
    <div className="w-full border-y border-white/[0.035] py-3.5 overflow-hidden bg-brand-background select-none">
      <div
        className="flex animate-marquee"
        style={{ width: 'max-content' }}
        onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
      >
        {/* Duplicated for seamless loop */}
        {[...ITEMS, ...ITEMS].map((text, i) => (
          <StripItem key={i} text={text} />
        ))}
      </div>
    </div>
  );
}
