import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right', // right, left
  size = 'md' // sm, md, lg
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
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl'
  };

  const slideVariants = {
    hidden: { x: position === 'right' ? '100%' : '-100%' },
    visible: { x: 0 },
    exit: { x: position === 'right' ? '100%' : '-100%' }
  };

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-950/30 dark:bg-navy-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body */}
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className={`absolute top-0 bottom-0 ${position === 'right' ? 'right-0' : 'left-0'} w-full ${sizeClasses[size]} bg-white dark:bg-navy-950 shadow-2xl flex flex-col z-[10000] border-l border-slate-200/40 dark:border-white/5`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200/65 dark:border-white/5">
              {title && (
                <h3 className="text-lg font-semibold text-navy-950 dark:text-white">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};

export default Drawer;
