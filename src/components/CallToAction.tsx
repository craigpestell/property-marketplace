import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className='bg-blue-900 text-white py-16'>
      <div className='layout text-center'>
        <h2 className='text-3xl font-bold mb-4'>
          Ready to Find Your Dream Home?
        </h2>
        <p className='text-lg text-blue-100 mb-8 max-w-2xl mx-auto'>
          Join thousands of satisfied customers who found their perfect property
          through our platform. Start your journey today and discover what makes
          us the #1 choice for property seekers.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <Link
            href='/listings'
            className='bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors text-lg'
          >
            Browse Properties
          </Link>
          <Link
            href='/signup'
            className='border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors text-lg'
          >
            Create Account
          </Link>
        </div>

        <div className='mt-12 text-sm text-blue-200'>
          <p>✓ No hidden fees • ✓ Verified listings • ✓ Expert support</p>
        </div>
      </div>
    </section>
  );
}
