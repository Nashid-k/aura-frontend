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
import { api } from '../shared/api/client';
import { useDashboard } from '../app/providers/DashboardContext';
import { TodayHabitCard } from '../entities/habit/ui/TodayHabitCard';
import { ShieldNudgeCard } from '../shared/ui/ShieldNudgeCard';
import { MutationCard } from '../shared/ui/MutationCard';
import { AutoScalingCard } from '../shared/ui/AutoScalingCard';
import { TemplateDrawer } from '../shared/ui/TemplateDrawer';
import { useMutationsQuery, useFuseMutation, useEvolutionMutation } from '../shared/lib/hooks/useDashboardQueries';
import { useAuth } from '../app/providers/AuthContext';
import { cn } from '../shared/lib/utils/cn';
import { Button } from '../shared/ui/core/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

export function TodayPage() {
  const { user } = useAuth();
  const { dashboard, loading, error, refresh, toggleHabit, logProgress, skipHabit, dismissBadge, newBadge } = useDashboard();
  const { openNewHabit, editHabit } = useOutletContext();
  const [templateOpen, setTemplateOpen] = useState(false);
  const [routineOpen, setRoutineOpen] = useState(false);
  const [routineContent, setRoutineContent] = useState('');
  const [routineLoading, setRoutineLoading] = useState(false);
  const hasHabits = dashboard.habits.length > 0;

  const { data: mutations = [] } = useMutationsQuery(user?.id);
  const fuseMutation = useFuseMutation();
  const evolutionMutation = useEvolutionMutation();

  const handleAcceptMutation = (suggestion) => {
    if (suggestion.type === 'habit_stack') {
      fuseMutation.mutate({ habitAId: suggestion.habitAId, habitBId: suggestion.habitBId });
    } else {
      evolutionMutation.mutate({ habitId: suggestion.habitId, status: 'accepted' });
    }
  };

  const handleDismissMutation = (suggestion) => {
    if (suggestion.type !== 'habit_stack') {
      evolutionMutation.mutate({ habitId: suggestion.habitId, status: 'dismissed' });
    }
  };

  const handleGenerateRoutine = async () => {
    setRoutineOpen(true);
    setRoutineLoading(true);
    try {
      const { data } = await api.post('/ai/routine');
      setRoutineContent(data.routine);
    } catch (err) {
      setRoutineContent("Unable to generate your routine at this time.");
    } finally {
      setRoutineLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="h-20 w-48 bg-muted animate-pulse rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-20">
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
        <header className="mb-12">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{currentDate}</p>
          <div className="flex items-baseline justify-between">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">Today</h1>
            <Button variant="ghost" size="icon" className="rounded-full h-12 w-12" onClick={() => setTemplateOpen(true)}>
              <Settings2 className="w-6 h-6" />
            </Button>
          </div>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Summary Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-muted-foreground mb-2">Summary</h2>
              <p className="text-lg font-medium leading-relaxed">
                {dashboard.summary.completedToday === dashboard.summary.totalHabits && dashboard.summary.totalHabits > 0
                  ? "You've completed all your rituals for today. Excellent work."
                  : `You have ${dashboard.summary.totalHabits - dashboard.summary.completedToday} rituals remaining to reach your goal.`}
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex gap-4 items-center justify-end">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg h-auto" onClick={openNewHabit}>
                <Plus className="mr-2 h-6 w-6" strokeWidth={3} />
                Add Habit
              </Button>
              <Button variant="secondary" size="lg" className="rounded-full px-8 py-6 text-lg h-auto" onClick={handleGenerateRoutine}>
                <Wand2 className="mr-2 h-6 w-6" />
                AI Plan
              </Button>
            </motion.div>
          </section>

          {/* Intelligence Alerts (Only if present) */}
          {(mutations.length > 0 || dashboard.tomorrowRisks?.length > 0) && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Intelligence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mutations.length > 0 && (
                  <MutationCard 
                    suggestion={mutations[0]} 
                    onAccept={() => handleAcceptMutation(mutations[0])}
                    onDismiss={() => handleDismissMutation(mutations[0])}
                  />
                )}
                <ShieldNudgeCard tomorrowRisks={dashboard.tomorrowRisks} />
              </div>
            </section>
          )}

          {/* Habits List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rituals</h3>
            </div>

            {hasHabits ? (
              <div className="grid grid-cols-1 gap-4">
                {dashboard.habits.map((habit) => (
                  <TodayHabitCard
                    key={habit._id}
                    habit={habit}
                    onToggle={() => toggleHabit(habit)}
                    onLogProgress={(delta) => logProgress(habit, delta)}
                    onSkip={() => skipHabit(habit)}
                    onEdit={() => editHabit(habit)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-[2.5rem] bg-secondary/20 border-2 border-dashed border-border/50">
                <h4 className="text-xl font-bold mb-2">No active habits</h4>
                <p className="text-muted-foreground mb-6">Start your journey by defining your first behavioral commitment.</p>
                <Button onClick={openNewHabit} className="rounded-full">Get Started</Button>
              </div>
            )}
          </section>

          {/* Additional Insights */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t">
            <AutoScalingCard />
            <div className="p-8 rounded-[2rem] bg-secondary/30 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Weekly Progress</h4>
                <div className="text-4xl font-black mb-2">{Math.round(dashboard.summary.weeklyCompletion)}%</div>
              </div>
              <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${dashboard.summary.weeklyCompletion}%` }}
                  className="h-full bg-primary rounded-full" 
                />
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      <TemplateDrawer open={templateOpen} onClose={() => setTemplateOpen(false)} />

      {/* Routine Dialog */}
      <AnimatePresence>
        {routineOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRoutineOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-10 rounded-[3rem] bg-card border shadow-2xl"
            >
              {routineLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-xl font-bold text-muted-foreground animate-pulse">Architecting your day...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="prose prose-slate max-w-none 
                    prose-h1:text-4xl prose-h1:font-black prose-h1:tracking-tight
                    prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8
                    prose-p:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed
                  ">
                    <ReactMarkdown>{routineContent}</ReactMarkdown>
                  </div>
                  <Button size="lg" className="w-full rounded-2xl h-16 text-xl font-bold" onClick={() => setRoutineOpen(false)}>
                    Adopt Strategy
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Badge Celebration */}
      <AnimatePresence>
        {newBadge && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative text-center p-12 max-w-lg"
            >
              <div className="text-[10rem] mb-8 leading-none">{newBadge.emoji}</div>
              <h3 className="text-5xl font-black mb-4 tracking-tight">{newBadge.label}</h3>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                {newBadge.desc}
              </p>
              <Button size="lg" className="w-full rounded-2xl h-16 text-xl font-bold" onClick={dismissBadge}>
                Continue
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
