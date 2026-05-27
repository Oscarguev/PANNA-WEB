import React, { useState } from 'react';
import { m } from 'framer-motion';
import { CloseIcon, SparklesIcon } from './Icons';
import { reveal, revealFade } from '../motion/variants';
import coffeeBourbon from '../assets/coffee_bourbon.webp';
import coffeeBags from '../assets/coffee_bags.webp';
import cinnamonRoll from '../assets/cinnamon_roll.webp';
import sourdoughToast from '../assets/sourdough_toast.webp';
import sourdoughPizza from '../assets/sourdough_pizza.webp';
import imagePan from '../assets/pan.webp';

const GALLERY_ITEMS = [
  {
    id: 1,
    image: sourdoughToast,
    category: "Brunch",
    title: "Tostada Dulce de Masa Madre",
    aspect: "col-span-12 md:col-span-8 aspect-[16/9] md:aspect-[16/10]",
    desc: "Rebanada gruesa de nuestra hogaza artesana, crema de cacahuate natural, fresas frescas, plátano laminado, frutos rojos confitados y granola crujiente."
  },
  {
    id: 2,
    image: coffeeBourbon,
    category: "Café",
    title: "Bourbon Naranja (Finca El Ángel)",
    aspect: "col-span-6 md:col-span-4 aspect-[3/4]",
    desc: "Microlote del productor Rafael Silva en Chalchuapa. Proceso natural anaeróbico secado en cama africana con notas a granada y lychee."
  },
  {
    id: 3,
    image: sourdoughPizza,
    category: "Masa Madre",
    title: "Pizza Pesto & Camarón a la Piedra",
    aspect: "col-span-6 md:col-span-4 aspect-[3/4]",
    desc: "Masa fermentada lentamente durante 48 horas, mozzarella, camarones selectos y un espiral de pesto de albahaca fresca hecho en casa."
  },
  {
    id: 4,
    image: cinnamonRoll,
    category: "Repostería",
    title: "Rol de Canela Recién Horneado",
    aspect: "col-span-12 md:col-span-8 aspect-[16/9] md:aspect-[16/10]",
    desc: "Masa hojaldrada tierna horneada diariamente, rellena de canela de Saigón y azúcar morena, servida tibia con un toque de glaseado clásico."
  },
  {
    id: 5,
    image: coffeeBags,
    category: "Boutique",
    title: "Microlotes Exclusivos de Panna",
    aspect: "col-span-6 md:col-span-6 aspect-[4/3] md:aspect-[16/10]",
    desc: "Nuestra colección de granos de especialidad (Bourbon Naranja y Heirloom) cultivados a 1,450 msnm sobre suelo franco arcilloso en Chalchuapa."
  },
  {
    id: 6,
    image: imagePan,
    category: "Artesanal",
    title: "El Origen de Todo (Masa Madre)",
    aspect: "col-span-6 md:col-span-6 aspect-[4/3] md:aspect-[16/10]",
    desc: "Hogazas de fermentación lenta de 48 horas. Procesos rústicos que otorgan una corteza crujiente insuperable y una miga alveolada y húmeda."
  }
];

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section id="gallery" className="bg-brand-background py-14 md:py-20 px-6 md:px-16 relative overflow-hidden border-t border-white/[0.02]">
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <m.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="space-y-3 text-left">
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-primary block font-semibold">
              Estética & Texturas
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-brand-textMain font-light tracking-[0.05em] uppercase">
              Galería Visual
            </h2>
            <div className="w-16 h-[1px] bg-brand-primary/30 mt-3" />
          </div>
          
          <div className="text-left md:text-right max-w-sm">
            <p className="font-body text-xs text-brand-textMuted font-light leading-relaxed">
              Cada plato y rincón cuenta una historia. Capturamos la esencia dramática de los ingredientes puros y el ambiente cálido de nuestro salón.
            </p>
          </div>
        </m.div>

        {/* Asymmetrical Masonry/Editorial Grid */}
        <m.div
          className="grid grid-cols-12 gap-6 pt-4"
          variants={revealFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className={`${item.aspect} relative overflow-hidden rounded-[2px] border border-white/[0.03] bg-neutral-950 group cursor-pointer shadow-2xl`}
            >
              {/* Image with extreme slow zoom */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform transition-transform duration-[2000ms] ease-high-end group-hover:scale-105"
              />

              {/* Dark Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-high-end flex flex-col justify-end p-6 md:p-8 z-10">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-[800ms] ease-high-end space-y-2 text-left">
                  <span className="font-body text-[11px] text-brand-primary tracking-[0.25em] uppercase font-bold block">
                    {item.category}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl text-brand-textMain font-light leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-2 pt-2 text-[11px] font-body tracking-wider text-brand-primary/80 uppercase font-light">
                    <span>Ampliar Imagen</span>
                    <SparklesIcon size={10} className="animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Static subtle corner tag */}
              <div className="absolute top-4 right-4 z-0 group-hover:z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-body text-[11px] tracking-widest text-brand-textMain bg-black/40 px-2 py-1 rounded border border-white/10 uppercase backdrop-blur-sm">
                P&P
              </div>
            </div>
          ))}
        </m.div>

      </div>

      {/* LUXURY INTERACTIVE LIGHTBOX MODAL */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-all duration-500">
          {/* Close Area */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveImage(null)} />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-5xl bg-[#080808] border border-white/10 rounded-[3px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full border border-white/15 hover:border-brand-primary flex items-center justify-center bg-black/60 text-brand-textMain hover:text-brand-primary transition-all duration-300"
            >
              <CloseIcon size={16} />
            </button>

            {/* Left/Upper side: Heavy dramatic Image representation */}
            <div className="w-full md:w-2/3 aspect-[4/3] md:aspect-auto md:h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeImage.image}
                alt={activeImage.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right/Lower side: Elegant boutique descriptions */}
            <div className="w-full md:w-1/3 p-8 flex flex-col justify-between space-y-6 bg-brand-surface border-t md:border-t-0 md:border-l border-white/[0.04] text-left">
              <div className="space-y-4">
                <span className="font-body text-[11px] text-brand-primary tracking-[0.25em] uppercase font-bold block pt-2">
                  {activeImage.category}
                </span>
                
                <h4 className="font-display text-2xl md:text-3xl text-brand-textMain font-light leading-snug">
                  {activeImage.title}
                </h4>

                <div className="w-12 h-[1px] bg-brand-primary/30 mt-2" />

                <p className="font-body text-[14px] text-brand-textMuted leading-relaxed font-light pt-2">
                  {activeImage.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-body tracking-[0.2em] uppercase text-brand-textMuted/60">
                <span>Panna & Pomodoro</span>
                <span className="text-brand-primary font-medium">Fine Dining</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
