'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuthRedirect = (redirectTo: string = '/auth/signin') => {
  const router = useRouter();

  useEffect(() => {
    // Make an API call to check auth status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        if (!data.success) {
          router.replace(redirectTo);
        }
      } catch (error) {
        router.replace(redirectTo);
      }
    };

    checkAuth();
  }, [router, redirectTo]);
};
