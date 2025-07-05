'use client';

import { useState } from 'react';

import Button from './buttons/Button';

interface Offer {
  offer_id: number;
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

interface OfferCardProps {
  offer: Offer;
  userRole: 'buyer' | 'seller';
  onOfferUpdated: () => void;
}

export default function OfferCard({
  offer,
  userRole,
  onOfferUpdated,
}: OfferCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'countered':
        return 'bg-blue-100 text-blue-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/offers/${offer.offer_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          counter_amount:
            newStatus === 'countered' ? parseFloat(counterAmount) : undefined,
          message: newStatus === 'countered' ? counterMessage : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update offer');
      }

      onOfferUpdated();
      setShowCounterForm(false);
      setCounterAmount('');
      setCounterMessage('');
    } catch (error) {
      // Handle error
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = new Date() > new Date(offer.expires_at);

  return (
    <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
      {/* Header */}
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            {offer.property_title}
          </h3>
          <p className='text-sm text-gray-600'>{offer.property_address}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            offer.status,
          )}`}
        >
          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
        </span>
      </div>

      {/* Offer Details */}
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <p className='text-sm text-gray-600'>Offer Amount</p>
          <p className='text-lg font-semibold text-green-600'>
            ${offer.offer_amount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>Listing Price</p>
          <p className='text-lg font-semibold text-gray-900'>
            ${offer.listing_price.toLocaleString()}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>Financing</p>
          <p className='text-sm font-medium text-gray-900 capitalize'>
            {offer.financing_type}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>Earnest Money</p>
          <p className='text-sm font-medium text-gray-900'>
            {offer.earnest_money
              ? `$${offer.earnest_money.toLocaleString()}`
              : 'Not specified'}
          </p>
        </div>
      </div>

      {/* Additional Details */}
      {offer.closing_date && (
        <div className='mb-4'>
          <p className='text-sm text-gray-600'>Proposed Closing Date</p>
          <p className='text-sm font-medium text-gray-900'>
            {formatDate(offer.closing_date)}
          </p>
        </div>
      )}

      {offer.contingencies && offer.contingencies.length > 0 && (
        <div className='mb-4'>
          <p className='text-sm text-gray-600'>Contingencies</p>
          <div className='flex flex-wrap gap-1 mt-1'>
            {offer.contingencies.map((contingency, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'
              >
                {contingency}
              </span>
            ))}
          </div>
        </div>
      )}

      {offer.message && (
        <div className='mb-4'>
          <p className='text-sm text-gray-600'>Message</p>
          <p className='text-sm text-gray-900 bg-gray-50 p-3 rounded'>
            {offer.message}
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className='mb-4 text-xs text-gray-500'>
        <p>Submitted: {formatDate(offer.created_at)}</p>
        {offer.updated_at !== offer.created_at && (
          <p>Updated: {formatDate(offer.updated_at)}</p>
        )}
        {!isExpired && offer.status === 'pending' && (
          <p>Expires: {formatDate(offer.expires_at)}</p>
        )}
        {isExpired && offer.status === 'pending' && (
          <p className='text-red-600 font-medium'>Expired</p>
        )}
      </div>

      {/* Counter Offer Form */}
      {showCounterForm && (
        <div className='border-t pt-4 mt-4'>
          <h4 className='text-md font-semibold mb-3'>Counter Offer</h4>
          <div className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Counter Amount
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                  $
                </span>
                <input
                  type='number'
                  className='w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  placeholder={offer.offer_amount.toString()}
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Message to Buyer
              </label>
              <textarea
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                placeholder='Explain your counter offer...'
              />
            </div>
            <div className='flex gap-2'>
              <Button
                onClick={() => handleStatusUpdate('countered')}
                disabled={isUpdating || !counterAmount}
                className='text-sm px-3 py-1'
              >
                Send Counter
              </Button>
              <Button
                variant='outline'
                onClick={() => setShowCounterForm(false)}
                className='text-sm px-3 py-1'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {offer.status === 'pending' && !isExpired && (
        <div className='flex gap-2 pt-4 border-t'>
          {userRole === 'seller' && (
            <>
              <Button
                onClick={() => handleStatusUpdate('accepted')}
                disabled={isUpdating}
                className='text-sm px-4 py-2'
              >
                Accept
              </Button>
              <Button
                variant='outline'
                onClick={() => setShowCounterForm(true)}
                disabled={isUpdating}
                className='text-sm px-4 py-2'
              >
                Counter
              </Button>
              <Button
                variant='outline'
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
                className='text-sm px-4 py-2 text-red-600 border-red-300 hover:bg-red-50'
              >
                Reject
              </Button>
            </>
          )}
          {userRole === 'buyer' && (
            <Button
              variant='outline'
              onClick={() => handleStatusUpdate('withdrawn')}
              disabled={isUpdating}
              className='text-sm px-4 py-2 text-gray-600'
            >
              Withdraw
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
