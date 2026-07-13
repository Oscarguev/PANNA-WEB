import { m } from 'framer-motion';
import { EASE } from '../motion/variants';
import { MapPinIcon, ClockIcon, PhoneIcon } from './Icons';

/**
 * Location — dirección, horario, cómo llegar.
 * Bloque previo al footer. Sin mapa dinámico (privacidad + cero API key).
 */
const MAPS_URL =
  'https://www.google.com/maps/place/Panna+%26+Pomodoro/@13.7229219,-89.7212373,17z/';

export default function Location() {
  return (
    <section
      id="location"
      aria-label="Dónde estamos"
      className="section bg-brand-background border-t border-brand-border"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">

          {/* Texto */}
          <m.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE.silk }}
          >
            <p className="eyebrow flex items-center gap-3">
              <span className="w-8 h-px bg-brand-textSubtle/60" aria-hidden="true" />
              Dónde estamos
            </p>
            <h2 className="h-section">
              Boulevard Las Palmeras, CC El Arco.
            </h2>
            <p className="font-sans text-[15px] text-brand-textSubtle leading-relaxed mt-5 max-w-reading">
              Sobre el Boulevard, dentro del centro comercial El Arco. Estacionamiento disponible en el CC. Llegadas a pie o en coche por la salida Sonsonate centro.
            </p>

            <ul className="mt-10 space-y-6">
              <li className="flex items-start gap-4">
                <MapPinIcon size={18} className="text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textMuted mb-1">Dirección</p>
                  <p className="font-sans text-[15px] text-brand-textMain leading-relaxed">
                    Boulevard Las Palmeras<br />
                    CC El Arco · Sonsonate, El Salvador
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <ClockIcon size={18} className="text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textMuted mb-1">Horario</p>
                  <p className="font-sans text-[15px] text-brand-textMain leading-relaxed tabular-nums">
                    Lun – Jue &nbsp;7:00 – 21:00<br />
                    Vie – Sáb &nbsp;7:00 – 22:00<br />
                    Domingo &nbsp;&nbsp;&nbsp;7:00 – 21:00
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <PhoneIcon size={18} className="text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textMuted mb-1">Teléfono</p>
                  <a
                    href="tel:+50324511000"
                    className="font-sans text-[15px] text-brand-textMain hover:text-brand-primary transition-colors duration-base tabular-nums"
                  >
                    2451-1000
                  </a>
                  <span className="block font-sans text-[12px] text-brand-textMuted mt-0.5">WhatsApp y llamadas</span>
                </div>
              </li>
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-underline"
              >
                Abrir en Google Maps
                <span className="ml-2" aria-hidden="true">↗</span>
              </a>
              <span className="font-sans text-[12px] text-brand-textMuted tabular-nums">
                Coordenadas: 13.7229, -89.7190
              </span>
            </div>
          </m.div>

          {/* Mapa estático (OpenStreetMap embed) */}
          <m.div
            className="md:col-span-7"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.10, ease: EASE.silk }}
          >
            <figure className="relative aspect-[4/3] md:aspect-[5/4] w-full overflow-hidden border border-brand-border bg-brand-placeholder">
              <iframe
                title="Mapa de Panna & Pomodoro, Boulevard Las Palmeras, Sonsonate"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-89.7215%2C13.7220%2C-89.7180%2C13.7240&amp;layer=mapnik&amp;marker=13.7229%2C-89.7190"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </figure>
            <p className="font-sans text-[12px] text-brand-textMuted mt-3 text-center md:text-left">
              Mapa cortesía de OpenStreetMap. Para indicaciones paso a paso, abre Google Maps.
            </p>
          </m.div>
        </div>
      </div>
    </section>
  );
}
