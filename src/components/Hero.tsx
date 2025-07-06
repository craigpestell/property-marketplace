import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white'>
      {/* Background overlay */}
      <div className='absolute inset-0 bg-black bg-opacity-30'></div>

      {/* Content */}
      <div className='relative layout py-24 lg:py-32'>
        <div className='max-w-5xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight'>
            Save $41K+ on Your
            <span className='block text-blue-200 bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent'>
              Dream Home
            </span>
          </h1>

          <p className='text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed font-light'>
            Revolutionary 0.9% seller commission. Zero buyer fees.
            <span className='block mt-2 text-lg md:text-xl opacity-90'>
              Full-service support + exclusive FSBO access others won't show
              you.
            </span>
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
            <Link
              href='/listings'
              className='group bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1'
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
              className='group bg-white text-blue-900 hover:bg-blue-50 px-10 py-4 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-100'
            >
              Start Saving Today
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          <div className='text-center group'>
            <div className='text-4xl md:text-5xl font-bold text-blue-200 mb-2 group-hover:scale-110 transition-transform duration-300'>
              0.9%
            </div>
            <div className='text-blue-100 text-lg font-medium'>
              Seller Commission
            </div>
            <div className='text-blue-300 text-sm mt-1'>
              vs. traditional 2.5%
            </div>
          </div>
          <div className='text-center group'>
            <div className='text-4xl md:text-5xl font-bold text-blue-200 mb-2 group-hover:scale-110 transition-transform duration-300'>
              $41K+
            </div>
            <div className='text-blue-100 text-lg font-medium'>
              Combined Savings
            </div>
            <div className='text-blue-300 text-sm mt-1'>on $1M property</div>
          </div>
          <div className='text-center group'>
            <div className='text-4xl md:text-5xl font-bold text-blue-200 mb-2 group-hover:scale-110 transition-transform duration-300'>
              5K+
            </div>
            <div className='text-blue-100 text-lg font-medium'>
              Happy Customers
            </div>
            <div className='text-blue-300 text-sm mt-1'>and growing</div>
          </div>
        </div>
      </div>
    </section>
  );
}
