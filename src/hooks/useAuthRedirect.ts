'use client';

import { useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { useRouter } from 'next/navigation';

// allowed unauthenticated routes
const allowedUnauthenticatedRoutes = ['/auth/signin', '/auth/signup', '/'];

export const useAuthRedirect = (
  authenticatedRedirect: string = '/dashboard',
  unauthenticatedRedirect: string = '/auth/signin'
) => {
  // cheking for authentication
  const { data: isAuthenticated, isLoading, isError } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // if user is authenticated and trying to access auth pages or home page
        if (allowedUnauthenticatedRoutes.includes(window.location.pathname)) {
          router.replace(authenticatedRedirect);
        }
      } else {
        // if user is not authenticated and trying to access restricted pages
        if (!allowedUnauthenticatedRoutes.includes(window.location.pathname)) {
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
