import { motion } from 'framer-motion';
import { useDashboard } from '../../app/providers/DashboardContext';
import { cn } from '@/shared/lib/utils/cn';

/**
 * WeeklyHeatmapWidget - A compact 7-day consistency visualization.
 * Redesigned with glassmorphism and growth-themed aesthetics.
 */
export function WeeklyHeatmapWidget({ className }) {
  const { dashboard, loading } = useDashboard();

  if (loading || !dashboard?.weeklySeries) {
    return (
      <div className={cn("w-[140px] h-[60px] rounded-xl bg-white/5 animate-pulse", className)} />
    );
  }

  const series = dashboard.weeklySeries;
  const maxCompleted = Math.max(...series.map(s => s.completed), 1);

  return (
    <div
      className={cn(
        "p-4 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-xl",
        "w-full sm:w-auto min-w-[160px]",
        className
      )}
    >
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">
        7-Day Consistency
      </span>
      <div className="flex items-end justify-between sm:justify-start gap-2 h-10">
        {series.map((day, i) => {
          const intensity = day.completed / maxCompleted;
          // Determine color based on completion intensity (Growth Palette)
          const barColor = intensity === 0 
            ? 'bg-slate-800' 
            : intensity > 0.6 
              ? 'bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.4)]' 
              : 'bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.2)]';

          return (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1 sm:flex-none">
              <motion.div
                initial={{ height: 4 }}
                animate={{ height: Math.max(day.completed > 0 ? intensity * 32 : 4, 4) }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.05 }}
                className={cn(
                  "w-2 sm:w-2.5 rounded-full transition-colors duration-500",
                  barColor
                )}
              />
              <span className="text-[9px] font-bold text-slate-600 uppercase">
                {day.day.charAt(0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
