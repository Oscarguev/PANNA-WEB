/**
 * variants.js
 * Panna & Pomodoro — Luxury Minimal Motion
 *
 * Philosophy: Apple editorial restraint.
 * Motion earns its place or it doesn't exist.
 *
 * Budget:
 *   - 2 entrance variants (opacity + y, or opacity only)
 *   - 1 cinematic image variant (Hero only)
 *   - 2 easing curves
 */

// ─── Easing ───────────────────────────────────────────────────────────────────
export const EASE = {
  silk:      [0.16, 1, 0.3, 1],        // Luxury ease-out — primary
  editorial: [0.25, 0.46, 0.45, 0.94], // Precise, measured
};

// ─── Reveal — opacity + translateY ───────────────────────────────────────────
// Used for: section entrances, headlines, content blocks
// Rule: 300–500ms max. y offset max 16px.
export const reveal = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE.silk } },
};

// ─── Reveal Fade — opacity only ───────────────────────────────────────────────
// Used for: brand elements, logos, labels
// No spatial movement — pure presence.
export const revealFade = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE.editorial } },
};

// ─── Ken Burns — Hero image only ─────────────────────────────────────────────
// Single-use. One cinematic moment. Reduced from 2.4s → 1.6s.
export const kenBurns = {
  hidden:  { opacity: 0, scale: 1.05 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.6, ease: EASE.editorial } },
};
