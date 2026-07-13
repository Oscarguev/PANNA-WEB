import { m } from 'framer-motion';
import imagePan from '../assets/pan.webp';
import coffeePour from '../assets/coffee_pour.webp';
import { EASE } from '../motion/variants';

const MODULES = [
  {
    id: 'pan',
    section: 'El pan',
    headlineA: 'Fermentada durante',
    headlineB: '48 horas.',
    body: 'Nuestra hogaza inicia su proceso dos días antes de llegar a tu mesa. La fermentación lenta desarrolla una acidez equilibrada, una miga abierta y una corteza que suena al romperla. No hay atajos en nuestro proceso.',
    credential: 'Horneada diariamente desde las 5:00 AM',
    image: imagePan,
    imageAlt: 'Hogaza de masa madre artesanal',
    imageLeft: true,
  },
  {
    id: 'cafe',
    section: 'El café',
    headlineA: 'Del productor',
    headlineB: 'a la taza.',
    body: 'Cada microlote tiene nombre, productor y finca de origen. Trabajamos con Rafael Silva en Finca El Ángel y con Bicafe en Finca La Fany, ambos en Chalchuapa. Conocemos el suelo donde creció cada grano antes de servirlo.',
    credential: 'Trazabilidad completa, sin intermediarios',
    image: coffeePour,
    imageAlt: 'Extracción de café de especialidad',
    imageLeft: false,
  },
  {
    id: 'lugar',
    section: 'El lugar',
    headlineA: 'Una mesa',
    headlineB: 'en Sonsonate.',
    body: 'Un salón íntimo diseñado para desacelerar. La luz es cálida, la música es baja y el aroma del horno llega desde la cocina. Cada detalle fue pensado para que el tiempo pase de otra manera.',
    credential: 'Blvd Las Palmeras · CC El Arco · Est. 2018',
    image: null,
    imageAlt: null,
    imageLeft: true,
  },
];

export default function NarrativeModules() {
  return (
    <div className="w-full">
      {MODULES.map((mod, i) => (
        <section
          key={mod.id}
          className={`w-full border-t border-brand-border lg:min-h-[580px] ${
            mod.image ? 'grid grid-cols-1 lg:grid-cols-2' : ''
          }`}
        >
          {mod.image && (
            <m.figure
              className={`relative overflow-hidden aspect-[4/3] lg:aspect-auto bg-brand-placeholder ${mod.imageLeft ? 'lg:order-1' : 'lg:order-2'}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: EASE.silk }}
            >
              <img
                src={mod.image}
                alt={mod.imageAlt}
                className="w-full h-full object-cover"
              />
            </m.figure>
          )}

          <div
            className={`bg-brand-background flex items-center justify-center px-8 md:px-14 lg:px-16 xl:px-20 py-16 lg:py-12 ${
              mod.image ? (mod.imageLeft ? 'lg:order-2' : 'lg:order-1') : ''
            }`}
          >
            <m.div
              className="max-w-md space-y-6 text-left"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: EASE.silk, delay: 0.15 }}
            >
              <div className="flex items-baseline gap-3 text-[12px] text-brand-textSubtle">
                <span className="tabular-nums">0{i + 1}</span>
                <span>·</span>
                <span>{mod.section}</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl text-brand-textMain font-light leading-[1.05] tracking-tighter">
                <span className="block">{mod.headlineA}</span>
                <span className="block">{mod.headlineB}</span>
              </h2>

              <p className="text-[15px] text-brand-textMain leading-relaxed max-w-reading">
                {mod.body}
              </p>

              <p className="text-[13px] text-brand-textSubtle pt-2 border-t border-brand-border">
                {mod.credential}
              </p>
            </m.div>
          </div>

        </section>
      ))}
    </div>
  );
}