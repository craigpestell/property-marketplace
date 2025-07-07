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
    <section className='py-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
      <div className='layout'>
        <div className='max-w-3xl mx-auto text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
            Why Choose Our Platform?
          </h2>
          <div className='w-24 h-px bg-blue-500 dark:bg-blue-400 mx-auto mb-8'></div>
          <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
            Traditional service quality with a modern commission structure. Get
            full support while keeping more money in your pocket.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature) => (
            <div
              key={feature.name}
              className='bg-white dark:bg-gray-800 p-6 rounded border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300'
            >
              <div className='flex justify-center mb-5'>
                <div className='flex items-center justify-center h-14 w-14 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'>
                  <feature.icon className='h-7 w-7' aria-hidden='true' />
                </div>
              </div>

              <h3 className='text-lg font-semibold text-gray-900 dark:text-white text-center mb-3'>
                {feature.name}
              </h3>

              <p className='text-gray-600 dark:text-gray-400 text-sm text-center mb-4 leading-relaxed'>
                {feature.description}
              </p>

              <div className='flex justify-center'>
                <div className='text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full inline-block border border-blue-100 dark:border-blue-800/50'>
                  {feature.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
