/**
 * RevealImage.jsx
 * Editorial image mask reveal. Stable aspect-ratio container, then a
 * clip-path + scale entrance. Direction policy:
 *   - 'bottom' (default) — full-width or hero shots
 *   - 'left' — images on the LEFT of a two-column composition
 *   - 'right' — images on the RIGHT of a two-column composition
 *   - 'full' — full-bleed editorial blocks
 * Duration 0.8–1.2s. Respects prefers-reduced-motion.
 */
import { m, useReducedMotion } from 'framer-motion';
import {
  imageReveal,
  imageRevealLeft,
  imageRevealRight,
  imageRevealFull,
} from './variants';

const VARIANTS = {
  bottom: imageReveal,
  left:   imageRevealLeft,
  right:  imageRevealRight,
  full:   imageRevealFull,
};

export default function RevealImage({
  children,
  direction = 'bottom',
  className,
  delay = 0,
  aspectRatio,
  amount = 0.2,
  style,
  ...rest
}) {
  const reduced = useReducedMotion();
  const variants = VARIANTS[direction] || imageReveal;
  const wrapperStyle = aspectRatio ? { aspectRatio, ...style } : style;

  if (reduced) {
    return (
      <div className={className} style={wrapperStyle} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      className={className}
      style={wrapperStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </m.div>
  );
}