'use client';

import * as React from 'react';
import '@/lib/env';

import PropertyCard from '@/components/PropertyCard';

import { Property } from '@/types';

export default function ListingsPage() {
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProperties, setFilteredProperties] = React.useState<
    Property[]
  >([]);

  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data.properties);
        setFilteredProperties(data.properties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (property.details &&
            property.details.toLowerCase().includes(searchQuery.toLowerCase())),
      );
      setFilteredProperties(filtered);
    }
  }, [searchQuery, properties]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <section className='bg-white'>
        <div className='layout min-h-screen py-12'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold mb-8'>Property Listings</h1>
            <div className='flex justify-center items-center'>
              <div className='text-lg'>Loading properties...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='bg-white'>
        <div className='layout min-h-screen py-12'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold mb-8'>Property Listings</h1>
            <div className='text-red-600'>Error: {error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-white'>
      <div className='layout min-h-screen py-12'>
        <div className='mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4 text-center'>
            Property Listings
          </h1>
          <p className='text-lg text-gray-600 text-center mb-8'>
            Browse all available properties in our marketplace
          </p>

          {/* Search Bar */}
          <div className='max-w-md mx-auto mb-8'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
              <input
                type='text'
                placeholder='Search properties...'
                value={searchQuery}
                onChange={handleSearchChange}
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className='text-center text-gray-500'>
            {searchQuery ? (
              <p>No properties found matching "{searchQuery}".</p>
            ) : (
              <p>No properties available at the moment.</p>
            )}
          </div>
        ) : (
          <>
            <div className='mb-6 text-center text-gray-600'>
              {searchQuery ? (
                <p>
                  Found {filteredProperties.length} propert
                  {filteredProperties.length === 1 ? 'y' : 'ies'} matching "
                  {searchQuery}"
                </p>
              ) : (
                <p>
                  Showing all {filteredProperties.length} propert
                  {filteredProperties.length === 1 ? 'y' : 'ies'}
                </p>
              )}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
