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
              properties. Save thousands with our 0.9% seller commission and
              zero buyer commission vs. traditional 5% total commission while
              receiving full-service support from search to closing.
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
                  affordable. Traditional real estate transactions involve 5%
                  total commission (2.5% for buyer's agent, 2.5% for seller's
                  agent), while we charge only 0.9% commission to sellers and
                  zero commission to buyers, saving both parties thousands of
                  dollars on your property transactions.
                </p>
                <p className='text-lg text-gray-600 mb-6'>
                  We provide comprehensive services to facilitate the entire
                  purchasing process - from contracts and paperwork to closing
                  support. Our platform brings together buyers, sellers, and
                  real estate professionals in one ecosystem, making property
                  transactions more efficient, accessible, and cost-effective
                  for everyone.
                </p>
                <p className='text-lg text-gray-600'>
                  <strong>Why sellers choose us:</strong> Properties sell faster
                  because buyers are attracted to our commission-free
                  purchasing. A larger pool of motivated buyers means quicker
                  sales and better offers for sellers, even with our lower 0.9%
                  commission structure.
                </p>
              </div>
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <div className='grid grid-cols-2 gap-6 text-center'>
                  <div>
                    <div className='text-3xl font-bold text-blue-600 mb-2'>
                      0.9%
                    </div>
                    <div className='text-gray-600'>Seller Commission</div>
                  </div>
                  <div>
                    <div className='text-3xl font-bold text-blue-600 mb-2'>
                      $41K+
                    </div>
                    <div className='text-gray-600'>Combined Savings</div>
                  </div>
                  <div>
                    <div className='text-3xl font-bold text-blue-600 mb-2'>
                      5K+
                    </div>
                    <div className='text-gray-600'>Happy Customers</div>
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

        {/* Why Choose Us Section */}
        <section className='py-16 bg-blue-50'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                The Win-Win Advantage
              </h2>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                Our unique commission structure creates a marketplace where
                everyone wins: buyers pay no commission, sellers save thousands,
                and properties sell faster.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <div className='text-center mb-6'>
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
                        d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                      />
                    </svg>
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                    For Buyers
                  </h3>
                </div>
                <ul className='space-y-3 text-gray-600'>
                  <li className='flex items-start space-x-3'>
                    <svg
                      className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
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
                    <span>
                      <strong>Zero commission fees</strong> - Save $25,000 on a
                      $1M purchase vs. traditional 2.5% buyer commission
                    </span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <svg
                      className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
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
                    <span>
                      <strong>Access to all properties</strong> including FSBO
                      listings
                    </span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <svg
                      className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
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
                    <span>
                      <strong>Full transaction support</strong> without the
                      commission burden
                    </span>
                  </li>
                </ul>
              </div>

              <div className='bg-white rounded-lg shadow-lg p-8'>
                <div className='text-center mb-6'>
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
                        d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                      />
                    </svg>
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                    For Sellers
                  </h3>
                </div>
                <ul className='space-y-3 text-gray-600'>
                  <li className='flex items-start space-x-3'>
                    <svg
                      className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0'
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
                    <span>
                      <strong>Save $16,000+</strong> on a $1M home vs.
                      traditional 2.5% seller commission
                    </span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <svg
                      className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0'
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
                    <span>
                      <strong>Faster sales</strong> due to larger pool of
                      motivated buyers
                    </span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <svg
                      className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0'
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
                    <span>
                      <strong>More competitive offers</strong> from buyers with
                      extra purchasing power
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-lg p-8'>
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                  The Marketplace Effect
                </h3>
                <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                  When buyers don't pay commission, they have more purchasing
                  power and are more active in the market. This creates a
                  larger, more motivated buyer pool that benefits sellers
                  through faster sales and better offers, even with our reduced
                  0.9% seller commission.
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
                <div className='p-4'>
                  <div className='text-3xl font-bold text-green-600 mb-2'>
                    3x
                  </div>
                  <div className='text-sm text-gray-600'>
                    More active buyers
                  </div>
                </div>
                <div className='p-4'>
                  <div className='text-3xl font-bold text-blue-600 mb-2'>
                    45%
                  </div>
                  <div className='text-sm text-gray-600'>
                    Faster average sale time
                  </div>
                </div>
                <div className='p-4'>
                  <div className='text-3xl font-bold text-purple-600 mb-2'>
                    12%
                  </div>
                  <div className='text-sm text-gray-600'>
                    Higher average offers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commission Comparison Section */}
        <section className='py-16 bg-white'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Commission Comparison
              </h2>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                We're disrupting the traditional real estate industry with
                transparent pricing, comprehensive services, and fair access to
                all properties.
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <div className='bg-white rounded-lg shadow-lg p-8'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                    Commission Comparison
                  </h3>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 bg-red-50 rounded-lg'>
                      <div>
                        <span className='text-lg font-semibold text-gray-900'>
                          Traditional Realtors
                        </span>
                        <p className='text-sm text-gray-600'>
                          Total commission (2.5% buyer + 2.5% seller)
                        </p>
                      </div>
                      <div className='text-3xl font-bold text-red-600'>5%</div>
                    </div>
                    <div className='flex items-center justify-between p-4 bg-green-50 rounded-lg'>
                      <div>
                        <span className='text-lg font-semibold text-gray-900'>
                          Real Estate Marketplace
                        </span>
                        <p className='text-sm text-gray-600'>
                          No buyer commission, 0.9% seller commission
                        </p>
                      </div>
                      <div className='text-3xl font-bold text-green-600'>
                        0.9%
                      </div>
                    </div>
                  </div>
                  <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                    <p className='text-sm text-gray-700'>
                      <strong>Combined savings:</strong> On a $1M property,
                      buyers save $25,000 (no 2.5% commission) and sellers save
                      $16,000 (0.9% vs 2.5%), for total savings of $41,000.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                  Complete Transaction Support
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-start space-x-3'>
                    <div className='bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                      <svg
                        className='w-4 h-4 text-blue-600'
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
                    <div>
                      <h4 className='text-lg font-semibold text-gray-900'>
                        Contract Management
                      </h4>
                      <p className='text-gray-600'>
                        Professional contract preparation and review services
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3'>
                    <div className='bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                      <svg
                        className='w-4 h-4 text-blue-600'
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
                    <div>
                      <h4 className='text-lg font-semibold text-gray-900'>
                        Paperwork Processing
                      </h4>
                      <p className='text-gray-600'>
                        Handle all necessary documentation and legal paperwork
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3'>
                    <div className='bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                      <svg
                        className='w-4 h-4 text-blue-600'
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
                    <div>
                      <h4 className='text-lg font-semibold text-gray-900'>
                        Closing Support
                      </h4>
                      <p className='text-gray-600'>
                        Comprehensive support throughout the closing process
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3'>
                    <div className='bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                      <svg
                        className='w-4 h-4 text-blue-600'
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
                    <div>
                      <h4 className='text-lg font-semibold text-gray-900'>
                        For Sale By Owner Support
                      </h4>
                      <p className='text-gray-600'>
                        List and discover "for sale by owner" properties that
                        traditional realtors often won't show because they're
                        not listed through the real estate board
                      </p>
                    </div>
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
              Ready to Save Thousands?
            </h2>
            <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
              Join thousands of satisfied customers who have saved money and
              received exceptional service with our 0.9% commission and
              full-service support.
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
