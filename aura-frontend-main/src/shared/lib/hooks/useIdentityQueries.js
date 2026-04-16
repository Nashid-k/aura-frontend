import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';

export function useIdentityQueries() {
  const queryClient = useQueryClient();

  const identityQuery = useQuery({
    queryKey: ['identity'],
    queryFn: async () => {
      const { data } = await api.get('/identity');
      return data;
    },
  });

  const forgeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/identity/forge');
      return data;
    },
    onSuccess: (newIdentity) => {
      queryClient.setQueryData(['identity'], newIdentity);
    },
  });

  return {
    identity: identityQuery.data,
    isLoading: identityQuery.isLoading,
    isForging: forgeMutation.isPending,
    forge: forgeMutation.mutateAsync,
  };
}
