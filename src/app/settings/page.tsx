'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { data: _session, status } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });

      if (response.ok) {
        await signOut({ redirect: false });
        router.push('/');
      } else {
        alert('Failed to delete account. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
      <div className='layout'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='px-6 py-8 border-b border-gray-200 dark:border-gray-700'>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                Account Settings
              </h1>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>
                Manage your account preferences and security
              </p>
            </div>

            <div className='px-6 py-6 space-y-8'>
              {/* Security Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                  Security
                </h2>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700'>
                    <div>
                      <h3 className='font-medium text-gray-900 dark:text-gray-100'>
                        Sign out of all devices
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        This will sign you out of all your active sessions
                      </p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className='bg-gray-600 dark:bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors'
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                  Notifications
                </h2>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg opacity-75 bg-white dark:bg-gray-700'>
                    <div>
                      <h3 className='font-medium text-gray-900 dark:text-gray-100'>
                        Email notifications
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Receive updates about new properties and account
                        activity
                      </p>
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Coming soon
                    </div>
                  </div>

                  <div className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg opacity-75 bg-white dark:bg-gray-700'>
                    <div>
                      <h3 className='font-medium text-gray-900 dark:text-gray-100'>
                        Push notifications
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Get notified about saved property updates
                      </p>
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Coming soon
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                  Privacy
                </h2>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg opacity-75 bg-white dark:bg-gray-700'>
                    <div>
                      <h3 className='font-medium text-gray-900 dark:text-gray-100'>
                        Profile visibility
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Control who can see your profile information
                      </p>
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Coming soon
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className='border-t border-gray-200 dark:border-gray-700 pt-8'>
                <h2 className='text-lg font-semibold text-red-600 dark:text-red-400 mb-4'>
                  Danger Zone
                </h2>
                <div className='border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-medium text-red-900 dark:text-red-400'>
                        Delete Account
                      </h3>
                      <p className='text-sm text-red-700 dark:text-red-300'>
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors'
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                  Confirm Account Deletion
                </h3>
                <p className='text-gray-600 dark:text-gray-400 mb-6'>
                  Are you sure you want to delete your account? This action will
                  permanently remove all your data and cannot be undone.
                </p>
                <div className='flex space-x-4'>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50'
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className='bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
