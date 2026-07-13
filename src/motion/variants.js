/**
 * variants.js
 * Panna & Pomodoro — Editorial Motion
 *
 * Restraint over flourish. Motion only where it carries information.
 *
 * Token layer (MOTION) is the single source of truth for durations, distances,
 * staggers, easing and parallax intensity. Variants below consume those tokens
 * so every transition in the site shares one language.
 */

// ─── Easing ───────────────────────────────────────────────────────────────────
export const EASE = {
  silk:      [0.16, 1, 0.3, 1],        // primary ease-out
  editorial: [0.25, 0.46, 0.45, 0.94], // precise, measured
  reveal:    [0.77, 0, 0.18, 1],       // slower opening, used for image masks
};

// ─── Token block ──────────────────────────────────────────────────────────────
// Read by every primitive (ScrollReveal, RevealText, RevealImage, StaggerGroup,
// ParallaxMedia, MotionLink, IntroOverlay, page transitions).
export const MOTION = {
  duration: {
    fast:      0.25,
    normal:    0.55,
    slow:      0.9,
    cinematic: 1.2,
  },
  delay: {
    short: 0.08,
    normal: 0.16,
  },
  stagger: {
    tight:   0.04,
    normal:  0.08,
    relaxed: 0.13,
  },
  distance: {
    small:  12,
    normal: 28,
    large:  56,
  },
  opacity: {
    hidden:  0,
    visible: 1,
    muted:   0.4,
  },
  // Parallax intensity in pixels — desktop/tablet. Mobile disabled in primitive.
  parallax: {
    desktop:     30,
    desktopMax:  50,
    tablet:      15,
    tabletMax:   25,
    mobile:      0,
  },
  intro: {
    desktopMs:       1400,
    mobileMs:         800,
    curtainDuration:  0.55,
    wordmarkDuration: 0.65,
  },
  route: {
    pageDuration:    0.32,
    curtainEnter:    0.45,
    curtainExit:     0.32,
    pageOffsetY:     6,
    pageOffsetYExit: -4,
  },
  // Reduced-motion multipliers — primitives consult prefersReducedMotion from
  // useReducedMotion() and skip transforms when true.
  reducedMotion: {
    durationScale: 0.0,   // zero duration when reduced
    distance:      0,
    parallaxPx:    0,
  },
  // Mobile scale applied by primitives on viewports < 768px.
  mobileScale: {
    durationFactor: 0.7, // -30%
    distanceFactor: 0.5, // halve distance
  },
};

// ─── Reveal — opacity + translateY ───────────────────────────────────────────
// Used for: section entrances, headlines, content blocks
export const reveal = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE.silk } },
};

// ─── Reveal Fade — opacity only ───────────────────────────────────────────────
// Used for: brand elements, logos, labels
export const revealFade = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE.editorial } },
};

// ─── Word Stagger — for inline headline reveals ───────────────────────────────
// Returns array of transition configs with cumulative delays; apply per word.
export const wordStagger = (base = 0.20, step = 0.12, duration = 0.6, ease = EASE.silk) =>
  (i) => ({ duration, delay: base + i * step, ease });

// ─── Scroll-reveal variants (consumed by ScrollReveal / StaggerGroup) ────────
export const fadeUp = {
  hidden:  { opacity: 0, y: MOTION.distance.small },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION.duration.normal, ease: EASE.silk } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: MOTION.duration.normal, ease: EASE.editorial } },
};

export const slideLeft = {
  hidden:  { opacity: 0, x:  MOTION.distance.small },
  visible: { opacity: 1, x: 0, transition: { duration: MOTION.duration.normal, ease: EASE.silk } },
};

export const slideRight = {
  hidden:  { opacity: 0, x: -MOTION.distance.small },
  visible: { opacity: 1, x: 0, transition: { duration: MOTION.duration.normal, ease: EASE.silk } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: MOTION.duration.normal, ease: EASE.silk } },
};

