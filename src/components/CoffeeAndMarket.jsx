import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { EASE } from '../motion/variants';
import coffeePour from '../assets/coffee_pour.webp';
import coffeeBourbon from '../assets/coffee_bourbon.webp';

/**
 * CoffeeAndMarket — bloque secundario sobrio de café y tienda.
 * Sin marquee animado. 2-col con texto + productos destacados (sin precios:
 * la lista vive en /market, no inventamos aquí).
 *
 * Los microlotes y panes listados son los mismos que existen en /market.
 */
const PRODUCTS = [
  {
    name: 'Bourbon Naranja · Finca El Ángel',
    desc: 'Microlote de Rafael Silva, Chalchuapa. Natural anaeróbico.',
  },
  {
    name: 'Heirloom · Finca La Fany',
    desc: 'Bicafe, Chalchuapa. Lavado, notas a melón y vainilla.',
  },
  {
    name: 'Hogaza de masa madre',
    desc: 'Fermentación de 48 h. Sale del horno cada mañana.',
  },
  {
    name: 'Rol de canela artesanal',
    desc: 'Masa tierna, canela de Saigón, glaseado clásico.',
  },
];

export default function CoffeeAndMarket() {
  return (
    <section
      id="coffee"
      aria-label="Café y tienda"
      className="section bg-brand-textMain text-brand-background border-y border-brand-textMain"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">

          {/* Header + texto */}
          <m.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE.silk }}
          >
            <p className="eyebrow-on-dark flex items-center gap-3">
              <span className="w-8 h-px bg-white/40" aria-hidden="true" />
              Café &amp; tienda
            </p>
            <h2 className="h-section-on-dark">
              Lo que servimos en barra también se lleva a casa.
            </h2>
            <p className="font-sans text-[15px] text-white/70 leading-relaxed mt-5 max-w-reading">
              Café de microlote, panes del día, repostería de masa madre y conservas de cocina. Compramos por nombre, tostamos en pequeño, vendemos directo.
            </p>

            <div className="mt-8">
              <Link to="/market" className="btn-underline-on-dark">
                Visitar tienda
                <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </div>
          </m.div>

          {/* Productos + foto */}
          <m.div
            className="md:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.10, ease: EASE.silk }}
          >
            {/* Lista de productos */}
            <ul className="md:col-span-7 space-y-0">
              {PRODUCTS.map((it, idx) => (
                <li
                  key={it.name}
                  className={`py-5 ${idx !== PRODUCTS.length - 1 ? 'border-b border-white/10' : ''}`}
                >
                  <h3 className="font-sans text-[15px] md:text-[16px] font-medium text-white mb-1">
                    {it.name}
                  </h3>
                  <p className="font-sans text-[13px] text-white/60 leading-snug">
                    {it.desc}
                  </p>
                </li>
              ))}
            </ul>

            {/* Foto pequeña */}
            <figure className="md:col-span-5">
              <div className="aspect-[3/4] overflow-hidden bg-brand-backgroundDark">
                <img
                  src={coffeeBourbon}
                  alt="Taza de café Bourbon Naranja servida en barra"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover image-zoom-slow"
                />
              </div>
              <figcaption className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/55 mt-3">
                Bourbon Naranja · Finca El Ángel
              </figcaption>
            </figure>
          </m.div>
        </div>

        {/* Foto inferior: barra */}
        <m.figure
          className="mt-16 md:mt-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE.silk }}
        >
          <div className="aspect-[16/7] overflow-hidden bg-brand-backgroundDark">
            <img
              src={coffeePour}
              alt="Café de filtro servido en la barra de Panna & Pomodoro"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover image-zoom-slow"
            />
          </div>
          <figcaption className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/55 mt-3">
            Servicio de barra · café de filtro y espresso
          </figcaption>
        </m.figure>
      </div>
    </section>
  );
}