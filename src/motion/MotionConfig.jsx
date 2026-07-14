/**
 * MotionConfig.jsx
 * Global Framer Motion configuration wrapper.
 * Respects prefers-reduced-motion automatically.
 *
 * Override de QA: añadir `?motion=on` o `?motion=force` a la URL
 * para forzar animaciones aunque el OS tenga reduced-motion activo.
 * Esto afecta tanto a framer-motion como al variant motion-safe: de
 * Tailwind (inyectando un override CSS en :root).
 */
import { useMemo, useEffect } from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

function getMotionOverride() {
  if (typeof window === 'undefined') return 'user';
  const params = new URLSearchParams(window.location.search);
  const v = params.get('motion');
  return v === 'on' || v === 'force';
}

function injectMotionOverride(forceOn) {
  if (typeof document === 'undefined') return;
  const id = 'motion-override-style';
  let el = document.getElementById(id);
  if (!forceOn) {
    if (el) el.remove();
    return;
  }
  if (el) return;
  el = document.createElement('style');
  el.id = id;
  // Override Tailwind motion-safe: variant cuando reduced-motion está activo en OS.
  // Usamos selector por atributo [class~="…"] para evitar el escape del colon.
  el.textContent = `
    [class~="motion-safe:animate-marquee"] {
      animation: marquee 60s linear infinite !important;
    }
  `;
  document.head.appendChild(el);
}

export default function LuxuryMotionConfig({ children }) {
  const forceMotion = useMemo(() => getMotionOverride(), []);
  useEffect(() => { injectMotionOverride(forceMotion); }, [forceMotion]);
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion={forceMotion ? false : 'user'}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
