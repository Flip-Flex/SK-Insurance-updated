import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const EditorialTrustValues = ({ values }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section ref={containerRef} className="relative w-full pt-8 pb-20 lg:pt-12 lg:pb-32 bg-transparent transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="w-8 h-[1px] bg-brand-accent hidden sm:block"></span>
            <span className="text-[12px] font-bold text-neutral-500 dark:text-brand-accent tracking-[0.25em] uppercase">
              OUR FOUNDATION
            </span>
            <span className="w-8 h-[1px] bg-brand-accent hidden sm:block"></span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white leading-[1.1]"
          >
            Why SK Smart is Chosen
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {values.map((val, idx) => {
            const colors = [
              { bg: 'from-blue-500/10 dark:from-blue-500/20', iconBg: 'bg-blue-50 dark:bg-blue-900/20', iconBorder: 'border-blue-200 dark:border-blue-500/30', iconColor: 'text-blue-600 dark:text-blue-400' },
              { bg: 'from-emerald-500/10 dark:from-emerald-500/20', iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', iconBorder: 'border-emerald-200 dark:border-emerald-500/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
              { bg: 'from-amber-500/10 dark:from-amber-500/20', iconBg: 'bg-amber-50 dark:bg-amber-900/20', iconBorder: 'border-amber-200 dark:border-amber-500/30', iconColor: 'text-amber-600 dark:text-amber-400' },
            ];
            const color = colors[idx % colors.length];

            return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group relative flex flex-col items-start p-10 lg:p-12 bg-white dark:bg-[#111] rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} to-transparent pointer-events-none`} />

              {/* Large faded background number */}
              <div className="absolute top-4 right-6 lg:top-6 lg:right-8 text-[90px] lg:text-[110px] font-black text-black/[0.03] dark:text-white/[0.03] pointer-events-none leading-none select-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-x-4 group-hover:translate-y-4">
                0{idx + 1}
              </div>

              {/* Icon */}
              {val.icon && (
                <div className={`relative mb-10 w-16 h-16 flex items-center justify-center rounded-2xl ${color.iconBg} border ${color.iconBorder} ${color.iconColor} shadow-sm transition-transform duration-500 group-hover:scale-110`}>
                  <val.icon className="text-2xl" />
                </div>
              )}

              {/* Content */}
              <h3 className="relative text-2xl lg:text-3xl font-black text-black dark:text-white mb-4 tracking-tight leading-[1.2]">
                {val.title}
              </h3>
              <p className="relative text-base lg:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                {val.description}
              </p>
            </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};