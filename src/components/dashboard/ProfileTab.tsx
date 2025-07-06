'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  propertyCount?: number;
}

export default function ProfileTab() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
  });

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

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchProfile();
    }
  }, [status, session]);

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

  if (loading && !profile) {
    return (
      <div className='p-6'>
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className='p-6'>
        <div className='text-center py-8'>
          <div className='text-red-600 dark:text-red-400 mb-4'>{error}</div>
          <button
            onClick={fetchProfile}
            className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* Profile Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Profile Information
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Manage your account details and preferences
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className='mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg'>
          {error}
        </div>
      )}

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleEditSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
            >
              Full Name
            </label>
            <input
              type='text'
              id='name'
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div className='flex space-x-4 pt-4'>
            <button
              type='submit'
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50'
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type='button'
              onClick={() => {
                setIsEditing(false);
                setError(null);
                if (profile) {
                  setEditForm({
                    name: profile.name || '',
                    email: profile.email || '',
                  });
                }
              }}
              className='bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg transition-colors'
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* Profile Display */
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Full Name
              </label>
              <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>
                <span className='text-gray-900 dark:text-white'>
                  {profile?.name || 'Not provided'}
                </span>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Email Address
              </label>
              <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>
                <span className='text-gray-900 dark:text-white'>
                  {profile?.email || 'Not provided'}
                </span>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Member Since
              </label>
              <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>
                <span className='text-gray-900 dark:text-white'>
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800'>
              <h3 className='text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4'>
                Account Overview
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-blue-700 dark:text-blue-300'>
                    Property Listings:
                  </span>
                  <span className='font-medium text-blue-900 dark:text-blue-100'>
                    {profile?.propertyCount || 0}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-blue-700 dark:text-blue-300'>
                    Account Status:
                  </span>
                  <span className='font-medium text-green-600 dark:text-green-400'>
                    Active
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-blue-700 dark:text-blue-300'>
                    Profile Completion:
                  </span>
                  <span className='font-medium text-blue-900 dark:text-blue-100'>
                    {profile?.name && profile?.email ? '100%' : '75%'}
                  </span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Quick Actions
                </h3>
                <div className='space-y-2'>
                  <Link
                    href='/settings'
                    className='block w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center px-4 py-2 rounded-lg transition-colors'
                  >
                    Account Settings
                  </Link>
                  <Link
                    href='/help'
                    className='block w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center px-4 py-2 rounded-lg transition-colors'
                  >
                    Help & Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
