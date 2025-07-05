'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import UserPropertyCard from '@/components/UserPropertyCard';

import { Property } from '@/types';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  propertyCount?: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
  });
  const [userListings, setUserListings] = useState<Property[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data.profile);
      setEditForm({
        name: data.profile.name || '',
        email: data.profile.email || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserListings = async () => {
    if (!session?.user?.email) return;

    try {
      setListingsLoading(true);
      const response = await fetch(
        `/api/listings?userEmail=${session.user.email}`,
      );
      if (response.ok) {
        const data = await response.json();
        setUserListings(data.properties || []);
      }
    } catch (err) {
      // Handle error silently for now
      setUserListings([]);
    } finally {
      setListingsLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyUid: string) => {
    if (!session?.user?.email) return;

    try {
      setDeletingPropertyId(propertyUid);
      setDeleteError(null);

      const response = await fetch(
        `/api/listings?uid=${propertyUid}&userEmail=${session.user.email}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        // Remove the deleted property from the list
        setUserListings((prev) =>
          prev.filter((property) => property.property_uid !== propertyUid),
        );

        // Update the profile property count
        if (profile) {
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  propertyCount: (prev.propertyCount || 0) - 1,
                }
              : null,
          );
        }
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      fetchProfile();
      fetchUserListings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-600 mb-4'>
            <svg
              className='h-12 w-12 mx-auto mb-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.94-.833-2.712 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <p className='text-lg font-semibold'>Error loading profile</p>
            <p className='text-sm'>{error}</p>
          </div>
          <button
            onClick={fetchProfile}
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center text-gray-600'>
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='layout'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='bg-white rounded-lg shadow-sm mb-8'>
            <div className='px-6 py-8 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center'>
                    <span className='text-xl font-bold text-white'>
                      {profile.name?.charAt(0).toUpperCase() ||
                        profile.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                      {profile.name || 'User'}
                    </h1>
                    <p className='text-gray-600'>{profile.email}</p>
                    <p className='text-sm text-gray-500'>
                      Member since{' '}
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <div className='px-6 py-6'>
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className='space-y-6'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Full Name
                    </label>
                    <input
                      id='name'
                      name='name'
                      type='text'
                      value={editForm.name}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                      placeholder='Enter your full name'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Email Address
                    </label>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      value={editForm.email}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                      placeholder='Enter your email address'
                    />
                  </div>

                  <div className='flex space-x-4'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type='button'
                      onClick={() => setIsEditing(false)}
                      className='bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                      Name
                    </h3>
                    <p className='mt-1 text-lg text-gray-900'>
                      {profile.name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                      Email
                    </h3>
                    <p className='mt-1 text-lg text-gray-900'>
                      {profile.email}
                    </p>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                      Member Since
                    </h3>
                    <p className='mt-1 text-lg text-gray-900'>
                      {new Date(profile.created_at).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                      Properties Listed
                    </h3>
                    <p className='mt-1 text-lg text-gray-900'>
                      {profile.propertyCount || 0}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* My Listings Section */}
          <div className='bg-white rounded-lg shadow-sm mb-8'>
            <div className='px-6 py-6 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-bold text-gray-900'>
                    My Listings
                  </h2>
                  <p className='text-gray-600'>
                    Properties you have listed for sale
                  </p>
                </div>
                <Link
                  href='/listings'
                  className='text-blue-600 hover:text-blue-700 text-sm font-medium'
                >
                  View All Properties →
                </Link>
              </div>
            </div>

            <div className='px-6 py-6'>
              {deleteError && (
                <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
                  {deleteError}
                </div>
              )}

              {listingsLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                  <span className='ml-2 text-gray-600'>
                    Loading your listings...
                  </span>
                </div>
              ) : userListings.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {userListings.slice(0, 6).map((property) => (
                    <UserPropertyCard
                      key={property.id}
                      property={property}
                      onDelete={handleDeleteProperty}
                      isDeleting={deletingPropertyId === property.property_uid}
                    />
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <div className='h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <svg
                      className='h-8 w-8 text-gray-400'
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
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    No listings yet
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    You haven't listed any properties for sale.
                  </p>
                  <Link
                    href='/listings'
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
                  >
                    Browse Properties
                  </Link>
                </div>
              )}

              {userListings.length > 6 && (
                <div className='mt-6 text-center'>
                  <Link
                    href='/listings'
                    className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                  >
                    View All {userListings.length} Listings
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Link
              href='/listings'
              className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200'
            >
              <div className='flex items-center space-x-3'>
                <div className='h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='h-6 w-6 text-blue-600'
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
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    Browse Properties
                  </h3>
                  <p className='text-sm text-gray-600'>Find your next home</p>
                </div>
              </div>
            </Link>

            <Link
              href='/settings'
              className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200'
            >
              <div className='flex items-center space-x-3'>
                <div className='h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='h-6 w-6 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    Account Settings
                  </h3>
                  <p className='text-sm text-gray-600'>Manage your account</p>
                </div>
              </div>
            </Link>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 opacity-75'>
              <div className='flex items-center space-x-3'>
                <div className='h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='h-6 w-6 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    Saved Properties
                  </h3>
                  <p className='text-sm text-gray-600'>Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
