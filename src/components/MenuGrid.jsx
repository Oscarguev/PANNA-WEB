import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sourdoughToast from '../assets/sourdough_toast.webp';
import sourdoughPizza from '../assets/sourdough_pizza.webp';
import cinnamonRoll from '../assets/cinnamon_roll.webp';
import coffeeBourbon from '../assets/coffee_bourbon.webp';
import menuDish from '../assets/menu_dish.webp';
import { useCartStore } from '../stores/useCartStore';
import { track, EVENTS } from '../analytics';

const CATEGORIZED_MENU = [
  {
    category: "Brunch & Masa Madre",
    items: [
      {
        id: 'menu-1',
        title: "Tostada Dulce de Masa Madre",
        description: "La hogaza del día cortada gruesa, cubierta sin miedo. Cacahuate natural, fresas, plátano, frutos rojos confitados y granola que suena. El desayuno que realmente llena.",
        price: 12.00,
        tag: "Firma",
        image: sourdoughToast,
      },
      {
        id: 'menu-4',
        title: "Rol de Canela Artesanal",
        description: "Sale del horno cada mañana. Canela de Saigón, azúcar morena, masa que se deshace. Llega tibio. Pide uno extra.",
        price: 5.50,
        tag: "Horneado",
        image: cinnamonRoll,
      }
    ]
  },
  {
    category: "Cafetería de Especialidad",
    items: [
      {
        id: 'menu-2',
        title: "Bourbon Naranja (Finca El Ángel)",
        description: "Rafael Silva, Chalchuapa. Natural anaeróbico, cama africana. Granada, lychee y pimienta blanca en taza. Para beberlo solo y en silencio.",
        price: 6.50,
        tag: "Anaeróbico",
        image: coffeeBourbon,
      },
      {
        id: 'menu-5',
        title: "Heirloom (Finca La Fany)",
        description: "Bicafe, Chalchuapa. Una taza limpia y honesta. Melón, fresas, vainilla. Lo que le pides a un buen café en una mañana despejada.",
        price: 6.00,
        tag: "Premium",
        image: coffeeBourbon,
      }
    ]
  },
  {
    category: "Pizzas Napolitanas",
    items: [
      {
        id: 'menu-3',
        title: "Pizza Pesto & Camarón",
        description: "Masa fermentada 48 horas, mozzarella, camarones y pesto de albahaca que hacemos aquí. La pizza que justifica el viaje a Sonsonate.",
        price: 18.50,
        tag: "Especial",
        image: sourdoughPizza,
      },
      {
        id: 'menu-6',
        title: "Pizza Vegetariana",
        description: "San Marzano, pimientos, cebolla morada, aceitunas, champiñones y albahaca fresca. Aceite de oliva virgen al terminar. Sin carne, sin compromisos.",
        price: 16.00,
        tag: "Vegetal",
        image: menuDish,
      }
    ]
  }
];

