'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAuthState } from '@/hooks/useAuthState';
import { CircleUserRound, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

const getNavigationItems = (isAuthenticated: boolean) => {
  const commonItems = [{ href: '/about', label: 'About' }];

  const authItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/categories', label: 'Categories' },
    { href: '/projects', label: 'Projects' },
  ];

  return isAuthenticated ? [...authItems, ...commonItems] : commonItems;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: isAuthenticated, isLoading } = useAuthState();
  const { logout } = useAuth();
  const router = useRouter();

  const navigationItems = getNavigationItems(isAuthenticated || false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="relative dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-900">
      <div className="flex justify-between items-center py-4 px-6">
        <div className="text-lg font-bold">Task Manager</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            {navigationItems.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="font-semibold hover:text-blue-600">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/profile')}
                  >
                    <CircleUserRound />
                  </Button>
                </>
              ) : (
                <div className="hidden md:flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/auth/signin')}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/auth/signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700">
          <ul className="flex flex-col py-2">
            {navigationItems.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block px-6 py-2 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-6 py-2 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/signin"
                    className="block px-6 py-2 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="block px-6 py-2 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
