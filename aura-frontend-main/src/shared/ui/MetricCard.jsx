import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/shared/lib/utils/cn';
import { Card, CardContent } from '@/shared/ui/core/Card';

export function MetricCard({ label, value, helper, accent = 'text-teal-500' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full relative overflow-hidden group border-white/5 bg-slate-900/40 backdrop-blur-xl">
        {/* Dynamic accent glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-teal-500/20 blur-3xl pointer-events-none group-hover:bg-teal-400/30 transition-colors duration-500"
        />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
              {label}
            </span>
            
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.15 }}
            >
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-100">
                {value}
              </h2>
            </motion.div>
            
            {helper && (
              <p className={cn("text-xs font-bold mt-2", accent)}>
                {helper}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
