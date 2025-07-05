'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';

import PropertyForm from '@/components/PropertyForm';

import { Property } from '@/types';

export default function EditListingPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [uid, setUid] = React.useState<string>('');

  React.useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUid(resolvedParams.uid);
    };
    getParams();
  }, [params]);

  React.useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/signin');
      return;
    }
    if (!uid) return;

    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/listings/uid/${uid}`);
        if (!response.ok) {
          throw new Error('Property not found');
        }
        const data = await response.json();

        // Check if the user owns this property
        // Use user_email if available, otherwise fallback to client_email
        const propertyOwnerEmail = data.user_email || data.client_email;

        if (propertyOwnerEmail !== session.user?.email) {
          setError('You are not authorized to edit this property');
          return;
        }

        setProperty(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load property',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [session, status, router, uid]);

  if (status === 'loading' || loading) {
    return (
      <section className='bg-white'>
        <div className='layout min-h-screen py-12'>
          <div className='text-center'>
            <div className='text-lg'>Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  if (error) {
    return (
      <section className='bg-white'>
        <div className='layout min-h-screen py-12'>
          <div className='text-center'>
            <div className='text-red-600 text-lg'>{error}</div>
            <button
              onClick={() => router.back()}
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!property) {
    return (
      <section className='bg-white'>
        <div className='layout min-h-screen py-12'>
          <div className='text-center'>
            <div className='text-gray-600 text-lg'>Property not found</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-white'>
      <div className='layout min-h-screen py-12'>
        <PropertyForm mode='edit' property={property} />
      </div>
    </section>
  );
}
