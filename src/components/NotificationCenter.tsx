'use client';

import { BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';

import { Notification, useNotifications } from '@/hooks/useNotifications';

import { useToast } from '@/contexts/ToastContext';

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    markAsRead,
    refreshNotifications,
  } = useNotifications();
  const { showInfo } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const prevUnreadCountRef = useRef(unreadCount);

  // Show toast notifications for new notifications
  useEffect(() => {
    if (prevUnreadCountRef.current < unreadCount && unreadCount > 0) {
      const newNotifications = notifications.slice(
        0,
        unreadCount - prevUnreadCountRef.current,
      );
      if (newNotifications.length > 0) {
        const latestNotification = newNotifications[0];
        showInfo('New Notification', latestNotification.title, 4000);
      }
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount, notifications, showInfo]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'offer_received':
        return '💰';
      case 'offer_accepted':
        return '✅';
      case 'offer_rejected':
        return '❌';
      case 'offer_countered':
        return '🔄';
      case 'offer_withdrawn':
        return '↩️';
      case 'offer_expired':
        return '⏰';
      case 'system':
        return '🔔';
      case 'reminder':
        return '📅';
      default:
        return '📄';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'normal':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'low':
        return 'bg-gray-100 border-gray-200 text-gray-800';
      default:
        return 'bg-blue-100 border-blue-200 text-blue-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead([notificationId]);
  };

  const handleMarkAllAsRead = async () => {
    await markAsRead();
  };

  return (
    <div className='relative'>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 text-gray-600 hover:text-gray-800 transition-colors'
        aria-label='Notifications'
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className='h-6 w-6 text-primary-600' />
        ) : (
          <BellIcon className='h-6 w-6' />
        )}

        {/* Connection Status Indicator */}
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-gray-400'
          }`}
        />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
          {/* Header */}
          <div className='px-4 py-3 border-b border-gray-200 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Notifications
            </h3>
            <div className='flex items-center space-x-2'>
              <button
                onClick={refreshNotifications}
                className='text-sm text-gray-500 hover:text-gray-700'
              >
                Refresh
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className='text-sm text-primary-600 hover:text-primary-700'
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <XMarkIcon className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className='max-h-96 overflow-y-auto'>
            {isLoading ? (
              <div className='px-4 py-8 text-center text-gray-500'>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className='px-4 py-8 text-center text-gray-500'>
                No notifications yet
              </div>
            ) : (
              <div className='divide-y divide-gray-200'>
                {notifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      !notification.read_at
                        ? 'bg-blue-50 border-l-4 border-blue-400'
                        : ''
                    }`}
                  >
                    <div className='flex items-start space-x-3'>
                      <div className='text-2xl'>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <p className='text-sm font-medium text-gray-900'>
                              {notification.title}
                            </p>
                            <p className='text-sm text-gray-600 mt-1'>
                              {notification.message}
                            </p>
                            <div className='flex items-center space-x-2 mt-2'>
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                                  notification.priority,
                                )}`}
                              >
                                {notification.priority}
                              </span>
                              <span className='text-xs text-gray-500'>
                                {formatTimeAgo(notification.created_at)}
                              </span>
                            </div>
                          </div>

                          {!notification.read_at && (
                            <button
                              onClick={() =>
                                handleMarkAsRead(notification.notification_id)
                              }
                              className='ml-2 p-1 text-gray-400 hover:text-gray-600'
                              title='Mark as read'
                            >
                              <CheckIcon className='h-4 w-4' />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg'>
            <button className='text-sm text-primary-600 hover:text-primary-700 font-medium'>
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
