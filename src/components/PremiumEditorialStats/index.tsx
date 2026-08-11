import React, { useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';

const formatValue = (latest: number, original: string) => {
  if (original === '98.7%') return latest.toFixed(1) + '%';
  if (original === '₹420L+') return '₹' + Math.round(latest) + 'L+';
  if (original === '150,000+') return Math.round(latest).toLocaleString('en-US') + '+';
  if (original === '4.9 / 5') return latest.toFixed(1) + ' / 5';
  return Math.round(latest).toString();
};

const parseValue = (original: string) => {
  if (original === '98.7%') return 98.7;
  if (original === '₹420L+') return 420;
  if (original === '150,000+') return 150000;
  if (original === '4.9 / 5') return 4.9;
  return 0;
};

const AnimatedNumber = ({ targetString, delay, start }: { targetString: string, delay: number, start: boolean }) => {
  const targetNum = parseValue(targetString);
  const nodeRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (start && nodeRef.current) {
      const controls = animate(0, targetNum, {
        duration: 2,
        delay: delay,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (nodeRef.current) {
            nodeRef.current.textContent = formatValue(latest, targetString);
          }
        }
      });
      return () => controls.stop();
    }
  }, [start, targetNum, targetString, delay]);

  return <span ref={nodeRef}>{formatValue(0, targetString)}</span>;
};

interface Stat {
  number: string;
  label: string;
  icon?: any;
  size?: string;
}

export const PremiumEditorialStats = ({ stats: propStats }: { stats?: Stat[] }) => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const defaultStats = [
    { number: '98.7%', label: t('claims_rate') || 'Claims Settlement Rate' },
    { number: '₹420L+', label: t('claims_disbursed') || 'Claims Disbursed' },
    { number: '150,000+', label: t('lives_secured') || 'Lives Secured' },
    { number: '4.9 / 5', label: t('customer_rating') || 'Customer Rating' }
  ];
  
  const stats = propStats || defaultStats;

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 bg-transparent overflow-hidden">
      
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="w-8 h-[1px] bg-brand-accent hidden sm:block"></span>
          <span className="text-[11px] font-bold text-brand-accent tracking-[0.2em] uppercase">
            // OUR TRACK RECORD
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]"
        >
          A Legacy Measured in Trust
        </motion.h2>
      </div>

      {/* Grid Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-full relative"
      >
        {/* Horizontal Dividers */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-[1px] bg-white/10 origin-left z-10" 
        />
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
          className="absolute top-1/2 left-0 w-full h-[1px] hidden md:block bg-white/10 origin-right z-10 -translate-y-1/2" 
        />
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 origin-left z-10" 
        />
        
        {/* Vertical Divider */}
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 w-[1px] h-full hidden md:block bg-white/10 origin-top z-10 -translate-x-1/2" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 relative z-0">
          {stats.map((stat, idx) => {
            const isTop = idx < 2;
            const isLeft = idx % 2 === 0;

            return (
              <div 
                key={idx}
                className={`
                  flex flex-col justify-start
                  py-8 sm:py-10 md:py-12
                  ${isLeft ? 'md:pr-12 md:pl-6' : 'md:pl-12 md:pr-6'}
                  ${isTop ? 'border-b md:border-none border-white/10' : ''}
                  items-start
                `}
              >
                <div className="flex flex-col">
                  {/* Subtle index number */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + (idx * 0.1) }}
                    className="text-[10px] font-bold text-neutral-500 mb-4 tracking-widest"
                  >
                    0{idx + 1}
                  </motion.div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    {/* Minimal Yellow Accent */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={isInView ? { height: '24px' } : { height: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + (idx * 0.1) }}
                      className="w-[2px] bg-brand-accent hidden sm:block" 
                    />
                    
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1]">
                      <AnimatedNumber targetString={stat.number} delay={0.3 + (idx * 0.1)} start={isInView} />
                    </div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.8, delay: 0.8 + (idx * 0.1) }}
                    className="text-[13px] sm:text-[14px] font-bold text-neutral-400 uppercase tracking-[0.1em] mt-2 sm:ml-5"
                  >
                    {stat.label.replace(/_/g, ' ')}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};