'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import PropertyCard from '@/components/PropertyCard';
import Skeleton from '@/components/Skeleton';

import { useSavedProperties } from '@/contexts/SavedPropertiesContext';

export default function SavedPropertiesPage() {
  const { data: session, status } = useSession();
  const { savedProperties, loading, error, count } = useSavedProperties();

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className='layout py-8'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4'></div>
            <p className='text-gray-600 dark:text-gray-400'>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className='layout py-8'>
        <div className='text-center py-12'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            Access Denied
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            Please log in to view your saved properties.
          </p>
          <Link
            href='/login'
            className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors'
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='layout py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Saved Properties
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          {count > 0
            ? `You have ${count} saved ${count === 1 ? 'property' : 'properties'}`
            : "You haven't saved any properties yet"}
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className='bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6'>
          <div className='flex'>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800 dark:text-red-300'>
                Error loading saved properties
              </h3>
              <div className='mt-2 text-sm text-red-700 dark:text-red-400'>
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'
            >
              <Skeleton className='h-48 w-full' />
              <div className='p-4'>
                <Skeleton className='h-6 w-3/4 mb-2' />
                <Skeleton className='h-5 w-1/2 mb-2' />
                <Skeleton className='h-4 w-full mb-1' />
                <Skeleton className='h-3 w-1/3' />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && count === 0 && (
        <div className='text-center py-12'>
          <div className='mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4'>
            <svg
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
            No saved properties yet
          </h3>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            Start exploring properties and save your favorites by clicking the
            heart icon.
          </p>
          <Link
            href='/listings'
            className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors'
          >
            Browse Properties
          </Link>
        </div>
      )}

      {/* Properties grid */}
      {!loading && !error && count > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {savedProperties.map((property) => (
            <PropertyCard key={property.property_uid} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
