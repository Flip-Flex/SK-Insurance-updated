import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const rotations = React.useMemo(() => 
    testimonials.map(() => Math.floor(Math.random() * 21) - 10),
  [testimonials]);
  
  return (
    <div className="max-w-sm md:max-w-5xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-20">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <div className="relative h-96 w-full">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: rotations[index],
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : rotations[index],
                  zIndex: isActive(index)
                    ? 999
                    : testimonials.length + 2 - index,
                  y: isActive(index) ? [0, -80, 0] : 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 origin-bottom"
              >
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-[center_12%] shadow-2xl border border-white/10 transition-all duration-700"
                />
              </motion.div>
            ))}
          </div>
          {/* Mobile Navigation Buttons */}
          <div className="flex md:hidden gap-4 mt-8 justify-center">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center group/button border border-white/10 hover:border-brand-accent transition-colors"
            >
              <FiArrowLeft className="h-5 w-5 text-white group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center group/button border border-white/10 hover:border-brand-accent transition-colors"
            >
              <FiArrowRight className="h-5 w-5 text-white group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
        <div className="flex justify-between flex-col py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <h3 className="text-4xl font-[900] text-white uppercase tracking-tight">
                {testimonials[active].name}
              </h3>
              <p className="text-sm font-extrabold text-brand-accent uppercase tracking-[0.3em] mt-2">
                {testimonials[active].designation}
              </p>
              <motion.p className="text-lg text-neutral-300 leading-relaxed mt-8">
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
              
              {testimonials[active].content && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mt-8"
                >
                  {testimonials[active].content}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center group/button border border-white/10 hover:border-brand-accent transition-colors"
            >
              <FiArrowLeft className="h-5 w-5 text-white group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center group/button border border-white/10 hover:border-brand-accent transition-colors"
            >
              <FiArrowRight className="h-5 w-5 text-white group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
