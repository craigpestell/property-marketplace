import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className='bg-blue-700 text-white py-16 md:py-20 relative overflow-hidden'>
      {/* Simple subtle background */}
      <div className='absolute inset-0 bg-pattern-blue opacity-5'></div>

      <div className='layout text-center relative z-10'>
        <h2 className='text-3xl md:text-4xl font-bold mb-6 leading-tight'>
          Skip the Traditional Realtor
        </h2>
        <div className='w-16 h-px bg-blue-300 mx-auto mb-8'></div>
        <p className='text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed'>
          Our platform connects buyers and sellers directly, eliminating costly
          realtor middlemen.
          <span className='block mt-3 text-lg text-blue-100'>
            Access exclusive FSBO properties + save $41K+ with our revolutionary
            0.9% commission structure.
          </span>
        </p>

        {/* FSBO Highlight Box - Cleaner Style */}
        <div className='bg-white/10 rounded p-8 mb-10 max-w-4xl mx-auto border border-blue-600/30 shadow'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left'>
            <div className='md:max-w-xl'>
              <h3 className='text-xl font-bold text-white mb-4'>
                Direct FSBO Access
              </h3>
              <p className='text-blue-100 leading-relaxed'>
                Traditional realtors hide "For Sale By Owner" properties to
                protect their commissions. We give you access to these exclusive
                listings that others won't show you.
              </p>
            </div>
            <div className='flex-shrink-0 mt-6 md:mt-0'>
              <div className='bg-green-600 text-white px-5 py-2.5 rounded font-semibold shadow-sm border border-green-500'>
                No Realtor Required
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-12'>
          <Link
            href='/listings'
            className='group bg-white text-blue-900 hover:bg-blue-50 px-10 py-4 rounded-xl font-semibold transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
          >
            <span className='flex items-center'>
              Browse Properties
              <svg
                className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </span>
          </Link>
          <Link
            href='/signup'
            className='group border-2 border-white text-white hover:bg-white hover:text-blue-900 px-10 py-4 rounded-xl font-semibold transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
          >
            Start Saving Today
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-center mt-8'>
          <div className='flex items-center justify-center gap-2'>
            <div className='bg-blue-800/70 p-1 rounded-full'>
              <svg
                className='w-3 h-3 text-green-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <span className='text-blue-100'>0.9% seller commission</span>
          </div>
          <div className='flex items-center justify-center space-x-2'>
            <svg
              className='w-5 h-5 text-green-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            <span className='text-blue-100'>Zero buyer fees</span>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <div className='bg-blue-800/70 p-1 rounded-full'>
              <svg
                className='w-3 h-3 text-green-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <span className='text-blue-100'>Exclusive FSBO access</span>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <div className='bg-blue-800/70 p-1 rounded-full'>
              <svg
                className='w-3 h-3 text-green-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <span className='text-blue-100'>Full-service support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
