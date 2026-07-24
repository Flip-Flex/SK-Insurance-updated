import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { Logo } from '../ui/Logo';
import { FaGlobe, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { locale: currentLang, setLocale: setCurrentLang, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'en', name: 'English', label: 'EN' },
    { code: 'ta', name: 'தமிழ்', label: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు', label: 'తెలుగు' },
    { code: 'ml', name: 'മലയാളം', label: 'മലയാളം' },
    { code: 'hi', name: 'हिन्दी', label: 'हिन्दी' }
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Insurance Plans', path: '/plans' },
    { name: 'Premium Calculator', path: '/calculator' },
    { name: 'Claims', path: '/claims' },
    { name: 'Contact', path: '/support' }
  ];

  const handleDashboardRedirect = () => {
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;
  
  // Logic: Transparent only if we are on the homepage, not scrolled, and mobile menu is closed.
  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled && !isOpen;

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent border-b border-transparent py-5'
            : 'bg-white/95 backdrop-blur-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-[rgba(0,0,0,0.06)] py-3'
        }`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
            {/* If the background is transparent (dark hero), logo might be white. If solid, use dark. The user will handle logo asset choice. */}
            <Logo showTagline={false} />
          </Link>

          {/* Center: Nav Links */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative group py-2 text-[15px] font-medium transition-colors duration-300 ${
                    active 
                      ? 'text-brand-accent' 
                      : `${isTransparent ? 'text-white' : 'text-black'} hover:text-brand-accent`
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 h-[2px] bg-brand-accent transition-all duration-300 left-1/2 -translate-x-1/2 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`flex items-center space-x-1.5 text-[14px] font-medium transition-colors cursor-pointer ${
                  isTransparent ? 'text-white hover:text-brand-accent' : 'text-black hover:text-brand-accent'
                }`}
              >
                <FaGlobe className="text-[16px]" />
                <span>{languages.find(l => l.code === currentLang)?.label || 'EN'}</span>
                <FaChevronDown className="text-[10px]" />
              </button>

              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-32 bg-white border border-[rgba(0,0,0,0.06)] rounded-[12px] shadow-lg z-50 overflow-hidden text-left"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-[14px] transition-colors text-left font-medium cursor-pointer ${
                          currentLang === lang.code 
                            ? 'text-black font-bold bg-brand-accent/20' 
                            : 'text-black hover:bg-neutral-50 hover:text-brand-accent'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`text-[15px] font-medium transition-colors cursor-pointer ${
                    isTransparent ? 'text-white hover:text-brand-accent' : 'text-black hover:text-brand-accent'
                  }`}
                >
                  Dashboard
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="px-6 py-2.5 rounded-[14px] bg-brand-accent hover:bg-brand-hover text-black font-bold text-[15px] cursor-pointer"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleDashboardRedirect}
                  className={`text-[15px] font-medium transition-colors cursor-pointer ${
                    isTransparent ? 'text-white hover:text-brand-accent' : 'text-black hover:text-brand-accent'
                  }`}
                >
                  Login
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {}}
                  className="px-6 py-2.5 rounded-[14px] bg-brand-accent hover:bg-brand-hover text-black font-bold text-[15px] cursor-pointer transition-colors"
                >
                  Get Quote
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors z-50 cursor-pointer ${
              isTransparent ? 'text-white hover:text-brand-accent' : 'text-black hover:text-brand-accent'
            }`}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-[100px] px-6 pb-6 overflow-y-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <div className="flex flex-col space-y-8 text-center mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-[22px] font-medium tracking-tight transition-colors ${
                    isActive(link.path) ? 'text-brand-accent' : 'text-black'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-10 flex flex-col space-y-6">
              {/* Mobile Language */}
              <div className="flex justify-center space-x-3 mb-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.code)}
                    className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer ${
                      currentLang === lang.code 
                        ? 'bg-brand-accent/20 text-black font-bold' 
                        : 'text-black hover:bg-neutral-50'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { setIsOpen(false); navigate('/dashboard'); }}
                    className="w-full py-4 text-black font-medium text-[16px] cursor-pointer hover:text-brand-accent transition-colors"
                  >
                    Dashboard
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setIsOpen(false); logout(); }}
                    className="w-full py-4 rounded-[14px] bg-brand-accent hover:bg-brand-hover text-black font-bold text-[16px] cursor-pointer"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setIsOpen(false); handleDashboardRedirect(); }}
                    className="w-full py-4 text-black font-medium text-[16px] cursor-pointer hover:text-brand-accent transition-colors"
                  >
                    Login
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 rounded-[14px] bg-brand-accent hover:bg-brand-hover text-black font-bold text-[16px] cursor-pointer"
                  >
                    Get Quote
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

