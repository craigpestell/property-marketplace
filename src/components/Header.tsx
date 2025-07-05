'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

            {/* Auth Links */}
            {status === 'loading' ? (
              <div className='w-16 h-4 bg-primary-800 animate-pulse rounded'></div>
            ) : status === 'authenticated' ? (
              <div className='flex items-center space-x-4'>
                <span className='text-sm text-primary-200'>
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <Link
                  href='/profile'
                  className='hover:text-primary-200 transition-colors'
                >
                  Profile
                </Link>
                <Link
                  href='/settings'
                  className='hover:text-primary-200 transition-colors'
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className='bg-primary-800 hover:bg-primary-700 px-3 py-1 rounded transition-colors text-sm'
                >
                  Logout
                </button>
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
