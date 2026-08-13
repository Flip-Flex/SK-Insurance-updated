import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const defaultTestimonials = [
  {
    testimonial: "My favorite solution in the market. We work 5x faster with COMPANY.",
    by: "Alex, CEO at TechCorp",
    imgSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    testimonial: "I'm confident my data is safe with COMPANY. I can't say that about other providers.",
    by: "Dan, CTO at SecureNet",
    imgSrc: "https://i.pravatar.cc/150?img=2"
  },
  {
    testimonial: "I know it's cliche, but we were lost before we found COMPANY. Can't thank you guys enough!",
    by: "Stephanie, COO at InnovateCo",
    imgSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    testimonial: "COMPANY's products make planning for the future seamless. Can't recommend them enough!",
    by: "Marie, CFO at FuturePlanning",
    imgSrc: "https://i.pravatar.cc/150?img=4"
  },
  {
    testimonial: "If I could give 11 stars, I'd give 12.",
    by: "Andre, Head of Design at CreativeSolutions",
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    testimonial: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! I'd bet you've saved me 100 hours so far.",
    by: "Jeremy, Product Manager at TimeWise",
    imgSrc: "https://i.pravatar.cc/150?img=6"
  },
  {
    testimonial: "Took some convincing, but now that we're on COMPANY, we're never going back.",
    by: "Pam, Marketing Director at BrandBuilders",
    imgSrc: "https://i.pravatar.cc/150?img=7"
  },
  {
    testimonial: "I would be lost without COMPANY's in-depth analytics. The ROI is EASILY 100X for us.",
    by: "Daniel, Data Scientist at AnalyticsPro",
    imgSrc: "https://i.pravatar.cc/150?img=8"
  },
  {
    testimonial: "It's just the best. Period.",
    by: "Fernando, UX Designer at UserFirst",
    imgSrc: "https://i.pravatar.cc/150?img=9"
  }
];

export const StaggerTestimonials = ({ testimonials = defaultTestimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="py-16 md:py-24 bg-white dark:bg-neutral-1000 transition-colors duration-300 overflow-hidden">

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-12 md:mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-6 tracking-tight">
          What Our <span className="text-brand-accent">Clients Say</span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
          Hear from the people who have experienced our services first-hand.
        </p>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full flex overflow-hidden group">
        {/* Gradients for smooth fade in/out on edges */}
        <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-neutral-1000 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-neutral-1000 to-transparent z-10 pointer-events-none" />
        
        <motion.div 
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {/* First Set */}
          <div className="flex gap-6 pr-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={`first-${index}`} 
                className="shrink-0 w-[280px] sm:w-[340px] p-6 lg:p-8 bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/10 flex flex-col justify-between hover:border-brand-accent/30 dark:hover:border-brand-accent/50 transition-colors duration-300 shadow-sm cursor-pointer"
              >
                <div>
                  <FaQuoteLeft className="text-brand-accent text-xl mb-4 opacity-80" />
                  <p className="text-black dark:text-white text-sm sm:text-base font-medium leading-relaxed mb-6">
                    "{testimonial.testimonial}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {testimonial.imgSrc && (
                    <img
                      src={testimonial.imgSrc}
                      alt={testimonial.by}
                      className="w-10 h-10 rounded-full object-cover border border-black/10 dark:border-white/10"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-black dark:text-white leading-tight">
                      {testimonial.by.split(',')[0]}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                      {testimonial.by.split(',').slice(1).join(',').trim()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Set (Duplicate for smooth looping) */}
          <div className="flex gap-6 pr-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={`second-${index}`} 
                className="shrink-0 w-[280px] sm:w-[340px] p-6 lg:p-8 bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/10 flex flex-col justify-between hover:border-brand-accent/30 dark:hover:border-brand-accent/50 transition-colors duration-300 shadow-sm cursor-pointer"
              >
                <div>
                  <FaQuoteLeft className="text-brand-accent text-xl mb-4 opacity-80" />
                  <p className="text-black dark:text-white text-sm sm:text-base font-medium leading-relaxed mb-6">
                    "{testimonial.testimonial}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {testimonial.imgSrc && (
                    <img
                      src={testimonial.imgSrc}
                      alt={testimonial.by}
                      className="w-10 h-10 rounded-full object-cover border border-black/10 dark:border-white/10"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-black dark:text-white leading-tight">
                      {testimonial.by.split(',')[0]}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                      {testimonial.by.split(',').slice(1).join(',').trim()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
