import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { IconType } from 'react-icons';

interface CardData {
  icon: IconType;
  title: string;
  desc: string;
}

interface StickyCardProps {
  card: CardData;
  idx: number;
  totalCards: number;
  activeIdx: MotionValue<number>;
}

export const StickyCard: React.FC<StickyCardProps> = ({ card, idx, totalCards, activeIdx }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const layoutId = `sticky-card-${idx}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // We expand the domain to explicitly define a "Reading Phase" and a "Transition Phase".
  const input: number[] = [];
  for (let i = 0; i < totalCards; i++) {
    input.push(i);
    if (i < totalCards - 1) {
      input.push(i + 0.6);
    }
  }

  const yOutput = input.map(v => {
    if (v <= idx - 0.4) return `100vh`;
    if (v >= idx && v <= idx + 0.6) return `0px`;
    const pushedCount = Math.floor(v) - idx;
    // Reduce stack offset to prevent overlapping header on small screens
    return `${-pushedCount * 12}px`;
  });

  const scaleOutput = input.map(v => {
    if (v <= idx + 0.6) return 1;
    const pushedCount = Math.floor(v) - idx;
    return 1 - (pushedCount * 0.02);
  });

  const borderOpacity = input.map(v => {
    if (v >= idx && v <= idx + 0.6) return 0.2;
    return 0.05;
  });

  const shadowOpacity = input.map(v => {
    if (v < idx) return 0;
    if (v >= idx && v <= idx + 0.6) return 0.15;
    const pushedCount = Math.floor(v) - idx;
    if (pushedCount === 1) return 0.08;
    return 0.03;
  });

  const y = useTransform(activeIdx, input, yOutput);
  const scale = useTransform(activeIdx, input, scaleOutput);
  
  const rawShadowOpacity = useTransform(activeIdx, input, shadowOpacity);
  const boxShadow = useTransform(
    rawShadowOpacity,
    (opacity) => `0px 30px 60px -15px rgba(0, 0, 0, ${opacity})`
  );

  const rawBorderOpacity = useTransform(activeIdx, input, borderOpacity);
  const borderColor = useTransform(
    rawBorderOpacity,
    (opacity) => `rgba(128, 128, 128, ${opacity})`
  );

  return (
    <>
      <motion.div
        style={{
          y,
          scale,
          zIndex: idx,
          transformOrigin: "top center"
        }}
        className="w-full absolute left-0 right-0 top-1/2 -translate-y-1/2 cursor-default"
      >
        <motion.div 
          layoutId={layoutId}
          onClick={() => setIsOpen(true)}
          style={{
            boxShadow,
            borderColor
          }}
          className="w-full aspect-square rounded-[24px] lg:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-white/[0.08] shadow-premium-dark flex flex-col justify-center bg-[#18181b]/80 backdrop-blur-[20px] cursor-pointer hover:bg-[#18181b]/95 transition-colors group"
        >
          <div className="flex flex-col items-start w-full">
            <motion.div layoutId={`icon-box-${layoutId}`} className="p-4 bg-neutral-900 text-white rounded-[16px] inline-block mb-8 shadow-sm">
              <card.icon className="text-4xl lg:text-5xl text-white" />
            </motion.div>
            <motion.h3 layoutId={`title-${layoutId}`} className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-4">
              {card.title}
            </motion.h3>
            <motion.p layoutId={`desc-${layoutId}`} className="text-[15px] lg:text-[16px] text-neutral-400 leading-relaxed">
              {card.desc}
            </motion.p>
            <div className="mt-6 flex items-center justify-end w-full text-brand-accent">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 group-hover:bg-brand-accent group-hover:text-black group-hover:border-brand-accent transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {mounted ? createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-8 md:p-24 pt-24 md:pt-32"
            >
              <div
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
              />
              
              <motion.div
                layoutId={layoutId}
                className="relative w-full max-w-5xl max-h-full bg-neutral-1000 rounded-[32px] overflow-hidden border border-white/10 z-10 flex flex-col shadow-2xl"
              >
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                
                <div className="p-8 sm:p-12 md:p-16 w-full flex flex-col overflow-y-auto">
                  <motion.div layoutId={`icon-box-${layoutId}`} className="p-4 bg-neutral-900 text-white rounded-[16px] inline-block shadow-sm w-max mb-8">
                    <card.icon className="text-4xl lg:text-5xl text-white" />
                  </motion.div>

                  <motion.h3 layoutId={`title-${layoutId}`} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    {card.title}
                  </motion.h3>
                  <motion.p layoutId={`desc-${layoutId}`} className="text-[16px] sm:text-[18px] md:text-[20px] text-neutral-400 leading-relaxed pb-8 mb-8 border-b border-white/10">
                    {card.desc}
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/80 text-base md:text-lg leading-relaxed"
                  >
                    <div className="flex flex-col gap-6 md:gap-8">
                      <p>Understanding {card.title.toLowerCase()} is crucial for protecting your financial future. This detailed guide explores how these instruments work to provide a safety net for you and your loved ones.</p>
                      
                      <div>
                        <h4 className="font-bold text-xl md:text-2xl mb-4 text-black dark:text-brand-accent">Key Benefits & Coverage</h4>
                        <ul className="list-disc pl-6 space-y-3 text-neutral-400">
                          <li>Comprehensive protection against unforeseen events and emergencies.</li>
                          <li>Potential tax benefits under various sections of the Income Tax Act.</li>
                          <li>Complete peace of mind knowing your family's future is secured.</li>
                          <li>Flexible premium payment options tailored to your income flow.</li>
                        </ul>
                      </div>
                      
                      <Link to="/plans" className="mt-4 px-8 py-4 md:px-10 md:py-5 md:text-lg bg-brand-accent text-black font-bold uppercase tracking-widest rounded-full hover:brightness-110 transition-all self-start shadow-[0_0_15px_rgba(255, 179, 0,0.4)] text-center inline-block">
                        Explore Plans
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      ) : null}
    </>
  );
};