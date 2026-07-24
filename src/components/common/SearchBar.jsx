import React from 'react';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = ({ value, onChange, placeholder = 'Search policies, clients, or logs...' }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <FaSearch className="text-sm" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 dark:focus:border-gold-500 focus:ring-1 focus:ring-gold-400/20 text-navy-950 dark:text-white transition-all shadow-sm"
      />
    </div>
  );
};
export default SearchBar;
