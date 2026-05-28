import React, { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import imagePan from '../assets/pan.webp';
import imageBaguette from '../assets/images/BAGUETTE MASA MADRE.webp';
import BrandWatermark from './BrandWatermark';
import { reveal, revealFade, EASE } from '../motion/variants';

export default function Story() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const panY      = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  const baguetteY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const pillars = [
    {
      num: 'I.',
      title: 'Panadería & Fermentación Lenta',
      body: 'Nuestra masa madre pasa 48 horas fermentando antes de entrar al horno. Es un proceso lento, pero es el único que produce la textura y el sabor que buscamos. La diferencia se escucha al partir el pan.',
    },
    {
      num: 'II.',
      title: 'Rigor de Especialidad',
      body: 'Cada extracción se hace a mano: V60 o AeroPress, báscula y temperatura controlada. Los granos vienen de microlotes con nombre y productor. Lo que sirves hoy no es exactamente lo que sirviste la semana pasada — eso es especialidad.',
    },
    {
      num: 'III.',
      title: 'El Brunch de Todos los Días',
      body: 'Brunch, tertulia o pausa larga — el salón está listo a cualquier hora. Ingredientes frescos de origen local, café en su punto y pan recién salido del horno. No hay distinción entre el cliente de las 7 AM y el de las 3 PM.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative bg-brand-background py-14 md:py-20 px-6 md:px-16 overflow-hidden border-t border-white/[0.02]"
    >

      <BrandWatermark className="right-6 top-1/2 -translate-y-1/2" opacity={0.035} />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* ── Left Column: single reveal — all children move as one block ── */}
          <m.div
            className="lg:col-span-6 space-y-10 text-left relative z-10"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {/* Section header */}
            <div className="space-y-3">
              <span className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-primary block font-semibold">
                Nuestra Identidad Culinaria
              </span>
              <h2 className="font-display text-brand-textMain font-light tracking-[0.02em]">
                El Respeto por <br />
                <span className="italic font-normal text-brand-primary">Los Procesos Nobles</span>
              </h2>
              <div className="w-20 h-[1px] bg-brand-primary/45 mt-4" />
            </div>

            <p className="font-body text-brand-textMuted leading-relaxed font-light">
              Somos un pequeño salón que se toma en serio lo que sirve. Cada hogaza lleva dos días de trabajo antes de salir del horno. Cada taza empieza con granos de productores que conocemos por nombre. No tenemos atajos favoritos.
            </p>

            {/* Three Pillars — static, no stagger */}
            <div className="space-y-8 pt-4">
              {pillars.map((pillar) => (
                <div key={pillar.num} className="space-y-2 text-left group">
                  <div className="flex items-center space-x-3.5">
                    <span className="font-body text-xs text-brand-primary font-semibold tracking-luxury uppercase">
                      {pillar.num} {pillar.title}
                    </span>
                    <div className="flex-grow h-[1px] bg-white/5 group-hover:bg-brand-primary/20 transition-colors duration-500" />
                  </div>
                  <p className="font-body text-brand-textMuted leading-relaxed font-light pl-6">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Signature */}
            <div className="pt-6 flex items-center space-x-6">
              <div className="text-left pl-6">
                <span className="font-brand text-3xl text-brand-primary block">
                  Panna
                </span>
                <span className="font-body text-[11px] tracking-[0.25em] text-brand-textMuted/60 uppercase block pt-1">
                  Artesanal y Fresco · Sonsonate
                </span>
              </div>
            </div>
          </m.div>

          {/* ── Right Column: Asymmetric Image Collage ── */}
          <div className="lg:col-span-6 relative flex items-center justify-center">

            <div className="absolute -inset-4 border border-brand-primary/10 rounded-[4px] pointer-events-none select-none z-0" />

            <div className="grid grid-cols-12 gap-4 w-full relative z-10">

              {/* Primary Large Image — reveal + parallax */}
              <m.div
                className="col-span-12 lg:col-span-8 overflow-hidden rounded-[2px] border border-white/5 shadow-2xl aspect-[4/5] max-h-[420px] lg:max-h-none bg-neutral-950"
                variants={revealFade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
              >
                <m.img
                  src={imagePan}
                  alt="Masa madre artesanal"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[115%] object-cover"
                  style={{ y: panY }}
                />
              </m.div>

              {/* Offset Small Image — reveal + parallax */}
              <m.div
                className="hidden lg:block absolute -bottom-8 -right-4 lg:-right-8 w-[44%] overflow-hidden rounded-[2px] border border-brand-primary/20 shadow-2xl aspect-[3/4] bg-neutral-950 z-20"
                variants={revealFade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.2 }}
              >
                <m.img
                  src={imageBaguette}
                  alt="Baguette de masa madre"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[120%] object-cover"
                  style={{ y: baguetteY }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </m.div>
            </div>

            {/* Gold emblem stamp — static */}
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full border border-brand-primary/20 flex items-center justify-center bg-brand-background/80 backdrop-blur-sm z-30 pointer-events-none select-none">
              <span className="font-display text-[11px] tracking-wider text-brand-primary uppercase text-center font-light leading-none">
                Est.<br />2018
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
