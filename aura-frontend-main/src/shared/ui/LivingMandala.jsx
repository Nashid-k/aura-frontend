import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils/cn';

/**
 * LivingMandala - A generative SVG visualization representing user progress.
 * Redesigned with Refined Focus & Growth aesthetic: deep slates, rich teals, oceanic blues.
 */
export const LivingMandala = ({ dashboard, className }) => {
  if (!dashboard || !dashboard.habits) return null;

  // Derive generative parameters from the user's actual data
  const completionRate = dashboard.summary.weeklyCompletion || 0; // 0 to 100
  const activeHabits = dashboard.habits.length || 1;
  const longestStreak = dashboard.summary.longestStreak || 0;
  
  // Calculate complexity and size based on progress
  const numPetals = Math.max(4, Math.min(12, Math.floor(activeHabits * 1.5)));
  const scale = 0.5 + (completionRate / 100) * 0.5; // 50% to 100% scale
  const rotationSpeed = longestStreak > 0 ? 30 - Math.min(20, longestStreak) : 0; // faster if lower streak, slower/calmer if high streak.

  // Refined Growth Palette: Teals and Blues (No pink or purple)
  const colors = [
    '#14B8A6', // Teal 500
    '#0D9488', // Teal 600
    '#0891B2', // Cyan 600
    '#0284C7', // Sky 600
    '#2563EB', // Blue 600
  ];

  // Generate rings based on habits
  const rings = dashboard.habits.map((habit, index) => {
    const consistency = habit.consistency || 0;
    const radius = 40 + index * 25;
    // Fallback to our growth palette if habit color is missing or inappropriate
    const color = habit.color && !habit.color.match(/pink|purple|rose|fuchsia|violet/i) 
      ? habit.color 
      : colors[index % colors.length];
    const isCompletedToday = habit.completedToday;

    return {
      radius,
      color,
      consistency,
      isCompletedToday,
      dashArray: `${consistency} ${100 - consistency}`,
    };
  });

  return (
    <div
      className={cn(
        "relative flex aspect-square w-full max-w-[400px] items-center justify-center mx-auto",
        "drop-shadow-[0_0_20px_rgba(20,184,166,0.2)]",
        className
      )}
    >
      <motion.svg
        viewBox="0 0 400 400"
        className="h-full w-full overflow-visible"
        animate={{ rotate: rotationSpeed > 0 ? 360 : 0 }}
        transition={{
          duration: rotationSpeed > 0 ? rotationSpeed : 0,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        <g transform="translate(200, 200)">
          {/* Base glowing center - Pulsing core */}
          <motion.circle
            r={20 * scale}
            className={cn(
              "transition-colors duration-500",
              completionRate > 50 ? "fill-teal-500" : "fill-slate-600"
            )}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ 
              scale: [0.8, 1.2, 0.8], 
              opacity: [0.5, 0.8, 0.5],
              filter: completionRate > 50 ? ['blur(2px)', 'blur(8px)', 'blur(2px)'] : 'none'
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Generative Rings based on specific habits */}
          {rings.map((ring, i) => (
            <motion.circle
              key={`ring-${i}`}
              r={ring.radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.isCompletedToday ? 4 : 1.5}
              strokeDasharray={ring.dashArray}
              strokeOpacity={ring.consistency > 0 ? 0.8 : 0.2}
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{
                pathLength: ring.consistency / 100,
                rotate: ring.isCompletedToday ? 360 : 0,
              }}
              transition={{
                pathLength: { duration: 2, ease: 'easeOut' },
                rotate: { duration: 60 + i * 10, repeat: Infinity, ease: 'linear' },
              }}
            />
          ))}

          {/* Geometric Petals representing the overall weekly completion */}
          {Array.from({ length: numPetals }).map((_, i) => {
            const angle = (i * 360) / numPetals;
            const petalLength = 60 + (completionRate / 100) * 80;
            return (
              <motion.path
                key={`petal-${i}`}
                d={`M 0 20 Q 20 ${petalLength / 2} 0 ${petalLength} Q -20 ${petalLength / 2} 0 20`}
                className="fill-cyan-500/10 stroke-cyan-500/30"
                strokeWidth={1}
                transform={`rotate(${angle})`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, delay: i * 0.1, type: 'spring' }}
              />
            );
          })}
        </g>
      </motion.svg>
    </div>
  );
};

