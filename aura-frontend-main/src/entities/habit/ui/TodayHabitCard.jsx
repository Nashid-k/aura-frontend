import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Trash2, 
  Edit3, 
  FastForward, 
  MoreHorizontal,
  Plus,
  Minus,
  Trophy
} from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Card } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';

export function TodayHabitCard({ habit, onToggle, onLogProgress, onSkip, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  
  const isCompleted = habit.completedToday;
  const isSkipped = habit.skippedToday;
  const progress = habit.progressToday || 0;
  const target = habit.targetValue || 1;
  const percent = Math.min(100, (progress / target) * 100);
  const color = habit.color || 'hsl(var(--primary))';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden p-6 rounded-[2rem] border-none shadow-sm transition-all duration-300",
        isCompleted ? "bg-success/10" : "bg-secondary/30",
        isSkipped && "opacity-40 grayscale-[0.5]"
      )}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              {/* Apple-style Activity Ring */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-primary/10"
                  />
                  <motion.circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke={isCompleted ? "hsl(var(--success))" : color}
                    strokeWidth="6"
                    strokeDasharray="150.8"
                    initial={{ strokeDashoffset: 150.8 }}
                    animate={{ strokeDashoffset: 150.8 - (150.8 * percent) / 100 }}
                    strokeLinecap="round"
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                  />
                </svg>
                {isCompleted ? (
                  <Check className="w-6 h-6 text-success" strokeWidth={4} />
                ) : (
                  <span className="text-sm font-black text-foreground/70">{Math.round(percent)}%</span>
                )}
              </div>

              <div>
                <h4 className={cn(
                  "text-xl font-bold tracking-tight transition-colors",
                  isCompleted ? "text-success-foreground" : "text-foreground"
                )}>
                  {habit.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">{habit.category}</span>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-bold text-amber-500/80">{(habit.streak?.current || 0)}D</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 hover:bg-background/50"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
              
              <AnimatePresence>
                {showMenu && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowMenu(false)}
                      className="fixed inset-0 z-10"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl bg-popover border shadow-xl z-20 overflow-hidden"
                    >
                      <button onClick={() => { onEdit(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-muted transition-colors">
                        <Edit3 className="w-4 h-4" /> Edit Habit
                      </button>
                      <button onClick={() => { onSkip(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-muted transition-colors">
                        <FastForward className="w-4 h-4 text-amber-500" /> Skip Today
                      </button>
                      <div className="h-px bg-muted" />
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4">
            {/* Simple Horizontal Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-muted-foreground px-1">
                <span>PROGRESS</span>
                <span>{progress} / {target} {habit.targetMetric}</span>
              </div>
              <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  className="h-full bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex gap-1 bg-background/50 rounded-2xl p-1 shadow-inner">
                <Button 
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-12 w-12"
                  onClick={() => onLogProgress(-1)}
                  disabled={isCompleted || isSkipped || progress <= 0}
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="flex items-center px-2 min-w-[3rem] justify-center font-bold">
                  {progress}
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-12 w-12"
                  onClick={() => onLogProgress(1)}
                  disabled={isCompleted || isSkipped}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <Button 
                onClick={onToggle}
                variant={isCompleted ? "default" : "secondary"}
                className={cn(
                  "flex-1 h-14 rounded-2xl text-lg font-bold transition-all duration-500",
                  isCompleted && "bg-success text-success-foreground hover:bg-success/90"
                )}
              >
                {isCompleted ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-6 h-6" strokeWidth={4} />
                    Done
                  </div>
                ) : (
                  "Complete"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
