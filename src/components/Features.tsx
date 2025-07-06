import {
  CurrencyDollarIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: '0.9% Seller Commission',
    description:
      'Sellers save $16,000+ (0.9% vs 2.5%) and buyers save $25,000+ (zero vs 2.5% commission) on a $1M property. Combined savings of $41,000+.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'For Sale By Owner',
    description:
      'Access all properties including "for sale by owner" listings that traditional realtors won\'t show.',
    icon: HomeIcon,
  },
  {
    name: 'Complete Support',
    description:
      'Professional contract management, paperwork processing, and closing support from start to finish.',
    icon: UserGroupIcon,
  },
  {
    name: 'Transparent Process',
    description:
      'No hidden fees or surprise costs. All pricing and services clearly outlined upfront.',
    icon: ShieldCheckIcon,
  },
];

export default function Features() {
  return (
    <section className='py-16 bg-white dark:bg-gray-900'>
      <div className='layout'>
        <div className='max-w-2xl mx-auto text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            Why Choose Real Estate Marketplace?
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Save thousands with our revolutionary 0.9% commission and get access
            to all properties with full-service support.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature) => (
            <div key={feature.name} className='text-center'>
              <div className='flex justify-center mb-4'>
                <div className='flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'>
                  <feature.icon className='h-8 w-8' aria-hidden='true' />
                </div>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                {feature.name}
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
