import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/constants';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.GET_ALL_USERS);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }
      return response.json();
    },
  });
};
