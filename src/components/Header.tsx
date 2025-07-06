'use client';

import {
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import { showDebugFeatures } from '@/lib/debug';

import NotificationCenter from '@/components/NotificationCenter';

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
    <header className='bg-primary-900 text-white shadow-lg'>
      <div className='layout'>
        <div className='flex items-center justify-between py-4'>
          {/* Logo */}
          <Link
            href='/'
            className='text-xl font-bold hover:text-primary-200 transition-colors'
          >
            Real Estate Marketplace
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            <Link href='/' className='hover:text-primary-200 transition-colors'>
              Home
            </Link>
            <Link
              href='/listings'
              className='hover:text-primary-200 transition-colors'
            >
              Listings
            </Link>
            <Link
              href='/about'
              className='hover:text-primary-200 transition-colors'
            >
              About
            </Link>
            <Link
              href='/notifications'
              className='hover:text-primary-200 transition-colors'
            >
              Notifications
            </Link>

            {/* Debug Links - Only visible to test users */}
            {showDebugFeatures(session?.user?.email) && (
              <>
                <span className='text-primary-400'>|</span>
                <div className='flex items-center space-x-3 text-xs bg-primary-800 px-3 py-1 rounded'>
                  <span className='text-primary-300 uppercase tracking-wide'>
                    Debug
                  </span>
                  <Link
                    href='/demo'
                    className='hover:text-primary-200 transition-colors text-primary-300'
                  >
                    Demo
                  </Link>
                  <Link
                    href='/test'
                    className='hover:text-primary-200 transition-colors text-primary-300'
                  >
                    Test
                  </Link>
                  <Link
                    href='/notifications'
                    className='hover:text-primary-200 transition-colors text-primary-300'
                  >
                    Notifications
                  </Link>
                </div>
              </>
            )}

            {/* Auth Links */}
            {status === 'loading' ? (
              <div className='w-16 h-4 bg-primary-800 animate-pulse rounded'></div>
            ) : status === 'authenticated' ? (
              <div className='flex items-center space-x-4'>
                {/* Notification Center */}
                <NotificationCenter />

                {/* User Dropdown */}
                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='flex items-center space-x-2 hover:text-primary-200 transition-colors focus:outline-none'
                  >
                    <UserCircleIcon className='h-5 w-5' />
                    <span className='text-sm'>
                      {session.user?.name || session.user?.email}
                    </span>
                    <ChevronDownIcon className='h-4 w-4' />
                  </button>

                  {isDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border'>
                      <div className='px-4 py-2 text-sm text-gray-700 border-b'>
                        Welcome, {session.user?.name || session.user?.email}
                      </div>
                      <Link
                        href='/profile'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href='/offers'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Offers
                      </Link>
                      <Link
                        href='/settings'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsDropdownOpen(false);
                        }}
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link
                  href='/login'
                  className='hover:text-primary-200 transition-colors'
                >
                  Login
                </Link>
                <Link
                  href='/signup'
                  className='bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded transition-colors text-sm font-medium'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden p-2 hover:bg-primary-800 rounded transition-colors'
          >
            {isMenuOpen ? (
              <XMarkIcon className='h-6 w-6' />
            ) : (
              <Bars3Icon className='h-6 w-6' />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden border-t border-primary-800 py-4'>
            <nav className='flex flex-col space-y-4'>
              <Link
                href='/'
                className='hover:text-primary-200 transition-colors'
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href='/listings'
                className='hover:text-primary-200 transition-colors'
                onClick={() => setIsMenuOpen(false)}
              >
                Listings
              </Link>
              <Link
                href='/about'
                className='hover:text-primary-200 transition-colors'
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href='/notifications'
                className='hover:text-primary-200 transition-colors'
                onClick={() => setIsMenuOpen(false)}
              >
                Notifications
              </Link>

              {/* Debug Links - Only visible to test users (Mobile) */}
              {showDebugFeatures(session?.user?.email) && (
                <>
                  <div className='border-t border-primary-700 pt-3 mt-3'>
                    <div className='text-xs text-primary-300 mb-2 uppercase tracking-wide'>
                      Debug
                    </div>
                    <Link
                      href='/demo'
                      className='hover:text-primary-200 transition-colors text-sm text-primary-300 block'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Demo
                    </Link>
                    <Link
                      href='/test'
                      className='hover:text-primary-200 transition-colors text-sm text-primary-300 block mt-2'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Test
                    </Link>
                    <Link
                      href='/notifications'
                      className='hover:text-primary-200 transition-colors text-sm text-primary-300 block mt-2'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Debug Notifications
                    </Link>
                  </div>
                </>
              )}

              {/* Mobile Auth Links */}
              {status === 'authenticated' ? (
                <div className='flex flex-col space-y-3 pt-3 border-t border-primary-800'>
                  <span className='text-sm text-primary-200'>
                    Welcome, {session.user?.name || session.user?.email}
                  </span>
                  <Link
                    href='/profile'
                    className='hover:text-primary-200 transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href='/settings'
                    className='hover:text-primary-200 transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className='bg-primary-800 hover:bg-primary-700 px-3 py-2 rounded transition-colors text-sm text-left'
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className='flex flex-col space-y-3 pt-3 border-t border-primary-800'>
                  <Link
                    href='/login'
                    className='hover:text-primary-200 transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href='/signup'
                    className='bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded transition-colors text-sm font-medium inline-block text-center'
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
