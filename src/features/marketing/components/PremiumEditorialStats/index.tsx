import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const Counter = ({ from, to, suffix = "", duration = 2 }: { from: number, to: number, suffix?: string, duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start: number | undefined;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      if (ref.current) ref.current.textContent = Math.floor(from + (to - from) * p) + suffix;
      if (p < 1) raf = requestAnimationFrame(step);
      else if (ref.current) ref.current.textContent = to + suffix;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, from, to, suffix, duration]);

  return <span ref={ref}>{from}{suffix}</span>;
};

interface Stat {
  number: string;
  label: string;
  icon?: any;
  size?: string;
}

export const PremiumEditorialStats = ({ stats: propStats }: { stats?: Stat[] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-4 pb-8 lg:pt-8 lg:pb-8 bg-transparent overflow-hidden">
      
      {/* Header Section */}
      <div className="w-full max-w-4xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <span className="w-8 h-[1px] bg-brand-accent hidden sm:block"></span>
          <span className="text-[12px] font-bold text-neutral-500 dark:text-brand-accent tracking-[0.25em] uppercase">
            OUR TRACK RECORD
          </span>
          <span className="w-8 h-[1px] bg-brand-accent hidden sm:block"></span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white leading-[1.1]"
        >
          A Legacy Measured <br className="hidden sm:block" /> in Trust
        </motion.h2>
      </div>

      {/* Refined Stats Strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-12 sm:gap-0 py-10 border-y border-black/10 dark:border-white/10 mt-12"
      >
        {[
          { n: 22, s: '+', l: 'Years of Trust' },
          { n: 5000, s: '+', l: 'Families Protected' },
          { n: 150, s: 'Cr+', l: 'AUM Managed' },
        ].map((s, i) => (
          <div key={i} className={`flex flex-col items-center text-center flex-1 w-full ${i !== 2 ? 'sm:border-r border-black/10 dark:border-white/10' : ''}`}>
            <div className="text-4xl sm:text-5xl font-black text-black dark:text-white tabular-nums tracking-tight mb-2">
              <Counter from={0} to={s.n} suffix={s.s} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};