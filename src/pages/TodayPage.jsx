import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { 
  Plus, 
  Wand2, 
  AlertCircle,
  Loader2,
  Settings2,
  ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TodayHabitCard } from '../entities/habit/ui/TodayHabitCard';
import { ShieldNudgeCard } from '../shared/ui/ShieldNudgeCard';
import { MutationCard } from '../shared/ui/MutationCard';
import { AutoScalingCard } from '../shared/ui/AutoScalingCard';
import { TemplateDrawer } from '../shared/ui/TemplateDrawer';
import { useMutationsQuery, useFuseMutation, useEvolutionMutation } from '../shared/lib/hooks/useDashboardQueries';
import { useAuth } from '../app/providers/AuthContext';
import { cn } from '../shared/lib/utils/cn';
import { Button } from '../shared/ui/core/Button';
import { useDashboardData, useHabitActions } from '../app/providers/DashboardContext';
import { staggerContainer, fadeSlideUp, SPRING_BOUNCY, EASE_CUSTOM } from '../shared/lib/utils/animations';

export function TodayPage() {
  const { user } = useAuth();
  const { dashboard, loading, error, refresh } = useDashboardData();
  const { toggleHabit, logProgress, skipHabit, dismissBadge, newBadge } = useHabitActions();
  const { openNewHabit, editHabit } = useOutletContext();
  
  const { data: mutationSugs = [] } = useMutationsQuery(user?.id);
  const fuseMutation = useFuseMutation();
  const evolutionMutation = useEvolutionMutation();

  const [templateOpen, setTemplateOpen] = useState(false);
  const [routineOpen, setRoutineOpen] = useState(false);
  const [routineContent, setRoutineContent] = useState('');
  const [routineLoading, setRoutineLoading] = useState(false);

  const hasHabits = dashboard.habits?.length > 0;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  if (loading && !dashboard.habits?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin opacity-40" />
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Aligning Aura...</p>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="max-w-4xl mx-auto pt-page-t px-page-x">
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span className="font-semibold text-sm">{error}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={refresh}>Retry</Button>
          </div>
        )}

        {/* Massive Typography Header */}
        <motion.header 
          variants={fadeSlideUp}
          initial="hidden"
          animate="show"
          className="mb-16"
        >
          <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-3 opacity-70">{currentDate}</p>
          <div className="flex items-baseline justify-between">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] text-foreground">Today</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-2xl h-12 w-12 hover:bg-secondary/50" 
              onClick={() => setTemplateOpen(true)}
              aria-label="Habit Templates"
            >
              <Settings2 className="w-6 h-6" />
            </Button>
          </div>
        </motion.header>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {/* Summary Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeSlideUp} className="flex flex-col justify-center">
              <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Current Momentum</h2>
              <div className="space-y-2">
                <div className="text-5xl font-black tracking-tighter">
                  {dashboard.summary?.completedToday || 0} / {dashboard.summary?.totalHabits || 0}
                </div>
                <p className="text-lg font-medium text-muted-foreground">Rituals honored today.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeSlideUp}>
              <ShieldNudgeCard risks={dashboard.tomorrowRisks} />
            </motion.div>
          </section>

          {/* AI Intelligence Layer */}
          <AnimatePresence>
            {(mutationSugs.length > 0 || dashboard.habits?.some(h => h.autoScaling)) && (
              <motion.section 
                variants={fadeSlideUp}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 px-2">
                  <Wand2 size={18} className="text-primary" />
                  <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Neural Suggestions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AutoScalingCard />
                  {mutationSugs.map((sug) => (
                    <MutationCard 
                      key={sug.id} 
                      suggestion={sug} 
                      onAction={async (id, action) => {
                        if (action === 'fuse') await fuseMutation.mutateAsync({ habitAId: sug.habitAId, habitBId: sug.habitBId });
                        else await evolutionMutation.mutateAsync({ habitId: sug.habitId, status: action });
                      }}
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Habits Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Active Rituals</h3>
              <Button variant="ghost" size="sm" className="rounded-xl font-bold text-primary" onClick={openNewHabit}>
                <Plus size={16} className="mr-1" /> Add Ritual
              </Button>
            </div>

            {hasHabits ? (
              <motion.div layout="position" className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout" initial={false}>
                  {dashboard.habits.map((habit) => (
                    <motion.div
                      key={habit._id}
                      layoutId={`habit-card-${habit._id}`}
                      variants={fadeSlideUp}
                      layout="position"
                      className="origin-top"
                    >
                      <TodayHabitCard
                        habit={habit}
                        onToggle={() => toggleHabit(habit)}
                        onLogProgress={(delta) => logProgress(habit, delta)}
                        onSkip={() => skipHabit(habit)}
                        onEdit={() => editHabit(habit)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                variants={fadeSlideUp}
                className="p-16 rounded-[3rem] bg-secondary/30 border border-dashed border-border/50 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8">
                  <Plus className="w-10 h-10 text-primary opacity-40" />
                </div>
                <h4 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Forge your first ritual</h4>
                <p className="text-muted-foreground mb-8 max-w-sm">Your journey to intentional living begins with a single commitment.</p>
                <Button onClick={openNewHabit} className="rounded-2xl h-14 px-10 shadow-xl shadow-primary/20">Get Started</Button>
              </motion.div>
            )}
          </section>
        </motion.div>
      </div>

      <TemplateDrawer open={templateOpen} onClose={() => setTemplateOpen(false)} />

      {/* Modern Badge Notification */}
      <AnimatePresence>
        {newBadge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={SPRING_BOUNCY}
              className="max-w-sm w-full bg-card p-10 rounded-[3rem] border border-border shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-8xl mb-8 transform hover:scale-110 transition-transform cursor-default select-none drop-shadow-2xl">
                  {newBadge.emoji || '🏆'}
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-2 text-foreground">Metamorphosis!</h2>
                <p className="text-lg font-bold text-primary mb-6 uppercase tracking-widest">{newBadge.label}</p>
                <p className="text-muted-foreground font-medium mb-10 leading-relaxed">{newBadge.desc}</p>
                <Button size="lg" className="w-full rounded-2xl h-16 text-xl font-bold shadow-xl shadow-primary/20" onClick={dismissBadge}>
                  Continue
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
