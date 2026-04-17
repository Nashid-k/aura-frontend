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
import { useHabitStatsQuery } from '@/shared/lib/hooks/useDashboardQueries';
import { HeatmapCalendar } from '@/shared/ui/HeatmapCalendar';
import { formatPercent } from '@/shared/lib/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';
import { cn } from '@/shared/lib/utils/cn';
import { EASE_CUSTOM } from '../shared/lib/utils/animations';

export function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: payload, isLoading: loading, error } = useHabitStatsQuery(id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center mx-auto text-destructive mb-6">
            <AlertCircle size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter">Connection Lost</h2>
            <p className="text-muted-foreground font-medium">{error || 'This ritual could not be summoned from the archive.'}</p>
          </div>
          <Button variant="secondary" className="rounded-2xl px-10 h-14 font-bold" onClick={() => navigate('/app/today')}>Return to Sanctuary</Button>
        </div>
      </div>
    );
  }

  const { habit, stats, logs, timeline, weeklySeries } = payload;

  return (
    <motion.div
      layoutId={`habit-card-container-${id}`}
      className="min-h-screen bg-background text-foreground"
      transition={{ duration: 0.6, ease: EASE_CUSTOM }}
    >
      <div className="max-w-4xl mx-auto px-page-x py-12 space-y-12 pb-32">
        
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/app/today')}
            className="group rounded-xl pl-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Sanctuary
          </Button>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full animate-pulse" 
              style={{ backgroundColor: habit.color || 'var(--primary)' }} 
            />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Vibrational Ritual</span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <header className="space-y-6">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
              >
                <Flame size={20} />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/50">{habit.category}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-7xl font-black tracking-tighter leading-tight"
            >
              {habit.title}
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed"
          >
            {habit.description || 'No mantra defined for this ritual.'}
          </motion.p>
        </header>

        {/* Key Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatItem label="Consistency" value={`${stats.consistency}%`} icon={<Target size={14} className="text-primary" />} />
          <StatItem label="Current Streak" value={`${stats.currentStreak}D`} icon={<Flame size={14} className="text-orange-500" />} />
          <StatItem label="Total Flow" value={stats.totalLogs} icon={<RotateCcw size={14} className="text-sky-500" />} />
          <StatItem label="Mastery" value="Initiate" icon={<TrendingUp size={14} className="text-emerald-500" />} />
        </motion.div>

        {/* Temporal Visualization */}
        <section className="space-y-8 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 px-2">Aura Heatmap</h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
              <Calendar size={12} /> Last 30 Cycles
            </div>
          </div>
          <Card className="p-8 rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl">
             <HeatmapCalendar data={timeline} />
          </Card>
        </section>

        {/* Log History */}
        <section className="space-y-8">
           <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 px-2">Manifestation Logs</h3>
           <div className="space-y-4">
             {logs.length > 0 ? logs.slice(0, 10).map((log, i) => (
               <motion.div
                 key={log._id}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 * i }}
                 className="flex items-center justify-between p-6 rounded-3xl bg-secondary/20 border border-border/10 hover:bg-secondary/40 transition-colors group"
               >
                 <div className="flex items-center gap-6">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center text-xl",
                     log.completed ? "bg-success/10 text-success" : "bg-muted/10 text-muted-foreground"
                   )}>
                     {log.completed ? '✓' : '—'}
                   </div>
                   <div>
                     <p className="font-bold text-lg">{new Date(log.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                     <p className="text-sm font-medium text-muted-foreground">{log.note || 'No notes for this manifestation.'}</p>
                   </div>
                 </div>
                 <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
               </motion.div>
             )) : (
               <div className="text-center py-20 bg-secondary/10 rounded-[3rem] border border-dashed border-border/40">
                 <FileText className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                 <p className="text-muted-foreground font-medium">No history recorded yet.</p>
               </div>
             )}
           </div>
        </section>
      </div>
    </motion.div>
  );
}

function StatItem({ label, value, icon }) {
  return (
    <div className="p-6 rounded-[2rem] bg-secondary/30 border border-border/50 space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground/60">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="text-3xl font-black tracking-tighter">{value}</div>
    </div>
  );
}
StatItem.displayName = 'StatItem';
