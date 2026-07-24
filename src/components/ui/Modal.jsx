import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl, max
  showClose = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    max: 'max-w-6xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/40 dark:bg-navy-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`relative w-full ${sizeClasses[size]} glass-panel dark:glass-panel-gold rounded-3xl p-6 shadow-2xl z-10 overflow-hidden border border-white/20 dark:border-white/5`}
          >
            {/* Gold Accent top border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-500 via-gold-300 to-navy-500" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 mt-1">
              {title && (
                <h3 className="text-xl font-semibold text-navy-950 dark:text-white">
                  {title}
                </h3>
              )}
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="max-h-[75vh] overflow-y-auto pr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default Modal;
