import React, { useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import SplitText from '../common/SplitText';
const formatValue = (latest: number, original: string) => {
  if (original === '98.7%') return latest.toFixed(1) + '%';
  if (original === '₹420M+') return '₹' + Math.round(latest) + 'M+';
  if (original === '150,000+') return Math.round(latest).toLocaleString('en-US') + '+';
  if (original === '4.9 / 5') return latest.toFixed(1) + ' / 5';
  return Math.round(latest).toString();
};

const parseValue = (original: string) => {
  if (original === '98.7%') return 98.7;
  if (original === '₹420M+') return 420;
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
        duration: 1.5,
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

export const PremiumEditorialStats = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const stats = [
    { number: '98.7%', label: t('claims_rate') || 'Claims Settlement Rate' },
    { number: '₹420M+', label: t('claims_disbursed') || 'Claims Disbursed' },
    { number: '150,000+', label: t('lives_secured') || 'Lives Secured' },
    { number: '4.9 / 5', label: t('customer_rating') || 'Customer Rating' }
  ];

  return (
    <section ref={sectionRef} className="w-full max-w-[1440px] mx-auto px-4 sm:px-12 py-12 md:py-24 bg-transparent overflow-hidden">
      {/* Headline Layer - using SplitText */}
      <div className="w-full flex justify-center -mt-2 md:-mt-4 mb-8 md:mb-16 px-2 sm:px-4">
        <SplitText
          text="A Legacy Measured in Trust"
          className="text-[32px] sm:text-[52px] lg:text-[72px] font-[900] tracking-[-1px] md:tracking-[-2px] text-white leading-[1.15] text-center max-w-[1200px] pb-2 md:pb-6"
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-50px"
          textAlign="center"
          tag="h2"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
      >
        {/* Static Divider Lines */}
        <div className="absolute top-0 left-0 w-full h-[1px] z-10 bg-white/[0.08]" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 hidden md:block z-10 bg-white/[0.08]" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] z-10 bg-white/[0.08]" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full -translate-x-1/2 hidden md:block z-10 bg-white/[0.08]" />

        {/* Quadrants */}
        <div className="grid grid-cols-1 md:grid-cols-2 relative z-0">
          {stats.map((stat, idx) => {
            const isTop = idx < 2;
            const isLeft = idx % 2 === 0;

            return (
              <div 
                key={idx}
                className={`
                  flex flex-col justify-end
                  py-8 sm:py-10 md:pt-[48px] md:pb-[56px]
                  ${isLeft ? 'md:pr-[64px]' : 'md:pl-[64px]'}
                  ${isTop ? 'border-b md:border-none border-white/[0.08]' : ''}
                  items-center md:items-start text-center md:text-left
                `}
              >
                <div className="text-[44px] sm:text-[56px] md:text-[64px] font-[800] text-brand-accent tracking-[-1px] leading-none mb-3 md:mb-4">
                  <AnimatedNumber targetString={stat.number} delay={idx * 0.1} start={isInView} />
                </div>
                <div className="text-[14px] sm:text-[16px] md:text-[18px] font-[600] text-neutral-400 dark:text-neutral-300 leading-[1.5] uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};