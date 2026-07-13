/**
 * MotionConfig.jsx
 * Global Framer Motion configuration wrapper.
 * Respects prefers-reduced-motion automatically.
 */
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

export default function LuxuryMotionConfig({ children }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion="user"
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