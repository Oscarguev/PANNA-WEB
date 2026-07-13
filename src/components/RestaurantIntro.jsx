import { m } from 'framer-motion';
import { EASE } from '../motion/variants';
import pan from '../assets/pan.webp';

/**
 * RestaurantIntro — breve presentación del lugar.
 * Layout asimétrico 5/7 cols (mobile stack, desktop 5+7).
 *
 * Datos verificables (no inventados):
 * - 2018 (memoria proyecto)
 * - 48 h fermentación (copy previa)
 * Foto: pan.webp (auténtica Panna, sin uniformes ajenos).
 */
const FACTS = [
  { kpi: '2018', label: 'Año de apertura' },
  { kpi: '48 h', label: 'Fermentación de masa madre' },
];

export default function RestaurantIntro() {
  return (
    <section
      id="restaurant"
      aria-label="Sobre el restaurante"
      className="section bg-brand-background"
    >
      <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
        {/* Texto a la izquierda (5 cols) */}
        <m.div
          className="md:col-span-5 md:sticky md:top-32"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE.silk }}
        >
          <p className="eyebrow flex items-center gap-3">
            <span className="w-8 h-px bg-brand-textSubtle/60" aria-hidden="true" />
            El restaurante
          </p>

          <h2 className="h-section mb-6">
            Un salón pequeño que se toma en serio lo que sirve.
          </h2>

          <p className="font-sans text-[15px] md:text-[16px] text-brand-textSubtle leading-relaxed mb-4 max-w-reading">
            Panna &amp; Pomodoro abrió en 2018 sobre el Boulevard Las Palmeras con una idea clara: hornear masa madre al amanecer, traer café de productores que visitamos y servir una cocina italiana honesta, en barra, sin prisa.
          </p>
          <p className="font-sans text-[15px] md:text-[16px] text-brand-textSubtle leading-relaxed max-w-reading">
            Hoy seguimos igual: una cocina abierta, una barra corta, una mesa para conversar.
          </p>

          {/* KPIs (lista de hechos verificados) */}
          <ul className="mt-10 grid grid-cols-2 gap-6 border-t border-brand-border pt-8" aria-label="Datos del restaurante">
            {FACTS.map((f) => (
              <li key={f.label} className="space-y-2">
                <span className="block font-display text-[1.75rem] md:text-[2.25rem] font-light leading-none text-brand-textMain tracking-tight tabular-nums">
                  {f.kpi}
                </span>
                <span className="block font-sans text-[11px] uppercase tracking-[0.14em] text-brand-textMuted leading-tight">
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        </m.div>

        {/* Foto + caption (7 cols) */}
        <m.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.10, ease: EASE.silk }}
        >
          <figure className="bg-brand-surface img-grid-item">
            <div className="aspect-[4/5] md:aspect-[5/6] overflow-hidden">
              <img
                src={pan}
                alt="Hogazas de masa madre recién salidas del horno"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover image-zoom-slow"
              />
            </div>
            <figcaption className="px-1 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle flex items-center justify-between gap-3">
              <span>Hogaza del día · fermentación 48 h</span>
              <span className="text-brand-textMuted normal-case tracking-normal text-[12px]">Sonsonate</span>
            </figcaption>
          </figure>
        </m.div>
      </div>
    </section>
  );
}