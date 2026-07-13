import { Link } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import pizzaHero from '../assets/sourdough_pizza.webp';
import { EASE } from '../motion/variants';

/**
 * Hero v5 — solo marca protagonista.
 *
 * Unica pieza textual con voz: "Panna & Pomodoro" en Fraunces.
 * Eyebrow pequeno y discreto. Un enlace secundario "Ver carta".
 * No descripcion, no boton de reservar (vive en la navbar),
 * no datos praticos (viven en InfoStrip debajo).
 *
 * Comportamiento esperado por el brief:
 * 1. PANNA & POMODORO es el unico texto fuerte del hero.
 * 2. La reserva se hace desde la navbar.
 * 3. La franja informativa debajo resuelve todo lo demas.
 */

// Foto: fade + scale entry; parallax sutil manejado por ParallaxMedia wrapper.
const PHOTO_VARIANTS = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE.silk } },
};

const WORDMARK_VARIANTS = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.20 + i * 0.10, ease: EASE.silk },
  }),
};

/**
 * Listener de parallax sutil para la foto del hero.
 * Sincroniza la variable CSS --hero-scroll con window.scrollY mapeado a un rango
 * pequeño (0..-20 desktop, 0 tablet, 0 mobile). Cumple Fase 3: max 3-5% pantalla.
 */
function HeroParallax() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const update = () => {
      const y = window.scrollY;
      if (window.innerWidth >= 1024) {
        // Desktop: hasta -20px proporcional.
        const v = Math.max(-20, Math.min(0, y * -0.06));
        root.style.setProperty('--hero-scroll', String(v));
      } else {
        // Tablet/mobile: 0.
        root.style.setProperty('--hero-scroll', '0');
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      root.style.setProperty('--hero-scroll', '0');
    };
  }, []);
  return null;
}

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="hero"
      aria-label="Panna y Pomodoro — restaurante italiano en Sonsonate"
      className="relative bg-black"
      style={{ minHeight: '76svh', height: 'min(720px, 76svh)' }}
    >
      {/* Fotografia a sangre — fade + scale entry + parallax sutil via CSS transform.
          Parallax se aplica al contenedor para mantener GPU-accelerated transform. */}
      <m.div
        initial="hidden"
        animate="visible"
        variants={PHOTO_VARIANTS}
        className="absolute inset-0 will-change-transform"
        aria-hidden="true"
        style={{
          transform: typeof window !== 'undefined' && window.innerWidth >= 1024
            ? 'translate3d(0, calc(var(--hero-scroll, 0) * 1px), 0)'
            : undefined,
        }}
      >
        <img
          src={pizzaHero}
          alt=""
          aria-hidden="true"
          width={2000}
          height={1333}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '42% center' }}
        />
      </m.div>

      {/* Listener parallax: actualiza --hero-scroll entre 0 y -20 (desktop) / 0 (mobile).
          Skip en prefers-reduced-motion. */}
      {!reduced && (
        <HeroParallax />
      )}

      {/* Overlay superior — soporta la navbar fija */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 md:h-36"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.20) 60%, rgba(10,10,10,0) 100%)',
        }}
      />

      {/* Gradiente principal detras del wordmark — concentrado en el centro */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.45) 45%, rgba(10,10,10,0) 75%)',
        }}
      />

      {/* Banda inferior suave — cede al cream */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 md:h-28"
        style={{
          background:
            'linear-gradient(0deg, rgba(244,240,232,0.55) 0%, rgba(244,240,232,0.18) 55%, rgba(244,240,232,0) 100%)',
        }}
      />

      {/* Linea roja 1px arriba — acento discreto */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-brand-primary/80"
      />

      {/* Contenido debajo del navbar fijo.
          - pt = navbar (~88px) + 16px de aire. Garantiza que el eyebrow NUNCA
            quede debajo del navbar aunque el flexbox intente centrar. */}
      <div
        className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col items-center justify-center text-center pt-[108px] md:pt-[120px] pb-20 md:pb-24"
        style={{ minHeight: '76svh' }}
      >
        <m.p
          variants={WORDMARK_VARIANTS}
          initial="hidden"
          animate={reduced ? 'visible' : 'visible'}
          custom={0}
          className="inline-flex items-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-white/85 font-medium mb-7 md:mb-9"
        >
          <span aria-hidden="true" className="inline-block w-7 h-px bg-brand-primary" />
          Restaurante italiano · Sonsonate
        </m.p>

        <h1
          aria-label="Panna y Pomodoro"
          className="font-wordmark text-white select-none uppercase"
          style={{
            fontSize: 'clamp(4rem, 13vw, 12.5rem)',
            lineHeight: 0.92,
            letterSpacing: '0.01em',
            textShadow: '0 4px 32px rgba(0,0,0,0.55)',
          }}
        >
          <m.span className="block" variants={WORDMARK_VARIANTS} initial="hidden" animate="visible" custom={1}>
            Panna{' '}
            <span aria-hidden="true" style={{ marginLeft: '-0.05em' }}>
              &amp;
            </span>
          </m.span>
          <m.span className="block" variants={WORDMARK_VARIANTS} initial="hidden" animate="visible" custom={2}>
            Pomodoro
          </m.span>
        </h1>

        {/* Unica accion secundaria discreta — la reserva vive en la navbar */}
        <m.div
          variants={WORDMARK_VARIANTS}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-10 md:mt-14"
        >
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 min-h-[44px] px-1 py-2 text-[12px] md:text-[13px] font-medium tracking-[0.18em] uppercase text-white/90 border-b border-white/40 hover:border-white hover:text-white transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Ver carta
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </m.div>
      </div>
    </section>
  );
}
