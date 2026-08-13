import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import SplitText from '../common/SplitText';

export const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Dynamic Cursor Light */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-screen"
        animate={{
          background: `radial-gradient(1200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 179, 0, 0.15), transparent 40%)`,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
      />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <motion.div style={{ y: y1, opacity }} className="relative z-10 flex flex-col items-center px-4 text-center mt-[-10dvh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block px-4 py-1.5 mb-8 text-xs font-bold tracking-[0.2em] uppercase rounded-full border border-brand-accent/30 bg-brand-accent/5 text-brand-accent backdrop-blur-md"
        >
          Welcome to the Future of Protection
        </motion.div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-[900] tracking-tighter leading-[0.9] mix-blend-difference">
          <SplitText text="SK SMART" delay={0} duration={0.8} />
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-accent to-white">
            <SplitText text="INVESTMENTS" delay={200} duration={0.8} />
          </span>
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 text-lg sm:text-xl text-neutral-400 font-medium max-w-2xl"
        >
          Securing wealth and empowering futures with actuarial precision and absolute transparency.
        </motion.p>
      </motion.div>

      {/* Floating 3D Cards */}
      <motion.div style={{ y: y2 }} className="absolute right-[10%] top-[20%] hidden lg:block z-0 opacity-50 blur-[2px] rotate-12">
        <div className="w-64 h-80 rounded-[32px] border border-white/10 bg-neutral-900/40 backdrop-blur-3xl shadow-2xl p-6 flex flex-col justify-between">
          <div className="w-12 h-12 rounded-full bg-brand-accent/20" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-white/20 rounded" />
            <div className="h-4 w-1/2 bg-white/10 rounded" />
          </div>
        </div>
      </motion.div>

      <motion.div style={{ y: y1 }} className="absolute left-[10%] bottom-[30%] hidden lg:block z-0 opacity-40 blur-[4px] -rotate-12 scale-75">
        <div className="w-64 h-80 rounded-[32px] border border-white/10 bg-neutral-900/40 backdrop-blur-3xl shadow-2xl p-6 flex flex-col justify-between">
          <div className="w-12 h-12 rounded-full bg-white/20" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-white/20 rounded" />
            <div className="h-4 w-2/3 bg-white/10 rounded" />
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-500">Discover</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-brand-accent"
        >
          <FaArrowDown size={12} />
        </motion.div>
      </motion.div>
    </section>
  );
};