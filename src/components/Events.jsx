import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { useUIStore } from '../stores/useUIStore';
import { track, EVENTS } from '../analytics';
import coffeePour from '../assets/coffee_pour.webp';
import pan from '../assets/pan.webp';

// Solo assets auténticos. Cero chef_plating o menu_dish.
const EVENT_ITEMS = [
  {
    id: 'e1',
    title: 'Coffee Cupping & Tasting Masterclass',
    date: 'Sábado 14 de junio, 2026 · 10:00 a 12:30',
    blurb: 'Cuatro microlotes servidos a ciegas. Aprendes a identificar fragancia, aroma, acidez y cuerpo con el barista.',
    price: 25.00,
    image: coffeePour,
  },
  {
    id: 'e2',
    title: 'Taller de masa madre',
    date: 'Sábado 21 de junio, 2026 · 9:00 a 12:00',
    blurb: 'Te llevás tu propia hogaza. Aprendés a alimentar la masa madre, manejar hidratación y hornear corteza crujiente.',
    price: 35.00,
    image: pan,
  },
  {
    id: 'e3',
    title: 'Vuelo de filtrados',
    date: 'Sábado 28 de junio, 2026 · 16:00 a 18:30',
    blurb: 'Tres extracciones paralelas — Chemex, V60 y Sifón — con granos de microlote seleccionados.',
    price: 20.00,
    image: coffeePour,
  },
];

export default function Events() {
  const addItem = useCartStore((state) => state.addItem);
  const showCartToast = useUIStore((state) => state.showCartToast);
  const [boughtIds, setBoughtIds] = useState({});
  const timersRef = useRef({});

  // Cleanup: cancelar todos los timers pendientes al desmontar para
  // evitar setState sobre componentes desmontados si el usuario navega.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach((t) => clearTimeout(t));
      timersRef.current = {};
    };
  }, []);

  const handleBuy = (ev) => {
    if (boughtIds[ev.id]) return;
    addItem({
      id: ev.id,
      title: `Entrada: ${ev.title}`,
      price: ev.price,
      image: ev.image,
      quantity: 1,
    });
    showCartToast({ title: `Entrada: ${ev.title}`, price: ev.price, image: ev.image });
    track(EVENTS.EVENT_TICKET_BUY, { event_id: ev.id, event_name: ev.title, price: ev.price });
    setBoughtIds((prev) => ({ ...prev, [ev.id]: true }));
    clearTimeout(timersRef.current[ev.id]);
    timersRef.current[ev.id] = setTimeout(() => {
      setBoughtIds((prev) => {
        const next = { ...prev };
        delete next[ev.id];
        return next;
      });
    }, 1800);
  };

  return (
    <section id="events" className="section bg-brand-background border-t border-brand-border">
      <div className="container-page space-y-16">

        <header className="max-w-3xl space-y-4">
          <h2 className="h-section">
            Lo que viene en la agenda.
          </h2>
          <p className="text-brand-textMain text-base md:text-lg leading-relaxed max-w-reading">
            Hacemos catas y talleres casi todos los sábados. No son eventos
            grandes — son grupos pequeños donde se aprende algo y se prueba café.
          </p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle/70">
            Precios con IVA incluido
          </p>
        </header>

        <ol className="space-y-16">
          {EVENT_ITEMS.map((ev, i) => (
            <li
              key={ev.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start border-t border-brand-border pt-10"
            >
              <figure className="md:col-span-5 img-grid-item aspect-[4/3] overflow-hidden bg-brand-placeholder">
                <img
                  src={ev.image}
                  alt={ev.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </figure>

              <div className="md:col-span-7 space-y-4">
                <span className="text-[12px] text-brand-textSubtle tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-brand-textMain font-normal leading-snug">
                  {ev.title}
                </h3>
                <p className="text-[13px] text-brand-textSubtle tabular-nums">
                  {ev.date}
                </p>
                <p className="text-[15px] text-brand-textMain leading-relaxed max-w-reading">
                  {ev.blurb}
                </p>
                <div className="flex flex-wrap items-baseline justify-between gap-6 pt-2">
                  <span className="font-sans text-lg text-brand-textMain tabular-nums">
                    ${ev.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleBuy(ev)}
                    aria-pressed={!!boughtIds[ev.id]}
                    aria-live="polite"
                    className={`btn-underline gap-2 ${
                      boughtIds[ev.id]
                        ? 'text-brand-primary border-brand-primary'
                        : ''
                    }`}
                  >
                    {boughtIds[ev.id] ? (
                      <>
                        <span aria-hidden="true">✓</span>
                        <span>Apartado</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true">+</span>
                        <span>Apartar mi lugar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
