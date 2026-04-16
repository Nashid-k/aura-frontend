import { motion } from 'framer-motion';
import { Bell, BellRing, Settings, Info, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { ReminderPanel } from '@/shared/ui/ReminderPanel';
import { useAuth } from '@/app/providers/AuthContext';
import { useDashboard } from '@/app/providers/DashboardContext';
import { Card, CardContent } from '@/shared/ui/core/Card';
import { cn } from '@/shared/lib/utils/cn';

export function RemindersPage() {
  const { user } = useAuth();
  const { dashboard, loading, notificationPermission, enableNotifications, toggleNotificationPreference } =
    useDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 w-full bg-card/40 animate-pulse rounded-2xl border border-border/20" />
        <div className="h-48 w-full bg-card/40 animate-pulse rounded-2xl border border-border/20" />
      </div>
    );
  }

  const isActive = Boolean(user?.notificationOptIn);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <BellRing size={24} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Reminder Studio</h1>
          </div>
          <div className={cn(
            "px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm",
            isActive ? "bg-teal-500/10 border-teal-500/20 text-teal-400" : "bg-muted border-border text-muted-foreground"
          )}>
            {isActive ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            {isActive ? "System Online" : "System Paused"}
          </div>
        </div>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
          Configure your rituals to trigger at the exact moment of intent. 
          {isActive ? " System alerts are active and ready for dispatch." : " Alerts are currently paused in your profile settings."}
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ReminderPanel
          habits={dashboard.habits}
          notificationsEnabled={isActive}
          permission={notificationPermission}
          onEnableNotifications={enableNotifications}
          onPreferenceToggle={toggleNotificationPreference}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/40 backdrop-blur-3xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-8 md:p-10 relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground shrink-0">
                <Settings size={32} />
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight">Ritual Orchestration</h3>
                  <p className="text-xs font-black uppercase tracking-[0.1em] text-primary/70">Optimization logic</p>
                </div>
                <p className="text-muted-foreground font-medium leading-relaxed max-w-xl">
                  Reminders are dispatched via <span className="text-primary font-bold italic">Push Protocol</span>. 
                  Nashid calculates the optimal window for each ritual to ensure you maintain momentum without cognitive overload.
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Real-time
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={12} />
                    Secure
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
