import { Link } from 'react-router-dom';
import sourdoughToast from '../assets/sourdough_toast.webp';
import sourdoughPizza from '../assets/sourdough_pizza.webp';
import cinnamonRoll from '../assets/cinnamon_roll.webp';
import coffeeBourbon from '../assets/coffee_bourbon.webp';
import coffeePour from '../assets/coffee_pour.webp';

const CATEGORIES = [
  {
    title: 'Brunch & Masa Madre',
    intro: 'Hogazas que llevan dos días fermentando. Salen del horno a las cinco de la mañana.',
    items: [
      {
        id: 'menu-1',
        title: 'Tostada dulce de masa madre',
        description: 'Rebanada gruesa, crema de cacahuate natural, fresas, plátano, frutos rojos confitados, granola.',
        price: 12.00,
        image: sourdoughToast,
      },
      {
        id: 'menu-4',
        title: 'Rol de canela artesanal',
        description: 'Canela de Saigón, azúcar morena, masa tierna. Se sirve tibio.',
        price: 5.50,
        image: cinnamonRoll,
      },
    ],
  },
  {
    title: 'Cafetería de especialidad',
    intro: 'Microlotes que compramos por nombre del productor, no por volumen.',
    items: [
      {
        id: 'menu-2',
        title: 'Bourbon Naranja · Finca El Ángel',
        description: 'Rafael Silva, Chalchuapa. Natural anaeróbico. Granada, lychee, pimienta blanca.',
        price: 6.50,
        image: coffeeBourbon,
      },
      {
        id: 'menu-5',
        title: 'Heirloom · Finca La Fany',
        description: 'Bicafe, Chalchuapa. Limpio. Melón, fresas, vainilla.',
        price: 6.00,
        image: coffeePour,
      },
    ],
  },
  {
    title: 'Pizzas a la piedra',
    intro: 'Misma masa de la panadería, estirada a mano, horno a la piedra.',
    items: [
      {
        id: 'menu-3',
        title: 'Pizza pesto y camarón',
        description: 'Masa fermentada 48 horas, mozzarella, camarones, pesto de albahaca hecho aquí.',
        price: 18.50,
        image: sourdoughPizza,
      },
      {
        id: 'menu-6',
        title: 'Pizza vegetariana',
        description: 'San Marzano, pimientos, cebolla morada, aceitunas, champiñones, albahaca.',
        price: 16.00,
        image: null,
      },
    ],
  },
];

export default function MenuGrid() {
  return (
    <section id="menu" className="section bg-brand-background border-t border-brand-border">

      <div className="container-page space-y-24">

        {/* Heading: no eyebrow, no divider, no tag */}
        <header className="max-w-3xl space-y-8">
          <h2 className="h-section">
            La carta es corta a propósito. Cada plato tiene a alguien detrás que lo cuida.
          </h2>
          <p className="text-brand-textMain text-base md:text-lg leading-relaxed max-w-reading">
            En Panna &amp; Pomodoro cocinamos con lo que sale del horno cada mañana y con
            café de productores que conocemos por nombre. No hay secciones de entrante,
            principal y postre — solo lo que preparamos hoy.
          </p>
          <div className="flex items-center gap-8 pt-2 text-[13px]">
            <Link to="/reservar" className="btn-underline">
              Reservar una mesa
            </Link>
          </div>
        </header>

        {/* Categories — editorial, no tags, no cards */}
        <div className="space-y-20">
          {CATEGORIES.map((cat, idx) => (
            <article key={cat.title} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <header className="lg:col-span-4 space-y-3">
                <span className="text-[12px] text-brand-textSubtle tabular-nums">
                  0{idx + 1}
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-brand-textMain font-light leading-tight tracking-tighter">
                  {cat.title}
                </h3>
                <p className="text-[14px] text-brand-textSubtle leading-relaxed max-w-xs">
                  {cat.intro}
                </p>
              </header>

              <ul className="lg:col-span-8 divide-y divide-brand-border">
                {cat.items.map((dish) => (
                  <li key={dish.id} className="grid grid-cols-12 gap-4 py-6 items-start group">
                    {dish.image ? (
                      <figure className="col-span-3 md:col-span-2 img-grid-item aspect-square overflow-hidden bg-brand-placeholder">
                        <img
                          src={dish.image}
                          alt={dish.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </figure>
                    ) : (
                      <div
                        className="col-span-3 md:col-span-2 aspect-square bg-brand-surface border border-brand-border flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <span className="font-display text-[10px] tracking-[0.25em] uppercase text-brand-textSubtle">
                          P &amp; P
                        </span>
                      </div>
                    )}
                    <div className={`${dish.image ? 'col-span-9 md:col-span-10' : 'col-span-9 md:col-span-10'} space-y-2`}>
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="font-display text-lg md:text-xl text-brand-textMain font-normal leading-snug">
                          {dish.title}
                        </h4>
                        <span className="font-sans text-base text-brand-textMain tabular-nums shrink-0">
                          ${dish.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[14px] text-brand-textSubtle leading-relaxed max-w-reading">
                        {dish.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}