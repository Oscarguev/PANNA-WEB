/**
 * IntroOverlay.jsx
 * Editorial intro: surface of brand-textMain covers viewport, wordmark fades in,
 * curtain lifts upward revealing the hero. One time per session (controlled by
 * useIntroGate). Total budget: 1.4s desktop / 0.8s mobile. Never blocks longer
 * than necessary; never shown on route changes.
 */
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { introCurtain, introWordmark, MOTION } from './variants';

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export default function IntroOverlay({ show }) {
  const reduced = useReducedMotion();
  const dur = reduced ? 0.0 : (isMobile() ? MOTION.intro.mobileMs / 1000 : MOTION.intro.desktopMs / 1000);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          <m.div
            key="intro-curtain"
            initial="hidden"
            animate="visible"
            exit="visible"
            variants={introCurtain}
            transition={{ duration: dur * 0.85, ease: [0.83, 0, 0.17, 1] }}
            style={{ transformOrigin: 'top' }}
            className="fixed inset-0 z-[80] bg-brand-textMain pointer-events-none"
            aria-hidden="true"
          />
          <m.div
            key="intro-wordmark"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={introWordmark}
            transition={{ duration: dur * 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[81] flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <span className="font-wordmark uppercase tracking-[0.04em] text-brand-background text-[16px] sm:text-[20px] md:text-[22px]">
              Panna &amp; Pomodoro
            </span>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}