// ─── Image reveal variants (clip-path + subtle scale) ────────────────────────
// Direction policy:
//   - images on the LEFT of a two-column composition → 'left' or 'bottom'
//   - images on the RIGHT → 'right' or 'bottom'
//   - full-width / hero / standalone editorial shots → 'bottom' or 'full'
export const imageReveal = {
  hidden:  { opacity: 0, scale: 1.06, clipPath: 'inset(0 0 100% 0)' },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: MOTION.duration.cinematic, ease: EASE.reveal },
  },
};

export const imageRevealLeft = {
  hidden:  { opacity: 0, scale: 1.04, clipPath: 'inset(0 100% 0 0)' },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: MOTION.duration.cinematic, ease: EASE.reveal },
  },
};

export const imageRevealRight = {
  hidden:  { opacity: 0, scale: 1.04, clipPath: 'inset(0 0 0 100%)' },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: 'inset(0 0 0 0%)',
    transition: { duration: MOTION.duration.cinematic, ease: EASE.reveal },
  },
};

export const imageRevealFull = {
  hidden:  { opacity: 0, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: MOTION.duration.cinematic, ease: EASE.silk },
  },
};

// ─── Intro overlay (Fase 2) ──────────────────────────────────────────────────
export const introCurtain = {
  hidden:  { scaleY: 1 },
  visible: { scaleY: 0, transition: { duration: MOTION.duration.cinematic, ease: EASE.silk, delay: 0.1 } },
};

export const introWordmark = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION.duration.normal, ease: EASE.silk, delay: 0.05 } },
  exit:    { opacity: 0, y: -8, transition: { duration: MOTION.duration.fast, ease: EASE.silk } },
};

// ─── Lightbox (Fase 12) ──────────────────────────────────────────────────────
export const lightboxBackdrop = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: MOTION.duration.fast, ease: EASE.editorial } },
  exit:    { opacity: 0, transition: { duration: MOTION.duration.fast, ease: EASE.editorial } },
};

export const lightboxDialog = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: MOTION.duration.normal, ease: EASE.silk } },
  exit:    { opacity: 0, scale: 0.98, transition: { duration: MOTION.duration.fast, ease: EASE.silk } },
};

// ─── Route transition (Fase 9) ───────────────────────────────────────────────
export const pageTransition = {
  hidden:  { opacity: 0, y: MOTION.route.pageOffsetY },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION.route.pageDuration, ease: EASE.silk } },
  exit:    { opacity: 0, y: MOTION.route.pageOffsetYExit, transition: { duration: MOTION.route.pageDuration, ease: EASE.silk } },
};

export const routeCurtain = {
  hidden:  { scaleY: 1 },
  visible: { scaleY: 0, transition: { duration: MOTION.route.curtainEnter, ease: EASE.editorial, delay: 0.05 } },
  exit:    { scaleY: 1, transition: { duration: MOTION.route.curtainExit, ease: EASE.editorial } },
};

// ─── Drawer / sheet slide (cart, portal, mobile menu) ────────────────────────
export const drawerSlideRight = {
  hidden:  { x: '100%' },
  visible: { x: 0, transition: { duration: MOTION.duration.normal, ease: EASE.silk } },
  exit:    { x: '100%', transition: { duration: MOTION.duration.fast, ease: EASE.silk } },
};

export const overlayFade = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: MOTION.duration.fast, ease: EASE.editorial } },
  exit:    { opacity: 0, transition: { duration: MOTION.duration.fast, ease: EASE.editorial } },
};

// ─── Stagger parent (used by StaggerGroup) ───────────────────────────────────
export const staggerParent = (step = MOTION.stagger.normal, delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: step, delayChildren: delay },
  },
});

// ─── Stagger child (used inside StaggerGroup) ─────────────────────────────────
export const staggerChild = {
  hidden:  { opacity: 0, y: MOTION.distance.small },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION.duration.normal, ease: EASE.silk } },
};