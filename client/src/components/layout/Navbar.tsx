import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ml' ? 'en' : 'ml';
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.books'), path: '/books' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.magazines'), path: '/magazines' },
    { name: t('nav.committee'), path: '/committee' },
    { name: t('nav.about'), path: '/about' },
  ];

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] z-50 bg-[#F4F1EA]/90 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-[#E8E2D2] rounded-full px-2 py-1.5 transition-colors duration-300 dark:bg-[#16281F]/90 dark:border-[#24392C]">
        <div className="flex justify-between items-center h-12 px-4">
          {/* Left - Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1F3E2F] rounded-full flex items-center justify-center text-white font-serif text-lg font-bold">
              S
            </div>
            <span className="font-serif text-[#1F3E2F] dark:text-[#EAF4EE] text-[22px] tracking-wide flex items-center gap-1.5">
              Srishtipadam <span className="text-sm opacity-80 -mt-2 grayscale mix-blend-luminosity">🍃</span>
            </span>
          </Link>
          
          {/* Center - Links */}
          <div className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${ location.pathname === link.path ? 'text-[#1F3E2F] dark:text-[#EAF4EE] font-bold' : 'text-[#3B5A4B] dark:text-[#9DB3A6] font-medium hover:text-[#1F3E2F] dark:hover:text-white' } transition-colors text-[14px]`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right - Controls */}
          <div className="hidden lg:flex items-center gap-5">
            <button onClick={toggleLanguage} className="text-[#1F3E2F] dark:text-[#EAF4EE] font-medium flex items-center gap-1 hover:opacity-80 text-sm">
                {i18n.language === 'ml' ? 'EN' : 'ML'} <span className="text-[10px]">▼</span>
            </button>
            <button onClick={toggleTheme} className="text-[#1F3E2F] dark:text-[#EAF4EE] hover:opacity-80 text-sm">
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link 
                to="/join"
                className="bg-[#1F3E2F] hover:bg-[#152E22] text-white px-7 py-2 rounded-full font-medium transition-colors text-[14px]"
              >
                Join Now
              </Link>
          </div>
          
          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-4">
            <button onClick={toggleTheme} className="text-[#1F3E2F] dark:text-[#EAF4EE]">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#1F3E2F] dark:text-[#EAF4EE]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 right-0 w-64 bg-[#F4F1EA] dark:bg-[#16281F] z-50 shadow-2xl flex flex-col"
          >
            <div className="p-4 flex justify-between items-center border-b border-[#E8E2D2] dark:border-[#24392C]">
              <span className="font-serif font-bold text-xl text-[#1F3E2F] dark:text-[#EAF4EE]">Srishtipadam</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#3B5A4B] dark:text-[#9DB3A6] p-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#1F3E2F]/10 text-[#1F3E2F] dark:text-white font-bold'
                      : 'text-[#3B5A4B] dark:text-[#9DB3A6] hover:bg-[#E8E2D2]/50 dark:hover:bg-[#24392C]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="p-4 border-t border-[#E8E2D2] dark:border-[#24392C] space-y-4">
              <button 
                onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 text-[#1F3E2F] dark:text-[#EAF4EE] font-medium"
              >
                <span>Language</span>
                <span className="font-bold">{i18n.language === 'ml' ? 'EN' : 'ML'}</span>
              </button>
              <Link 
                to="/join"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full block text-center bg-[#1F3E2F] text-white px-4 py-3 rounded-xl font-bold"
              >
                Join Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

