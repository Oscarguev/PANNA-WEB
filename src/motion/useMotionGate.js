/**
 * useMotionGate.js
 * Combines prefers-reduced-motion (OS) and mobile viewport check.
 * Returns:
 *   reduced: true when OS preference is "reduce"
 *   isMobile: true when viewport < 768px (SSR safe)
 *   factor:   duration multiplier (0 = skip, 0.7 = -30% on mobile)
 */
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { MOTION } from './variants';

export function useMotionGate() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);

  return {
    reduced,
    isMobile,
    factor: reduced ? 0 : (isMobile ? MOTION.mobileScale.durationFactor : 1),
  };
}