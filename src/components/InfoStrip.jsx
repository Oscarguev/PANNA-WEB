import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, PhoneIcon } from './Icons';

/**
 * InfoStrip — datos clave del restaurante visibles sin scroll.
 * 4 items en grid (mobile 2x2, desktop fila con separadores).
 */
const HOURS = [
  { days: 'Lun–Jue', time: '7:00 – 21:00' },
  { days: 'Vie–Sáb', time: '7:00 – 22:00' },
  { days: 'Dom',     time: '7:00 – 21:00' },
];

export default function InfoStrip() {
  return (
    <section
      aria-label="Información práctica del restaurante"
      className="bg-brand-surface border-y border-brand-border"
    >
      <div className="container-page grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-brand-border">
        {/* Ubicación */}
        <div className="py-7 md:py-9 md:pr-8 first:pt-7">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-brand-textMuted mb-3 flex items-center gap-2">
            <MapPinIcon size={14} className="text-brand-primary" aria-hidden="true" />
            Ubicación
          </p>
          <p className="font-sans text-[14px] md:text-[15px] text-brand-textMain leading-snug">
            Boulevard Las Palmeras<br />
            CC El Arco · Sonsonate
          </p>
        </div>

        {/* Horario */}
        <div className="py-7 md:py-9 md:px-8">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-brand-textMuted mb-3 flex items-center gap-2">
            <ClockIcon size={14} className="text-brand-primary" aria-hidden="true" />
            Horario
          </p>
          <ul className="font-sans text-[14px] md:text-[15px] text-brand-textMain leading-snug tabular-nums space-y-0.5">
            {HOURS.map((h) => (
              <li key={h.days}>
                <span className="text-brand-textMuted">{h.days}</span>{' '}
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Teléfono */}
        <div className="py-7 md:py-9 md:px-8">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-brand-textMuted mb-3 flex items-center gap-2">
            <PhoneIcon size={14} className="text-brand-primary" aria-hidden="true" />
            Teléfono
          </p>
          <a
            href="tel:+50324511000"
            className="font-sans text-[14px] md:text-[15px] text-brand-textMain tabular-nums hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            2451-1000
          </a>
          <p className="font-sans text-[12px] text-brand-textMuted mt-1">WhatsApp y llamadas</p>
        </div>

        {/* Reservar */}
        <div className="py-7 md:py-9 md:pl-8">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-brand-textMuted mb-3">
            Reservar
          </p>
          <Link to="/reservar" className="btn-primary-sm">
            Reservar una mesa
          </Link>
        </div>
      </div>
    </section>
  );
}