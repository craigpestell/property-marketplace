import {
  CreditCardIcon,
  HomeIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Find Your Perfect Home',
    description:
      'Browse through thousands of verified properties from trusted sellers and real estate agents.',
    icon: HomeIcon,
  },
  {
    name: 'Prime Locations',
    description:
      'Discover properties in the best neighborhoods and up-and-coming areas across the city.',
    icon: MapPinIcon,
  },
  {
    name: 'Transparent Pricing',
    description:
      'No hidden fees or surprise costs. See all pricing details upfront before making any decisions.',
    icon: CreditCardIcon,
  },
  {
    name: 'Secure Transactions',
    description:
      'All transactions are protected with bank-level security and verified documentation.',
    icon: ShieldCheckIcon,
  },
];

export default function Features() {
  return (
    <section className='py-16 bg-white'>
      <div className='layout'>
        <div className='max-w-2xl mx-auto text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Why Choose Our Platform?
          </h2>
          <p className='text-lg text-gray-600'>
            We make finding and buying your dream property simple, secure, and
            stress-free.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature) => (
            <div key={feature.name} className='text-center'>
              <div className='flex justify-center mb-4'>
                <div className='flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600'>
                  <feature.icon className='h-8 w-8' aria-hidden='true' />
                </div>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                {feature.name}
              </h3>
              <p className='text-gray-600'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
