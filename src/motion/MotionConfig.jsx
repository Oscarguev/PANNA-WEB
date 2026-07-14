/**
 * MotionConfig.jsx
 * Global Framer Motion configuration wrapper.
 * Respects prefers-reduced-motion automatically.
 *
 * Override de QA: añadir `?motion=on` o `?motion=force` a la URL
 * para forzar animaciones aunque el OS tenga reduced-motion activo.
 */
import { useMemo } from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

function getMotionOverride() {
  if (typeof window === 'undefined') return 'user';
  const params = new URLSearchParams(window.location.search);
  const v = params.get('motion');
  if (v === 'on' || v === 'force') return false;
  if (v === 'off' || v === 'respect') return 'user';
  return 'user';
}

export default function LuxuryMotionConfig({ children }) {
  const reducedMotion = useMemo(() => getMotionOverride(), []);
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion={reducedMotion}
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
