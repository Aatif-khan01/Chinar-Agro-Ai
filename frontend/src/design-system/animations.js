/* ═══════════════════════════════════════════════════════════════════════════
   AgriAI — Motion System
   Centralized Framer Motion presets. Respects prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════════════════ */

import { motion } from './motion.js';

// ─── Duration & easing (mirrors tokens.js) ──────────────────────────────────
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.22,
  slow: 0.38,
  slower: 0.56,
  slowest: 0.8,
};

export const ease = {
  entrance: [0.16, 1, 0.3, 1],
  snappy: [0.2, 0, 0, 1],
  smooth: [0.25, 0.1, 0.25, 1],
  out: [0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
  inOut: [0.4, 0, 0.2, 1],
};

export const spring = {
  snappy: { type: 'spring', stiffness: 320, damping: 32 },
  gentle: { type: 'spring', stiffness: 220, damping: 26 },
  default: { type: 'spring', stiffness: 260, damping: 28 },
};

// ─── Reduced motion helper ──────────────────────────────────────────────────
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const withReducedMotion = (motionProps) => {
  if (prefersReducedMotion()) {
    const { initial, animate, exit, whileHover, whileTap, transition, ...rest } = motionProps;
    return {
      ...rest,
      initial: false,
      animate: {},
      transition: { duration: 0 },
    };
  }
  return motionProps;
};

// ─── Page transitions ───────────────────────────────────────────────────────
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const pageTransition = {
  duration: duration.slow,
  ease: ease.entrance,
};

// ─── Stagger ────────────────────────────────────────────────────────────────
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.entrance },
  },
};

// ─── Scroll reveal (whileInView) ────────────────────────────────────────────
export const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slower, ease: ease.entrance },
  },
};

export const revealFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.slow, ease: ease.entrance },
  },
};

// ─── Fade variants ──────────────────────────────────────────────────────────
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.slow, ease: ease.entrance } },
  exit: { opacity: 0, transition: { duration: duration.normal } },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slower, ease: ease.entrance },
  },
  exit: { opacity: 0, y: -12, transition: { duration: duration.normal } },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -14 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.entrance } },
  exit: { opacity: 0, y: 14, transition: { duration: duration.normal } },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0, transition: { duration: duration.slow, ease: ease.entrance } },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: duration.slow, ease: ease.entrance } },
};

// ─── Scale ──────────────────────────────────────────────────────────────────
export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease: ease.entrance },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: duration.normal } },
};

// ─── Card hover ─────────────────────────────────────────────────────────────
export const cardHover = {
  rest: { y: 0 },
  hover: { y: -3, transition: { duration: duration.normal, ease: ease.snappy } },
};

// ─── Button press ───────────────────────────────────────────────────────────
export const buttonTap = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
};

// ─── Nav indicator ──────────────────────────────────────────────────────────
export const navIndicator = {
  layoutId: 'activeNavIndicator',
  initial: false,
  transition: spring.snappy,
};

// ─── Dropdown / popover ─────────────────────────────────────────────────────
export const dropdown = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.fast, ease: ease.entrance },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: duration.instant },
  },
};

// ─── Dialog ─────────────────────────────────────────────────────────────────
export const dialogOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.fast } },
  exit: { opacity: 0, transition: { duration: duration.instant } },
};

export const dialogContent = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.slow, ease: ease.entrance },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.99,
    transition: { duration: duration.fast },
  },
};

// ─── Slide variants ─────────────────────────────────────────────────────────
export const slideUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.entrance } },
  exit: { opacity: 0, y: -10, transition: { duration: duration.normal } },
};

export const slideDown = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.entrance } },
  exit: { opacity: 0, y: -10, transition: { duration: duration.normal } },
};

// ─── Progress fill (transform-based) ────────────────────────────────────────
export const progressFill = (value, delay = 0.2) => ({
  initial: { scaleX: 0 },
  animate: { scaleX: value / 100 },
  transition: { duration: 0.9, delay, ease: ease.entrance },
});

// Re-export motion for viewport reveals
export { motion };
