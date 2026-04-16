/**
 * Aura Sophisticated Animation Variants
 * Using Spring Physics for a natural, "premium" feel.
 */

export const springConfig = {
  type: 'spring',
  stiffness: 350,
  damping: 30,
};

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

export const fadeSlideUp = {
  hidden: { 
    opacity: 0, 
    y: 24,
    scale: 0.98,
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: springConfig,
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    }
  }
};

export const glassIn = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  show: { 
    opacity: 1, 
    backdropFilter: 'blur(20px)',
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

export const listItem = {
  hidden: { opacity: 0, x: -12 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: springConfig
  }
};
