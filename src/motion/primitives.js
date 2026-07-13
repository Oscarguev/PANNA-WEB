/**
 * motion/index.js
 * Re-export entry point for every motion primitive so consumers can import
 * from a single path: `import { ScrollReveal, RevealImage } from '../motion'`.
 */
export { default as ScrollReveal } from './ScrollReveal';
export { default as RevealText } from './RevealText';
export { default as RevealImage } from './RevealImage';
export { default as StaggerGroup } from './StaggerGroup';
export { default as ParallaxMedia } from './ParallaxMedia';
export { default as MotionLink } from './MotionLink';
export { default as IntroOverlay } from './IntroOverlay';
export { default as LuxuryMotionConfig } from './MotionConfig';
export { useIntroGate } from './useIntroGate';
export { useMotionGate } from './useMotionGate';
export { useBrandTransform } from './useBrandTransform';
export * from './variants';