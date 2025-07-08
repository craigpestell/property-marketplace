'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

import { useClientUid } from '@/hooks/useClientUid';

import UserPropertyCard from '@/components/UserPropertyCard';

import { Property } from '@/types';

export default function MyListingsTab() {
  const { data: session } = useSession();
  const { clientUid, loading: clientUidLoading } = useClientUid();
  const [userListings, setUserListings] = useState<Property[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchUserListings = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      setListingsLoading(true);

      // Wait for clientUid to be loaded before fetching
      if (clientUidLoading) {
        // Skip fetching while client_uid is still loading
        return;
      }

      // Always use clientUid if available
      if (clientUid) {
        const response = await fetch(`/api/listings?clientUid=${clientUid}`);
        if (response.ok) {
          const data = await response.json();
          setUserListings(data.properties || []);
          return;
        }
      }

      // Fallback to email only if clientUid is not available
      const response = await fetch(
        `/api/listings?userEmail=${session.user.email}`,
      );
      if (response.ok) {
        const data = await response.json();
        setUserListings(data.properties || []);
      }
    } catch (err) {
      setUserListings([]);
    } finally {
      setListingsLoading(false);
    }
  }, [session?.user?.email, clientUid, clientUidLoading]);

  const handleDeleteProperty = async (propertyUid: string) => {
    if (!session?.user?.email) return;

    // Wait for clientUid to finish loading before proceeding
    if (clientUidLoading) {
      setDeleteError('Please wait, still loading user data...');
      return;
    }

    try {
      setDeletingPropertyId(propertyUid);
      setDeleteError(null);

      let url = `/api/listings?uid=${propertyUid}`;

      // Always use clientUid when available for better security
      if (clientUid) {
        url += `&clientUid=${clientUid}`;
      } else {
        url += `&userEmail=${session.user.email}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUserListings((prev) =>
          prev.filter((property) => property.property_uid !== propertyUid),
        );
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.error || 'Failed to delete property');
      }
    } catch (err) {
      setDeleteError('Failed to delete property');
    } finally {
      setDeletingPropertyId(null);
    }
  };

  // Fetch when session is available and when clientUid loading state changes
  useEffect(() => {
    if (session?.user) {
      // Only attempt to fetch when we know if clientUid is available or not
      if (!clientUidLoading) {
        fetchUserListings();
      }
    }
  }, [session, clientUidLoading, fetchUserListings]);

  return (
    <div className='p-6'>
      {/* Listings Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              My Listings
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Manage your property listings
            </p>
          </div>
          <div className='flex items-center space-x-4'>
            <Link
              href='/listings/create'
              className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              + Create New Listing
            </Link>
            <Link
              href='/listings'
              className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium'
            >
              Browse All Properties →
            </Link>
          </div>
        </div>
      </div>

      {deleteError && (
        <div className='mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg'>
          {deleteError}
          <button
            onClick={() => setDeleteError(null)}
            className='ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200'
          >
            ×
          </button>
        </div>
      )}

      {/* Listings Content */}
      {listingsLoading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3'></div>
          <span className='text-gray-600 dark:text-gray-400'>
            Loading your listings...
          </span>
        </div>
      ) : userListings.length > 0 ? (
        <>
          {/* Statistics */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800'>
              <div className='flex items-center'>
                <div className='p-2 bg-blue-100 dark:bg-blue-800 rounded-lg'>
                  <svg
                    className='w-6 h-6 text-blue-600 dark:text-blue-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <div className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                    {userListings.length}
                  </div>
                  <div className='text-blue-700 dark:text-blue-300'>
                    Total Listings
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800'>
              <div className='flex items-center'>
                <div className='p-2 bg-green-100 dark:bg-green-800 rounded-lg'>
                  <svg
                    className='w-6 h-6 text-green-600 dark:text-green-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <div className='text-2xl font-bold text-green-900 dark:text-green-100'>
                    {userListings.length}
                  </div>
                  <div className='text-green-700 dark:text-green-300'>
                    Active
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800'>
              <div className='flex items-center'>
                <div className='p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg'>
                  <svg
                    className='w-6 h-6 text-yellow-600 dark:text-yellow-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <div className='text-2xl font-bold text-yellow-900 dark:text-yellow-100'>
                    $
                    {userListings
                      .reduce((sum, p) => sum + (p.price || 0), 0)
                      .toLocaleString()}
                  </div>
                  <div className='text-yellow-700 dark:text-yellow-300'>
                    Total Value
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {userListings.map((property) => (
              <UserPropertyCard
                key={property.id}
                property={property}
                onDelete={handleDeleteProperty}
                isDeleting={deletingPropertyId === property.property_uid}
              />
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className='text-center py-12'>
          <div className='h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg
              className='h-12 w-12 text-gray-400 dark:text-gray-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 21l4-4 4 4M3 7l9-4 9 4'
              />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
            No listings yet
          </h3>
          <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
            You haven't created any property listings yet. Get started by
            listing your first property.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/listings/create'
              className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors'
            >
              Create Your First Listing
            </Link>
            <Link
              href='/listings'
              className='bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg transition-colors'
            >
              Browse Properties for Ideas
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
