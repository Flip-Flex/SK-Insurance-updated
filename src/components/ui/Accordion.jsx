import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

/**
 * Accordion component built with Framer Motion.
 * Props:
 *   - type: 'single' | 'multiple' (default 'single')
 *   - collapsible: boolean (default true)
 *   - className: string
 *   - children: AccordionItem elements
 */
export const Accordion = ({ type = 'single', collapsible = true, className = '', children }) => {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (value) => {
    if (type === 'single') {
      if (openItems.includes(value)) {
        if (collapsible) setOpenItems([]);
      } else {
        setOpenItems([value]);
      }
    } else {
      if (openItems.includes(value)) {
        setOpenItems(openItems.filter(v => v !== value));
      } else {
        setOpenItems([...openItems, value]);
      }
    }
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          isOpen: openItems.includes(child.props.value),
          onToggle: () => toggleItem(child.props.value),
        });
      })}
    </div>
  );
};

/**
 * AccordionItem wrapper
 * Props:
 *   - value: string (unique identifier)
 *   - className: string
 *   - isOpen: boolean (injected by Accordion)
 *   - onToggle: function (injected by Accordion)
 */
export const AccordionItem = ({ value, className = '', isOpen, onToggle, children }) => {
  return (
    <div className={`border-b ${className}`}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { isOpen, onToggle });
      })}
    </div>
  );
};

/**
 * AccordionTrigger — the clickable header
 */
export const AccordionTrigger = ({ className = '', isOpen, onToggle, children }) => {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center justify-between py-5 text-left font-semibold transition-colors cursor-pointer ${className}`}
    >
      {children}
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="shrink-0 ml-4"
      >
        <FaChevronDown className="text-sm text-neutral-400" />
      </motion.span>
    </button>
  );
};

/**
 * AccordionContent — the collapsible body
 */
export const AccordionContent = ({ className = '', isOpen, children }) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className={`pb-5 pt-0 text-sm leading-relaxed ${className}`}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
