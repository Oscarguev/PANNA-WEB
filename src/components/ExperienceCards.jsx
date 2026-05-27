import React from 'react';
import { m } from 'framer-motion';
import logo from '../assets/logo.png';
import coffeePour from '../assets/coffee_pour.webp';
import menuDish from '../assets/menu_dish.webp';
import spaghettiImage from '../assets/spaghetti.webp';
import { reveal, EASE } from '../motion/variants';

const EXPERIENCES = [
  {
    id: 1,
    title: "Un Brunch para Disfrutar",
    subtitle: "Menu de la casa",
    description: "Un brunch diseñado para deleitar tus sentidos. Servido directamente en nuestra barra privada con explicaciones sensoriales y maridajes de fermentos de autor en cada creación.",
    image: menuDish,
    tag: "Todo el dia, Todos los dias",
  },
  {
    id: 2,
    title: "Catas de Especialidad",
    subtitle: "Microlotes Exóticos & Notas de Cata",
    description: "Un recorrido guiado por nuestro barista a través de los microlotes de café más selectos de El Salvador y el mundo. Aprende a identificar perfiles de sabor florales, frutales y achocolatados en taza.",
    image: coffeePour,
    tag: "Rituales de Café",
  },
  {
    id: 3,
    title: "Terraza",
    subtitle: "Atmósfera bajo nuestra ramada",
    description: "Un espacio reservado al aire libre rodeado de vegetación e iluminación tenue. La combinación ideal de aire fresco, el aroma a masa madre caliente de nuestro horno y la calidez del salón.",
    image: spaghettiImage,
    tag: "Cenas Inolvidables",
  },
];

export default function ExperienceCards() {
  return (
    <section
      id="experiences"
      className="bg-brand-background py-14 md:py-20 px-6 md:px-16 relative overflow-hidden border-t border-white/[0.02]"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/3 rounded-full blur-[180px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto space-y-16">

        {/* Section Header — single reveal, no nested variants */}
        <m.div
          className="text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <span className="eyebrow text-center mb-0">
            Momentos Memorables
          </span>
          <h2 className="font-display text-brand-textMain font-light tracking-[0.05em] uppercase">
            Experiencias Gastronómicas
          </h2>
          <div className="w-16 h-[1px] bg-brand-primary/30 mx-auto mt-3" />
          <p className="font-body text-brand-textMuted font-light leading-relaxed pt-2">
            Elevamos un brunch ordinario o una cena tranquila a una memoria imborrable. Descubre los rincones y experiencias de Panna &amp; Pomodoro.
          </p>
        </m.div>

        {/* Cards Grid — single reveal on container, CSS hover on cards */}
        <m.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-6"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[4px] border border-white/[0.04] bg-brand-surface/40 hover:border-brand-primary/20 hover:bg-brand-surface/80 h-full shadow-2xl hover:shadow-brand-primary/5 cursor-default hover:-translate-y-1.5"
              style={{ transition: 'transform 200ms ease-out, border-color 0.7s, background-color 0.7s, box-shadow 0.7s' }}
            >
              <div className="flex flex-col h-full">
                {/* Image Frame */}
                <div className="relative w-full h-52 shrink-0 overflow-hidden bg-neutral-950">
                  <div className="absolute inset-0 bg-brand-background/40 group-hover:bg-brand-background/0 transition-colors duration-700 z-10" />
                  <img
                    src={exp.image}
                    alt={exp.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform transition-transform duration-[1800ms] ease-high-end group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 z-20 font-body text-[11px] tracking-[0.2em] uppercase font-semibold text-brand-primary bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-brand-primary/20">
                    {exp.tag}
                  </span>
                </div>

                {/* Info Frame */}
                <div className="p-6 md:p-8 flex-grow flex flex-col space-y-4 relative z-20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-[11px] text-brand-primary tracking-[0.2em] uppercase font-semibold block">
                        {exp.subtitle}
                      </span>
                      <m.img
                        src={logo}
                        alt="Panna & Pomodoro"
                        className="h-6 w-6 object-contain mix-blend-screen"
                        style={{ filter: 'brightness(0.6) sepia(0.3)' }}
                        whileHover={{ scale: 1.15, filter: 'brightness(1.8) sepia(0.6) drop-shadow(0 0 8px rgba(197,168,128,0.9))' }}
                        whileTap={{ scale: 0.95, filter: 'brightness(2.2) sepia(0.8) drop-shadow(0 0 14px rgba(197,168,128,1))' }}
                        transition={{ duration: 0.35, ease: EASE.silk }}
                      />
                    </div>
                    <h3 className="font-display text-brand-textMain group-hover:text-brand-primary transition-colors duration-500 font-light leading-snug">
                      {exp.title}
                    </h3>
                    <p className="font-body text-[14px] text-brand-textMuted leading-relaxed font-light pt-1">
                      {exp.description}
                    </p>
                  </div>

                </div>
              </div>

              {/* Bottom gold line slide-in */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-high-end" />
            </div>
          ))}
        </m.div>

      </div>
    </section>
  );
}
