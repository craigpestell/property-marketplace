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
      'Save $16,000+ on seller fees. Compared to traditional 2.5% commissions, you keep more money in your pocket.',
    highlight: 'vs. 2.5% traditional',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Zero Buyer Fees',
    description:
      'Buyers pay absolutely nothing. Save $25,000+ compared to traditional buyer agent fees.',
    highlight: 'vs. 2.5% traditional',
    icon: HomeIcon,
  },
  {
    name: 'FSBO Access',
    description:
      'Exclusive access to "For Sale By Owner" properties that traditional agents won\'t show you.',
    highlight: 'Hidden listings revealed',
    icon: UserGroupIcon,
  },
  {
    name: 'Full-Service Support',
    description:
      'Professional contracts, paperwork, inspections, and closing support from start to finish.',
    highlight: 'White-glove service',
    icon: ShieldCheckIcon,
  },
];

export default function Features() {
  return (
    <section className='py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
      <div className='layout'>
        <div className='max-w-3xl mx-auto text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
            Why Choose Our Platform?
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-400 leading-relaxed'>
            Revolutionary commission structure with complete service support.
            Save money without sacrificing quality.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature) => (
            <div
              key={feature.name}
              className='group text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700'
            >
              <div className='flex justify-center mb-6'>
                <div className='flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300'>
                  <feature.icon className='h-10 w-10' aria-hidden='true' />
                </div>
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                {feature.name}
              </h3>
              <div className='text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full inline-block'>
                {feature.highlight}
              </div>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
