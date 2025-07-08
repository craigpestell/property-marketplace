'use client';

import { SessionProvider } from 'next-auth/react';

import { ClientProvider } from '@/contexts/ClientContext';

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ClientProvider>{children}</ClientProvider>
    </SessionProvider>
  );
}
