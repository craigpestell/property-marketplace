'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';

import PropertyForm from '@/components/PropertyForm';

export default function CreateListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
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

  return (
    <section className='bg-white'>
      <div className='layout min-h-screen py-12'>
        <PropertyForm mode='create' />
      </div>
    </section>
  );
}
