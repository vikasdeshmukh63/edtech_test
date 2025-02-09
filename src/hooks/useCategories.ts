import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/constants';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }
      return response.json();
    },
  });
};
