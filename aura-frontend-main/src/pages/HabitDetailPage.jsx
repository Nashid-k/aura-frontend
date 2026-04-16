import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Flame, 
  Target, 
  TrendingUp, 
  RotateCcw, 
  Calendar, 
  FileText,
  ChevronRight,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '@/shared/api/client';
import { HeatmapCalendar } from '@/shared/ui/HeatmapCalendar';
import { formatPercent } from '@/shared/lib/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';
import { cn } from '@/shared/lib/utils/cn';

function buildHeatmapFromTimeline(timeline) {
  return timeline.slice(-35).map((entry) => ({
    date: entry.date,
    completed: entry.completed ? 1 : 0,
    total: entry.scheduled && !entry.skipped ? 1 : 0,
    intensity: entry.completed ? 1 : 0,
  }));
}

function ScrollCard({ children, delay = 0, className, ...props }) {
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

export function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHabit() {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get(`/habits/${id}/stats`);
        setPayload(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load habit details.');
      } finally {
        setLoading(false);
      }
    }

    fetchHabit();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="p-8 rounded-[2rem] bg-card border border-border/40 shadow-sm flex flex-col items-center text-center gap-6">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Ritual Not Found</h3>
            <p className="text-muted-foreground font-medium">{error || 'This habit could not be loaded.'}</p>
          </div>
          <Button variant="secondary" className="rounded-full px-8" onClick={() => navigate('/today')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const { habit, stats, logs, timeline, weeklySeries } = payload;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={() => navigate('/today')}
            className="flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Today</span>
          </button>
        </motion.div>

        {/* Header Hero */}
        <header className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: habit.color || 'var(--primary)' }} 
              />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Core Ritual</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              {habit.title}
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              {habit.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatItem label="Streak" value={`${stats.streak?.current || 0}d`} icon={<Flame className="w-4 h-4 text-orange-500" />} />
            <StatItem label="Consistency" value={formatPercent(stats.consistency)} icon={<Target className="w-4 h-4 text-primary" />} />
            <StatItem label="Best" value={`${stats.streak?.best || 0}d`} icon={<TrendingUp className="w-4 h-4 text-green-500" />} />
            <StatItem label="Recovery" value={formatPercent(stats.recoveryRate)} icon={<RotateCcw className="w-4 h-4 text-sky-500" />} />
          </div>
        </header>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollCard>
            <Card className="h-full border-border/40 bg-card shadow-sm rounded-[2rem]">
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Weekly Resonance</CardTitle>
                    <CardDescription className="font-medium">Volume over the past 5 weeks</CardDescription>
                  </div>
                  <Calendar className="text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="h-48 flex items-end justify-between gap-4 pt-8">
                  {weeklySeries.map((week, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-4">
                      <div className="w-full bg-secondary/30 rounded-full h-32 relative overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(week.completed / 7) * 100}%` }}
                          transition={{ delay: 0.1 + idx * 0.1, duration: 1 }}
                          className="absolute bottom-0 left-0 right-0 rounded-full"
                          style={{ backgroundColor: habit.color || 'var(--primary)' }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {week.week}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollCard>

          <ScrollCard delay={0.1}>
            <Card className="h-full border-border/40 bg-card shadow-sm rounded-[2rem]">
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Ritual Density</CardTitle>
                    <CardDescription className="font-medium">Completion patterns</CardDescription>
                  </div>
                  <TrendingUp className="text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 flex flex-col justify-center min-h-[240px]">
                <HeatmapCalendar data={buildHeatmapFromTimeline(timeline)} />
              </CardContent>
            </Card>
          </ScrollCard>
        </div>

        {/* History */}
        <ScrollCard delay={0.15}>
          <Card className="border-border/40 bg-card shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="px-8 py-8 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">Chronicles</CardTitle>
                </div>
                <FileText className="text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {logs.length > 0 ? logs.map((log) => (
                  <div
                    key={log._id}
                    className="p-8 hover:bg-secondary/20 transition-colors group flex justify-between items-start gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          {log.date}
                        </span>
                        {log.skipped && (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            Skipped
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-medium leading-relaxed">
                        {log.note || 'No notes for this session.'}
                      </p>
                    </div>
                    <ChevronRight className="text-muted-foreground mt-1" />
                  </div>
                )) : (
                  <div className="py-20 text-center flex flex-col items-center gap-4">
                    <Info className="w-10 h-10 text-muted-foreground/20" />
                    <p className="text-muted-foreground font-medium">No chronicles recorded yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollCard>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon }) {
  return (
    <div className="p-4 rounded-3xl bg-card border border-border/40 shadow-sm space-y-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
StatItem.displayName = 'StatItem';
