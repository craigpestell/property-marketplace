'use client';

import {
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import { showDebugFeatures } from '@/lib/debug';

import NotificationCenter from '@/components/NotificationCenter';
import SimpleThemeSwitch from '@/components/SimpleThemeSwitch';

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => {
      window.location.href = '/';
    });
  };

  return (
    <header className='bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg transition-colors duration-200 border-b border-gray-200 dark:border-gray-700'>
      <div className='layout'>
        <div className='flex items-center justify-between py-4'>
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center space-x-2 text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors'
          >
            <Image
              src='/svg/RealEstateLogo.svg'
              alt='Real Estate Marketplace'
              width={32}
              height={32}
              className='h-8 w-8'
            />
            <span className='font-heading hidden sm:inline'>
              Real Estate Marketplace
            </span>
            <span className='font-heading sm:hidden'>RE Marketplace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            <Link
              href='/'
              className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium'
            >
              Home
            </Link>
            <Link
              href='/listings'
              className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium'
            >
              Listings
            </Link>
            <Link
              href='/about'
              className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium'
            >
              About
            </Link>

            {/* Debug Links - Only visible to test users */}
            {showDebugFeatures(session?.user?.email) && (
              <>
                <span className='text-gray-300 dark:text-gray-500'>|</span>
                <div className='flex items-center space-x-3 text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded border border-gray-200 dark:border-gray-600'>
                  <span className='text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold'>
                    Debug
                  </span>
                  <Link
                    href='/demo'
                    className='text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors'
                  >
                    Demo
                  </Link>
                  <Link
                    href='/test'
                    className='text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors'
                  >
                    Test
                  </Link>
                </div>
              </>
            )}

            {/* Auth Links */}
            {status === 'loading' ? (
              <div className='w-16 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded'></div>
            ) : status === 'authenticated' ? (
              <div className='flex items-center space-x-4'>
                {/* Notification Center */}
                <NotificationCenter />

                {/* User Dropdown */}
                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none'
                  >
                    <UserCircleIcon className='h-5 w-5' />
                    <span className='text-sm font-medium'>
                      {session.user?.name || session.user?.email}
                    </span>
                    <ChevronDownIcon className='h-4 w-4' />
                  </button>

                  {isDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700'>
                      {/* Account Management */}
                      <Link
                        href='/dashboard'
                        className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium'
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        📊 Dashboard
                      </Link>

                      {/* Divider */}
                      <div className='border-t dark:border-gray-700 my-1'></div>

                      {/* Quick Actions */}
                      <div className='px-4 py-1 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                        Quick Actions
                      </div>
                      <Link
                        href='/listings/create'
                        className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        ➕ Create Listing
                      </Link>

                      {/* Divider */}
                      <div className='border-t dark:border-gray-700 my-1'></div>

                      {/* System Actions */}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsDropdownOpen(false);
                        }}
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link
                  href='/login'
                  className='hover:text-primary-200 dark:hover:text-primary-300 transition-colors'
                >
                  Login
                </Link>
                <Link
                  href='/signup'
                  className='bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 px-4 py-2 rounded transition-colors text-sm font-medium'
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Theme Switch */}
            <SimpleThemeSwitch />
          </nav>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center space-x-3'>
            {/* Theme Switch for Mobile */}
            <SimpleThemeSwitch />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors border border-gray-200 dark:border-gray-700'
            >
              {isMenuOpen ? (
                <XMarkIcon className='h-6 w-6' />
              ) : (
                <Bars3Icon className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden border-t border-gray-200 dark:border-gray-700 py-4'>
            <nav className='flex flex-col space-y-4'>
              <Link
                href='/'
                className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href='/listings'
                className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                Listings
              </Link>
              <Link
                href='/about'
                className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Debug Links - Only visible to test users (Mobile) */}
              {showDebugFeatures(session?.user?.email) && (
                <>
                  <div className='border-t border-gray-200 dark:border-gray-700 pt-3 mt-3'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-semibold'>
                      Debug
                    </div>
                    <Link
                      href='/demo'
                      className='text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors text-sm block'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Demo
                    </Link>
                    <Link
                      href='/test'
                      className='text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors text-sm block mt-2'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Test
                    </Link>
                  </div>
                </>
              )}

              {/* Mobile Auth Links */}
              {status === 'authenticated' ? (
                <div className='flex flex-col space-y-3 pt-3 border-t border-primary-800 dark:border-gray-700'>
                  {/* Account Management */}
                  <Link
                    href='/dashboard'
                    className='hover:text-primary-200 dark:hover:text-primary-300 transition-colors font-medium'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📊 Dashboard
                  </Link>

                  {/* Quick Actions */}
                  <div className='pt-2 border-t border-primary-700 dark:border-gray-600'>
                    <div className='text-xs text-primary-300 dark:text-gray-400 mb-2 uppercase tracking-wide'>
                      Quick Actions
                    </div>
                    <Link
                      href='/listings/create'
                      className='hover:text-primary-200 dark:hover:text-primary-300 transition-colors text-sm'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ➕ Create Listing
                    </Link>
                  </div>

                  {/* System Actions */}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className='bg-primary-800 dark:bg-gray-700 hover:bg-primary-700 dark:hover:bg-gray-600 px-3 py-2 rounded transition-colors text-sm text-left mt-3'
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <div className='flex flex-col space-y-3 pt-3 border-t border-primary-800 dark:border-gray-700'>
                  <Link
                    href='/login'
                    className='hover:text-primary-200 dark:hover:text-primary-300 transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href='/signup'
                    className='bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 px-4 py-2 rounded transition-colors text-sm font-medium inline-block text-center'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
