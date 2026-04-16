import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils/cn';

function getCellColor(intensity) {
  if (intensity >= 0.9) {
    return 'bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]';
  }
  if (intensity >= 0.65) {
    return 'bg-teal-600/80';
  }
  if (intensity >= 0.35) {
    return 'bg-sky-600/60';
  }
  if (intensity > 0) {
    return 'bg-slate-700/50';
  }
  return 'bg-white/[0.03] border-white/[0.05]';
}

export function HeatmapCalendar({ data }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        Last 35 days Activity
      </p>
      
      <div className="grid grid-cols-7 gap-1.5">
        {data.map((entry, index) => {
          const colorClass = getCellColor(entry.intensity);
          return (
            <motion.div
              key={entry.date}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 24,
                delay: index * 0.01,
              }}
              whileHover={{
                scale: 1.3,
                zIndex: 10,
                transition: { duration: 0.2 }
              }}
              title={`${entry.date} • ${entry.completed}/${entry.total || 0} completed`}
              className={cn(
                "aspect-square rounded-md cursor-pointer transition-shadow duration-300 border border-white/[0.05]",
                colorClass
              )}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Less</span>
        {[0, 0.2, 0.5, 0.75, 1].map((intensity) => (
          <div
            key={intensity}
            className={cn(
              "w-2.5 h-2.5 rounded-sm border border-white/[0.05]",
              getCellColor(intensity).split(' ')[0]
            )}
          />
        ))}
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">More</span>
      </div>
    </div>
  );
}
