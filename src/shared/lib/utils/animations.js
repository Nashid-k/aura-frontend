/**
 * Aura Sophisticated Animation Engine
 * Using Apple-style easing and spring physics for a high-fidelity interface.
 */

// 1. Unified Easing Profiles
export const EASE_CUSTOM = [0.21, 0.47, 0.32, 0.98]; // Luxury, slow-start, smooth-finish

// 2. Physics-based Spring Presets
export const SPRING_TIGHT = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const SPRING_BOUNCY = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
};

export const SPRING_GENTLE = {
  type: 'spring',
  stiffness: 150,
  damping: 25,
};

// 3. Staggered Container Variants
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// 4. Component Variants
export const fadeSlideUp = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98,
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: SPRING_BOUNCY,
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.99,
    transition: { duration: 0.2, ease: EASE_CUSTOM }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, y: 10 },
  show: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: SPRING_TIGHT,
  }
};

export const glassIn = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  show: { 
    opacity: 1, 
    backdropFilter: 'blur(20px)',
    transition: { duration: 0.6, ease: EASE_CUSTOM }
  }
};

// 5. Global Page Transitions (to be used in AppShell)
export const pageTransition = {
  initial: { opacity: 0, scale: 0.98, z: -10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    z: 0,
    transition: {
      duration: 0.6,
      ease: EASE_CUSTOM
    }
  },
  exit: { 
    opacity: 0, 
    scale: 1.02, 
    z: 10,
    transition: {
      duration: 0.4,
      ease: EASE_CUSTOM
    }
  }
};
