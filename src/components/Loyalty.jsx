import { useState } from 'react';
import { AlertTriangleIcon } from './Icons';
import { useSessionStore } from '../stores/useSessionStore';
import { useUIStore } from '../stores/useUIStore';

const TIERS = [
  {
    name: 'Semilla',
    range: '0 – 499 puntos',
    blurb: 'Para empezar a acumular.',
    perks: [
      'Café espresso gratis en tu cumpleaños',
      'Prioridad de reserva en terraza',
    ],
  },
  {
    name: 'Brote',
    range: '500 – 1.499 puntos',
    blurb: 'Cuando ya somos regulares.',
    perks: [
      'Todo lo anterior',
      '10% de descuento en granos de café de especialidad',
      'Una bebida de cortesía al mes',
    ],
  },
  {
    name: 'Bosque',
    range: '1.500 puntos y más',
    blurb: 'Para quienes casi viven aquí.',
    perks: [
      'Todo lo anterior',
      'Mesa del Chef sin costo',
      'Cata privada de microlotes exóticos',
    ],
  },
];

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Loyalty() {
  const userSession = useSessionStore((state) => state);
  const openPortal  = useUIStore((state) => state.openPortal);

  const puntos = userSession?.loggedIn ? (userSession.points ?? 0) : 0;
  const nivel  = puntos >= 1500 ? 'Bosque' : puntos >= 500 ? 'Brote' : 'Semilla';

  const [loading, setLoading] = useState(false);
  const [notice, setNotice]   = useState(null);

  const handleSim = () => {
    setLoading(true);
    setNotice(null);
    setTimeout(() => {
      setLoading(false);
      setNotice({ kind: 'success', text: 'Saldo recargado en tu cuenta.' });
    }, 1200);
  };

  return (
    <section id="loyalty" className="section bg-brand-background border-t border-brand-border">
      <div className="container-page space-y-16">

        <header className="max-w-3xl space-y-4">
          <h2 className="h-section">
            Club PANNA. Por volver.
          </h2>
          <p className="text-brand-textMain text-base md:text-lg leading-relaxed max-w-reading">
            Diez puntos por cada dólar gastado en el local. Los puntos se acumulan
            solos y los puedes canjear por crédito directo en tu próxima cuenta.
            Sin aplicaciones. Sin niveles raros. Solo venir y ser parte.
          </p>
        </header>

        {/* Inline summary */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-t border-brand-border pt-8 gap-6">
          <dl className="flex flex-wrap items-baseline gap-x-12 gap-y-4">
            <div className="space-y-1">
              <dt className="text-[12px] text-brand-textSubtle">Tus puntos</dt>
              <dd className="font-display text-3xl md:text-4xl text-brand-textMain tabular-nums">
                {userSession?.loggedIn ? puntos.toLocaleString('es-SV') : '—'}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-[12px] text-brand-textSubtle">Tu nivel</dt>
              <dd className="font-display text-3xl md:text-4xl text-brand-textMain">
                {userSession?.loggedIn ? nivel : '—'}
              </dd>
            </div>
          </dl>

          <div className="flex items-center gap-6 text-[13px]">
            {userSession?.loggedIn ? (
              <button
                onClick={handleSim}
                disabled={loading}
                className="btn-underline gap-2"
              >
                {loading ? <><Spinner /> Recargando</> : 'Recargar saldo'}
              </button>
            ) : (
              <button
                onClick={openPortal}
                className="btn-underline"
              >
                Iniciar sesión para activar
              </button>
            )}
          </div>
        </div>

        {notice && (
          <p
            role="status"
            aria-live="polite"
            className={`text-[13px] border px-3 py-2.5 inline-flex items-center gap-2 ${
              notice.kind === 'success'
                ? 'text-brand-success border-brand-success/40 bg-brand-successBg'
                : 'text-brand-danger border-brand-danger/40 bg-brand-dangerBg'
            }`}
          >
            <AlertTriangleIcon size={14} aria-hidden="true" />
            {notice.text}
          </p>
        )}

        {/* Tiers — three columns, open, no cards, no accordion */}
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 border-t border-brand-border pt-10">
          {TIERS.map((tier, i) => (
            <li key={tier.name} className="space-y-4">
              <span className="text-[12px] text-brand-textSubtle tabular-nums">
                0{i + 1}
              </span>
              <h3 className="font-display text-2xl text-brand-textMain font-normal">
                {tier.name}
              </h3>
              <p className="font-sans text-[13px] text-brand-textSubtle uppercase tabular-nums tracking-[0.18em]">
                {tier.range}
              </p>
              <p className="text-[14px] text-brand-textMain leading-relaxed">
                {tier.blurb}
              </p>
              <ul className="space-y-2 pt-2">
                {tier.perks.map((perk) => (
                  <li key={perk} className="text-[13px] text-brand-textMain leading-relaxed">
                    {perk}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}