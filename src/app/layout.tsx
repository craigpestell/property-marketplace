import { Metadata } from 'next';
import * as React from 'react';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SessionWrapper from '@/components/SessionWrapper';

import { siteConfig } from '@/constant/config';
import { SavedPropertiesProvider } from '@/contexts/SavedPropertiesContext';
import { ToastProvider } from '@/contexts/ToastContext';

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Real Estate Marketplace',
    template: `%s | Real Estate Marketplace`,
  },
  description:
    'Find your dream property in our curated real estate marketplace',
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: 'Real Estate Marketplace',
    description:
      'Find your dream property in our curated real estate marketplace',
    siteName: 'Real Estate Marketplace',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Marketplace',
    description:
      'Find your dream property in our curated real estate marketplace',
    images: [`${siteConfig.url}/images/og.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <SessionWrapper>
          <SavedPropertiesProvider>
            <ToastProvider>
              <Header />
              <main className='min-h-[calc(100vh-80px)]'>{children}</main>
              <Footer />
            </ToastProvider>
          </SavedPropertiesProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
