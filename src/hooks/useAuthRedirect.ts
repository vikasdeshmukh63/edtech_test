'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from './useAuthState';

export const useAuthRedirect = (
  authenticatedRedirect: string = '/dashboard',
  unauthenticatedRedirect: string = '/auth/signin'
) => {
  const router = useRouter();
  const { data: isAuthenticated, isLoading, isError } = useAuthState();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // If user is authenticated and trying to access auth pages or home page
        if (
          window.location.pathname.startsWith('/auth/') ||
          window.location.pathname === '/'
        ) {
          router.replace(authenticatedRedirect);
        }
      } else {
        // If user is not authenticated or there's an auth error
        if (
          !window.location.pathname.startsWith('/auth/') &&
          window.location.pathname !== '/'
        ) {
          router.replace(unauthenticatedRedirect);
        }
      }
    }
  }, [
    router,
    isAuthenticated,
    isLoading,
    isError,
    authenticatedRedirect,
    unauthenticatedRedirect,
  ]);

  return { isAuthenticated, isLoading, isError };
};
