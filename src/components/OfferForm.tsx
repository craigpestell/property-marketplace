'use client';

import { useState } from 'react';

import { useToast } from '@/contexts/ToastContext';

import Button from './buttons/Button';

interface OfferFormProps {
  propertyUid: string;
  listingPrice: number;
  onOfferSubmitted: () => void;
  onCancel: () => void;
}

export default function OfferForm({
  propertyUid,
  listingPrice,
  onOfferSubmitted,
  onCancel,
}: OfferFormProps) {
  const { showSuccess, showError, showInfo } = useToast();
  const [formData, setFormData] = useState({
    offer_amount: '',
    message: '',
    financing_type: 'conventional',
    contingencies: [] as string[],
    closing_date: '',
    earnest_money: '',
    inspection_period_days: '10',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Show initial feedback
      showInfo('Submitting Offer', 'Processing your offer submission...');

      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_uid: propertyUid,
          offer_amount: parseFloat(formData.offer_amount),
          message: formData.message,
          financing_type: formData.financing_type,
          contingencies: formData.contingencies,
          closing_date: formData.closing_date || null,
          earnest_money: formData.earnest_money
            ? parseFloat(formData.earnest_money)
            : null,
          inspection_period_days: parseInt(formData.inspection_period_days),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // eslint-disable-next-line no-console
        console.error('Offer submission failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        const errorMessage = errorData.error || 'Failed to submit offer';
        showError('Offer Submission Failed', errorMessage);
        throw new Error(errorMessage);
      }

      await response.json();
      showSuccess(
        'Offer Submitted Successfully!',
        `Your offer of $${parseFloat(formData.offer_amount).toLocaleString()} has been submitted and the property owner will be notified.`,
      );
      onOfferSubmitted();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to submit offer';
      // Only show network error toast if it's not an API response error
      if (
        !(
          err instanceof Error && err.message.includes('Failed to submit offer')
        )
      ) {
        showError('Network Error', errorMessage);
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContingencyChange = (contingency: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      contingencies: checked
        ? [...prev.contingencies, contingency]
        : prev.contingencies.filter((c) => c !== contingency),
    }));
  };

  const commonContingencies = [
    'Inspection',
    'Financing',
    'Appraisal',
    'Sale of current home',
    'Final walk-through',
  ];

  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
        Make an Offer
      </h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {error && (
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4'>
            <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
          </div>
        )}

        {/* Offer Amount */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Offer Amount *
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400'>
              $
            </span>
            <input
              type='number'
              required
              className='w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              placeholder={listingPrice.toLocaleString()}
              value={formData.offer_amount}
              onChange={(e) =>
                setFormData({ ...formData, offer_amount: e.target.value })
              }
            />
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Listing price: ${listingPrice.toLocaleString()}
          </p>
        </div>

        {/* Financing Type */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Financing Type
          </label>
          <select
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            value={formData.financing_type}
            onChange={(e) =>
              setFormData({ ...formData, financing_type: e.target.value })
            }
          >
            <option value='cash'>Cash</option>
            <option value='conventional'>Conventional Loan</option>
            <option value='fha'>FHA Loan</option>
            <option value='va'>VA Loan</option>
            <option value='other'>Other</option>
          </select>
        </div>

        {/* Earnest Money */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Earnest Money
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400'>
              $
            </span>
            <input
              type='number'
              className='w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              placeholder='5,000'
              value={formData.earnest_money}
              onChange={(e) =>
                setFormData({ ...formData, earnest_money: e.target.value })
              }
            />
          </div>
        </div>

        {/* Proposed Closing Date */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Proposed Closing Date
          </label>
          <input
            type='date'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            value={formData.closing_date}
            onChange={(e) =>
              setFormData({ ...formData, closing_date: e.target.value })
            }
          />
        </div>

        {/* Inspection Period */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Inspection Period (days)
          </label>
          <input
            type='number'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            value={formData.inspection_period_days}
            onChange={(e) =>
              setFormData({
                ...formData,
                inspection_period_days: e.target.value,
              })
            }
          />
        </div>

        {/* Contingencies */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Contingencies
          </label>
          <div className='space-y-2'>
            {commonContingencies.map((contingency) => (
              <label key={contingency} className='flex items-center'>
                <input
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
                  checked={formData.contingencies.includes(contingency)}
                  onChange={(e) =>
                    handleContingencyChange(contingency, e.target.checked)
                  }
                />
                <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>
                  {contingency}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Message to Seller
          </label>
          <textarea
            rows={4}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            placeholder='Tell the seller why they should accept your offer...'
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 pt-6'>
          <Button type='submit' disabled={isSubmitting} className='flex-1'>
            {isSubmitting ? 'Submitting...' : 'Submit Offer'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='flex-1'
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
