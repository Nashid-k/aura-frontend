import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Sparkles, 
  Zap, 
  BarChart2, 
  TrendingUp, 
  Award, 
  Activity,
  ChevronRight,
  Flame,
  ShieldCheck,
  Info,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { HeatmapCalendar } from '@/shared/ui/HeatmapCalendar';
import { useDashboard } from '@/app/providers/DashboardContext';
import { formatPercent } from '@/shared/lib/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/core/Card';
import { cn } from '@/shared/lib/utils/cn';

function ScrollRevealCard({ children, delay = 0, className, ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ProgressPage() {
  const { dashboard, loading } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 w-full bg-card/40 animate-pulse rounded-[2rem] border border-border/20" />
        <div className="h-64 w-full bg-card/40 animate-pulse rounded-[2rem] border border-border/20" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24 bg-background text-foreground">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Progress</h1>
        <p className="text-muted-foreground text-lg font-medium">Your journey to a better you, visualized.</p>
      </header>

      {/* Narrative & Keystone Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {dashboard.weeklyReflection && (
          <ScrollRevealCard
            className={cn(
              "lg:col-span-7",
              dashboard.summary.keystoneHabit ? "lg:col-span-7" : "lg:col-span-12"
            )}
          >
            <Card className="h-full border-border/40 bg-card shadow-sm rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 md:p-10 relative">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Sparkles size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Weekly Reflection</span>
                  </div>
                  <blockquote className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
                    "{dashboard.weeklyReflection}"
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          </ScrollRevealCard>
        )}

        {dashboard.summary.keystoneHabit && (
          <ScrollRevealCard className="lg:col-span-5">
            <Card className="h-full border-border/40 bg-primary text-primary-foreground shadow-sm rounded-[2rem]">
              <CardContent className="p-8 md:p-10 flex flex-col justify-between h-full space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/20 text-white">
                      <Zap size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/70">Keystone Ritual</span>
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight">{dashboard.summary.keystoneHabit.title}</h3>
                </div>
                <p className="text-primary-foreground/80 font-medium leading-relaxed">
                  This habit is your primary growth driver. Consistency here anchors your entire routine.
                </p>
              </CardContent>
            </Card>
          </ScrollRevealCard>
        )}
      </div>

      {/* Momentum Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ScrollRevealCard className="lg:col-span-8">
          <Card className="h-full border-border/40 bg-card shadow-sm rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Momentum</CardTitle>
                <CardDescription className="font-medium">Activity over the last 7 days</CardDescription>
              </div>
              <BarChart2 className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="h-64 flex items-end justify-between gap-3 pt-8">
                {dashboard.weeklySeries.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full relative flex flex-col justify-end h-40 bg-secondary/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.completed / Math.max(...dashboard.weeklySeries.map(d => d.completed), 1)) * 100}%` }}
                        transition={{ delay: 0.1 + idx * 0.05, duration: 0.8, ease: "easeOut" }}
                        className="w-full bg-primary"
                      />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollRevealCard>

        <ScrollRevealCard className="lg:col-span-4" delay={0.1}>
          <Card className="h-full border-border/40 bg-card shadow-sm rounded-[2rem]">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-2xl font-bold tracking-tight">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3">
              {dashboard.leaderboard.length ? (
                dashboard.leaderboard.map((habit, index) => (
                  <div
                    key={habit._id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-border/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-4">{index + 1}</span>
                      <span className="font-semibold tracking-tight">{habit.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame size={14} fill="currentColor" />
                        <span className="font-bold text-sm">{(habit.streak?.current || 0)}d</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{formatPercent(habit.consistency)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground text-sm font-medium">Keep going to see rankings.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollRevealCard>
      </div>

      {/* Resilience & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScrollRevealCard delay={0.15}>
          <Card className="h-full border-border/40 bg-card shadow-sm rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Resilience</CardTitle>
                <CardDescription className="font-medium">Focus vs Recovery rate</CardDescription>
              </div>
              <ShieldCheck className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="h-48 flex items-end gap-2 pt-4">
                {dashboard.habits.map((habit, idx) => (
                  <div key={idx} className="flex-1 flex items-end justify-center gap-1 group relative h-full">
                    <div className="flex-1 bg-primary/20 rounded-full h-full relative overflow-hidden">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${habit.consistency * 100}%` }}
                        className="absolute bottom-0 left-0 right-0 bg-primary/40"
                      />
                    </div>
                    <div className="flex-1 bg-teal-500/10 rounded-full h-full relative overflow-hidden">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${habit.recoveryRate * 100}%` }}
                        className="absolute bottom-0 left-0 right-0 bg-teal-500/30"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500/30" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recovery</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollRevealCard>

        <ScrollRevealCard delay={0.2}>
          <Card className="h-full border-border/40 bg-card shadow-sm rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Consistency</CardTitle>
                <CardDescription className="font-medium">Daily habit density</CardDescription>
              </div>
              <Calendar className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-8 pb-8 flex flex-col justify-center min-h-[240px]">
              <HeatmapCalendar data={dashboard.heatmap} />
            </CardContent>
          </Card>
        </ScrollRevealCard>
      </div>

      {/* Reflections */}
      <ScrollRevealCard delay={0.25}>
        <Card className="border-border/40 bg-card shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-8 py-8 border-b border-border/40">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Recent Notes</CardTitle>
            </div>
            <MessageSquare className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {dashboard.reflections.length ? (
                dashboard.reflections.map((reflection) => (
                  <div
                    key={reflection.id}
                    className="p-8 hover:bg-secondary/20 transition-colors group flex justify-between items-center"
                  >
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{reflection.title}</h4>
                      <p className="text-muted-foreground leading-relaxed font-medium">{reflection.note}</p>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground font-medium">No reflections recorded yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </ScrollRevealCard>
    </div>
  );
}
