'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Property } from '@/types';

interface PropertyFormProps {
  property?: Property;
  mode: 'create' | 'edit';
}

export default function PropertyForm({ property, mode }: PropertyFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: property?.title || '',
    price: property?.price || '',
    address: property?.address || '',
    details: property?.details || '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    yearBuilt: '',
    description: '',
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (property?.details) {
      try {
        const details = JSON.parse(property.details);
        setFormData((prev) => ({
          ...prev,
          propertyType: details.propertyType || '',
          bedrooms: details.bedrooms || '',
          bathrooms: details.bathrooms || '',
          squareFootage: details.squareFootage || '',
          yearBuilt: details.yearBuilt || '',
          description: details.description || '',
        }));
      } catch (e) {
        // If details is not JSON, treat as description
        setFormData((prev) => ({
          ...prev,
          description: property.details || '',
        }));
      }
    }
  }, [property]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Enter key from submitting the form
    if (e.key === 'Enter' && e.target !== e.currentTarget) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      setError('You must be logged in to create or edit listings');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const details = JSON.stringify({
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms
          ? parseInt(formData.bathrooms)
          : undefined,
        squareFootage: formData.squareFootage
          ? parseInt(formData.squareFootage)
          : undefined,
        yearBuilt: formData.yearBuilt
          ? parseInt(formData.yearBuilt)
          : undefined,
        description: formData.description,
      });

      const form = new FormData();
      form.append('email', session.user.email);
      form.append('userEmail', session.user.email);
      form.append('title', formData.title);
      form.append('price', formData.price.toString());
      form.append('address', formData.address);
      form.append('details', details);

      if (imageFile) {
        form.append('image', imageFile);
      }

      const url =
        mode === 'create'
          ? '/api/listings'
          : `/api/listings/uid/${property?.property_uid}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: form,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save property');
      }

      // Redirect to the property or listings page
      if (mode === 'create') {
        router.push('/listings');
      } else {
        router.push(`/property/${property?.property_uid}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold mb-6'>
          {mode === 'create' ? 'Add New Property' : 'Edit Property'}
        </h1>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className='space-y-6'
        >
          {/* Basic Information */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Basic Information</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='title'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Property Title *
                </label>
                <input
                  type='text'
                  id='title'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='price'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Price *
                </label>
                <input
                  type='number'
                  id='price'
                  name='price'
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min='0'
                  step='1000'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </div>

            <div className='mt-4'>
              <label
                htmlFor='address'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Address *
              </label>
              <input
                type='text'
                id='address'
                name='address'
                value={formData.address}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Property Details</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <label
                  htmlFor='propertyType'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Property Type
                </label>
                <select
                  id='propertyType'
                  name='propertyType'
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value=''>Select Type</option>
                  <option value='house'>House</option>
                  <option value='apartment'>Apartment</option>
                  <option value='condo'>Condo</option>
                  <option value='townhouse'>Townhouse</option>
                  <option value='commercial'>Commercial</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor='bedrooms'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Bedrooms
                </label>
                <input
                  type='number'
                  id='bedrooms'
                  name='bedrooms'
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min='0'
                  max='20'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='bathrooms'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Bathrooms
                </label>
                <input
                  type='number'
                  id='bathrooms'
                  name='bathrooms'
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min='0'
                  max='20'
                  step='0.5'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='squareFootage'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Square Footage
                </label>
                <input
                  type='number'
                  id='squareFootage'
                  name='squareFootage'
                  value={formData.squareFootage}
                  onChange={handleInputChange}
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='yearBuilt'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Year Built
                </label>
                <input
                  type='number'
                  id='yearBuilt'
                  name='yearBuilt'
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  min='1800'
                  max={new Date().getFullYear() + 1}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Description
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Describe the property features, amenities, and other details...'
            />
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor='image'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Property Image{' '}
              {mode === 'edit' && '(leave empty to keep current image)'}
            </label>
            <input
              type='file'
              id='image'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
            />
            {mode === 'edit' && property?.image_url && (
              <div className='mt-2'>
                <p className='text-sm text-gray-600'>Current image:</p>
                <Image
                  src={property.image_url}
                  alt='Current property'
                  width={128}
                  height={96}
                  className='mt-1 w-32 h-24 object-cover rounded border'
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-between pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={() => router.back()}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={loading}
              className='px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading
                ? 'Saving...'
                : mode === 'create'
                  ? 'Create Listing'
                  : 'Update Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
