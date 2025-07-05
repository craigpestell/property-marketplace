import Link from 'next/link';

import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.property_uid}`}>
      <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
        <img
          src={property.image_url || '/placeholder-property.jpg'}
          alt={property.title}
          className='w-full h-48 object-cover'
        />
        <div className='p-4'>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {property.title}
            </h3>
            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono'>
              {property.property_uid}
            </span>
          </div>
          <p className='text-xl font-bold text-primary-600 mb-2'>
            ${property.price.toLocaleString()}
          </p>
          <p className='text-gray-600 text-sm mb-2'>{property.address}</p>
          <p className='text-gray-500 text-xs'>
            Listed: {new Date(property.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
