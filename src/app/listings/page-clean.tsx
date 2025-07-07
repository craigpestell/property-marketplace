'use client';

import Link from 'next/link';
import * as React from 'react';
import '@/lib/env';

import PropertyCard from '@/components/PropertyCard';

import { Property } from '@/types';

export default function ListingsPage() {
  const [filteredProperties, setFilteredProperties] = React.useState<
    Property[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(20);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);
  const [hasNext, setHasNext] = React.useState(false);
  const [hasPrev, setHasPrev] = React.useState(false);

  // Filter states
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState('');
  const [sortBy, setSortBy] = React.useState('created_at');
  const [sortOrder, setSortOrder] = React.useState('DESC');
  const [showFilters, setShowFilters] = React.useState(false);

  // Debounced search to avoid too many API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();

        // Add pagination parameters
        params.append('page', currentPage.toString());
        params.append('limit', itemsPerPage.toString());

        if (debouncedSearchQuery.trim())
          params.append('search', debouncedSearchQuery.trim());
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (propertyType) params.append('propertyType', propertyType);
        if (bedrooms) params.append('bedrooms', bedrooms);
        if (bathrooms) params.append('bathrooms', bathrooms);
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);

        const queryString = params.toString();
        const url = `/api/listings${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setFilteredProperties(data.properties);

        // Update pagination state
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total);
          setHasNext(data.pagination.hasNext);
          setHasPrev(data.pagination.hasPrev);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearchQuery,
    minPrice,
    maxPrice,
    propertyType,
    bedrooms,
    bathrooms,
    sortBy,
    sortOrder,
  ]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearchQuery,
    minPrice,
    maxPrice,
    propertyType,
    bedrooms,
    bathrooms,
    sortBy,
    sortOrder,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (error) {
    return (
      <section className='bg-white dark:bg-gray-900 transition-colors duration-200'>
        <div className='layout min-h-screen py-12'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100'>
              Property Listings
            </h1>
            <div className='text-red-600 dark:text-red-400'>Error: {error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-white dark:bg-gray-900 transition-colors duration-200'>
      <div className='layout min-h-screen py-6'>
        {/* Compact Header */}
        <div className='mb-4'>
          <div className='flex justify-between items-center mb-3'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              Property Listings
            </h1>
            <Link
              href='/listings/create'
              className='inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors'
            >
              <svg
                className='w-4 h-4 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
              List Property
            </Link>
          </div>

          {/* Compact Incentive Banner */}
          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 text-blue-600 dark:text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                  />
                </svg>
                <span className='font-semibold text-blue-700 dark:text-blue-300'>
                  Save $41K+ with Zero Buyer Commission
                </span>
              </div>
              <span className='text-blue-600 dark:text-blue-400 text-xs'>
                Access FSBO properties others won't show
              </span>
            </div>
          </div>

          {/* Compact Search and Filters */}
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <div className='relative flex-grow'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg
                    className='h-4 w-4 text-gray-400'
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
                  className='block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              >
                Filters
              </button>
            </div>

            {showFilters && (
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700'>
                <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2'>
                  <div className='col-span-2'>
                    <div className='flex gap-1'>
                      <input
                        type='number'
                        placeholder='Min Price'
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className='w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      />
                      <input
                        type='number'
                        placeholder='Max Price'
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className='w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      />
                    </div>
                  </div>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className='px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  >
                    <option value=''>All Types</option>
                    <option value='house'>House</option>
                    <option value='apartment'>Apartment</option>
                    <option value='condo'>Condo</option>
                    <option value='townhouse'>Townhouse</option>
                  </select>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className='px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  >
                    <option value=''>Beds</option>
                    <option value='1'>1+</option>
                    <option value='2'>2+</option>
                    <option value='3'>3+</option>
                    <option value='4'>4+</option>
                  </select>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className='px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  >
                    <option value=''>Baths</option>
                    <option value='1'>1+</option>
                    <option value='2'>2+</option>
                    <option value='3'>3+</option>
                    <option value='4'>4+</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className='px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  >
                    <option value='created_at'>Newest</option>
                    <option value='price'>Price</option>
                    <option value='saves'>Popular</option>
                  </select>
                </div>
                <div className='flex justify-between items-center mt-2'>
                  <button
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                      setPropertyType('');
                      setBedrooms('');
                      setBathrooms('');
                      setSortBy('created_at');
                      setSortOrder('DESC');
                      setSearchQuery('');
                    }}
                    className='text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className='px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700'
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
            <p>No properties found</p>
          </div>
        ) : (
          <>
            {/* Compact Results Header */}
            <div className='flex justify-between items-center mb-3 text-sm text-gray-600 dark:text-gray-400'>
              <span>
                {totalItems} propert{totalItems === 1 ? 'y' : 'ies'}
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </span>
              {totalPages > 1 && (
                <div className='flex items-center gap-1'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrev}
                    className={`p-1 rounded ${hasPrev ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 19l-7-7 7-7'
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className={`p-1 rounded ${hasNext ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Property Grid - Optimized for more properties above fold */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
              {filteredProperties.map((property) => (
                <div key={property.id}>
                  <PropertyCard property={property} showSaveCount={true} />
                </div>
              ))}
            </div>

            {/* Bottom Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 mt-6 text-sm'>
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrev}
                  className={`px-2 py-1 rounded ${!hasPrev ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  Previous
                </button>
                <span className='px-2 py-1 bg-blue-600 text-white rounded'>
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNext}
                  className={`px-2 py-1 rounded ${!hasNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
