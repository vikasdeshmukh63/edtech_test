'use client';

import { Button } from '@/components/Button';
import Loader from '@/components/Loader';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import {
  AlarmClockCheck,
  CalendarCheck,
  CheckCheck,
  ClipboardCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// features data
const features = [
  {
    title: 'Organize Tasks',
    description: 'Keep your tasks organized and prioritized',
    icon: <ClipboardCheck />,
    iconColor: 'text-blue-500',
  },
  {
    title: 'Track Progress',
    description: 'Monitor your progress in real-time',
    icon: <AlarmClockCheck />,
    iconColor: 'text-purple-500',
  },
  {
    title: 'Achieve Goals',
    description: 'Turn your goals into accomplishments',
    icon: <CheckCheck />,
    iconColor: 'text-indigo-500',
  },
];

export default function Home() {
  // check if user is authenticated
  const { isAuthenticated, isLoading } = useAuthRedirect();

  // router
  const router = useRouter();

  // if loading
  if (isLoading) {
    return <Loader className="w-full h-screen" />;
  }

  // if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        {/* icon  */}
        <div className="mb-8 animate-bounce flex justify-center items-center">
          <CalendarCheck className="text-blue-500" size={100} />
        </div>

        {/* heading  */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Welcome to Task Manager
        </h1>

        {/* description  */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
          Organize, track, and accomplish your goals with our intuitive task
          management solution
        </p>

        {/* features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className={`${feature.iconColor} mb-4`}>{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* sign in button  */}
        <div className="mt-12">
          <Button variant="primary" onClick={() => router.push('/auth/signin')}>
            Sign In to Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
