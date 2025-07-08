'use client';

import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ClientContextType {
  clientUid: string | null;
  isLoading: boolean;
}

// Create context with default values
const defaultContextValue: ClientContextType = {
  clientUid: null,
  isLoading: true,
};

export const ClientContext =
  createContext<ClientContextType>(defaultContextValue);

export const useClientContext = () => useContext(ClientContext);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [clientUid, setClientUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    // When session is loaded, set clientUid from session data
    if (status === 'authenticated' && session?.user?.client_uid) {
      setClientUid(session.user.client_uid);
    } else {
      setClientUid(null);
    }

    setIsLoading(false);
  }, [session, status]);

  return (
    <ClientContext.Provider
      value={{
        clientUid,
        isLoading,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}
