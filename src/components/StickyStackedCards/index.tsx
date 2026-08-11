import React from 'react';
import { FaShieldAlt, FaHeartbeat, FaUserShield, FaCar } from 'react-icons/fa';
import { useTranslation } from '../../context/LanguageContext';
import { SimpleCard } from './SimpleCard';

export const StickyStackedCards = () => {
  const { t } = useTranslation();
  const eduCards = [
    { icon: FaShieldAlt, title: t('card_1_title'), desc: t('card_1_desc') },
    { icon: FaHeartbeat, title: t('card_2_title'), desc: t('card_2_desc') },
    { icon: FaUserShield, title: t('card_3_title'), desc: t('card_3_desc') },
    { icon: FaCar, title: t('card_4_title'), desc: t('card_4_desc') },
  ];

  return (
    <div className="relative w-full pt-8 pb-16 lg:pt-12 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
        {/* Header */}
        <div className="text-center md:text-left mb-12 sm:mb-16 lg:mb-20 space-y-4 lg:space-y-6 flex flex-col items-center md:items-start max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] sm:text-[11px] font-extrabold text-black dark:text-brand-accent tracking-[0.2em] uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse shadow-[0_0_8px_rgba(246,255,0,0.8)]" />
            {t('fl_101')}
          </span>
          <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-[900] tracking-[-1px] text-black dark:text-white leading-[1.1] sm:leading-[1.15] drop-shadow-sm">
            {t('what_is_ins_title')}
          </h2>
          <p className="text-[13px] sm:text-[15px] lg:text-[17px] text-neutral-600 dark:text-neutral-400 leading-[1.6] sm:leading-[1.8] font-medium tracking-wide">
            {t('what_is_ins_desc')}
          </p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eduCards.map((card, idx) => (
            <SimpleCard key={idx} card={card} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};
