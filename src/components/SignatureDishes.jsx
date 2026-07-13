import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import ScrollReveal from '../motion/ScrollReveal';
import StaggerGroup from '../motion/StaggerGroup';
import RevealImage from '../motion/RevealImage';
import sourdoughToast from '../assets/sourdough_toast.webp';
import sourdoughPizza from '../assets/sourdough_pizza.webp';
import coffeeBourbon from '../assets/coffee_bourbon.webp';
import cinnamonRoll from '../assets/cinnamon_roll.webp';

/**
 * SignatureDishes — 4 platos destacados read-only.
 * Datos sincronizados con `src/components/MenuGrid.jsx` para no inventar precios.
 * Mismos ítems (id, title, price, image) que ya existen en la carta.
 */
const DISHES = [
  {
    id: 'menu-1',
    name: 'Tostada dulce de masa madre',
    category: 'Brunch · Hogaza artesana',
    desc: 'Rebanada gruesa de nuestra hogaza artesana, crema de cacahuate natural, fresas, plátano, frutos rojos y granola.',
    price: 12.00,
    image: sourdoughToast,
    alt: 'Tostada dulce de masa madre con crema de cacahuate, fresas y granola',
  },
  {
    id: 'menu-3',
    name: 'Pizza pesto y camarón',
    category: 'Pizzas · Horno a la piedra',
    desc: 'Masa fermentada 48 horas, mozzarella, camarones selectos y pesto de albahaca fresca hecho en casa.',
    price: 18.50,
    image: sourdoughPizza,
    alt: 'Pizza artesanal de pesto y camarón recién horneada',
  },
  {
    id: 'menu-2',
    name: 'Bourbon Naranja · Finca El Ángel',
    category: 'Café de origen · Chalchuapa',
    desc: 'Microlote del productor Rafael Silva en Chalchuapa. Natural anaeróbico con notas a granada y lychee.',
    price: 6.50,
    image: coffeeBourbon,
    alt: 'Taza de café de microlote Bourbon Naranja servido en barra',
  },
  {
    id: 'menu-4',
    name: 'Rol de canela artesanal',
    category: 'Panadería · Canela de Saigón',
    desc: 'Canela de Saigón, azúcar morena, masa hojaldrada tierna. Horneado cada mañana.',
    price: 5.50,
    image: cinnamonRoll,
    alt: 'Rol de canela recién horneado con glaseado clásico',
  },
];

export default function SignatureDishes() {
  return (
    <section
      id="signature"
      aria-label="Platos destacados"
      className="section bg-brand-background border-y border-brand-border"
    >
      <div className="container-page">
        {/* Header */}
        <ScrollReveal
          as="div"
          className="max-w-3xl mb-12 md:mb-16"
          amount={0.3}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow flex items-center gap-3">
            <span className="w-8 h-px bg-brand-textSubtle/60" aria-hidden="true" />
            Platos destacados
          </p>
          <h2 className="h-section">
            Lo que firma la casa.
          </h2>
          <p className="font-sans text-[14px] md:text-[15px] text-brand-textSubtle leading-relaxed mt-5 max-w-reading">
            Cuatro ítems que viven en la carta los siete días. La rotación de temporada y el resto del menú está en la sección del menú.
          </p>
          <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle/70 mt-3">
            Precios con IVA incluido
          </p>
        </ScrollReveal>

        {/* Grid 2x2 con stagger editorial */}
        <StaggerGroup
          as="ul"
          stagger={0.08}
          delayChildren={0.05}
          amount={0.2}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
        >
          {DISHES.map((dish) => (
            <li key={dish.id} className="bg-brand-surface border border-brand-border overflow-hidden">
              <m.article
                className="group h-full flex flex-col transition-colors duration-base hover:bg-brand-background"
              >
                <figure className="img-grid-item">
                  <RevealImage direction="bottom" aspectRatio="4/3" className="overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover image-zoom-slow"
                    />
                  </RevealImage>
                  <figcaption className="font-sans text-[11px] uppercase text-brand-textSubtle tracking-[0.18em] px-6 md:px-8 pt-3">
                    {dish.category}
                  </figcaption>
                </figure>
                <div className="p-6 md:p-8 flex flex-col gap-4 flex-1">
                  <header className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-[1.25rem] md:text-[1.5rem] font-medium leading-tight text-brand-textMain tracking-tight">
                      {dish.name}
                    </h3>
                    <span className="font-display text-[1.125rem] md:text-[1.375rem] font-medium text-brand-textMain tabular-nums shrink-0">
                      ${dish.price.toFixed(2)}
                    </span>
                  </header>
                  <p className="font-sans text-[14px] text-brand-textSubtle leading-relaxed">
                    {dish.desc}
                  </p>
                </div>
              </m.article>
            </li>
          ))}
        </StaggerGroup>

        {/* CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <Link to="/menu" className="btn-underline btn-arrow-shift">
            Ver el menú completo
            <span className="arrow ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}