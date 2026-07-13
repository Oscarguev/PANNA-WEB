import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { EASE } from '../motion/variants';

/**
 * MenuPreview — vista editorial de la carta.
 * 3 categorías · 2 items c/u (mismos datos que MenuGrid) · precios reales.
 * Read-only: el detalle (incluye carrito) está en /menu.
 *
 * Datos alineados con `src/components/MenuGrid.jsx` para no inventar precios.
 *
 * P8 legibilidad:
 * - Sin cards. Lista editorial con divisores finos.
 * - Body 16px, descripciones 14px, precios alineados a la derecha.
 * - Menor espacio vertical entre items (py-3).
 * - Mantener estética menú profesional.
 */
const SECTIONS = [
  {
    title: 'Brunch & Masa Madre',
    intro: 'Hogazas que llevan dos días fermentando.',
    items: [
      { name: 'Tostada dulce de masa madre', desc: 'Rebanada gruesa, crema de cacahuate, fresas, plátano, frutos rojos, granola.', price: 12.00 },
      { name: 'Rol de canela artesanal',      desc: 'Canela de Saigón, azúcar morena, masa tierna. Se sirve tibio.',         price: 5.50 },
    ],
  },
  {
    title: 'Cafetería de especialidad',
    intro: 'Microlotes que compramos por nombre del productor.',
    items: [
      { name: 'Bourbon Naranja · Finca El Ángel', desc: 'Rafael Silva, Chalchuapa. Natural anaeróbico. Granada, lychee, pimienta blanca.', price: 6.50 },
      { name: 'Heirloom · Finca La Fany',         desc: 'Bicafe, Chalchuapa. Limpio. Melón, fresas, vainilla.',                              price: 6.00 },
    ],
  },
  {
    title: 'Pizzas a la piedra',
    intro: 'Misma masa de la panadería, estirada a mano.',
    items: [
      { name: 'Pizza pesto y camarón',  desc: 'Masa fermentada 48 horas, mozzarella, camarones, pesto de albahaca hecho aquí.', price: 18.50 },
      { name: 'Pizza vegetariana',      desc: 'San Marzano, pimientos, cebolla morada, aceitunas, champiñones, albahaca.',       price: 16.00 },
    ],
  },
];

export default function MenuPreview() {
  return (
    <section
      id="menu-preview"
      aria-label="Vista previa de la carta"
      className="section bg-brand-background"
    >
      <div className="container-page">
        <m.div
          className="max-w-3xl mb-10 md:mb-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE.silk }}
        >
          <p className="eyebrow flex items-center gap-3">
            <span className="w-8 h-px bg-brand-textSubtle/60" aria-hidden="true" />
            La carta
          </p>
          <h2 className="h-section">
            Una carta que cambia según lo que llega del horno.
          </h2>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {SECTIONS.map((section, sIdx) => (
            <m.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: sIdx * 0.08, ease: EASE.silk }}
            >
              <header className="mb-5 pb-3 border-b border-brand-textMain">
                <h3 className="font-display text-[1.4rem] md:text-[1.625rem] font-medium leading-tight text-brand-textMain">
                  {section.title}
                </h3>
                <p className="font-sans text-[13px] text-brand-textMuted italic mt-1">
                  {section.intro}
                </p>
              </header>

              <ul>
                {section.items.map((it, iIdx) => (
                  <li
                    key={it.name}
                    className={`py-3 ${iIdx !== section.items.length - 1 ? 'border-b border-brand-border/60' : ''}`}
                  >
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                      <span className="font-sans text-[16px] font-medium text-brand-textMain">
                        {it.name}
                      </span>
                      <span
                        className="font-display text-[1.25rem] md:text-[1.375rem] font-medium text-brand-textMain tabular-nums shrink-0"
                        aria-label={`Precio ${it.price.toFixed(2)} dólares`}
                      >
                        ${it.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="font-sans text-[14px] text-brand-textSubtle leading-snug">
                      {it.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </m.div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <Link to="/menu" className="btn-underline">
            Ver la carta completa
            <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
