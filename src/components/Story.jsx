import { m } from 'framer-motion';
import imageRotulo from '../assets/bulldog.webp';
import { reveal, revealFade } from '../motion/variants';
import ParallaxMedia from '../motion/ParallaxMedia';

const PILLARS = [
  {
    title: 'Fermentación lenta',
    body: 'La hogaza del día se empieza dos días antes. Cuarenta y ocho horas entre la harina y el horno. La diferencia se escucha al partir el pan.',
  },
  {
    title: 'Café con trazabilidad',
    body: 'Cada microlote tiene productor y finca. Rafael Silva en Chalchuapa, Bicafe en La Fany. Compramos por nombre, no por volumen.',
  },
  {
    title: 'Cocina servida en barra',
    body: 'La carta cambia según lo que haya llegado esa mañana. No hay menú permanente. Lo que sirves hoy no es exactamente lo que serviste la semana pasada, y eso es a propósito.',
  },
];

export default function Story() {
  return (
    <section
      id="story"
      aria-label="Masa madre y proceso"
      className="section bg-brand-background border-t border-brand-border"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left Column */}
          <m.div
            className="lg:col-span-5 lg:sticky lg:top-28 space-y-8 text-left"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="eyebrow flex items-center gap-3">
              <span className="w-8 h-px bg-brand-textSubtle/60" aria-hidden="true" />
              La historia
            </p>

            <h2 className="h-section">
              Masa madre desde el primer día, el mismo horno encendido a las cinco de la mañana.
            </h2>

            <p className="font-sans text-[15px] md:text-[16px] text-brand-textSubtle leading-relaxed max-w-reading">
              Abrimos en 2018 en un local del Boulevard Las Palmeras con una sola mesa y un horno. Hoy seguimos siendo un local pequeño. Lo que cambió es la constancia: la misma masa madre desde el primer día, los mismos productores de café, el mismo horario.
            </p>

            <div className="pt-2">
              <p className="font-display text-base text-brand-textMain italic">
                — Alejandro &amp; el equipo de cocina
              </p>
            </div>
          </m.div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-12">

            <m.ul
              className="space-y-10"
              variants={revealFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {PILLARS.map((pillar, i) => (
                <li key={pillar.title} className="grid grid-cols-12 gap-6 items-start">
                  <span className="col-span-2 font-sans text-[13px] font-medium text-brand-textMuted tabular-nums pt-2">
                    0{i + 1}
                  </span>
                  <div className="col-span-10 space-y-3 border-t border-brand-border pt-4">
                    <h3 className="font-display text-[1.25rem] md:text-[1.5rem] text-brand-textMain font-normal leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-[14px] md:text-[15px] text-brand-textMain leading-relaxed max-w-reading">
                      {pillar.body}
                    </p>
                  </div>
                </li>
              ))}
            </m.ul>

            <m.figure
              className="img-grid-item"
              variants={revealFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="aspect-[16/9] overflow-hidden bg-brand-stone">
                <ParallaxMedia intensity={30} className="w-full h-full">
                  <img
                    src={imageRotulo}
                    alt="Rótulo original Panna & Pomodoro, Boulevard Las Palmeras, 2018"
                    loading="lazy"
                    decoding="async"
                    className="image-zoom-slow w-full h-full object-cover"
                  />
                </ParallaxMedia>
              </div>
              <figcaption className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle mt-3">
                Boulevard Las Palmeras · 2018
              </figcaption>
            </m.figure>
          </div>

        </div>
      </div>
    </section>
  );
}
