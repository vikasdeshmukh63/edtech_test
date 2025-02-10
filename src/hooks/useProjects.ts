import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/constants';
import { Project } from '@/types/types';
import { toast } from 'react-toastify';

export const useProjects = () => {
  const queryClient = useQueryClient();

  const getAllProjects = useQuery({
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

  const createProjectMutation = useMutation({
    mutationFn: async (project: { title: string; description: string }) => {
      const response = await fetch(API_ENDPOINTS.CREATE_PROJECT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Project creation failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Project creation failed');
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (project: Project) => {
      const response = await fetch(API_ENDPOINTS.UPDATE_PROJECT(project._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Project update failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Project update failed');
    },
  });

  const deleteManyProjectsMutation = useMutation({
    mutationFn: async (projectIds: string[]) => {
      const response = await fetch(API_ENDPOINTS.DELETE_MANY_PROJECTS, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete projects');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projects deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete projects');
    },
  });

  return {
    getAllProjects,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteManyProjects: deleteManyProjectsMutation.mutateAsync,
    isLoading:
      createProjectMutation.isPending ||
      updateProjectMutation.isPending ||
      deleteManyProjectsMutation.isPending,
  };
};
