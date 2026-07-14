/**
 * MotionConfig.jsx
 * Global Framer Motion configuration wrapper.
 * Respects prefers-reduced-motion automatically.
 *
 * Override de QA: añadir `?motion=on` o `?motion=force` a la URL
 * para forzar TODAS las animaciones aunque el OS tenga reduced-motion
 * activo. Esto afecta:
 *  - framer-motion primitives (via MotionConfig.reducedMotion="never"
 *    + patch de window.matchMedia al module-load)
 *  - Tailwind motion-safe: variant (via <style> override)
 *
 * El patch de matchMedia se ejecuta al import de este módulo, antes
 * de que cualquier componente llame useReducedMotion().
 */
import { useMemo, useEffect } from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

function getMotionOverride() {
  if (typeof window === 'undefined') return false;
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
  el.textContent = `
    [class~="motion-safe:animate-marquee"] {
      animation: marquee 60s linear infinite !important;
    }
  `;
  document.head.appendChild(el);
}

function patchMatchMedia(forceOn) {
  // useReducedMotion() de framer-motion lee window.matchMedia directamente.
  // Patcheamos la función para devolver matches:false cuando el query
  // es de prefers-reduced-motion y el override está activo.
  if (typeof window === 'undefined') return;
  if (!window.matchMedia) return;
  if (window.__motionMatchMediaPatched) return;
  window.__motionMatchMediaPatched = true;
  const original = window.matchMedia.bind(window);
  window.matchMedia = function patchedMatchMedia(query) {
    if (forceOn && query.includes('prefers-reduced-motion')) {
      const mql = original.call(window, query);
      // Override .matches con getter que siempre devuelve false.
      try {
        Object.defineProperty(mql, 'matches', { value: false, configurable: true });
      } catch {
        // algunos browsers bloquean redefine de propiedad no-configurable;
        // en ese caso devolvemos un objeto MQL-shaped con matches:false.
        return {
          matches: false,
          media: mql.media,
          onchange: null,
          addEventListener() {},
          removeEventListener() {},
          addListener() {},
          removeListener() {},
          dispatchEvent() { return false; },
        };
      }
      return mql;
    }
    return original.call(window, query);
  };
}

// Side-effect: ejecuta el patch al import del módulo (antes de mount).
// Solo si override activo; si no, no tocamos matchMedia.
if (typeof window !== 'undefined') {
  // useMemo defer la decisión a render; pero podemos leer la URL aquí mismo.
  try {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('motion');
    if (v === 'on' || v === 'force') {
      patchMatchMedia(true);
      injectMotionOverride(true);
    }
  } catch { /* SSR-safe */ }
}

export default function LuxuryMotionConfig({ children }) {
  const forceMotion = useMemo(() => getMotionOverride(), []);
  useEffect(() => {
    if (forceMotion) {
      patchMatchMedia(true);
      injectMotionOverride(true);
    }
  }, [forceMotion]);
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion={forceMotion ? 'never' : 'user'}
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
