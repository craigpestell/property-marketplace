import Image from 'next/image';
import Link from 'next/link';

import SavePropertyButton from '@/components/SavePropertyButton';

import { useSavedProperties } from '@/contexts/SavedPropertiesContext';

import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  showSaveCount?: boolean; // New prop to conditionally show save count
}

export default function PropertyCard({
  property,
  showSaveCount = false,
}: PropertyCardProps) {
  const { isPropertySaved } = useSavedProperties();
  const isSaved = isPropertySaved(property.property_uid);

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/20 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/30 transition-shadow duration-300 relative group border border-gray-200 dark:border-gray-700'>
      {/* Save button overlay - show always if saved, or on hover if not saved */}
      <div
        className={`absolute top-3 right-3 z-10 transition-opacity duration-200 ${
          isSaved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <SavePropertyButton
          propertyUid={property.property_uid}
          className='bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 hover:bg-opacity-100 dark:hover:bg-opacity-100 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600'
          size='md'
        />
      </div>

      <Link href={`/property/${property.property_uid}`} className='block'>
        <div className='relative overflow-hidden'>
          <Image
            src={property.image_url || '/placeholder-property.jpg'}
            alt={property.title}
            className='w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110'
            width={600}
            height={192}
            priority={true}
          />
          {/* Save count badge - only show if showSaveCount is true and saves > 0 */}
          {showSaveCount && property.saves && property.saves > 0 && (
            <div className='absolute bottom-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center shadow-lg z-10'>
              <svg
                className='w-3 h-3 mr-1'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                  clipRule='evenodd'
                />
              </svg>
              {property.saves}
            </div>
          )}
        </div>
        <div className='p-4'>
          <div className='mb-2'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              {property.title}
            </h3>
          </div>
          <p className='text-xl font-bold text-primary-600 dark:text-primary-400 mb-2'>
            ${property.price.toLocaleString()}
          </p>
          <p className='text-gray-600 dark:text-gray-300 text-sm mb-2'>
            {property.address}
          </p>
          <p className='text-gray-500 dark:text-gray-400 text-xs'>
            Listed: {new Date(property.created_at).toLocaleDateString()}
          </p>
        </div>
      </Link>
    </div>
  );
}
