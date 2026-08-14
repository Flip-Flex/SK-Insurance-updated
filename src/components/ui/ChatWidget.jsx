import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export const ChatWidget = () => {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-hide when compare bar is visible on Plans page
  useEffect(() => {
    const checkCompareBar = () => {
      const allFixed = document.querySelectorAll('[class*="fixed"][class*="bottom"]');
      let hasCompare = false;
      allFixed.forEach(el => {
        if (el.textContent?.includes('plans selected')) hasCompare = true;
      });
      setIsMinimized(hasCompare);
    };
    const observer = new MutationObserver(checkCompareBar);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    checkCompareBar();
    return () => observer.disconnect();
  }, []);

  if (location.pathname.startsWith('/dashboard') || location.pathname === '/login') {
    return null;
  }

  const whatsappUrl = "https://wa.me/919994451300?text=Hi%20SK%20Smart%20Investments,%20I%20want%20to%20explore%20about%20insurance.";

  return (
    <>
      {/* Minimized peek tab — slides in from right edge when compare bar is active */}
      <AnimatePresence>
        {isMinimized && (
          <motion.a
            initial={{ x: 80 }}
            animate={{ x: 0 }}
            exit={{ x: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-28 right-0 z-[9999] bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-4 rounded-l-2xl shadow-lg cursor-pointer flex flex-col items-center gap-1.5 transition-colors"
            title="Chat on WhatsApp"
          >
            <FaWhatsapp className="text-lg" />
            <span className="text-[7px] font-extrabold uppercase tracking-widest" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>Chat</span>
          </motion.a>
        )}
      </AnimatePresence>

      <div className={`fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-[9999] font-sans transition-all duration-300 ${isMinimized ? 'translate-x-[200%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] transition-all cursor-pointer transform hover:scale-[1.05] active:scale-95 duration-200 relative z-50"
        >
          <FaWhatsapp className="text-[32px]" />
        </a>
      </div>
    </>
  );
};
export default ChatWidget;
