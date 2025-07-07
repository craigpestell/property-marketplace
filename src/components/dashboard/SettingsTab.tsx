'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsTab() {
  const { data: _session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });

      if (response.ok) {
        await signOut({ redirect: false });
        window.location.href = '/';
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

  return (
    <div className='p-6'>
      {/* Settings Header */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Account Settings
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Manage your account preferences and security settings
        </p>
      </div>

      <div className='space-y-8'>
        {/* UI Preferences */}
        <div className='border-b border-gray-200 dark:border-gray-700 pb-8'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            UI Preferences
          </h3>
          <div className='space-y-6'>
            <div>
              <div className='font-medium text-gray-900 dark:text-white mb-2'>
                Theme
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                Choose your preferred color theme
              </div>
              <div className='flex flex-wrap gap-3'>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  } hover:border-blue-400 dark:hover:border-blue-500 transition-colors`}
                >
                  <SunIcon className='w-5 h-5 text-yellow-500' />
                  <span>Light</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  } hover:border-blue-400 dark:hover:border-blue-500 transition-colors`}
                >
                  <MoonIcon className='w-5 h-5 text-blue-400' />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className='border-b border-gray-200 dark:border-gray-700 pb-8'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Notification Preferences
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium text-gray-900 dark:text-white'>
                  Email Notifications
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Receive email updates about offers and property activity
                </div>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium text-gray-900 dark:text-white'>
                  Browser Notifications
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Get real-time notifications in your browser
                </div>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium text-gray-900 dark:text-white'>
                  Marketing Emails
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Receive promotional content and market updates
                </div>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input type='checkbox' className='sr-only peer' />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className='border-b border-gray-200 dark:border-gray-700 pb-8'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Privacy Settings
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium text-gray-900 dark:text-white'>
                  Profile Visibility
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Make your profile visible to other users
                </div>
              </div>
              <select className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'>
                <option value='public'>Public</option>
                <option value='contacts'>Contacts Only</option>
                <option value='private'>Private</option>
              </select>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium text-gray-900 dark:text-white'>
                  Contact Information
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Allow others to see your contact details
                </div>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className='border-b border-gray-200 dark:border-gray-700 pb-8'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Account Actions
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium text-gray-900 dark:text-white'>
                  Change Password
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Update your account password
                </div>
              </div>
              <button className='bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors'>
                Change
              </button>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium text-gray-900 dark:text-white'>
                  Download Data
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Download a copy of your account data
                </div>
              </div>
              <button className='bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors'>
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className='text-lg font-semibold text-red-600 dark:text-red-400 mb-4'>
            Danger Zone
          </h3>
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium text-red-900 dark:text-red-100'>
                  Delete Account
                </div>
                <div className='text-sm text-red-700 dark:text-red-300 mt-1'>
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </div>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className='bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors'
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Confirm Account Deletion
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently lost.
            </p>
            <div className='flex space-x-4'>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className='bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50'
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
