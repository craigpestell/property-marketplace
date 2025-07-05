import Link from 'next/link';

export default function PropertyNotFound() {
  return (
    <main className='bg-gray-50 min-h-screen'>
      <div className='layout py-20'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Property Not Found
          </h1>
          <p className='text-lg text-gray-600 mb-8'>
            The property with this ID doesn't exist or has been removed.
          </p>
          <div className='space-y-4'>
            <Link
              href='/'
              className='inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium'
            >
              Browse All Properties
            </Link>
            <p className='text-sm text-gray-500'>
              Make sure you have the correct Property ID (format:
              PROP-XXXXX-XXXXX)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
