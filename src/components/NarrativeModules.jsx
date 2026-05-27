import { m } from 'framer-motion';
import imagePan from '../assets/pan.webp';
import coffeePour from '../assets/coffee_pour.webp';
import chefPlating from '../assets/chef_plating.webp';
import { EASE } from '../motion/variants';

const MODULES = [
  {
    id: 'pan',
    eyebrow: 'El Pan',
    headlineA: 'Fermentada',
    headlineB: 'Durante 48 Horas',
    body: 'Nuestra hogaza inicia su proceso dos días antes de llegar a tu mesa. La fermentación lenta desarrolla una acidez equilibrada, una miga abierta y una corteza que suena al romperla. No hay atajos en nuestro proceso.',
    credential: 'Horneada diariamente desde las 5:00 AM',
    image: imagePan,
    imageAlt: 'Hogaza de masa madre artesanal',
    imageLeft: true,
  },
  {
    id: 'cafe',
    eyebrow: 'El Café',
    headlineA: 'Del Productor',
    headlineB: 'a la Taza',
    body: 'Cada microlote tiene nombre, productor y finca de origen. Trabajamos con Rafael Silva en Finca El Ángel y con Bicafe en Finca La Fany, ambos en Chalchuapa. Conocemos el suelo donde creció cada grano antes de servirlo.',
    credential: 'Trazabilidad completa — sin intermediarios',
    image: coffeePour,
    imageAlt: 'Extracción de café de especialidad',
    imageLeft: false,
  },
  {
    id: 'lugar',
    eyebrow: 'El Lugar',
    headlineA: 'Una Mesa',
    headlineB: 'en Sonsonate',
    body: 'Un salón íntimo diseñado para desacelerar. La luz es cálida, la música es baja y el aroma del horno llega desde la cocina. Cada detalle fue pensado para que el tiempo pase de otra manera.',
    credential: 'Blvd Las Palmeras · CC El Arco · Est. 2018',
    image: chefPlating,
    imageAlt: 'Ambiente del restaurante Panna & Pomodoro',
    imageLeft: true,
  },
];

export default function NarrativeModules() {
  return (
    <div className="w-full">
      {MODULES.map((mod) => (
        <section
          key={mod.id}
          className="w-full border-t border-white/[0.03] grid grid-cols-1 lg:grid-cols-2 lg:min-h-[580px]"
        >
          {/* ── Image Panel ── */}
          <m.div
            className={`relative overflow-hidden aspect-[4/3] lg:aspect-auto ${mod.imageLeft ? 'lg:order-1' : 'lg:order-2'}`}
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE.silk }}
          >
            <img
              src={mod.image}
              alt={mod.imageAlt}
              className="w-full h-full object-cover"
            />
            {/* Dark base vignette */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            {/* Directional bleed toward text */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                mod.imageLeft
                  ? 'bg-gradient-to-r from-transparent via-transparent to-brand-background/80'
                  : 'bg-gradient-to-l from-transparent via-transparent to-brand-background/80'
              }`}
            />
          </m.div>

          {/* ── Text Panel ── */}
          <div
            className={`bg-brand-background flex items-center justify-center px-8 md:px-14 lg:px-16 xl:px-20 py-16 lg:py-12 ${
              mod.imageLeft ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            <m.div
              className="max-w-sm space-y-7 text-left"
              initial={{ opacity: 0, x: mod.imageLeft ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: EASE.silk, delay: 0.15 }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-4">
                <span className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-primary font-semibold">
                  {mod.eyebrow}
                </span>
                <div className="flex-grow h-[1px] bg-brand-primary/20" />
              </div>

              {/* Headline */}
              <h2 className="font-display text-brand-textMain font-light leading-[1.1] tracking-tight">
                <span className="block text-4xl md:text-5xl lg:text-[3.25rem]">{mod.headlineA}</span>
                <span className="block text-4xl md:text-5xl lg:text-[3.25rem] text-brand-primary italic">
                  {mod.headlineB}
                </span>
              </h2>

              {/* Body */}
              <p className="font-body text-brand-textMuted leading-relaxed font-light text-[15px]">
                {mod.body}
              </p>

              {/* Credential */}
              <div className="pt-2 border-t border-white/[0.06]">
                <span className="font-display italic text-brand-primary/70 text-[15px] font-light tracking-wide">
                  — {mod.credential}
                </span>
              </div>
            </m.div>
          </div>

        </section>
      ))}
    </div>
  );
}
