import { useMutation } from '@tanstack/react-query';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@/app/api/types/types';

export const useAuth = () => {
  const signupMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await fetch('/api/auth/signup', {
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
  });

  const signinMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch('/api/auth/signin', {
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
  });

  return {
    signup: signupMutation.mutate,
    signin: signinMutation.mutate,
    isLoading: signupMutation.isPending || signinMutation.isPending,
    error: signupMutation.error || signinMutation.error,
  };
};
