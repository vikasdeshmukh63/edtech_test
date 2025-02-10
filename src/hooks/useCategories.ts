import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/constants';
import { toast } from 'react-toastify';
import { Category } from '@/types/types';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const getAllCategories = useQuery({
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

  const createCategoryMutation = useMutation({
    mutationFn: async (category: { name: string }) => {
      const response = await fetch(API_ENDPOINTS.CREATE_CATEGORY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Category creation failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Category creation failed');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (category: Category) => {
      const response = await fetch(
        API_ENDPOINTS.UPDATE_CATEGORY(category._id),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(category),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Category update failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Category update failed');
    },
  });

  const deleteManyCategoriesMutation = useMutation({
    mutationFn: async (categoryIds: string[]) => {
      const response = await fetch(API_ENDPOINTS.DELETE_MANY_CATEGORIES, {
        method: 'DELETE',
        body: JSON.stringify({ categoryIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Category deletion failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categories deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Categories deletion failed');
    },
  });

  return {
    getAllCategories,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteManyCategories: deleteManyCategoriesMutation.mutate,
    isLoading:
      getAllCategories.isLoading ||
      createCategoryMutation.isPending ||
      updateCategoryMutation.isPending ||
      deleteManyCategoriesMutation.isPending,
  };
};
