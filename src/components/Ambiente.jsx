import { m } from 'framer-motion';
import { EASE } from '../motion/variants';

/**
 * Ambiente — bloque tipográfico sobre el lugar.
 * Sin fotografía: hasta producir fotos reales del salón / fachada / barra /
 * equipo, evitamos usar pan.webp (recurso auténtico pero visualmente repetido
 * en otras secciones del Home) y descartamos cualquier claim visual no
 * documentado.
 */
export default function Ambiente() {
  return (
    <section
      id="ambiente"
      aria-label="El lugar"
      className="section bg-brand-background border-y border-brand-border"
    >
      <div className="container-page space-y-12">

        <m.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE.silk }}
        >
          <p className="eyebrow flex items-center gap-3">
            <span className="w-8 h-px bg-brand-textSubtle/60" aria-hidden="true" />
            El lugar
          </p>
          <h2 className="h-section">
            Servicio en barra, cocina abierta, horno desde las cinco de la mañana.
          </h2>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">

          <m.div
            className="md:col-span-6 space-y-6 border-t border-brand-border pt-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE.silk }}
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle">
              La barra
            </span>
            <p className="font-sans text-[16px] md:text-[17px] text-brand-textMain leading-relaxed max-w-reading">
              La barra es el lugar para esperar, leer o conversar. Por la mañana se sirve café de filtro y espresso de la máquina; por la tarde, bebidas y comida.
            </p>
          </m.div>

          <m.div
            className="md:col-span-6 space-y-6 border-t border-brand-border pt-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE.silk, delay: 0.08 }}
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle">
              La cocina
            </span>
            <p className="font-sans text-[16px] md:text-[17px] text-brand-textMain leading-relaxed max-w-reading">
              Cocina abierta a la vista, horno encendido desde temprano. La misma masa madre desde 2018 y los mismos productores de café de Chalchuapa.
            </p>
          </m.div>

        </div>

        <m.div
          className="border-t border-brand-border pt-6 flex flex-wrap items-baseline justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE.silk }}
        >
          <p className="font-sans text-[13px] text-brand-textSubtle">
            Boulevard Las Palmeras · CC El Arco · Sonsonate
          </p>
          <p className="font-sans text-[13px] text-brand-textSubtle tabular-nums">
            Dom — Jue 7:00 — 21:00 · Vie — Sáb 7:00 — 22:00
          </p>
        </m.div>
      </div>
    </section>
  );
}
