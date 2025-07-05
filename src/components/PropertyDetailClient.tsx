'use client';

import {
  CalendarIcon,
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { Property, PropertyDetails } from '@/types';

interface PropertyDetailClientProps {
  property: Property;
}

export default function PropertyDetailClient({
  property,
}: PropertyDetailClientProps) {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner =
    session?.user?.email &&
    property.client_email &&
    session.user.email === property.client_email;

  const handleImageError = () => {
    setImageError(true);
  };

  const copyPropertyUID = async () => {
    try {
      await navigator.clipboard.writeText(property.property_uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy UID:', err);
    }
  };

  // Parse details - look for description within details
  let parsedDetails: PropertyDetails | null = null;
  let detailsText = '';
  let propertyDescription = '';

  if (property.details) {
    try {
      parsedDetails = JSON.parse(property.details);
      // Extract description from details if it exists
      propertyDescription = parsedDetails?.description || '';
    } catch {
      detailsText = property.details;
      // If it's plain text, treat it as description
      propertyDescription = property.details;
    }
  }

  return (
    <main className='bg-gray-50 min-h-screen'>
      <div className='layout py-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Property Image */}
          <div className='mb-8'>
            <img
              src={
                !imageError && property.image_url
                  ? property.image_url
                  : '/placeholder-property.jpg'
              }
              alt={property.title}
              className='w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg'
              onError={handleImageError}
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Main Content */}
            <div className='lg:col-span-2'>
              {/* Property Header */}
              <div className='bg-white rounded-xl p-6 shadow-sm mb-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h1 className='text-3xl lg:text-4xl font-bold text-gray-900'>
                        {property.title}
                      </h1>
                      <button
                        onClick={copyPropertyUID}
                        className='flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-mono transition-colors'
                        title='Click to copy Property ID'
                      >
                        <ClipboardDocumentIcon className='h-3 w-3' />
                        {property.property_uid}
                      </button>
                    </div>
                    {copied && (
                      <p className='text-xs text-green-600 mb-2'>
                        Copied to clipboard!
                      </p>
                    )}
                  </div>
                  {isOwner && (
                    <Link
                      href={`/profile/edit-property/${property.property_uid}`}
                      className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium'
                    >
                      Edit Property
                    </Link>
                  )}
                </div>

                <div className='flex items-center text-gray-600 mb-4'>
                  <MapPinIcon className='h-5 w-5 mr-2' />
                  <span className='text-lg'>{property.address}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center text-primary-600'>
                    <CurrencyDollarIcon className='h-6 w-6 mr-1' />
                    <span className='text-3xl font-bold'>
                      {property.price.toLocaleString()}
                    </span>
                  </div>

                  <div className='flex items-center text-gray-500'>
                    <CalendarIcon className='h-5 w-5 mr-2' />
                    <span className='text-sm'>
                      Listed{' '}
                      {new Date(property.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Description - now from details */}
              {propertyDescription && (
                <div className='bg-white rounded-xl p-6 shadow-sm mb-6'>
                  <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                    About This Property
                  </h2>
                  <p className='text-gray-700 leading-relaxed text-lg'>
                    {propertyDescription}
                  </p>
                </div>
              )}

              {/* Property Details Section - same as before but without separate description handling */}
              {(parsedDetails || detailsText) && (
                <div className='bg-white rounded-xl p-6 shadow-sm mb-6'>
                  <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                    Property Features & Details
                  </h2>

                  {parsedDetails ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {/* Basic Info */}
                      {(parsedDetails.bedrooms ||
                        parsedDetails.bathrooms ||
                        parsedDetails.squareFootage) && (
                        <div>
                          <h3 className='font-semibold text-gray-900 mb-3'>
                            Basic Information
                          </h3>
                          <div className='space-y-2'>
                            {parsedDetails.bedrooms && (
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>Bedrooms:</span>
                                <span className='font-medium'>
                                  {parsedDetails.bedrooms}
                                </span>
                              </div>
                            )}
                            {parsedDetails.bathrooms && (
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>
                                  Bathrooms:
                                </span>
                                <span className='font-medium'>
                                  {parsedDetails.bathrooms}
                                </span>
                              </div>
                            )}
                            {parsedDetails.squareFootage && (
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>
                                  Square Feet:
                                </span>
                                <span className='font-medium'>
                                  {parsedDetails.squareFootage.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {parsedDetails.yearBuilt && (
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>
                                  Year Built:
                                </span>
                                <span className='font-medium'>
                                  {parsedDetails.yearBuilt}
                                </span>
                              </div>
                            )}
                            {parsedDetails.propertyType && (
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>Type:</span>
                                <span className='font-medium capitalize'>
                                  {parsedDetails.propertyType}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      {parsedDetails.features &&
                        parsedDetails.features.length > 0 && (
                          <div>
                            <h3 className='font-semibold text-gray-900 mb-3'>
                              Features
                            </h3>
                            <ul className='space-y-1'>
                              {parsedDetails.features.map((feature, index) => (
                                <li
                                  key={index}
                                  className='text-gray-700 text-sm'
                                >
                                  • {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Amenities */}
                      {parsedDetails.amenities &&
                        parsedDetails.amenities.length > 0 && (
                          <div>
                            <h3 className='font-semibold text-gray-900 mb-3'>
                              Amenities
                            </h3>
                            <ul className='space-y-1'>
                              {parsedDetails.amenities.map((amenity, index) => (
                                <li
                                  key={index}
                                  className='text-gray-700 text-sm'
                                >
                                  • {amenity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Additional Details */}
                      {(parsedDetails.parking ||
                        parsedDetails.heating ||
                        parsedDetails.cooling) && (
                        <div>
                          <h3 className='font-semibold text-gray-900 mb-3'>
                            Additional Details
                          </h3>
                          <div className='space-y-2'>
                            {parsedDetails.parking && (
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>Parking:</span>
                                <span className='font-medium'>
                                  {parsedDetails.parking}
                                </span>
                              </div>
                            )}
                            {parsedDetails.heating && (
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>Heating:</span>
                                <span className='font-medium'>
                                  {parsedDetails.heating}
                                </span>
                              </div>
                            )}
                            {parsedDetails.cooling && (
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>Cooling:</span>
                                <span className='font-medium'>
                                  {parsedDetails.cooling}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes - but don't show description again if it was already shown above */}
                      {parsedDetails.notes &&
                        parsedDetails.notes !== parsedDetails.description && (
                          <div className='md:col-span-2 lg:col-span-3'>
                            <h3 className='font-semibold text-gray-900 mb-3'>
                              Additional Notes
                            </h3>
                            <p className='text-gray-700 leading-relaxed'>
                              {parsedDetails.notes}
                            </p>
                          </div>
                        )}
                    </div>
                  ) : (
                    // Only show plain text if it wasn't already shown as description
                    !propertyDescription && (
                      <div className='text-gray-700 leading-relaxed'>
                        <pre className='whitespace-pre-wrap font-sans'>
                          {detailsText}
                        </pre>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Rest of the component remains the same... */}
              <div className='bg-white rounded-xl p-6 shadow-sm'>
                <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
                  Property Summary
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex justify-between py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>Property ID</span>
                    <span className='font-mono text-sm'>
                      {property.property_uid}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>Price</span>
                    <span className='font-medium'>
                      ${property.price.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>Listed Date</span>
                    <span className='font-medium'>
                      {new Date(property.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>Location</span>
                    <span className='font-medium'>{property.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar remains the same... */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-xl p-6 shadow-sm mb-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Quick Facts
                </h3>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Price</span>
                    <span className='font-semibold text-primary-600'>
                      ${property.price.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Property ID</span>
                    <span className='font-mono text-sm'>
                      {property.property_uid}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Listed</span>
                    <span className='font-medium'>
                      {new Date(property.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {parsedDetails?.bedrooms && (
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>Bedrooms</span>
                      <span className='font-medium'>
                        {parsedDetails.bedrooms}
                      </span>
                    </div>
                  )}
                  {parsedDetails?.bathrooms && (
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>Bathrooms</span>
                      <span className='font-medium'>
                        {parsedDetails.bathrooms}
                      </span>
                    </div>
                  )}
                  {parsedDetails?.squareFootage && (
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>Sq Ft</span>
                      <span className='font-medium'>
                        {parsedDetails.squareFootage.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              <div className='bg-white rounded-xl p-6 shadow-sm'>
                <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                  Interested in this property?
                </h3>

                <form className='space-y-4'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Full Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder='Your full name'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Email Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder='your.email@example.com'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='message'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Message
                    </label>
                    <textarea
                      id='message'
                      rows={4}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder="I'm interested in this property..."
                      defaultValue={`I'm interested in ${property.title} (${property.property_uid}) at ${property.address}. Please contact me with more information.`}
                    />
                  </div>

                  <button
                    type='submit'
                    className='w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium'
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
