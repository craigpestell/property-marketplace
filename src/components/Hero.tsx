import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Rocket, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

function Hero(){
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
    <motion.section
        className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-[var(--background)] relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/[0.1] to-[var(--accent)]/[0.1] pointer-events-none" />
        <div className="container px-4 sm:px-6 relative z-10 max-w-full">
            <motion.div
                className="flex flex-col items-center space-y-6 text-center"
                {...fadeIn}
            >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-poppins bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                    Welcome to Property Marketplace
                </h1>
                <p className="mx-auto max-w-[600px] text-[var(--muted-foreground)] text-base sm:text-lg px-4">
                    Find your dream property today!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4">
                    <Link
                        href="/posts"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--primary-foreground)] shadow-lg hover:bg-[var(--primary)]/[0.9] transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                    >
                        View listings
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        href="/sign-in"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--primary-foreground)] shadow-lg hover:bg-[var(--primary)]/[0.9] transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                    >
                        Post your property
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </motion.div>
        </div>
    </motion.section>
);
}

export default Hero;