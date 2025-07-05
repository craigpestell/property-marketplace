'use client';

import * as React from 'react';
import '@/lib/env';

import CallToAction from '@/components/CallToAction';
import FeaturedProperties from '@/components/FeaturedProperties';
import Features from '@/components/Features';
import Hero from '@/components/Hero';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedProperties limit={6} />
      <CallToAction />
    </>
  );
}
