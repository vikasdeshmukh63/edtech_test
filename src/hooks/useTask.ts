import { CreateTask, UpdateTask } from '@/app/api/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
export const useTask = (queryType?: 'all' | 'user') => {
  const queryClient = useQueryClient();

  // Add getAllTasks query
  const getAllTasks = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks/get-all-tasks');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
      return await response.json();
    },
    enabled: queryType === 'all',
  });

  // Add getTask query
  const getAllUserTasks = useQuery({
    queryKey: ['user-tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks/get-all-user-tasks');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
      return await response.json();
    },
    enabled: queryType === 'user',
  });

  const createTaskMutation = useMutation({
    mutationFn: async (task: CreateTask) => {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Task creation failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
      toast.success('Task created successfully');
    },
    onError: () => {
      toast.error('Task creation failed');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (task: UpdateTask) => {
      const response = await fetch(`/api/tasks/update/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Task update failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filtered-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Task update failed');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(`/api/tasks/delete/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Task deletion failed');
      }

      return await response.json();
    },
  });

  const deleteManyTasksMutation = useMutation({
    mutationFn: async (taskIds: string[]) => {
      const response = await fetch('/api/tasks/delete-many', {
        method: 'DELETE',
        body: JSON.stringify({ taskIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Task deletion failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filtered-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
      toast.success('Tasks deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Tasks deletion failed');
    },
  });

  return {
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    deleteManyTasks: deleteManyTasksMutation.mutate,
    getAllTasks,
    getAllUserTasks,
  };
};
