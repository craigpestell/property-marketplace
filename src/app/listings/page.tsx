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

  // Remove the client-side filtering useEffect since we're doing server-side filtering now

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
      <div className='layout min-h-screen py-12'>
        <div className='mb-12'>
          <div className='text-center mb-6'>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              Property Listings
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-400 mb-4'>
              Browse all available properties in our marketplace
            </p>
            <Link
              href='/listings/create'
              className='inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors'
            >
              <svg
                className='w-5 h-5 mr-2'
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
              List Your Property
            </Link>
          </div>

          {/* Simplified Incentive Tagline */}
          <div className='bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-lg p-4 max-w-4xl mx-auto mb-6'>
            <div className='flex items-center justify-center gap-4 text-center'>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-5 h-5 text-yellow-300'
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
                <span className='font-bold text-xl'>
                  Save $41K+ with Zero Buyer Commission
                </span>
              </div>
              <div className='hidden md:block text-blue-200 dark:text-blue-300'>
                •
              </div>
              <div className='text-blue-100 dark:text-blue-200 text-sm'>
                Access FSBO properties others won't show
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className='max-w-4xl mx-auto mb-8'>
            {/* Search Input */}
            <div className='relative mb-4'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg
                  className='h-5 w-5 text-gray-400 dark:text-gray-500'
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
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            {/* Filter Toggle Button */}
            <div className='flex justify-center mb-4'>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z'
                  />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                  {/* Price Range */}
                  <div className='col-span-1 md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Price Range
                    </label>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='number'
                        placeholder='Min Price'
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                      />
                      <span className='text-gray-500 dark:text-gray-400'>
                        to
                      </span>
                      <input
                        type='number'
                        placeholder='Max Price'
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value=''>All Types</option>
                      <option value='house'>House</option>
                      <option value='apartment'>Apartment</option>
                      <option value='condo'>Condo</option>
                      <option value='townhouse'>Townhouse</option>
                      <option value='commercial'>Commercial</option>
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Bedrooms
                    </label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value=''>Any</option>
                      <option value='1'>1+</option>
                      <option value='2'>2+</option>
                      <option value='3'>3+</option>
                      <option value='4'>4+</option>
                      <option value='5'>5+</option>
                    </select>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Bathrooms
                    </label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value=''>Any</option>
                      <option value='1'>1+</option>
                      <option value='2'>2+</option>
                      <option value='3'>3+</option>
                      <option value='4'>4+</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value='created_at'>Newest First</option>
                      <option value='price'>Price</option>
                      <option value='title'>Title</option>
                      <option value='address'>Location</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Order
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value='DESC'>
                        {sortBy === 'price' ? 'High to Low' : 'Descending'}
                      </option>
                      <option value='ASC'>
                        {sortBy === 'price' ? 'Low to High' : 'Ascending'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className='mt-4 flex justify-center'>
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
                      setCurrentPage(1); // Reset pagination
                    }}
                    className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900'
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className='text-center text-gray-500 dark:text-gray-400 py-8'>
            <div className='inline-flex items-center'>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Loading properties...
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className='text-center text-gray-500 dark:text-gray-400'>
            {debouncedSearchQuery ||
            minPrice ||
            maxPrice ||
            propertyType ||
            bedrooms ||
            bathrooms ? (
              <p>No properties found matching your search criteria.</p>
            ) : (
              <p>No properties available at the moment.</p>
            )}
          </div>
        ) : (
          <>
            {/* Top Pagination Controls - Simplified */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                {/* Pagination Buttons */}
                <div className='flex items-center gap-2'>
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrev}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      hasPrev
                        ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className='flex items-center gap-1'>
                    {/* First page */}
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className='px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className='px-2 text-gray-400 dark:text-gray-500'>
                            ...
                          </span>
                        )}
                      </>
                    )}

                    {/* Previous page */}
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className='px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                      >
                        {currentPage - 1}
                      </button>
                    )}

                    {/* Current page */}
                    <button className='px-3 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 border border-blue-600 dark:border-blue-700 rounded-md'>
                      {currentPage}
                    </button>

                    {/* Next page */}
                    {currentPage < totalPages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className='px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                      >
                        {currentPage + 1}
                      </button>
                    )}

                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className='px-2 text-gray-400 dark:text-gray-500'>
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className='px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      hasNext
                        ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Property Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Bottom Pagination Controls - Complete */}
            {totalPages > 1 && (
              <div className='flex flex-col gap-4'>
                {/* Results Info and Items Per Page Selector */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div className='text-center sm:text-left text-gray-600 dark:text-gray-400'>
                    {debouncedSearchQuery ||
                    minPrice ||
                    maxPrice ||
                    propertyType ||
                    bedrooms ||
                    bathrooms ? (
                      <p>
                        Found {totalItems} propert
                        {totalItems === 1 ? 'y' : 'ies'} matching your criteria{' '}
                        {totalPages > 1 &&
                          `(Page ${currentPage} of ${totalPages})`}
                      </p>
                    ) : (
                      <p>
                        Showing {totalItems} propert
                        {totalItems === 1 ? 'y' : 'ies'}
                        {totalPages > 1 &&
                          ` (Page ${currentPage} of ${totalPages})`}
                      </p>
                    )}
                  </div>

                  {/* Items Per Page Selector */}
                  <div className='flex items-center gap-2 text-sm'>
                    <label className='text-gray-600 dark:text-gray-400'>
                      Show:
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        handleItemsPerPageChange(parseInt(e.target.value))
                      }
                      className='px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className='text-gray-600 dark:text-gray-400'>
                      per page
                    </span>
                  </div>
                </div>

                {/* Pagination Navigation */}
                <div className='flex items-center justify-center gap-4'>
                  {/* Pagination Buttons */}
                  <div className='flex items-center gap-2'>
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrev}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        hasPrev
                          ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className='flex items-center gap-1'>
                      {/* First page */}
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className='px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
                          >
                            1
                          </button>
                          {currentPage > 4 && (
                            <span className='px-2 text-gray-400'>...</span>
                          )}
                        </>
                      )}

                      {/* Previous page */}
                      {currentPage > 1 && (
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          className='px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
                        >
                          {currentPage - 1}
                        </button>
                      )}

                      {/* Current page */}
                      <button className='px-3 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 border border-blue-600 dark:border-blue-700 rounded-md'>
                        {currentPage}
                      </button>

                      {/* Next page */}
                      {currentPage < totalPages && (
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          className='px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
                        >
                          {currentPage + 1}
                        </button>
                      )}

                      {/* Last page */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <span className='px-2 text-gray-400'>...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className='px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNext}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        hasNext
                          ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
