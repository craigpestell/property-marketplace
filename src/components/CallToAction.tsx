import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className='bg-blue-900 text-white py-16'>
      <div className='layout text-center'>
        <h2 className='text-3xl font-bold mb-4'>
          Ready to Save $41K+ on Your Next Property?
        </h2>
        <p className='text-lg text-blue-100 mb-8 max-w-2xl mx-auto'>
          Join thousands of satisfied customers who saved money with our 0.9%
          seller commission and received exceptional full-service support.
          Buyers pay zero commission, creating faster sales for sellers and more
          purchasing power for buyers. Access all properties including "for sale
          by owner" listings.
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
            Start Saving Today
          </Link>
        </div>

        <div className='mt-12 text-sm text-blue-200'>
          <p>
            ✓ 0.9% seller commission only • ✓ Full-service support • ✓ Access
            all properties
          </p>
        </div>
      </div>
    </section>
  );
}
