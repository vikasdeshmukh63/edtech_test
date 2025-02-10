import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container className="flex items-center justify-center h-screen">
      <div className="text-center">
        {/* heading  */}
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
          404
        </h1>
        {/* sub heading  */}
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
          Page Not Found
        </h2>
        {/* message  */}
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The page you are looking for does not exist.
        </p>
        {/* button  */}
        <Link href="/dashboard">
          <Button variant="primary" className="mt-6">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </Container>
  );
}
