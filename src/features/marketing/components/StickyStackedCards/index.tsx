import React from 'react';
import { FaShieldAlt, FaHeartbeat, FaUserShield, FaCar } from 'react-icons/fa';
import { useTranslation } from '../../../../context/LanguageContext';
import { SimpleCard } from './SimpleCard';

export const StickyStackedCards = () => {
  const { t } = useTranslation();
  const eduCards = [
    { icon: FaShieldAlt, title: t('card_1_title'), desc: t('card_1_desc'), colorClass: 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]', bgHoverClass: 'bg-blue-50 dark:bg-blue-900/10' },
    { icon: FaHeartbeat, title: t('card_2_title'), desc: t('card_2_desc'), colorClass: 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]', bgHoverClass: 'bg-red-50 dark:bg-red-900/10' },
    { icon: FaUserShield, title: t('card_3_title'), desc: t('card_3_desc'), colorClass: 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]', bgHoverClass: 'bg-emerald-50 dark:bg-emerald-900/10' },
    { icon: FaCar, title: t('card_4_title'), desc: t('card_4_desc'), colorClass: 'text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]', bgHoverClass: 'bg-amber-50 dark:bg-amber-900/10' },
  ];

  return (
    <div className="relative w-full pt-8 sm:pt-12 pb-16 lg:pt-16 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12 space-y-4 lg:space-y-6 flex flex-col items-center max-w-3xl mx-auto">

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
