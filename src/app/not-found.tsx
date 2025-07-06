import { Metadata } from 'next';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <section className='bg-white dark:bg-gray-900'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black dark:text-white'>
          <RiAlarmWarningFill
            size={60}
            className='drop-shadow-glow animate-flicker text-red-500 dark:text-red-400'
          />
          <h1 className='mt-8 text-4xl md:text-6xl'>Page Not Found</h1>
          <a
            href='/'
            className='mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline'
          >
            Back to home
          </a>
        </div>
      </section>
    </main>
  );
}
