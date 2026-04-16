import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils/cn';

export function LivingSigil({ params, level = 1, className }) {
  // Default params if none provided
  const {
    lines = 'fluid',
    complexity = 3,
    auraColor = '#14b8a6', // Default teal
    symmetry = 4,
  } = params || {};

  // Procedural generation based on params
  const points = [];
  const radius = 100;
  
  // Safe symmetry value
  const validSymmetry = Math.max(3, Math.min(12, symmetry));
  const validComplexity = Math.max(1, Math.min(12, complexity));
  
  for (let i = 0; i < validSymmetry; i++) {
    const angle = (Math.PI * 2 * i) / validSymmetry;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    points.push({ x, y });
  }

  // Generate paths based on "lines" style (angular vs fluid vs mixed)
  const generatePath = (pts, isInner) => {
    const scale = isInner ? 0.5 : 1;
    if (lines === 'angular') {
      return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * scale} ${p.y * scale}`).join(' ') + ' Z';
    } else if (lines === 'mixed') {
       return pts.map((p, i) => `${i === 0 ? 'M' : 'Q'} ${p.x * scale * 0.8} ${p.y * scale * 1.2} ${p.x * scale} ${p.y * scale}`).join(' ') + ' Z';
    } else {
      // fluid
      return pts.map((p, i) => {
        const next = pts[(i + 1) % pts.length];
        const cpX = (p.x + next.x) / 2 * 1.5;
        const cpY = (p.y + next.y) / 2 * 1.5;
        return `${i === 0 ? `M ${p.x * scale} ${p.y * scale}` : ''} Q ${cpX * scale} ${cpY * scale} ${next.x * scale} ${next.y * scale}`;
      }).join(' ');
    }
  };

  const outerPath = generatePath(points, false);
  const innerPath = generatePath(points, true);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full aspect-square max-w-[300px] mx-auto",
        className
      )}
    >
      <motion.svg
        viewBox="-150 -150 300 300"
        className="w-full h-full overflow-visible"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, ease: 'linear', repeat: Infinity }}
      >
        {/* Subtle Aura Gradient Background */}
        <motion.circle
          r={radius * 1.1}
          fill={`url(#auraGradient)`}
          initial={{ opacity: 0.1, scale: 0.95 }}
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [0.95, 1.02, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <defs>
          <radialGradient id="auraGradient">
            <stop offset="0%" stopColor={auraColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={auraColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Complexity layers */}
        {Array.from({ length: validComplexity }).map((_, i) => {
          const rotationOffset = (360 / validComplexity) * i;
          return (
            <g key={i} transform={`rotate(${rotationOffset}) scale(${1 - i * 0.12})`}>
              <motion.path
                d={outerPath}
                fill="none"
                stroke={auraColor}
                strokeWidth={1.5}
                strokeOpacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3 + i * 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d={innerPath}
                fill={auraColor}
                fillOpacity={0.05}
                stroke={auraColor}
                strokeWidth={0.5}
                strokeOpacity={0.4}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, delay: i * 0.3 }}
              />
            </g>
          );
        })}
        
        {/* Core level indicator (center) */}
        <motion.circle
          r={radius * 0.18}
          className="fill-background stroke-[1px]"
          style={{ stroke: auraColor }}
        />
        <text
          x="0"
          y="2"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground text-[22px] font-bold tracking-tighter"
        >
          {level}
        </text>
      </motion.svg>
    </div>
  );
}