export default function MenuGrid() {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState({});

  const handleAdd = (dish) => {
    addItem({ id: dish.id, title: dish.title, price: dish.price, image: dish.image, quantity: 1 });
    track(EVENTS.ADD_TO_CART, { item_id: dish.id, item_name: dish.title, price: dish.price });
    setAdded((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [dish.id]: false })), 1500);
  };

  return (
    <section id="menu" className="bg-brand-background w-full py-14 md:py-20 px-6 md:px-16 border-t border-white/[0.02] relative">
      {/* Decorative Blur Background Element */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-primary/3 rounded-full blur-[180px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto space-y-28">
        
        {/* Intro Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Visual gourmet display with dual frame (Pizzas) */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center items-center py-6 relative">
            
            {/* Elegant luxury background ring overlay */}
            <div className="absolute w-[95%] h-[95%] border border-brand-primary/20 rounded-[4px] pointer-events-none z-0" />
            
            {/* Double image overlay arrangement */}
            <div className="relative z-10 w-full aspect-[1/1] max-w-[440px] rounded-[2px] overflow-hidden border border-white/5 shadow-2xl bg-neutral-950">
              <img
                src={sourdoughPizza}
                alt="Pizzas de Masa Madre"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2000ms] ease-high-end"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-transparent to-transparent pointer-events-none opacity-80" />
              
              {/* Overlay visual badge */}
              <div className="absolute bottom-6 left-6 text-left space-y-1">
                <span className="font-body text-xs tracking-wider uppercase text-brand-primary block font-semibold">Masa Madre 48h</span>
                <span className="font-body text-[11px] tracking-[0.25em] text-brand-textMain uppercase block">Horneado artesanal a la piedra</span>
              </div>
            </div>

          </div>

          {/* Right Column: Text Intro Editorial */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-8 text-left">
            <div className="space-y-3">
              <span className="eyebrow">
                Disfruta de ingredientes frescos
              </span>
              <h2 className="font-display text-brand-textMain font-light tracking-[0.02em]">
                Nuestra Cocina
              </h2>
              <div className="w-16 h-[1px] bg-brand-primary/30 mt-3" />
            </div>

            <p className="font-body text-brand-textMuted leading-relaxed font-light">
              En Panna & Pomodoro elevamos insumos simples de alta calidad a un nivel superior. Compartir platos, degustar extracciones finas de café y disfrutar de una panadería excepcional son la base de nuestra identidad gastronómica.
            </p>

            <p className="font-body text-brand-textMuted/80 leading-relaxed font-light">
              Conocidos por nuestra masa madre artesanal y café seleccionado de altura de Sonsonate, ofrecemos una experiencia íntima donde cada detalle, desde la temperatura del agua hasta la mantelería de hilo, está cuidadosamente orquestado.
            </p>

            {/* CTAs */}
            <div className="flex items-center space-x-8 pt-4">
              <Link
                to="/reservar"
                className="px-6 py-3 border border-brand-primary/40 text-brand-textMain hover:border-brand-primary hover:bg-brand-primary hover:text-black font-body tracking-[0.2em] text-[11px] uppercase transition-all duration-700 rounded-full font-semibold bg-black/40"
              >
                Reserva tu Mesa
              </Link>
              
              <a href="#tasting-menu" className="flex items-center space-x-3 group">
                <span className="font-body text-[11px] tracking-[0.2em] uppercase text-brand-textMain hover:text-brand-primary transition-colors duration-500">
                  Explorar la Carta
                </span>
                <div className="w-8 h-8 rounded-full border border-brand-primary/20 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary/10 transition-all duration-500">
                  <span className="text-brand-primary text-xs transform group-hover:translate-x-0.5 transition-transform duration-500">→</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Separator line */}
        <div id="tasting-menu" className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/15 to-transparent pt-4" />

        {/* PREMIUM EDITABLE TASTING MENU BLOCK */}
        <div className="space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto flex flex-col items-center">
            <span className="eyebrow text-center mb-0">
              Menú de Degustación
            </span>
            <h3 className="font-display text-brand-textMain font-light tracking-[0.1em] uppercase">
              La Selección del Chef
            </h3>
            <div className="w-12 h-[1px] bg-brand-primary/20 mt-2" />
          </div>

          {/* Editorial Menu Board */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 pt-6">
            
            {/* Left Column of Tasting Menu Categories */}
            <div className="space-y-12">
              {CATEGORIZED_MENU.slice(0, 2).map((cat, idx) => (
                <div key={idx} className="space-y-8 text-left">
                  {/* Category Title */}
                  <h4 className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-primary font-bold border-b border-white/5 pb-2">
                    {cat.category.toUpperCase()}
                  </h4>

                  {/* Items List */}
                  <div className="space-y-8">
                    {cat.items.map((dish) => (
                      <div key={dish.id} className="group space-y-2">
                        <div className="flex items-end justify-between space-x-4">
                          <h5 className="font-display text-xl text-brand-textMain group-hover:text-brand-primary transition-colors duration-500 font-light tracking-wide">
                            {dish.title}
                          </h5>
                          <div className="flex-grow border-b border-dotted border-white/10 group-hover:border-brand-primary/35 transition-colors duration-700 mx-2 mb-1.5" />
                          <span className="price">${dish.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <p className="font-body text-[14px] text-brand-textMuted leading-relaxed font-light pr-8 flex-1">
                            {dish.description}
                          </p>
                          <button
                            onClick={() => handleAdd(dish)}
                            className={`ml-4 flex-shrink-0 px-4 py-1.5 rounded-full border text-[11px] font-body tracking-widest uppercase font-bold transition-all duration-300 ${
                              added[dish.id]
                                ? 'border-brand-primary bg-brand-primary text-black'
                                : 'border-white/15 text-brand-textMuted hover:border-brand-primary hover:text-brand-primary'
                            }`}
                          >
                            {added[dish.id] ? '✓ Agregado' : '+ Agregar'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column of Tasting Menu Categories */}
            <div className="space-y-12">
              {CATEGORIZED_MENU.slice(2).map((cat, idx) => (
                <div key={idx} className="space-y-8 text-left">
                  {/* Category Title */}
                  <h4 className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-primary font-bold border-b border-white/5 pb-2">
                    {cat.category.toUpperCase()}
                  </h4>

                  {/* Items List */}
                  <div className="space-y-8">
                    {cat.items.map((dish) => (
                      <div key={dish.id} className="group space-y-2">
                        <div className="flex items-end justify-between space-x-4">
                          <h5 className="font-display text-xl text-brand-textMain group-hover:text-brand-primary transition-colors duration-500 font-light tracking-wide">
                            {dish.title}
                          </h5>
                          <div className="flex-grow border-b border-dotted border-white/10 group-hover:border-brand-primary/35 transition-colors duration-700 mx-2 mb-1.5" />
                          <span className="price">${dish.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <p className="font-body text-[14px] text-brand-textMuted leading-relaxed font-light pr-8 flex-1">
                            {dish.description}
                          </p>
                          <button
                            onClick={() => handleAdd(dish)}
                            className={`ml-4 flex-shrink-0 px-4 py-1.5 rounded-full border text-[11px] font-body tracking-widest uppercase font-bold transition-all duration-300 ${
                              added[dish.id]
                                ? 'border-brand-primary bg-brand-primary text-black'
                                : 'border-white/15 text-brand-textMuted hover:border-brand-primary hover:text-brand-primary'
                            }`}
                          >
                            {added[dish.id] ? '✓ Agregado' : '+ Agregar'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Additional premium graphic callout card on bottom right */}
              <div className="bg-brand-surface/40 border border-white/[0.03] p-6 rounded-[2px] text-left space-y-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
                
                <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold block">
                  Maridaje Sugerido
                </span>
                <p className="font-display text-lg text-brand-textMain font-light italic leading-snug">
                  "El barista recomienda acompañar la Tostada Dulce de masa madre con una taza caliente de Bourbon Naranja (Finca El Ángel). Las notas de granada y pimienta del grano contrastan de manera insuperable con el dulzor y cremosidad de la crema de cacahuate y plátano."
                </p>
                <div className="text-[12px] font-body tracking-wider text-brand-textMuted/60 uppercase">
                  &mdash; Barista Principal
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
