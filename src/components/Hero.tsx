import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white'>
      {/* Background overlay */}
      <div className='absolute inset-0 bg-black bg-opacity-30'></div>

      {/* Content */}
      <div className='relative layout py-24 lg:py-32'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6'>
            Save $40K+ on Your
            <span className='block text-blue-200'>Dream Home</span>
          </h1>

          <p className='text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
            Pay only 0.9% commission (sellers only) instead of the traditional
            5% total commission (2.5% buyer + 2.5% seller). Buyers pay zero
            commission, creating a larger pool of motivated buyers that helps
            properties sell faster. Full-service support from search to closing,
            plus access to "for sale by owner" properties others won't show you.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link
              href='/listings'
              className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg'
            >
              Browse Properties
            </Link>
            <Link
              href='/signup'
              className='bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors text-lg'
            >
              Start Saving Today
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-blue-200'>0.9%</div>
            <div className='text-blue-100'>Seller Commission</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-blue-200'>$41K+</div>
            <div className='text-blue-100'>Combined Savings</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-blue-200'>5K+</div>
            <div className='text-blue-100'>Happy Customers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
