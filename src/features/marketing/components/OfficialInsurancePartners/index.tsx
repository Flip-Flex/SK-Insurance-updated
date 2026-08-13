import React from 'react';
import { motion } from 'framer-motion';

export const OfficialInsurancePartners = ({ partners = [] }) => {
  // Duplicate the array to create a seamless infinite scrolling loop
  const logos = [...partners, ...partners];

  return (
    <section className="py-24 sm:py-32 overflow-hidden border-t border-white/5 bg-neutral-1000 relative z-10">
      <div className="container flex flex-col items-start text-left max-w-[1400px] mx-auto px-4 md:px-8 xl:px-16">
        <span className="mb-[16px] text-[11px] font-extrabold text-brand-accent tracking-[0.3em] uppercase">
          // OUR NETWORK
        </span>
        <h2 className="mb-12 sm:mb-16 text-3xl sm:text-4xl md:text-5xl font-[900] tracking-[-1px] text-white leading-tight uppercase">
          Official Insurance Partners
        </h2>
      </div>
      
      <div className="relative w-full flex items-center justify-center overflow-hidden">
        <motion.div
          className="flex flex-nowrap items-center w-max gap-12 sm:gap-16 md:gap-24 pl-12 sm:pl-16 md:pl-24"
        <motion.div
          className="flex flex-nowrap items-center w-max gap-12 sm:gap-16 md:gap-24 pr-12 sm:pr-16 md:pr-24"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 40,
          }}
            <div 
              key={`${partner.name}-${index}`} 
              className="flex shrink-0 items-center justify-center group"
            >
              <div className="bg-white px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center min-w-[140px] h-[80px]">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 sm:h-12 w-auto max-w-[160px] object-contain"
                  onError={(e) => {
                    if(partner.onlineLogo && !e.currentTarget.src.includes(partner.onlineLogo)) {
                      e.currentTarget.src = partner.onlineLogo;
                    } else {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                      }
                    }
                  }}
                />
                <span className="hidden text-neutral-800 font-bold text-center text-xs sm:text-sm px-2 leading-tight">
                  {partner.name}
                </span>
              </div>
            </div>
        
        {/* Gradient Overlays for smooth edges on the infinite marquee */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-neutral-1000 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-neutral-1000 to-transparent pointer-events-none z-10"></div>
      </div>
    </section>
  );
};
