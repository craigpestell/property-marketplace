import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='layout'>
        {/* Hero Section */}
        <section className='py-20 bg-white'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
              About Real Estate Marketplace
            </h1>
            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
              We're revolutionizing the way people buy, sell, and discover
              properties. Our platform connects buyers with sellers in a
              seamless, transparent, and efficient marketplace.
            </p>
            <div className='flex justify-center'>
              <Link
                href='/listings'
                className='bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold'
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className='py-16'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <h2 className='text-3xl font-bold text-gray-900 mb-6'>
                  Our Mission
                </h2>
                <p className='text-lg text-gray-600 mb-6'>
                  At Real Estate Marketplace, we believe that finding the
                  perfect property should be simple, transparent, and
                  stress-free. Our mission is to empower individuals and
                  families to make informed real estate decisions through
                  cutting-edge technology and exceptional service.
                </p>
                <p className='text-lg text-gray-600'>
                  We're committed to creating a platform that brings together
                  buyers, sellers, and real estate professionals in one
                  comprehensive ecosystem, making property transactions more
                  efficient and accessible for everyone.
                </p>
              </div>
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <div className='grid grid-cols-2 gap-6 text-center'>
                  <div>
                    <div className='text-3xl font-bold text-blue-600 mb-2'>
                      10K+
                    </div>
                    <div className='text-gray-600'>Properties Listed</div>
                  </div>
                  <div>
                    <div className='text-3xl font-bold text-blue-600 mb-2'>
                      5K+
                    </div>
                    <div className='text-gray-600'>Happy Customers</div>
                  </div>
                  <div>
                    <div className='text-3xl font-bold text-blue-600 mb-2'>
                      50+
                    </div>
                    <div className='text-gray-600'>Cities Covered</div>
                  </div>
                  <div>
                    <div className='text-3xl font-bold text-blue-600 mb-2'>
                      99%
                    </div>
                    <div className='text-gray-600'>Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className='py-16 bg-white'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Our Values
              </h2>
              <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                These core values guide everything we do and shape the way we
                serve our community.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='text-center'>
                <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  Transparency
                </h3>
                <p className='text-gray-600'>
                  We believe in complete transparency in all our dealings,
                  providing clear and accurate information to help you make
                  informed decisions.
                </p>
              </div>

              <div className='text-center'>
                <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  Innovation
                </h3>
                <p className='text-gray-600'>
                  We continuously innovate and improve our platform to provide
                  the best possible experience for our users through technology.
                </p>
              </div>

              <div className='text-center'>
                <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  Community
                </h3>
                <p className='text-gray-600'>
                  We're committed to building strong communities and helping
                  people find their perfect homes in neighborhoods they'll love.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className='py-16'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Meet Our Team
              </h2>
              <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                Our dedicated team of professionals is committed to providing
                you with the best real estate experience.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='text-center bg-white rounded-lg shadow-lg p-6'>
                <div className='w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-white'>CP</span>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  Craig Pestell
                </h3>
                <p className='text-blue-600 mb-3'>Founder & CEO</p>
                <p className='text-gray-600'>
                  Passionate about technology and real estate, Craig founded
                  Real Estate Marketplace to revolutionize how people find their
                  dream homes.
                </p>
              </div>

              <div className='text-center bg-white rounded-lg shadow-lg p-6'>
                <div className='w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-white'>MK</span>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  Michelle Kessler
                </h3>
                <p className='text-green-600 mb-3'>Head of Operations</p>
                <p className='text-gray-600'>
                  With over 10 years in real estate operations, Michelle ensures
                  our platform runs smoothly and efficiently for all users.
                </p>
              </div>

              <div className='text-center bg-white rounded-lg shadow-lg p-6'>
                <div className='w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-white'>DJ</span>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  David Johnson
                </h3>
                <p className='text-purple-600 mb-3'>Lead Developer</p>
                <p className='text-gray-600'>
                  David leads our technical team, building innovative features
                  that make property searching and listing a breeze.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className='py-16 bg-blue-600'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-white mb-4'>
              Ready to Get Started?
            </h2>
            <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
              Join thousands of satisfied customers who have found their perfect
              properties through our platform.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/listings'
                className='bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold'
              >
                Browse Properties
              </Link>
              <Link
                href='/signup'
                className='bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold border-2 border-blue-700'
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className='py-16 bg-white'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Get in Touch
              </h2>
              <p className='text-lg text-gray-600'>
                Have questions? We'd love to hear from you.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='text-center'>
                <div className='bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-6 h-6 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Email
                </h3>
                <p className='text-gray-600'>hello@propertymarketplace.com</p>
              </div>

              <div className='text-center'>
                <div className='bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-6 h-6 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Phone
                </h3>
                <p className='text-gray-600'>+1 (555) 123-4567</p>
              </div>

              <div className='text-center'>
                <div className='bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-6 h-6 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Office
                </h3>
                <p className='text-gray-600'>
                  123 Property Street
                  <br />
                  Real Estate City, RE 12345
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
