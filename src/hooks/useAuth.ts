'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@/app/api/types/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '@/constants/constants';

// ! auth hook
export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // ! signup mutation
  const signupMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await fetch(API_ENDPOINTS.AUTH_SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      return response.json() as Promise<AuthResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signup failed');
    },
  });

  // ! signin mutation
  const signinMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch(API_ENDPOINTS.AUTH_SIGNIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signin failed');
      }

      return response.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], true);
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signin failed');
    },
  });

  // ! logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(API_ENDPOINTS.AUTH_LOGOUT, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
      // clearing all queries from the cache
      queryClient.clear();
      queryClient.setQueryData(['auth'], false);
      queryClient.setQueryData(['user'], null);
      router.push('/');
      toast.success('Logged out successfully');
    },
  });

  return {
    signup: signupMutation.mutate,
    signin: signinMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading:
      signupMutation.isPending ||
      signinMutation.isPending ||
      logoutMutation.isPending,
    error: signupMutation.error || signinMutation.error || logoutMutation.error,
  };
};
