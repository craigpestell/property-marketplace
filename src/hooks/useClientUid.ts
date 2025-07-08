'use client';

import { useClientContext } from '@/contexts/ClientContext';

/**
 * Custom hook to get the client_uid for the current user
 * @returns { clientUid: string | null, loading: boolean, hasClientUid: boolean }
 */
export function useClientUid() {
  const { clientUid, isLoading } = useClientContext();

  return {
    clientUid,
    loading: isLoading,
    hasClientUid: Boolean(clientUid),
  };
}
