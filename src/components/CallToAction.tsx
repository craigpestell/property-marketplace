import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className='bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-20 relative overflow-hidden'>
      {/* Background pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className='layout text-center relative z-10'>
        <h2 className='text-4xl md:text-5xl font-bold mb-6 leading-tight'>
          Skip the Traditional Realtor
        </h2>
        <p className='text-xl md:text-2xl text-blue-100 mb-6 max-w-4xl mx-auto leading-relaxed font-light'>
          Our platform connects buyers and sellers directly, eliminating costly
          realtor middlemen.
          <span className='block mt-3 text-lg opacity-90'>
            Access exclusive FSBO properties + save $41K+ with our revolutionary
            0.9% commission structure.
          </span>
        </p>

        {/* FSBO Highlight Box */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-10 max-w-4xl mx-auto border border-white/20'>
          <div className='flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left'>
            <div className='flex-1'>
              <h3 className='text-2xl font-bold text-white mb-2'>
                Direct FSBO Access
              </h3>
              <p className='text-blue-100 leading-relaxed'>
                Traditional realtors hide "For Sale By Owner" properties to
                protect their commissions. We give you access to these exclusive
                listings that others won't show you.
              </p>
            </div>
            <div className='flex-shrink-0'>
              <div className='bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg'>
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

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-center'>
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
            <span className='text-blue-100 font-medium'>
              0.9% seller commission
            </span>
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
            <span className='text-blue-100 font-medium'>Zero buyer fees</span>
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
            <span className='text-blue-100 font-medium'>
              Exclusive FSBO access
            </span>
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
            <span className='text-blue-100 font-medium'>
              Full-service support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
