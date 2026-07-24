import React from 'react';
import { FaInbox } from 'react-icons/fa';

export const EmptyState = ({
  icon: Icon = FaInbox,
  title = 'No Data Found',
  description = 'There are no items to display at this time.',
  actionButton
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-panel dark:glass-panel-gold rounded-2xl border border-dashed border-slate-300/60 dark:border-white/10 my-4">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-navy-900 text-gold-500 mb-3 animate-bounce">
        <Icon className="text-3xl" />
      </div>
      <h3 className="text-lg font-semibold text-navy-950 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">{description}</p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};
export default EmptyState;
