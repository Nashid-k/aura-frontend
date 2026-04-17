import { useState, useRef, useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/shared/lib/utils/cn';

/**
 * AuraSurface - A high-fidelity container that reacts to mouse movement.
 * Provides a magnetic pull for its children and a follow-glow effect.
 */
export const AuraSurface = memo(({ children, className, glowColor = 'hsl(var(--primary))', intensity = 0.15 }) => {
  const containerRef = useRef(null);
  
  // Mouse position relative to container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the glow
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Background glow opacity based on distance from center
  const glowOpacity = useTransform(
    [smoothX, smoothY],
    ([x, y]) => {
      if (!containerRef.current) return 0;
      return intensity;
    }
  );

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative group/aura overflow-hidden transition-all duration-700", className)}
    >
      {/* Ambient Radial Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${smoothX}px ${smoothY}px, ${glowColor}, transparent 40%)`,
          opacity: glowOpacity,
        }}
      />
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none z-[1] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

AuraSurface.displayName = 'AuraSurface';

/**
 * Magnetic - A wrapper that pulls its content toward the mouse.
 */
export const Magnetic = memo(({ children, strength = 0.3 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { damping: 20, stiffness: 150 });
  const smoothY = useSpring(y, { damping: 20, stiffness: 150 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
    >
      {children}
    </motion.div>
  );
});

Magnetic.displayName = 'Magnetic';
