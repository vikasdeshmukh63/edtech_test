import { useQuery } from '@tanstack/react-query';

export const useAuthState = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await fetch('/api/auth/check');
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      const data = await response.json();
      return data.success;
    },
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
