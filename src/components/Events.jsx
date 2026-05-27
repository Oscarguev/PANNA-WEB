import React, { useState } from 'react';
import { TicketIcon, SparklesIcon, ClockIcon } from './Icons';
import { useCartStore } from '../stores/useCartStore';
import { useUIStore } from '../stores/useUIStore';
import { track, EVENTS } from '../analytics';
import chefPlating from '../assets/chef_plating.webp';
import coffeePour from '../assets/coffee_pour.webp';
import spaghettiImage from '../assets/spaghetti.webp';

const EVENTS_DATA = [
  {
    id: 'e1',
    title: "Coffee Cupping & Tasting Masterclass",
    date: "14 de Junio, 2026",
    time: "10:00 AM &mdash; 12:30 PM",
    price: 25.00,
    image: coffeePour,
    category: "Workshop Barismo",
    description: "Aprende el arte de la catación profesional. Analizaremos fragancias, aromas, acidez y cuerpo de 4 orígenes únicos de café de especialidad.",
    spotsLeft: 4
  },
  {
    id: 'e2',
    title: "Taller de Panadería Artesanal & Masa Madre",
    date: "21 de Junio, 2026",
    time: "9:00 AM &mdash; 12:00 PM",
    price: 35.00,
    image: chefPlating,
    category: "Técnica & Oficio",
    description: "Aprende el arte de la panadería de fermentación lenta. Aprenderás a alimentar tu masa madre, manejar la hidratación y hornear hogazas perfectas con corteza crujiente.",
    spotsLeft: 8
  },
  {
    id: 'e3',
    title: "Vuelo de Café de Especialidad & Filtrados",
    date: "28 de Junio, 2026",
    time: "4:00 PM &mdash; 6:30 PM",
    price: 20.00,
    image: spaghettiImage,
    category: "Cata Sensorial",
    description: "Una degustación guiada de tres métodos de extracción (Chemex, V60, Sifón) utilizando granos cultivados en altitudes extremas de Sonsonate. Descubre el impacto de los procesos en taza.",
    spotsLeft: 6
  }
];

