import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/constants';

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.GET_USER(userId)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return response.json();
    },
  });
};
