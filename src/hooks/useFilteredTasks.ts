import { useInfiniteQuery } from '@tanstack/react-query';
import { Task } from '@/types/types';

interface FilterParams {
  priority?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: string;
  projectId?: string;
}

export const useFilteredTasks = (filters: FilterParams) => {
  return useInfiniteQuery({
    queryKey: ['filtered-tasks', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams();

      // Add filters to query params
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.assignedTo)
        queryParams.append('assignedTo', filters.assignedTo);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.projectId) queryParams.append('projectId', filters.projectId);

      queryParams.append('page', pageParam.toString());
      queryParams.append('limit', '10'); // Number of items per page

      const response = await fetch(`/api/tasks/filtered?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      return {
        tasks: data.data as Task[],
        nextPage: data.hasMore ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};
