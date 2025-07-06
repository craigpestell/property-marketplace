'use client';

import Link from 'next/link';
import * as React from 'react';

import PropertyCard from '@/components/PropertyCard';

import { Property } from '@/types';

interface FeaturedPropertiesProps {
  limit?: number;
}

export default function FeaturedProperties({
  limit = 6,
}: FeaturedPropertiesProps) {
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`/api/listings?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data.properties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [limit]);

  if (loading) {
    return (
      <section className='bg-gray-50 dark:bg-gray-800 py-16'>
        <div className='layout'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
              Featured Properties
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {Array.from({ length: limit }).map((_, index) => (
                <div
                  key={index}
                  className='bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden animate-pulse'
                >
                  <div className='h-48 bg-gray-300 dark:bg-gray-600'></div>
                  <div className='p-4'>
                    <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2'></div>
                    <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4'></div>
                    <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='bg-gray-50 dark:bg-gray-800 py-16'>
        <div className='layout'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
              Featured Properties
            </h2>
            <div className='text-red-600 dark:text-red-400'>
              Error loading properties
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-gray-50 dark:bg-gray-800 py-16'>
      <div className='layout'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            Featured Properties
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Discover our handpicked selection of the finest properties currently
            available in the market.
          </p>
        </div>

        {properties.length === 0 ? (
          <div className='text-center text-gray-500 dark:text-gray-400'>
            <p>No properties available at the moment.</p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className='text-center'>
              <Link
                href='/listings'
                className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
              >
                View All Properties
                <svg
                  className='ml-2 -mr-1 w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
