import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const EditorialTrustValues = ({ values }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Card 01: Starts centered. Holds. Then slides Left.
  const card1X = useTransform(scrollYProgress, [0, 0.2, 0.35, 1], ["0%", "0%", "-120%", "-120%"]);
  const card1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.35, 1], [1, 1, 0, 0]);

  // Card 02: Starts Right. Slides Center. Holds. Slides Left.
  const card2X = useTransform(scrollYProgress, [0, 0.2, 0.35, 0.55, 0.7, 1], ["120%", "120%", "0%", "0%", "-120%", "-120%"]);
  const card2Opacity = useTransform(scrollYProgress, [0, 0.2, 0.35, 0.55, 0.7, 1], [0, 0, 1, 1, 0, 0]);

  // Card 03: Starts Right. Slides Center. Holds.
  const card3X = useTransform(scrollYProgress, [0, 0.55, 0.7, 1], ["120%", "120%", "0%", "0%"]);
  const card3Opacity = useTransform(scrollYProgress, [0, 0.55, 0.7, 1], [0, 0, 1, 1]);

  const getCardStyle = (index) => {
    if (index === 0) return { x: card1X, opacity: card1Opacity };
    if (index === 1) return { x: card2X, opacity: card2Opacity };
    if (index === 2) return { x: card3X, opacity: card3Opacity };
    return { x: "120%", opacity: 0 };
  };

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] bg-neutral-50 dark:bg-neutral-1000 transition-colors duration-300">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        
        {/* Section Header */}
        <div className="absolute top-24 lg:top-32 left-1/2 -translate-x-1/2 w-full max-w-[1400px] px-4 md:px-8 xl:px-16 text-left z-10 pointer-events-none flex flex-col items-start">
          <span className="text-[11px] font-extrabold text-neutral-500 dark:text-brand-accent tracking-[0.3em] uppercase mb-4 sm:mb-6">
            // Our Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] tracking-[-1px] text-black dark:text-white leading-tight uppercase">
            Why SK Smart is Chosen
          </h2>
        </div>

        {/* Feature Cards Story Stage */}
        <div className="relative w-full max-w-[1000px] h-[450px] sm:h-[500px] mx-auto px-4 sm:px-8 mt-16 sm:mt-24">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              style={{
                ...getCardStyle(idx),
                willChange: "transform, opacity"
              }}
              className="absolute inset-0 mx-4 sm:mx-8 flex flex-col justify-center items-center text-center p-8 sm:p-16 rounded-[40px] bg-gradient-to-br from-black/[0.05] to-transparent dark:from-white/[0.08] dark:to-white/[0.02] border border-black/10 dark:border-white/10 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
            >
              <div className="text-[100px] sm:text-[140px] font-[900] text-transparent bg-clip-text bg-gradient-to-b from-black/60 dark:from-white/10 to-black/10 dark:to-transparent leading-none absolute top-4 sm:top-8 left-6 sm:left-12 pointer-events-none tracking-tighter">
                0{idx + 1}
              </div>
              
              <div className="relative z-10 flex flex-col items-center max-w-[600px]">
                {val.icon && (
                  <div className="mb-6 sm:mb-8 p-4 rounded-full bg-neutral-200/50 dark:bg-brand-accent/10 border border-neutral-300 dark:border-brand-accent/20 text-black dark:text-brand-accent">
                    <val.icon className="text-3xl sm:text-4xl drop-shadow-none dark:drop-shadow-[0_0_15px_rgba(246,255,0,0.5)]" />
                  </div>
                )}
                <h3 className="text-[28px] sm:text-[42px] font-[800] text-black dark:text-white mb-4 sm:mb-6 tracking-tight leading-[1.15]">
                  {val.title}
                </h3>
                <p className="text-[16px] sm:text-[20px] text-neutral-600 dark:text-neutral-300 leading-[1.7] font-light tracking-wide">
                  {val.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};