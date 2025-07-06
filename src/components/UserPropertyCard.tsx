import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Property } from '@/types';

interface UserPropertyCardProps {
  property: Property;
  onDelete: (propertyId: string) => void;
  isDeleting?: boolean;
}

export default function UserPropertyCard({
  property,
  onDelete,
  isDeleting = false,
}: UserPropertyCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(property.property_uid);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/20 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/30 transition-shadow duration-300 relative border border-gray-200 dark:border-gray-700'>
      {/* Action Buttons */}
      <div className='absolute top-2 right-2 z-10 flex space-x-2'>
        {/* Edit Button */}
        <Link
          href={`/listings/edit/${property.property_uid}`}
          className='bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors'
          title='Edit listing'
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            className='h-4 w-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
            />
          </svg>
        </Link>

        {/* Delete Button */}
        {!showDeleteConfirm ? (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className='bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50'
            title='Delete listing'
          >
            {isDeleting ? (
              <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
            ) : (
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                />
              </svg>
            )}
          </button>
        ) : (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-gray-700 dark:text-gray-300 mb-3'>
              Delete this listing?
            </p>
            <div className='flex space-x-2'>
              <button
                onClick={handleConfirmDelete}
                className='bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded text-xs'
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className='bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs'
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <Link href={`/property/${property.property_uid}`}>
        <Image
          src={property.image_url || '/placeholder-property.jpg'}
          alt={property.title}
          width={400}
          height={192}
          className='w-full h-48 object-cover'
        />
        <div className='p-4'>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              {property.title}
            </h3>
            <span className='text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono'>
              {property.property_uid}
            </span>
          </div>
          <p className='text-xl font-bold text-primary-600 dark:text-primary-400 mb-2'>
            ${property.price.toLocaleString()}
          </p>
          <p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
            {property.address}
          </p>
          <p className='text-gray-500 dark:text-gray-500 text-xs'>
            Listed: {new Date(property.created_at).toLocaleDateString()}
          </p>
        </div>
      </Link>
    </div>
  );
}
