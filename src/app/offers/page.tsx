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

export default function OffersPage() {
  const { data: session, status } = useSession();
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
    if (status === 'authenticated') {
      fetchOffers();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, fetchOffers]);

  const handleOfferUpdated = () => {
    fetchOffers();
  };

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Loading offers...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
            Sign In Required
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            You need to be signed in to view your offers.
          </p>
          <Link
            href='/login'
            className='bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors'
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const buyerOffers = offers.filter(
    (offer) => offer.buyer_email === session?.user?.email,
  );
  const sellerOffers = offers.filter(
    (offer) => offer.seller_email === session?.user?.email,
  );

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
            My Offers
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Manage offers you've made and received
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='border-b border-gray-200 dark:border-gray-700 mb-8'>
          <nav className='-mb-px flex space-x-8'>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              All Offers ({offers.length})
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'buyer'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              My Offers ({buyerOffers.length})
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'seller'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Offers Received ({sellerOffers.length})
            </button>
          </nav>
        </div>

        {/* Offers Grid */}
        {offers.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-400 dark:text-gray-600 text-6xl mb-4'>
              📋
            </div>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              No offers yet
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              {activeTab === 'buyer'
                ? "You haven't made any offers yet. Browse properties to get started!"
                : activeTab === 'seller'
                  ? "You haven't received any offers yet. Make sure your listings are visible to buyers!"
                  : "You don't have any offers yet. Start browsing properties or list your own!"}
            </p>
            <Link
              href='/listings'
              className='bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors'
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className='grid gap-6'>
            {offers.map((offer) => (
              <OfferCard
                key={offer.offer_uid}
                offer={offer}
                userRole={
                  offer.buyer_email === session?.user?.email
                    ? 'buyer'
                    : 'seller'
                }
                onOfferUpdated={handleOfferUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
