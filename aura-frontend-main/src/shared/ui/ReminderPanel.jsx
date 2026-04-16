import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';
import { cn } from '@/shared/lib/utils/cn';

function toMinutes(value) {
  if (!value || !value.includes(':')) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * ReminderPanel - Manages habit notifications and upcoming reminders.
 * Redesigned with Refined Focus & Growth aesthetic.
 */
export function ReminderPanel({
  habits,
  notificationsEnabled,
  permission,
  onEnableNotifications,
  onPreferenceToggle,
  className,
}) {
  const upcoming = useMemo(
    () =>
      [...habits]
        .filter((habit) => habit.reminder && !habit.completedToday && !habit.skippedToday)
        .sort((left, right) => toMinutes(left.reminder) - toMinutes(right.reminder))
        .slice(0, 4),
    [habits]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 26, delay: 0.1 }}
      className={className}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Browser alerts for habits that still need attention today.
                </p>
              </div>
              
              {/* Custom Switch Implementation */}
              <button
                onClick={onPreferenceToggle}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  notificationsEnabled ? "bg-teal-600" : "bg-slate-700"
                )}
                aria-label="Toggle reminder notifications"
              >
                <motion.span
                  animate={{ x: notificationsEnabled ? 20 : 2 }}
                  className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0"
                />
              </button>
            </div>

            {/* Alert section */}
            {permission === 'denied' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                  Browser notifications are blocked. Re-enable them in settings.
                </p>
              </motion.div>
            )}

            {/* Actions section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={onEnableNotifications}
                className="flex-1 gap-2"
                variant={notificationsEnabled ? "outline" : "default"}
              >
                <Bell className="w-4 h-4" />
                Enable browser alerts
              </Button>
              
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300",
                notificationsEnabled 
                  ? "bg-teal-500/10 border-teal-500/20 text-teal-500" 
                  : "bg-slate-800/50 border-slate-700 text-slate-400"
              )}>
                {notificationsEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                <span>
                  {notificationsEnabled
                    ? `Notifications ${permission === 'granted' ? 'ready' : 'pending'}`
                    : 'Notifications paused'}
                </span>
              </div>
            </div>

            {/* Reminders list */}
            <div className="space-y-2">
              {upcoming.map((habit, index) => (
                <motion.div
                  key={habit._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
                    delay: 0.15 + index * 0.06,
                  }}
                  whileHover={{ x: 4 }}
                  className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-slate-800/30 border border-border/40 hover:bg-slate-800/50 hover:border-teal-500/30 transition-all duration-200"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-foreground leading-none">{habit.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                      {habit.description}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-500 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {habit.reminder || 'No time'}
                  </div>
                </motion.div>
              ))}
              
              {!upcoming.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center"
                >
                  <p className="text-sm text-muted-foreground italic">
                    No pending reminders right now. Today is either clear or already completed.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
