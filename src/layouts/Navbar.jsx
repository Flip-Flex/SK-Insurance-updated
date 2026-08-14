import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/contexts/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from '../components/ui/Logo';
import { FaGlobe, FaChevronDown, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggeredMenu } from '../components/ui/StaggeredMenu';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isManager } = useAuth();
  const { locale: currentLang, setLocale: setCurrentLang, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const { theme, toggleTheme, isDark: isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme toggle is handled by ThemeContext

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
    navigate('/login');
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
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          isTransparent || isOpen
            ? 'bg-transparent backdrop-blur-none border-transparent py-1.5 md:py-3'
            : 'bg-white/85 dark:bg-neutral-950/85 backdrop-blur-[20px] shadow-premium-soft dark:shadow-premium-dark border-b border-black/5 dark:border-white/10 py-1.5'
        }`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
            {/* If the background is transparent (light video hero), use dark logo. If solid (dark navbar), use light logo. */}
            <Logo showTagline={false} isDark={!isTransparent} />
          </Link>

          {/* Center: Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-2 py-2 text-[15px] font-medium transition-all duration-300 inline-block transform hover:scale-110 ${
                    active 
                      ? (isTransparent ? 'text-black font-bold scale-105' : 'text-brand-accent font-bold scale-105 drop-shadow-[0_0_8px_rgba(255,179,0,0.6)]') 
                      : (isTransparent ? 'text-black hover:text-black/70' : 'text-black dark:text-white hover:text-brand-accent hover:drop-shadow-[0_0_8px_rgba(255,179,0,0.4)]')
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className={`flex items-center space-x-1.5 text-[14px] font-medium transition-colors cursor-pointer ${isTransparent ? 'text-black hover:text-black/70' : 'text-black dark:text-white hover:text-brand-accent'}`}
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
                    className="absolute right-0 mt-4 w-32 bg-neutral-900 border border-white/10 rounded-[12px] shadow-premium-dark z-50 overflow-hidden text-left"
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
                            ? 'text-brand-accent font-bold bg-brand-accent/10' 
                            : 'text-neutral-300 hover:bg-white/5 hover:text-brand-accent'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center p-2 rounded-full transition-colors ${isTransparent ? 'text-black hover:bg-black/10' : 'text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:text-brand-accent'}`}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <FaSun className="text-[16px]" /> : <FaMoon className="text-[16px]" />}
            </button>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isManager && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2.5 rounded-[14px] bg-brand-accent hover:bg-brand-hover text-black font-bold text-[15px] cursor-pointer"
                >
                  Dashboard
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className={`px-4 py-2.5 rounded-[14px] font-medium text-[14px] transition-colors ${isTransparent ? 'text-black hover:bg-black/10' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
                >
                  Logout
                </button>
              )}
              {!isManager && (
                <button
                  onClick={() => navigate('/appointment')}
                  className={`px-7 py-2.5 rounded-xl backdrop-blur-md font-medium text-[15px] cursor-pointer transition-all duration-300 hover:border-brand-accent hover:bg-brand-accent hover:text-black hover:shadow-[0_0_15px_rgba(255, 179, 0,0.3)] ${isTransparent ? 'bg-black/5 border-black/20 text-black' : 'bg-black/5 dark:bg-black/40 border-black/10 dark:border-white/10 text-black dark:text-white'}`}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>

          {/* Mobile GSAP StaggeredMenu (Handles its own toggle) */}
          <div className="lg:hidden block">
            <StaggeredMenu
              position="right"
              items={navLinks.map(link => ({
                label: link.name,
                ariaLabel: `Go to ${link.name}`,
                link: link.path
              }))}
              socialItems={[]}
              displaySocials={false}
              displayItemNumbering={false}
              menuButtonColor={isDarkMode ? "#ffffff" : "#000000"}
              openMenuButtonColor={isDarkMode ? "#ffffff" : "#000000"}
              changeMenuColorOnOpen={true}
              colors={isDarkMode ? ['#111111', '#FFB300'] : ['#EAEAEA', '#FFB300']}
              accentColor="#FFB300"
              isFixed={true}
              onMenuOpen={() => setIsOpen(true)}
              onMenuClose={() => setIsOpen(false)}
              bottomContent={(closeMenu) => (
                <div className="flex flex-col space-y-6">
                  {/* Mobile Theme & Language */}
                  <div className="flex items-center justify-center space-x-8 mb-6">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center justify-center text-[18px] font-bold transition-colors cursor-pointer text-black dark:text-white hover:text-brand-accent dark:hover:text-brand-accent"
                      aria-label="Toggle Theme"
                    >
                      {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>

                    <div className="relative flex justify-center">
                    <button
                      onClick={() => setShowLangDropdown(!showLangDropdown)}
                      className="flex items-center space-x-2 text-[16px] font-bold transition-colors cursor-pointer text-black dark:text-white hover:text-brand-accent dark:hover:text-brand-accent"
                    >
                      <FaGlobe className="text-[18px]" />
                      <span>{languages.find(l => l.code === currentLang)?.label || 'EN'}</span>
                      <FaChevronDown className={`text-[12px] transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showLangDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-4 w-40 bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-[12px] shadow-xl z-50 overflow-hidden text-center"
                        >
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setCurrentLang(lang.code);
                                setShowLangDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-[15px] transition-colors text-center font-medium cursor-pointer ${
                                currentLang === lang.code 
                                  ? 'text-brand-accent font-bold bg-brand-accent/10' 
                                  : 'text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-brand-accent dark:hover:text-brand-accent'
                              }`}
                            >
                              {lang.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                  {isAuthenticated ? (
                    <>
                      {isManager && (
                        <button
                          onClick={() => { closeMenu(); setIsOpen(false); navigate('/dashboard'); }}
                          className="w-full py-4 rounded-[14px] bg-brand-accent hover:bg-brand-hover text-black font-bold text-[16px] cursor-pointer"
                        >
                          Dashboard
                        </button>
                      )}
                      {!isManager && (
                        <button
                          onClick={() => { closeMenu(); setIsOpen(false); navigate('/appointment'); }}
                          className="w-full py-4 rounded-xl bg-brand-accent hover:bg-[#E6A100] text-black font-bold text-[16px] cursor-pointer transition-all duration-300 shadow-sm active:scale-95"
                        >
                          Get Started
                        </button>
                      )}
                      <button
                        onClick={() => { closeMenu(); setIsOpen(false); logout(); }}
                        className="w-full py-4 mt-4 rounded-[14px] border border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold text-[16px] cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { closeMenu(); setIsOpen(false); navigate('/appointment'); }}
                        className="w-full py-4 rounded-xl bg-brand-accent hover:bg-[#E6A100] text-black font-bold text-[16px] cursor-pointer transition-all duration-300 shadow-sm active:scale-95"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Navbar;

