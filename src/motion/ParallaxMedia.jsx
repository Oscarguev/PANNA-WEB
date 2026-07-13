/**
 * ParallaxMedia.jsx
 * Subtle scroll-linked translate for large editorial media (hero, full-bleed,
 * closing photo before footer). Never applied to cards, buttons, icons or
 * grids. Disabled on mobile viewports (<768px) and under prefers-reduced-motion.
 * Max displacement: 30–50px desktop, 15–25px tablet, 0 mobile.
 * Uses transform/y only (GPU-accelerated).
 */
import { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MOTION } from './variants';

function pickIntensity(px, viewportWidth) {
  if (viewportWidth >= 1024) return Math.min(px, MOTION.parallax.desktopMax);
  if (viewportWidth >= 768)  return Math.min(px, MOTION.parallax.tabletMax);
  return 0;
}

export default function ParallaxMedia({
  children,
  intensity = MOTION.parallax.desktop,
  className,
  offset = ['start end', 'end start'],
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const safeIntensity = pickIntensity(intensity, typeof window !== 'undefined' ? window.innerWidth : 1280);
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [safeIntensity, -safeIntensity],
  );

  return (
    <m.div
      ref={ref}
      style={{ y, willChange: reduced ? undefined : 'transform' }}
      className={className}
      {...rest}
    >
      {children}
    </m.div>
  );
}