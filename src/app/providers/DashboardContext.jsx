import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { api } from '../../shared/api/client';
import { useAuth } from './AuthContext';
import { 
  useDashboardQuery, 
  useAiNudgeQuery, 
  useStreakAlertsQuery, 
  useLogMutation,
  useHabitMutation
} from '../../shared/lib/hooks/useDashboardQueries';
import { nativeBridge } from '../../shared/lib/utils/nativeBridge';
import { registerServiceWorker, subscribeToPush } from '../../shared/lib/utils/notifications';

const DashboardDataContext = createContext(null);
const HabitActionContext = createContext(null);
const NotificationContext = createContext(null);

const emptyDashboard = {
  summary: {
    completedToday: 0,
    totalHabits: 0,
    weeklyCompletion: 0,
    longestStreak: 0,
    strongestHabit: '',
  },
  habits: [],
  leaderboard: [],
  weeklySeries: [],
  heatmap: [],
  reflections: [],
  weeklyReflection: '',
};

export function DashboardProvider({ children }) {
  return (
    <DashboardDataProvider>
      <HabitActionProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </HabitActionProvider>
    </DashboardDataProvider>
  );
}

function DashboardDataProvider({ children }) {
  const { user } = useAuth();
  const { data: dashboard = emptyDashboard, isLoading: loading, error: queryError, refetch } = useDashboardQuery(user?.id);
  const { data: aiNudge = '' } = useAiNudgeQuery(user?.id);
  const { data: streakAlerts = [] } = useStreakAlertsQuery(user?.id);

  const error = queryError ? (queryError.response?.data?.message || 'Could not load dashboard') : '';

  useEffect(() => {
    if (dashboard.summary) {
      const remaining = dashboard.summary.totalHabits - dashboard.summary.completedToday;
      nativeBridge.setBadge(remaining > 0 ? remaining : 0);
    }
  }, [dashboard.summary]);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  const value = useMemo(() => ({
    dashboard,
    loading,
    error,
    aiNudge,
    streakAlerts,
    refresh: () => refetch()
  }), [dashboard, loading, error, aiNudge, streakAlerts, refetch]);

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

function HabitActionProvider({ children }) {
  const { user } = useAuth();
  const { refresh } = useDashboardData();
  const logMutation = useLogMutation(user?.id);
  const habitMutation = useHabitMutation();

  const [backupMessage, setBackupMessage] = useState(null);
  const [importing, setImporting] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  const value = useMemo(() => ({
    backupMessage,
    importing,
    newBadge,
    dismissBadge() { setNewBadge(null); },
    clearBackupMessage() { setBackupMessage(null); },
    async saveHabit(form, editingHabit) {
      try {
        await habitMutation.mutateAsync({ form, habitId: editingHabit?._id });
      } catch {
        setBackupMessage({ type: 'error', text: 'Failed to save habit.' });
      }
    },
    async toggleHabit(habit) {
      try {
        const isCompleted = !habit.completedToday;
        const result = await logMutation.mutateAsync({
          habitId: habit._id,
          completed: isCompleted,
          skipped: false,
          progress: isCompleted && habit.targetValue > 0 ? habit.targetValue : 0,
        });
        if (result.newBadges?.length) setNewBadge(result.newBadges[0]);
      } catch {
        setBackupMessage({ type: 'error', text: 'Failed to sync progress.' });
      }
    },
    async logProgress(habit, progressDelta) {
      try {
        const newProgress = Math.max(0, (habit.progressToday || 0) + progressDelta);
        const isDone = newProgress >= habit.targetValue;
        const result = await logMutation.mutateAsync({
          habitId: habit._id,
          completed: isDone,
          skipped: false,
          progress: newProgress,
        });
        if (result.newBadges?.length) setNewBadge(result.newBadges[0]);
      } catch {
        setBackupMessage({ type: 'error', text: 'Failed to sync progress.' });
      }
    },
    async skipHabit(habit) {
      try {
        const isSkipped = !habit.skippedToday;
        const result = await logMutation.mutateAsync({
          habitId: habit._id,
          completed: false,
          skipped: isSkipped,
        });
        if (result.newBadges?.length) setNewBadge(result.newBadges[0]);
      } catch {
        setBackupMessage({ type: 'error', text: 'Failed to sync progress.' });
      }
    },
    async exportData() {
      try {
        const { data } = await api.get('/data/export');
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aura-habits-${dayjs().format('YYYY-MM-DD')}.json`;
        link.click();
        URL.revokeObjectURL(url);
        setBackupMessage({ type: 'success', text: 'Export created.' });
      } catch {
        setBackupMessage({ type: 'error', text: 'Export failed.' });
      }
    },
    async importData(file) {
      if (!file) return;
      try {
        setImporting(true);
        const text = await file.text();
        const payload = JSON.parse(text);
        await api.post('/data/import', payload);
        setBackupMessage({ type: 'success', text: 'Import completed.' });
        await refresh();
      } catch {
        setBackupMessage({ type: 'error', text: 'Import failed.' });
      } finally {
        setImporting(false);
      }
    }
  }), [backupMessage, importing, newBadge, logMutation, habitMutation, refresh]);

  return <HabitActionContext.Provider value={value}>{children}</HabitActionContext.Provider>;
}

function NotificationProvider({ children }) {
  const { user, updatePreferences } = useAuth();
  const { dashboard } = useDashboardData();
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );

  useEffect(() => {
    if (!user?.notificationOptIn || notificationPermission !== 'granted' || !dashboard.habits) {
      return undefined;
    }

    const checkReminders = () => {
      const now = dayjs();
      const todayKey = now.format('YYYY-MM-DD');

      dashboard.habits.forEach((habit) => {
        if (!habit.reminder || habit.completedToday || habit.skippedToday) return;

        const reminderAt = dayjs(`${todayKey}T${habit.reminder}`);
        const diff = now.diff(reminderAt, 'minute');
        const storageKey = `aura-reminder-${habit._id}-${todayKey}`;

        if (diff >= 0 && diff < 1 && !localStorage.getItem(storageKey)) {
          new Notification(`Time for ${habit.title}`, {
            body: habit.description || 'Your ritual is due now.',
          });
          localStorage.setItem(storageKey, 'sent');
        }
      });
    };

    checkReminders();
    const interval = window.setInterval(checkReminders, 30000);
    return () => window.clearInterval(interval);
  }, [dashboard.habits, notificationPermission, user?.notificationOptIn]);

  const value = useMemo(() => ({
    notificationPermission,
    async enableNotifications() {
      if (!('Notification' in window) || !Notification.requestPermission) {
        setNotificationPermission('unsupported');
        return;
      }
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        const subscription = await subscribeToPush();
        if (subscription) await api.post('/auth/push-subscription', subscription);
        if (!user?.notificationOptIn) await updatePreferences({ notificationOptIn: true });
      }
    },
    async toggleNotificationPreference() {
      await updatePreferences({ notificationOptIn: !user?.notificationOptIn });
    }
  }), [notificationPermission, user?.notificationOptIn, updatePreferences]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) throw new Error('useDashboardData must be used within DashboardProvider');
  return context;
}

export function useHabitActions() {
  const context = useContext(HabitActionContext);
  if (!context) throw new Error('useHabitActions must be used within DashboardProvider');
  return context;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within DashboardProvider');
  return context;
}

// Facade for backward compatibility
export function useDashboard() {
  const data = useDashboardData();
  const actions = useHabitActions();
  const notifications = useNotifications();
  
  return useMemo(() => ({
    ...data,
    ...actions,
    ...notifications
  }), [data, actions, notifications]);
}
