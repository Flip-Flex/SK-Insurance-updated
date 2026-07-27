import React from 'react';
import { FaShieldAlt, FaHeartbeat, FaUserShield, FaCar } from 'react-icons/fa';
import { useTranslation } from '../../context/LanguageContext';
import ScrollStack, { ScrollStackItem } from '../ScrollStack/ScrollStack';
import { StickyCard } from './StickyCard';
import { useStickyScroll } from './useStickyScroll';

export const StickyStackedCards = () => {
  const { t } = useTranslation();
  const eduCards = [
    { icon: FaShieldAlt, title: t('card_1_title'), desc: t('card_1_desc') },
    { icon: FaHeartbeat, title: t('card_2_title'), desc: t('card_2_desc') },
    { icon: FaUserShield, title: t('card_3_title'), desc: t('card_3_desc') },
    { icon: FaCar, title: t('card_4_title'), desc: t('card_4_desc') },
  ];

  const { activeIdx, containerRef } = useStickyScroll(eduCards.length);

  return (
    <div className="relative w-full py-16">
      <div ref={containerRef} className="relative w-full h-[300vh] lg:h-[400vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col lg:flex-row lg:items-center max-w-[1440px] mx-auto px-4 lg:px-12">
          
          {/* Pinned Header */}
          <div className="w-full lg:w-[45%] text-left space-y-5 pt-16 sm:pt-24 lg:pt-0 shrink-0 relative z-50">
            <span className="mb-[16px] inline-block text-[11px] font-extrabold text-brand-accent tracking-[0.3em] uppercase">
              // {t('fl_101')}
            </span>
            <h2 className="text-[28px] sm:text-[40px] md:text-[48px] font-[900] tracking-[-1px] text-neutral-1000 dark:text-white leading-[1.1] sm:leading-[1.15]">
              {t('what_is_ins_title')}
            </h2>
            <p className="text-[14px] sm:text-[16px] text-neutral-500 dark:text-neutral-400 max-w-[50ch] leading-[1.7] font-normal tracking-wide">
              {t('what_is_ins_desc')}
            </p>
          </div>
          
          {/* Cards Container */}
          <div className="relative w-full lg:w-[55%] flex-1 flex flex-col justify-center mt-8 lg:mt-0 h-[450px] lg:h-[600px]">
            <div className="relative w-full max-w-[380px] lg:max-w-[420px] mx-auto lg:mr-auto lg:ml-[15%] h-full">
              {eduCards.map((card, idx) => (
                <StickyCard
                  key={idx}
                  card={card}
                  idx={idx} 
                  totalCards={eduCards.length}
                  activeIdx={activeIdx} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
