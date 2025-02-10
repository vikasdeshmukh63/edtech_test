'use client';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  return (
    <Container className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
          Oops!
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
          Something went wrong
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <Button variant="primary" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    </Container>
  );
}
