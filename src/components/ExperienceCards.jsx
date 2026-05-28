import React from 'react';
import { m } from 'framer-motion';
import logo from '../assets/logo.png';
import coffeePour from '../assets/coffee_pour.webp';
import menuDish from '../assets/menu_dish.webp';
import spaghettiImage from '../assets/spaghetti.webp';
import { reveal } from '../motion/variants';

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

      <div className="max-w-7xl mx-auto space-y-16">

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
              className="group relative flex flex-col overflow-hidden rounded-[4px] border border-white/[0.04] hover:border-brand-primary/20 bg-brand-surface/40 h-full cursor-default"
              style={{ transition: 'transform 200ms ease-out, border-color 0.6s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="flex flex-col h-full">
                {/* Image Frame */}
                <div className="relative w-full h-52 shrink-0 overflow-hidden bg-neutral-950">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[1400ms] ease-high-end group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 z-10 font-body text-[11px] tracking-[0.2em] uppercase font-semibold text-brand-primary bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-brand-primary/20">
                    {exp.tag}
                  </span>
                </div>

                {/* Info Frame */}
                <div className="p-6 md:p-8 flex-grow flex flex-col space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-[11px] text-brand-primary tracking-[0.2em] uppercase font-semibold block">
                        {exp.subtitle}
                      </span>
                      <img
                        src={logo}
                        alt=""
                        aria-hidden="true"
                        className="h-6 w-6 object-contain mix-blend-screen opacity-40"
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

              {/* Bottom gold line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-high-end" />
            </div>
          ))}
        </m.div>

      </div>
    </section>
  );
}
