'use client';

import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/about', label: 'About' },
] as const;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
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
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