export default function Events() {
  const addItem       = useCartStore((state) => state.addItem);
  const showCartToast = useUIStore((state) => state.showCartToast);

  const [quantities, setQuantities] = useState({ e1: 1, e2: 1, e3: 1 });

  const handleQtyChange = (eventId, val) => {
    setQuantities({ ...quantities, [eventId]: Math.max(1, parseInt(val) || 1) });
  };

  const handleBuyTicket = (ev) => {
    const qty = quantities[ev.id];
    const item = {
      id: ev.id,
      title: `Ticket: ${ev.title} (${ev.date})`,
      price: ev.price,
      image: ev.image,
      quantity: qty,
    };
    addItem(item);
    showCartToast({ title: item.title, price: item.price, image: item.image });
    track(EVENTS.EVENT_TICKET_BUY, {
      event_id:    ev.id,
      event_name:  ev.title,
      event_date:  ev.date,
      price:       ev.price,
      quantity:    qty,
    });
    track(EVENTS.ADD_TO_CART, {
      item_id:   ev.id,
      item_name: item.title,
      price:     ev.price,
      quantity:  qty,
      source:    'events',
    });
  };

  return (
    <section id="events" className="bg-[#050505] py-24 md:py-36 px-6 md:px-16 relative overflow-hidden border-t border-white/[0.02]">
      {/* Visual background lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-primary/3 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto flex flex-col items-center">
          <span className="eyebrow text-center mb-0">
            Cultura & Encuentros
          </span>
          <h2 className="font-display text-brand-textMain font-light tracking-[0.05em] uppercase">
            Talleres & Catas de Café
          </h2>
          <div className="w-16 h-[1px] bg-brand-primary/30 mx-auto mt-3" />
          <p className="font-body text-brand-textMuted font-light leading-relaxed pt-2">
            Disfruta de nuestra agenda de especialidad. Reserva tus entradas para talleres interactivos de panadería de masa madre y cataciones guiadas de café de altura.
          </p>
        </div>

        {/* Dynamic Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {EVENTS_DATA.map((ev) => (
            <div
              key={ev.id}
              className="group relative bg-brand-surface/40 rounded-[4px] border border-white/[0.03] overflow-hidden flex flex-col justify-between hover:border-brand-primary/20 hover:bg-brand-surface/80 hover:shadow-2xl transition-all duration-700 h-full shadow-xl"
            >
              
              {/* Upper Visual section */}
              <div className="relative h-48 shrink-0 bg-neutral-950 overflow-hidden">
                {/* Category tag */}
                <span className="absolute top-4 left-4 z-20 font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded border border-brand-primary/20">
                  {ev.category}
                </span>

                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover transform transition-transform duration-[1800ms] ease-high-end group-hover:scale-105"
                />
                
                {/* Visual vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Lower Details section */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-4 text-left relative z-20">
                <div className="space-y-3">
                  
                  {/* Date details */}
                  <div className="flex items-center space-x-2 text-[11px] font-body tracking-wider text-brand-primary uppercase font-bold">
                    <TicketIcon size={12} />
                    <span>{ev.date}</span>
                  </div>

                   <h3 className="font-display text-brand-textMain group-hover:text-brand-primary transition-colors duration-500 font-light leading-snug">
                    {ev.title}
                  </h3>

                  {/* Time info */}
                  <div className="flex items-center space-x-2 text-[11px] font-body text-brand-textMuted/75 uppercase tracking-widest font-light pb-1">
                    <ClockIcon size={10} className="text-brand-primary/60" />
                    <span dangerouslySetInnerHTML={{ __html: ev.time }} />
                  </div>

                  <p className="font-body text-[14px] text-brand-textMuted leading-relaxed font-light line-clamp-3 pt-1">
                    {ev.description}
                  </p>
                </div>

                {/* Tickets Buy Controls */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Price and remaining spots */}
                    <div className="text-left">
                      <span className="text-[11px] font-body tracking-wider text-brand-textMuted uppercase block">TICKET INDIVIDUAL</span>
                      <span className="price">${ev.price.toFixed(2)}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2">
                      <span className="font-body text-[11px] tracking-wider uppercase text-brand-textMuted">Cantidad:</span>
                      <div className="flex items-center space-x-3 bg-black/60 border border-white/10 rounded-full px-3 py-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(ev.id, quantities[ev.id] - 1)}
                          disabled={quantities[ev.id] <= 1}
                          className="text-brand-textMuted hover:text-brand-primary disabled:opacity-30 disabled:hover:text-brand-textMuted transition-colors text-[11px] font-bold font-mono px-1"
                        >
                          -
                        </button>
                        <span className="font-body text-[11px] text-brand-textMain font-bold min-w-[12px] text-center select-none">
                          {quantities[ev.id]}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(ev.id, quantities[ev.id] + 1)}
                          disabled={quantities[ev.id] >= 5}
                          className="text-brand-textMuted hover:text-brand-primary disabled:opacity-30 disabled:hover:text-brand-textMuted transition-colors text-[11px] font-bold font-mono px-1"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => handleBuyTicket(ev)}
                    className="w-full py-3 bg-transparent border border-brand-primary/45 hover:bg-brand-primary hover:text-black text-brand-primary font-body tracking-[0.2em] text-[11px] uppercase font-bold transition-all duration-500 rounded-full flex items-center justify-center space-x-2"
                  >
                    <span>Reservar Entradas</span>
                    <SparklesIcon size={10} />
                  </button>

                  {/* Spots left indicator */}
                  <div className="text-center">
                    <span className="text-[11px] font-body tracking-[0.2em] text-brand-primary/70 uppercase font-semibold">
                      ¡Solo quedan {ev.spotsLeft} cupos disponibles!
                    </span>
                  </div>
                </div>

              </div>

              {/* Gold border accent that slides in */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
