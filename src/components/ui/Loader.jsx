import React from 'react';

export const Loader = ({ size = 'md', className = '', label }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-t-gold-500 border-r-transparent border-b-navy-700 border-l-navy-200 dark:border-b-navy-400 dark:border-l-navy-800`}
      />
      {label && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 animate-pulse">{label}</p>}
    </div>
  );
};

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}
        />
      ))}
    </>
  );
};
export default Loader;
