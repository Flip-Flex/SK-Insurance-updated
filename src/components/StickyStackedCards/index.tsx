import React from 'react';
import { FaShieldAlt, FaHeartbeat, FaUserShield, FaCar } from 'react-icons/fa';
import { useTranslation } from '../../context/LanguageContext';
import { useStickyScroll } from './useStickyScroll';
import { StickyCard } from './StickyCard';

export const StickyStackedCards = () => {
  const { t } = useTranslation();
  
  const eduCards = [
    { icon: FaShieldAlt, title: t('card_1_title'), desc: t('card_1_desc') },
    { icon: FaHeartbeat, title: t('card_2_title'), desc: t('card_2_desc') },
    { icon: FaUserShield, title: t('card_3_title'), desc: t('card_3_desc') },
    { icon: FaCar, title: t('card_4_title'), desc: t('card_4_desc') },
  ];

  const { containerRef, activeIdx } = useStickyScroll(eduCards.length);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        
        {/* Pinned Header */}
        <div className="w-full text-center space-y-2 pt-16 sm:pt-24 px-4 shrink-0 relative z-50">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black bg-brand-accent rounded-[999px]">
            {t('fl_101')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-1000 dark:text-white">
            {t('what_is_ins_title')}
          </h2>
          <p className="text-xs text-neutral-600 max-w-xl mx-auto">
            {t('what_is_ins_desc')}
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative w-full max-w-[750px] mx-auto flex-1 flex flex-col justify-center px-4 mt-8">
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
  );
};
