import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { EASE } from '../motion/variants';
import { PhoneIcon, MapPinIcon } from './Icons';

/**
 * ReserveCTA — cierre de conversión.
 * Variación dark (carbón) para romper monotonía "fondo crema + título izq + imagen der".
 * CTA directo a /reservar + datos prácticos verificables.
 */
export default function ReserveCTA() {
  return (
    <section
      id="reservar-cta"
      aria-label="Reservar una mesa"
      className="section bg-brand-textMain text-brand-background"
    >
      <div className="container-page">
        <m.div
          className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE.silk }}
        >
          {/* Texto izq */}
          <div className="md:col-span-7 space-y-6">
            <p className="eyebrow-on-dark flex items-center gap-3">
              <span className="w-8 h-px bg-white/40" aria-hidden="true" />
              Reserva
            </p>

            <h2 className="h-section-on-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Reservar una mesa.
            </h2>

            <p className="font-sans text-[16px] text-white/75 leading-relaxed max-w-reading">
              Te confirmamos por teléfono en menos de 24 horas. Para grupos mayores a seis o eventos privados, llámanos directo.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/reservar" className="btn-primary-on-dark">
                Reservar ahora
                <span className="ml-2" aria-hidden="true">→</span>
              </Link>

              <a
                href="tel:+50324511000"
                className="btn-ghost-on-dark tabular-nums"
              >
                <PhoneIcon size={14} aria-hidden="true" />
                2451-1000
              </a>
            </div>
          </div>

          {/* Datos prácticos der */}
          <ul className="md:col-span-5 space-y-6 border-t md:border-t-0 md:border-l border-white/15 pt-8 md:pt-0 md:pl-10">
            <li className="flex items-start gap-4">
              <MapPinIcon size={18} className="text-white/70 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/55">Dirección</p>
                <p className="font-sans text-[15px] text-white leading-relaxed">
                  Boulevard Las Palmeras<br />CC El Arco · Sonsonate
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="shrink-0 mt-0.5 w-[18px] h-[18px] flex items-center justify-center text-white/70" aria-hidden="true">●</span>
              <div className="space-y-1">
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/55">Horario</p>
                <p className="font-sans text-[15px] text-white leading-relaxed tabular-nums">
                  Dom — Jue: 7:00 — 21:00<br />Vie — Sáb: 7:00 — 22:00
                </p>
              </div>
            </li>
          </ul>
        </m.div>
      </div>
    </section>
  );
}
