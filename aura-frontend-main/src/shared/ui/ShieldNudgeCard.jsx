import { ShieldAlert, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { cn } from '@/shared/lib/utils/cn';

/**
 * ShieldNudgeCard - Proactive risk detection and shadow mode alerts.
 * Redesigned with oceanic blues and glassmorphism.
 */
export const ShieldNudgeCard = ({ tomorrowRisks, className }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!tomorrowRisks || !tomorrowRisks.risks || tomorrowRisks.risks.length === 0 || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn("mb-6", className)}
      >
        <Card
          className={cn(
            "relative overflow-hidden p-6 border-l-4 border-blue-500/50",
            "bg-gradient-to-br from-blue-900/20 to-teal-900/10 backdrop-blur-xl"
          )}
        >
          {/* Decorative background element */}
          <div className="absolute -top-6 -right-6 text-blue-500/5 rotate-[-15deg]">
            <ShieldAlert size={140} />
          </div>

          <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.3)] text-white">
              <ShieldAlert size={24} />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Shadow Mode Alert
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-500 text-[10px] font-black uppercase tracking-wider border border-teal-500/30">
                    Proactive Shield
                  </span>
                </div>
                <button 
                  onClick={() => setDismissed(true)} 
                  className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-base text-foreground italic leading-relaxed mb-4">
                "{tomorrowRisks.shieldNudge}"
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                  Detected Risks for {tomorrowRisks.date || 'Tomorrow'}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {tomorrowRisks.risks.map((risk, index) => (
                    <div
                      key={index}
                      title={risk.reason}
                      className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-help"
                    >
                      <Info size={14} className="text-blue-400" />
                      <span className="text-xs font-semibold text-slate-300 group-hover:text-foreground">
                        {risk.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

