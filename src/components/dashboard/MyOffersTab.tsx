'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

import OfferCard from '@/components/OfferCard';

interface Offer {
  offer_uid: string;
  property_uid: string;
  buyer_email: string;
  seller_email: string;
  offer_amount: number;
  status: string;
  message: string;
  financing_type: string;
  contingencies: string[];
  closing_date: string;
  earnest_money: number;
  inspection_period_days: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
  property_title: string;
  property_address: string;
  listing_price: number;
  property_images: string[];
}

export default function MyOffersTab() {
  const { data: session } = useSession();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'buyer' | 'seller'>('all');

  const fetchOffers = useCallback(async () => {
    try {
      const roleParam = activeTab === 'all' ? '' : `?role=${activeTab}`;
      const response = await fetch(`/api/offers${roleParam}`);
      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers);
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (session?.user) {
      fetchOffers();
    }
  }, [session, fetchOffers]);

  const getStatusStats = () => {
    const stats = {
      pending: offers.filter((o) => o.status === 'pending').length,
      accepted: offers.filter((o) => o.status === 'accepted').length,
      rejected: offers.filter((o) => o.status === 'rejected').length,
      countered: offers.filter((o) => o.status === 'countered').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className='p-6'>
      {/* Offers Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              My Offers
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Track and manage your property offers
            </p>
          </div>
          <Link
            href='/listings'
            className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Browse Properties
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='mb-6'>
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <nav className='-mb-px flex space-x-8'>
            {[
              { id: 'all', name: 'All Offers' },
              { id: 'buyer', name: 'Offers Made' },
              { id: 'seller', name: 'Offers Received' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'all' | 'buyer' | 'seller')
                }
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Statistics */}
      {offers.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 dark:bg-blue-800 rounded-lg'>
                <svg
                  className='w-5 h-5 text-blue-600 dark:text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <div className='text-lg font-bold text-blue-900 dark:text-blue-100'>
                  {stats.pending}
                </div>
                <div className='text-sm text-blue-700 dark:text-blue-300'>
                  Pending
                </div>
              </div>
            </div>
          </div>

          <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 dark:bg-green-800 rounded-lg'>
                <svg
                  className='w-5 h-5 text-green-600 dark:text-green-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <div className='text-lg font-bold text-green-900 dark:text-green-100'>
                  {stats.accepted}
                </div>
                <div className='text-sm text-green-700 dark:text-green-300'>
                  Accepted
                </div>
              </div>
            </div>
          </div>

          <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800'>
            <div className='flex items-center'>
              <div className='p-2 bg-red-100 dark:bg-red-800 rounded-lg'>
                <svg
                  className='w-5 h-5 text-red-600 dark:text-red-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <div className='text-lg font-bold text-red-900 dark:text-red-100'>
                  {stats.rejected}
                </div>
                <div className='text-sm text-red-700 dark:text-red-300'>
                  Rejected
                </div>
              </div>
            </div>
          </div>

          <div className='bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800'>
            <div className='flex items-center'>
              <div className='p-2 bg-orange-100 dark:bg-orange-800 rounded-lg'>
                <svg
                  className='w-5 h-5 text-orange-600 dark:text-orange-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <div className='text-lg font-bold text-orange-900 dark:text-orange-100'>
                  {stats.countered}
                </div>
                <div className='text-sm text-orange-700 dark:text-orange-300'>
                  Countered
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offers Content */}
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3'></div>
          <span className='text-gray-600 dark:text-gray-400'>
            Loading offers...
          </span>
        </div>
      ) : offers.length === 0 ? (
        /* Empty State */
        <div className='text-center py-12'>
          <div className='h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg
              className='h-12 w-12 text-gray-400 dark:text-gray-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
              />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
            No offers yet
          </h3>
          <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
            {activeTab === 'buyer'
              ? "You haven't made any offers yet. Browse properties to get started!"
              : activeTab === 'seller'
                ? "You haven't received any offers yet. Make sure your listings are visible to buyers!"
                : "You don't have any offers yet. Start browsing properties or list your own!"}
          </p>
          <Link
            href='/listings'
            className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors'
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        /* Offers List */
        <div className='space-y-6'>
          {offers.map((offer) => {
            // Determine user role for this offer
            const userRole =
              offer.buyer_email === session?.user?.email ? 'buyer' : 'seller';

            return (
              <OfferCard
                key={offer.offer_uid}
                offer={offer}
                userRole={userRole}
                onOfferUpdated={fetchOffers}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
