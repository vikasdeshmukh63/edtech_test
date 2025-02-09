import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/constants';
export const useAuthState = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.AUTH_CHECK);
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
