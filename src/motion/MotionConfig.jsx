/**
 * MotionConfig.jsx
 * Panna & Pomodoro — Global Framer Motion configuration wrapper
 *
 * Wraps the application to respect prefers-reduced-motion OS setting.
 * When reduced motion is preferred, all Framer animations are disabled
 * automatically without any component-level changes.
 */
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

export default function LuxuryMotionConfig({ children }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion="user"
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
