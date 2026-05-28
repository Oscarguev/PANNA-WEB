import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { m, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import heroBackground from '../assets/bulldog.webp';
import logo from '../assets/logo.png';
import { ArrowRightIcon } from './Icons';
import { kenBurns, EASE } from '../motion/variants';

export default function Hero() {
  const [hoursOpen, setHoursOpen] = React.useState(false);
  const workingHours = [
    { day: "Domingo", time: "7:00 - 21:00" },
    { day: "Lunes", time: "7:00 - 21:00" },
    { day: "Martes", time: "7:00 - 21:00" },
    { day: "Miércoles", time: "7:00 - 21:00" },
    { day: "Jueves", time: "7:00 - 21:00" },
    { day: "Viernes", time: "7:00 - 22:00" },
    { day: "Sábado", time: "7:00 - 22:00" },
  ];

  // ── Mouse parallax setup ──────────────────────────────────────────────────
  const sectionRef = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring damping — slower = more cinematic lag between layers
  const springCfg = { stiffness: 45, damping: 18 };
  const springX = useSpring(rawX, springCfg);
  const springY = useSpring(rawY, springCfg);

  // Layer depths — background moves least, logo most (parallax illusion of depth)
  const bgX     = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const bgY     = useTransform(springY, [-0.5, 0.5], [-12, 12]);
  const logoX   = useTransform(springX, [-0.5, 0.5], [-32, 32]);
  const logoY   = useTransform(springY, [-0.5, 0.5], [-20, 20]);
  const titleX  = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const titleY  = useTransform(springY, [-0.5, 0.5], [-8, 8]);
  const ctaX    = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  const ctaY    = useTransform(springY, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen bg-brand-background flex flex-col justify-between items-center py-12 md:pt-40 md:pb-12 px-6 md:px-16 overflow-hidden"
    >

      {/* ── Cinematic Background — Ken Burns + mouse parallax ── */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        {/* Oversized by 60px on all sides to cover parallax movement */}
        <m.img
          src={heroBackground}
          alt="Panna & Pomodoro Cozy Dining Room"
          className="absolute object-cover filter brightness-[0.8] contrast-[1.05] object-center max-w-none"
          fetchPriority="high"
          style={{
            inset: '-30px',
            width: 'calc(100% + 60px)',
            height: 'calc(100% + 60px)',
            x: bgX,
            y: bgY,
          }}
          variants={kenBurns}
          initial="hidden"
          animate="visible"
        />
        <div className="absolute inset-0 bg-radial-vignette from-transparent via-black/35 to-brand-background" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-background/60 via-transparent to-brand-background" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* ── Center Block ── */}
      <div className="relative z-10 my-auto text-center space-y-4 md:space-y-6 max-w-6xl pt-4 md:pt-6">

        {/* Logo — deepest parallax layer */}
        <m.div
          className="flex justify-center select-none pb-2"
          style={{ x: logoX, y: logoY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE.silk }}
        >
          <m.img
            src={logo}
            alt="Panna & Pomodoro Icon"
            className="h-16 md:h-24 lg:h-28 w-auto object-contain filter brightness-110 drop-shadow-[0_8px_30px_rgba(197,168,128,0.15)] mix-blend-screen"
            whileHover={{ scale: 1.04, rotate: 8 }}
            transition={{ duration: 0.7, ease: EASE.silk }}
          />
        </m.div>

        {/* Eyebrow subtitle — mid layer */}
        <m.span
          className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-primary block select-none font-semibold"
          style={{ x: titleX, y: titleY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: EASE.editorial }}
        >
          Una Verdadera Experiencia Artesanal
        </m.span>

        {/* ── Main Title — mid layer ── */}
        <div className="space-y-1 select-none">
          <m.h1
            className="font-brand text-[2.25rem] sm:text-7xl md:text-[6.5rem] lg:text-[8rem] text-brand-textMain font-light leading-none uppercase tracking-tight"
            style={{ x: titleX, y: titleY }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE.silk }}
          >
            PANNA{' '}
            <span className="text-brand-primary font-normal md:-mx-2 select-none">
              &amp;
            </span>{' '}
            POMODORO
          </m.h1>
        </div>

        {/* ── CTAs — shallowest parallax layer ── */}
        <m.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 md:pt-10"
          style={{ x: ctaX, y: ctaY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7, ease: EASE.editorial }}
        >
          <Link
            to="/reservar"
            className="px-8 py-3.5 bg-brand-primary text-black font-body tracking-[0.25em] text-[12px] uppercase font-bold hover:bg-[#ab8b5f] transition-all duration-500 rounded-full shadow-xl hover:shadow-brand-primary/10 transform hover:-translate-y-0.5"
          >
            Reservar una Mesa
          </Link>

          <Link to="/menu" className="flex items-center space-x-3 group text-brand-textMain hover:text-brand-primary transition-colors duration-500">
            <span className="font-body text-[12px] tracking-[0.25em] uppercase">
              Ver Menú
            </span>
            <div className="w-8 h-8 rounded-full border border-brand-primary/30 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary/10 transition-all duration-500">
              <ArrowRightIcon size={12} className="text-brand-primary transform group-hover:translate-x-0.5 transition-transform duration-500" />
            </div>
          </Link>
        </m.div>
      </div>

      {/* ── Bottom Block: Hours Grid — static, anchors the composition ── */}
      <div className="relative z-10 w-full max-w-6xl text-center space-y-6 pt-8 md:pt-12">
        <m.div
          className="space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9, ease: EASE.editorial }}
        >
          <span className="font-body text-[12px] md:text-[14px] tracking-[0.3em] uppercase text-brand-primary block font-semibold">
            Horarios
          </span>
          <div className="w-12 h-[1px] bg-brand-primary/20 mx-auto mt-1" />
        </m.div>

        {/* Mobile hours dropdown */}
        <div className="block md:hidden">
          <m.button
            onClick={() => setHoursOpen(!hoursOpen)}
            className="inline-flex items-center justify-center space-x-2 border border-brand-primary/30 rounded-full px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase text-brand-primary hover:bg-brand-primary/10 transition-all duration-300 transform active:scale-95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            <span>{hoursOpen ? 'Ocultar Horarios' : 'Ver Horarios'}</span>
            <span className={`transform transition-transform duration-500 text-[10px] ${hoursOpen ? 'rotate-180' : ''}`}>
              &darr;
            </span>
          </m.button>

          <AnimatePresence>
            {hoursOpen && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: EASE.silk }}
                className="overflow-hidden mt-4 w-full max-w-xs mx-auto bg-brand-surfaceMuted/80 backdrop-blur-md rounded-[2px] border border-white/[0.04] p-4 space-y-2.5 text-left"
              >
                {workingHours.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-white/[0.02] last:border-0 pb-1.5 last:pb-0">
                    <span className="font-body text-[11px] text-brand-textMuted tracking-[0.15em] uppercase font-semibold">
                      {item.day}
                    </span>
                    <span className="font-body text-[11px] text-brand-textMain font-light tracking-wider">
                      {item.time}
                    </span>
                  </div>
                ))}
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop hours grid */}
        <m.div
          className="hidden md:flex md:justify-center overflow-x-auto gap-5 sm:grid sm:grid-cols-4 lg:grid-cols-7 sm:overflow-visible sm:gap-4 lg:gap-2 px-4 max-w-5xl mx-auto pt-1"
          style={{ scrollbarWidth: 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.0, ease: EASE.editorial }}
        >
          {workingHours.map((item, idx) => (
            <div
              key={idx}
              className="min-w-[76px] shrink-0 sm:min-w-0 sm:shrink space-y-1.5 border-r border-white/[0.04] last:border-r-0 px-2 group text-center tabular-nums"
            >
              <p className="font-body text-[12px] text-brand-textMuted tracking-[0.2em] uppercase font-semibold group-hover:text-brand-primary transition-colors duration-300">
                {item.day}
              </p>
              <p className="font-body text-[12px] text-brand-textMain font-light tracking-wider">
                {item.time}
              </p>
            </div>
          ))}
        </m.div>

        {/* Scroll Indicator */}
        <m.div
          className="pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.4 }}
        >
          <a
            href="#story"
            className="text-brand-primary/40 hover:text-brand-primary transition-colors duration-300 flex flex-col items-center space-y-2 text-[12px] font-body tracking-luxury uppercase animate-bounce"
          >
            <span className="text-[12px]">&darr;</span>
          </a>
        </m.div>
      </div>

    </section>
  );
}
