import React from 'react';
import { FaShieldAlt, FaHeartbeat, FaUserShield, FaCar, FaHome, FaPlane } from 'react-icons/fa';

const defaultIcons = {
  ALL: FaShieldAlt,
  Health: FaHeartbeat,
  Life: FaUserShield,
  General: FaShieldAlt
};

export const Filters = ({ options, activeFilter, onChange, className = '' }) => {
  return (
    <div className={`p-1.5 sm:p-2 bg-slate-200/70 dark:bg-navy-900/80 backdrop-blur-xl rounded-2xl border border-slate-300/60 dark:border-white/10 shadow-inner flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 ${className}`}>
      {options.map((opt) => {
        const IconComponent = opt.icon || defaultIcons[opt.value];
        const isActive = activeFilter === opt.value;

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-amber-500 via-gold-400 to-amber-500 text-navy-950 shadow-md font-extrabold scale-[1.03] border border-amber-300/50'
                : 'bg-white/60 dark:bg-navy-950/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-800/80 border border-transparent hover:border-slate-300/60 dark:hover:border-white/10 hover:shadow-sm'
            }`}
          >
            {IconComponent && (
              <IconComponent className={`text-sm transition-transform duration-300 ${isActive ? 'text-navy-950 scale-110' : 'text-amber-500/80 dark:text-amber-400/80'}`} />
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
export default Filters;
