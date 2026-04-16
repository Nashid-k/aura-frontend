import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { api } from '../../api/client';

export const useDashboardQuery = (userId) => {
  return useQuery({
    queryKey: ['dashboard', userId, dayjs().format('YYYY-MM-DD')],
    queryFn: async () => {
      const { data } = await api.get(`/dashboard?date=${dayjs().format('YYYY-MM-DD')}`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useAiNudgeQuery = (userId) => {
  return useQuery({
    queryKey: ['ai-nudge', userId],
    queryFn: async () => {
      const { data } = await api.get('/ai/nudge');
      return data?.nudge || '';
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useStreakAlertsQuery = (userId) => {
  return useQuery({
    queryKey: ['streak-alerts', userId],
    queryFn: async () => {
      const { data } = await api.get('/ai/streak-alerts');
      return data?.alerts || [];
    },
    enabled: !!userId,
  });
};

export const useLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, completed, skipped, progress, note }) => {
      const { data } = await api.post('/logs', {
        habitId,
        date: dayjs().format('YYYY-MM-DD'),
        completed,
        skipped,
        progress,
        note,
      });
      return data;
    },
    onMutate: async (newLog) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['dashboard'] });

      // Snapshot the previous value
      const previousDashboard = queryClient.getQueryData(['dashboard']);

      // Optimistically update to the new value
      queryClient.setQueriesData({ queryKey: ['dashboard'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          habits: old.habits.map((h) =>
            h._id === newLog.habitId
              ? {
                  ...h,
                  completedToday: newLog.completed,
                  skippedToday: newLog.skipped,
                  progressToday: newLog.progress ?? h.progressToday,
                }
              : h
          ),
        };
      });

      return { previousDashboard };
    },
    onError: (err, newLog, context) => {
      queryClient.setQueriesData({ queryKey: ['dashboard'] }, context.previousDashboard);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useHabitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ form, habitId }) => {
      if (habitId) {
        return api.patch(`/habits/${habitId}`, form);
      }
      return api.post('/habits', form);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useMutationsQuery = (userId) => {
  return useQuery({
    queryKey: ['mutations', userId],
    queryFn: async () => {
      const { data } = await api.get('/ai/mutations');
      return data?.suggestions || [];
    },
    enabled: !!userId,
  });
};

export const useFuseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitAId, habitBId }) => {
      const { data } = await api.post('/ai/fuse', { habitAId, habitBId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['mutations'] });
    },
  });
};

export const useEvolutionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, status }) => {
      const { data } = await api.post(`/ai/evolution/${habitId}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['mutations'] });
    },
  });
};
