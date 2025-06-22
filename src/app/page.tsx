/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code, DollarSign, HouseIcon, LucidePersonStanding, Paperclip, Rocket, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import Hero from '@/components/Hero'; // Adjust the import path as necessary

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      <Hero/>
      {/* Features Section */}
      <motion.section
        className="w-full py-12 sm:py-16 md:py-24 bg-[var(--card)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container px-4 sm:px-6 max-w-full">
          <motion.div
            className="flex flex-col items-center justify-center space-y-6 text-center"
            {...fadeIn}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter font-poppins text-[var(--foreground)]">
              Why use Property Marketplace?
            </h2>
            <p className="mx-auto max-w-[600px] text-[var(--muted-foreground)] text-base sm:text-lg px-4">
              Buy or sell properties with only 1% commission.
            </p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 px-4">
            {[
              {
                icon: DollarSign,
                title: 'Sell your property',
                description:
                  'List your property with ease and reach a wide audience of potential buyers.',
              },
              {
                icon: HouseIcon,
                title: 'Shop and Buy',
                description:
                  'Find your dream home or sell your property with confidence.',
              },
              {
                icon: LucidePersonStanding,
                title: 'Skip the realtor',
                description:
                  'Save on commissions and fees by using our platform to connect directly with buyers and sellers.',
              },
              {
                icon: Paperclip,
                title: 'Let us handle the hard work',
                description:
                  'We take care of the paperwork and legalities, so you can focus on what matters most.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center space-y-4 rounded-xl bg-[var(--background)] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[var(--border)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] p-3 shadow-md">
                  <feature.icon className="h-6 w-6 text-[var(--accent-foreground)]" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] pt-8">
                  {feature.title}
                </h3>
                <p className="text-center text-[var(--muted-foreground)] text-sm sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="w-full py-12 sm:py-16 md:py-24 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container px-4 sm:px-6 max-w-full">
          <motion.div
            className="flex flex-col items-center space-y-6 text-center"
            {...fadeIn}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter font-poppins">
              Start Building Today
            </h2>
            <p className="mx-auto max-w-[600px] text-[var(--primary-foreground)]/[0.9] text-base sm:text-lg px-4">
              Clone the repository and launch your next project with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4">
              <pre className="bg-[var(--card)]/[0.95] px-4 py-3 rounded-xl font-mono text-xs sm:text-sm text-[var(--foreground)] shadow-inner w-full overflow-x-auto max-w-full">
                <code>
                  git clone
                  https://github.com/AnwarHossainSR/nextjs-15-template.git
                </code>
              </pre>
            </div>
            <Link
              href="/docs"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--accent-foreground)] shadow-lg hover:bg-[var(--accent)]/[0.9] transition-all duration-300 hover:scale-105 w-full sm:w-auto mx-4"
            >
              Explore Documentation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
