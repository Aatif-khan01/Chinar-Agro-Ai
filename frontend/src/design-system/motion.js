import { motion as fmMotion } from 'framer-motion';

/**
 * Viewport reveal defaults — use with whileInView on sections.
 * Respects prefers-reduced-motion via CSS; Framer also checks media query when reduced.
 */
export const viewportOnce = {
  once: true,
  margin: '-8% 0px',
  amount: 0.2,
};

export const motion = fmMotion;
