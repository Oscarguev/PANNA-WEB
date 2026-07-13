/**
 * useBrandTransform.js
 * Editorial scroll-aware brand hook.
 *
 * Tracks scroll and returns motion values for:
 * - heroY / heroOpacity: subtle fade-out of the hero block on scroll
 * - navBrandOpacity: navbar brand visibility (used by Navbar)
 */
import { useScroll, useTransform, useReducedMotion } from 'framer-motion';

export function useBrandTransform() {
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();

  const heroY = useTransform(
    scrollY,
    [0, 300],
    prefersReducedMotion ? [0, 0] : [0, -20]
  );

  const heroOpacity = useTransform(
    scrollY,
    [0, 280],
    prefersReducedMotion ? [1, 1] : [1, 0]
  );

  const navBrandOpacity = useTransform(
    scrollY,
    [20, 80],
    prefersReducedMotion ? [1, 1] : [1, 1]
  );

  return {
    scrollY,
    heroY,
    heroOpacity,
    navBrandOpacity,
  };
}