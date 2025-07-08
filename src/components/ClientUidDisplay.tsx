'use client';

import { useClientUid } from '@/hooks/useClientUid';

export default function ClientUidDisplay() {
  const { clientUid, loading, hasClientUid } = useClientUid();

  if (loading) {
    return <div className='text-gray-600'>Loading client information...</div>;
  }

  if (!hasClientUid) {
    return <div className='text-amber-600'>No client UID available</div>;
  }

  return (
    <div className='text-green-600'>
      <span className='font-medium'>Client UID:</span> {clientUid}
    </div>
  );
}
