import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/constants';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.GET_ALL_PROJECTS);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch projects');
      }
      return response.json();
    },
  });
};
