import Link from 'next/link';

export default function Hero() {
  return (
    <section className='bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-800 relative'>
      {/* Light background pattern for subtle texture */}
      <div className='absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 opacity-50'></div>

      {/* Content */}
      <div className='relative layout py-16 lg:py-24'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-col lg:flex-row items-center gap-8'>
            <div className='lg:w-3/5 mb-10 lg:mb-0'>
              <h1 className='font-heading text-4xl md:text-5xl font-semibold mb-6 leading-tight text-gray-900 dark:text-gray-100 tracking-normal'>
                Save{' '}
                <span className='text-blue-600 dark:text-blue-400'>$41K+</span>{' '}
                on Your Dream Home
              </h1>

              <p className='font-body text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed'>
                With our{' '}
                <span className='font-medium text-gray-800 dark:text-gray-200'>
                  0.9% seller commission
                </span>{' '}
                and zero buyer fees, you get full-service support plus exclusive
                access to properties others won't show you.
              </p>

              <div className='flex flex-col sm:flex-row gap-4'>
                <Link
                  href='/listings'
                  className='inline-flex font-body items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded shadow-sm transition-all hover:shadow'
                >
                  Browse Properties
                  <svg
                    className='ml-2 w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </Link>
                <Link
                  href='/signup'
                  className='inline-flex font-body items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded shadow-sm transition-all hover:shadow'
                >
                  Start Saving Today
                </Link>
              </div>
            </div>

            <div className='lg:w-2/5'>
              <div className='bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow'>
                <h3 className='font-heading text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 pb-2 border-b border-gray-100 dark:border-gray-700 tracking-normal'>
                  Why Choose Our Platform
                </h3>
                <ul className='space-y-4 mt-4'>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 p-1 rounded mt-0.5'>
                      <svg
                        className='w-4 h-4 text-blue-600 dark:text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                    <span className='font-body text-gray-700 dark:text-gray-300 ml-3'>
                      0.9% seller commission vs traditional 2.5%
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 p-1 rounded mt-0.5'>
                      <svg
                        className='w-4 h-4 text-blue-600 dark:text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                    <span className='font-body text-gray-700 dark:text-gray-300 ml-3'>
                      Zero buyer agent fees - save $25K+
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 p-1 rounded mt-0.5'>
                      <svg
                        className='w-4 h-4 text-blue-600 dark:text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                    <span className='font-body text-gray-700 dark:text-gray-300 ml-3'>
                      Full-service support from search to closing
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 p-1 rounded mt-0.5'>
                      <svg
                        className='w-4 h-4 text-blue-600 dark:text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                    <span className='font-body text-gray-700 dark:text-gray-300 ml-3'>
                      Access to exclusive FSBO properties
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics - Clean & Traditional Style */}
        <div className='mt-16 max-w-5xl mx-auto'>
          <div className='w-full h-px bg-gray-200 dark:bg-gray-800 mb-12'></div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6 text-center shadow-sm'>
              <div className='font-heading text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-2 tracking-normal'>
                0.9%
              </div>
              <div className='font-body text-gray-800 dark:text-gray-200 font-medium mb-2'>
                Seller Commission
              </div>
              <div className='font-body text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center'>
                <span className='line-through text-red-500 dark:text-red-400 mr-2'>
                  2.5%
                </span>
                <span>traditional rate</span>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6 text-center shadow-sm'>
              <div className='font-heading text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-2 tracking-normal'>
                $41K+
              </div>
              <div className='font-body text-gray-800 dark:text-gray-200 font-medium mb-2'>
                Average Savings
              </div>
              <div className='font-body text-gray-500 dark:text-gray-400 text-sm'>
                on $1M property
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6 text-center shadow-sm'>
              <div className='font-heading text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-2 tracking-normal'>
                5K+
              </div>
              <div className='font-body text-gray-800 dark:text-gray-200 font-medium mb-2'>
                Happy Customers
              </div>
              <div className='font-body text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center'>
                <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                <span>and growing daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
