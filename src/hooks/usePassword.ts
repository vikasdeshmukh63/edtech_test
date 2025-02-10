import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/constants';
import { toast } from 'react-toastify';

export const usePassword = () => {
  const resetPasswordMutation = useMutation({
    mutationFn: async (passwords: {
      oldPassword: string;
      newPassword: string;
    }) => {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwords),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Password reset failed');
    },
  });

  return {
    resetPassword: resetPasswordMutation.mutate,
  };
};
