/**
 * MotionConfig.jsx
 * Global Framer Motion configuration wrapper.
 * Respects prefers-reduced-motion automáticamente.
 *
 * Override de QA: añadir `?motion=on` o `?motion=force` a la URL
 * para forzar TODAS las animaciones aunque el OS tenga reduced-motion
 * activo. Esto afecta:
 *  - framer-motion primitives (via MotionConfig.reducedMotion="never"
 *    + patch de window.matchMedia montado y desmontado según URL)
 *  - Tailwind motion-safe: variant (vía <style> inyectado)
 *
 * El patch de matchMedia se monta en useEffect cuando forceMotion=true
 * y se desmonta cuando la URL cambia / componente se desmonta,
 * evitando fugas entre rutas.
 */
import { useMemo, useEffect, useRef } from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

function getMotionOverride() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const v = params.get('motion');
  return v === 'on' || v === 'force';
}

const MOTION_OVERRIDE_STYLE_ID = 'motion-override-style';

// ── Module-singletons: capturamos matchMedia original UNA sola vez. ──────
// Antes el patch era side-effect al cargar el módulo; eso filtraba el
// override entre rutas (si entrabas con ?motion=on y luego navegabas sin
// el param, useReducedMotion seguía devolviendo false el resto del SPA).
// Ahora montamos/desmontamos el patch vía useEffect con [forceMotion] dep.
let originalMatchMedia = null;
function getOriginalMatchMedia() {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  if (originalMatchMedia) return originalMatchMedia;
  originalMatchMedia = window.matchMedia.bind(window);
  return originalMatchMedia;
}

function patchMatchMedia(forceOn) {
  if (typeof window === 'undefined') return () => {};
  if (!window.matchMedia) return () => {};
  const original = getOriginalMatchMedia();
  if (!original) return () => {};
  window.matchMedia = function patchedMatchMedia(query) {
    if (forceOn && query.includes('prefers-reduced-motion')) {
      const mql = original.call(window, query);
      try {
        Object.defineProperty(mql, 'matches', {
          get: () => false,
          configurable: true,
        });
      } catch {
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
  return () => {
    window.matchMedia = original;
  };
}

function injectMotionOverride(forceOn) {
  if (typeof document === 'undefined') return () => {};
  const remove = () => {
    const el = document.getElementById(MOTION_OVERRIDE_STYLE_ID);
    if (el) el.remove();
  };
  if (!forceOn) {
    remove();
    return remove;
  }
  let el = document.getElementById(MOTION_OVERRIDE_STYLE_ID);
  if (el) return remove;
  el = document.createElement('style');
  el.id = MOTION_OVERRIDE_STYLE_ID;
  // Override Tailwind motion-safe: variant cuando reduced-motion está activo en OS.
  el.textContent = `
    [class~="motion-safe:animate-marquee"] {
      animation: marquee 60s linear infinite !important;
    }
  `;
  document.head.appendChild(el);
  return remove;
}

export default function LuxuryMotionConfig({ children }) {
  const forceMotion = useMemo(() => getMotionOverride(), []);
  // Cleanup refs: el último useEffect gana. Si forceMotion cambia entre
  // mount → unmount, los cleanups corren en orden inverso.
  const cleanupRef = useRef([]);

  useEffect(() => {
    // Reset cleanups de runs anteriores antes de instalar nuevos.
    cleanupRef.current.forEach((fn) => { try { fn(); } catch { /* */ } });
    cleanupRef.current = [];

    if (forceMotion) {
      cleanupRef.current.push(patchMatchMedia(true));
      cleanupRef.current.push(injectMotionOverride(true));
    } else {
      // Asegurar estado limpio incluso si la URL cambió.
      cleanupRef.current.push(injectMotionOverride(false));
    }

    return () => {
      cleanupRef.current.forEach((fn) => { try { fn(); } catch { /* */ } });
      cleanupRef.current = [];
    };
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