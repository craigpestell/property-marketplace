import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0'>
        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-900/70 to-purple-900/80'></div>

        {/* Floating shapes */}
        <div className='absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse'></div>
        <div className='absolute top-40 right-32 w-48 h-48 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000'></div>
        <div className='absolute bottom-32 left-1/4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500'></div>

        {/* Grid pattern */}
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3e%3cdefs%3e%3cpattern id="a" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="translate(0,0) rotate(0) skewX(0) skewY(0)"%3e%3csvg viewBox="0 0 15 15" width="15" height="15" xmlns="http://www.w3.org/2000/svg"%3e%3cg fill="%23ffffff" fill-opacity="0.03" fill-rule="evenodd"%3e%3ccircle cx="3" cy="3" r="1"/%3e%3c/g%3e%3c/svg%3e%3c/pattern%3e%3c/defs%3e%3crect width="100%25" height="100%25" fill="url(%23a)"/%3e%3c/svg%3e")] opacity-50'></div>
      </div>

      {/* Content */}
      <div className='relative layout py-28 lg:py-36'>
        <div className='max-w-6xl mx-auto text-center'>
          {/* Badge */}
          <div className='inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm'>
            <span className='relative flex h-3 w-3 mr-3'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
            </span>
            <span className='text-sm font-medium text-blue-100'>
              Revolutionary Real Estate Platform
            </span>
          </div>

          <h1 className='text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight'>
            Save{' '}
            <span className='relative inline-block'>
              <span className='bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse'>
                $41K+
              </span>
              <div className='absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-purple-400/20 blur-lg -z-10 animate-pulse'></div>
            </span>{' '}
            on Your
            <span className='block mt-4 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent'>
              Dream Home
            </span>
          </h1>

          <p className='text-xl md:text-2xl lg:text-3xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light'>
            Revolutionary{' '}
            <span className='font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent'>
              0.9% seller commission
            </span>
            . Zero buyer fees.
            <span className='block mt-4 text-lg md:text-xl lg:text-2xl opacity-90'>
              Full-service support + exclusive FSBO access others won't show
              you.
            </span>
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-16'>
            <Link
              href='/listings'
              className='group relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-12 py-5 rounded-2xl font-bold transition-all duration-500 text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 border border-blue-400/20'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500'></div>
              <span className='relative flex items-center'>
                🏠 Browse Properties
                <svg
                  className='ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300'
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
              className='group relative bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-indigo-900 px-12 py-5 rounded-2xl font-bold transition-all duration-500 text-lg shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105 border border-white/30 hover:border-white'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500'></div>
              <span className='relative flex items-center'>
                ✨ Start Saving Today
              </span>
            </Link>
          </div>
        </div>

        {/* Enhanced Stats with Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          <div className='group relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500'></div>
            <div className='relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center group-hover:bg-white/15 transition-all duration-500 hover:scale-105'>
              <div className='text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-500'>
                0.9%
              </div>
              <div className='text-white text-xl font-bold mb-2'>
                Seller Commission
              </div>
              <div className='text-blue-200 text-sm flex items-center justify-center'>
                <span className='bg-red-500/20 text-red-300 px-3 py-1 rounded-full line-through mr-2'>
                  2.5%
                </span>
                <span className='text-emerald-300'>vs. traditional</span>
              </div>
            </div>
          </div>

          <div className='group relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500'></div>
            <div className='relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center group-hover:bg-white/15 transition-all duration-500 hover:scale-105'>
              <div className='text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-500'>
                $41K+
              </div>
              <div className='text-white text-xl font-bold mb-2'>
                Combined Savings
              </div>
              <div className='text-blue-200 text-sm'>
                <span className='text-emerald-300'>on $1M property</span>
              </div>
            </div>
          </div>

          <div className='group relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500'></div>
            <div className='relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center group-hover:bg-white/15 transition-all duration-500 hover:scale-105'>
              <div className='text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-500'>
                5K+
              </div>
              <div className='text-white text-xl font-bold mb-2'>
                Happy Customers
              </div>
              <div className='text-blue-200 text-sm flex items-center justify-center'>
                <span className='w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse'></span>
                <span className='text-green-300'>and growing daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
