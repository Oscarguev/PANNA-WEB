import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { track, EVENTS } from '../analytics';
import sourdoughToast  from '../assets/sourdough_toast.webp';
import cinnamonRoll    from '../assets/cinnamon_roll.webp';
import coffeeBourbon   from '../assets/coffee_bourbon.webp';
import sourdoughPizza  from '../assets/sourdough_pizza.webp';
import coffeePour      from '../assets/coffee_pour.webp';
import menuDish        from '../assets/menu_dish.webp';

// ── EDITABLE: Selección del día (carrusel horizontal) ────────────────────
// Estos ítems también son agregables al carrito. Mantén el mismo `id` si
// el ítem ya existe en MenuGrid para que el carrito no duplique productos.
// Para cambiar imagen: importa el archivo arriba (líneas 4-9) y úsalo aquí.
const ITEMS = [
  { id: 'hs-1', tag: 'Firma',      title: 'Tostada Dulce de Masa Madre',      price: 12.00, image: sourdoughToast }, // ✏️ tag · title · price · image
  { id: 'hs-2', tag: 'Anaeróbico', title: 'Bourbon Naranja — Finca El Ángel', price: 6.50,  image: coffeeBourbon  },
  { id: 'hs-3', tag: 'Especial',   title: 'Pizza Pesto & Camarón',            price: 18.50, image: sourdoughPizza  },
  { id: 'hs-4', tag: 'Horneado',   title: 'Rol de Canela Artesanal',          price: 5.50,  image: cinnamonRoll   },
  { id: 'hs-5', tag: 'Premium',    title: 'Heirloom — Finca La Fany',         price: 6.00,  image: coffeePour     },
  { id: 'hs-6', tag: 'Vegetal',    title: 'Pizza Vegetariana',                price: 16.00, image: menuDish       },
];

export default function HorizontalShowcase() {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState({});

  const handleAdd = (item) => {
    addItem({ id: item.id, title: item.title, price: item.price, image: item.image, quantity: 1 });
    track(EVENTS.ADD_TO_CART, { item_id: item.id, item_name: item.title, price: item.price });
    setAdded((p) => ({ ...p, [item.id]: true }));
    setTimeout(() => setAdded((p) => ({ ...p, [item.id]: false })), 1400);
  };

  return (
    <section className="w-full py-14 md:py-20 bg-brand-background border-t border-white/[0.03] overflow-hidden">

      {/* Header */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-10 flex items-end justify-between">
        <div className="space-y-2">
          <span className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-primary font-semibold block">
            Imperdibles
          </span>
          <h2 className="font-display text-brand-textMain font-light text-2xl md:text-3xl tracking-tight">
            La Selección del Día
          </h2>
        </div>
        <Link
          to="/menu"
          className="hidden md:inline-flex items-center gap-2 font-body text-[11px] tracking-[0.25em] uppercase text-brand-textMuted hover:text-brand-primary transition-colors duration-300"
        >
          Ver carta completa →
        </Link>
      </div>

      {/* Horizontal scroll track */}
      <div className="flex gap-4 overflow-x-auto scroll-smooth pl-6 md:pl-16 pr-6 scrollbar-hide"
           style={{ scrollSnapType: 'x mandatory' }}>
        {ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-44 md:w-52 group"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Image */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[2px] border border-white/[0.04] bg-neutral-950 mb-3">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute top-2 left-2 font-body text-[9px] tracking-[0.2em] uppercase font-bold text-brand-primary bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-brand-primary/20">
                {item.tag}
              </span>
            </div>

            {/* Info */}
            <div className="flex items-end justify-between gap-2 px-0.5">
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-display text-brand-textMain font-light text-sm leading-tight tracking-wide truncate group-hover:text-brand-primary transition-colors duration-500">
                  {item.title}
                </h3>
                <span className="font-body text-brand-primary font-semibold text-xs tracking-wider block">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => handleAdd(item)}
                className={`flex-shrink-0 w-7 h-7 rounded-full border font-body text-xs font-bold transition-all duration-300 flex items-center justify-center ${
                  added[item.id]
                    ? 'border-brand-primary bg-brand-primary text-black'
                    : 'border-white/20 text-brand-textMuted hover:border-brand-primary hover:text-brand-primary'
                }`}
                aria-label={`Agregar ${item.title}`}
              >
                {added[item.id] ? '✓' : '+'}
              </button>
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0 w-6 md:w-16" aria-hidden="true" />
      </div>

      {/* Mobile CTA */}
      <div className="md:hidden px-6 pt-8">
        <Link
          to="/menu"
          className="block text-center font-body text-[11px] tracking-[0.25em] uppercase text-brand-textMuted hover:text-brand-primary transition-colors duration-300"
        >
          Ver carta completa →
        </Link>
      </div>

    </section>
  );
}
