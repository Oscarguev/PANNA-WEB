/**
 * useBrandTransform.js
 * Panna & Pomodoro — Hero-to-Navbar brand morphing hook
 *
 * Tracks page scroll from 0 to the Hero section height.
 * Returns motion values for progressive brand transformation:
 * - Hero title letter-spacing collapses as user scrolls
 * - Navbar brand expands in the opposite direction
 *
 * This creates the editorial "brand is always present" effect.
 */
import { useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * @param {number} heroHeight - Height of the hero section in px (default: window.innerHeight)
 * @returns {{
 *   scrollYProgress: MotionValue,
 *   heroTracking: MotionValue,  // letter-spacing for hero h1
 *   heroOpacity: MotionValue,   // opacity of hero title during scroll
 *   heroY: MotionValue,         // subtle upward drift of hero title
 *   navBrandOpacity: MotionValue, // navbar brand visibility
 * }}
 */
export function useBrandTransform() {
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();

  // Hero h1: as user scrolls 0→300px, title subtly drifts up and fades
  const heroY = useTransform(
    scrollY,
    [0, 300],
    prefersReducedMotion ? [0, 0] : [0, -30]
  );

  const heroOpacity = useTransform(
    scrollY,
    [0, 280],
    prefersReducedMotion ? [1, 1] : [1, 0]
  );

  // Letter spacing: relaxes from editorial wide to slightly tighter on scroll
  // (Not easy to interpolate as CSS string, so we return a numeric value in em units * 100)
  // Components should use this as a style transform
  const heroTrackingNum = useTransform(
    scrollY,
    [0, 200],
    prefersReducedMotion ? [8, 8] : [8, 6] // represents 0.08em → 0.06em (× 0.01)
  );

  // Navbar brand: fades in after 40px scroll (complements the existing isScrolled logic)
  const navBrandOpacity = useTransform(
    scrollY,
    [20, 80],
    [0.7, 1]
  );

  return {
    scrollY,
    heroY,
    heroOpacity,
    heroTrackingNum,
    navBrandOpacity,
  };
}
