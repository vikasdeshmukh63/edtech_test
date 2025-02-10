import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/constants';
import { toast } from 'react-toastify';

// ! profile hook
export const useProfile = () => {
  const queryClient = useQueryClient();

  // ! get profile
  const getProfile = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.GET_USER);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
  });

  // ! update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (profile: { name: string; email: string }) => {
      const response = await fetch(API_ENDPOINTS.UPDATE_USER, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Profile update failed');
    },
  });

  return {
    getProfile,
    updateProfile: updateProfileMutation.mutate,
  };
};
