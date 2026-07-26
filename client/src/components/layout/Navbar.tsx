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
    <nav className="fixed w-full z-50 bg-background/80 /80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img src={logo} alt="Srishtipadham Logo" className="w-10 h-10 object-contain rounded-full" />
              <span className="font-bold text-xl text-primary">Srishtipadham</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${ location.pathname === link.path ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary' } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-4 ml-4 border-l border-border pl-4">
              <button 
                onClick={toggleLanguage}
                className="font-medium hover:text-primary w-8 h-8 rounded-md bg-surface flex items-center justify-center"
                aria-label="Toggle Language"
              >
                {i18n.language === 'ml' ? 'EN' : 'ML'}
              </button>
              
              <button
                onClick={toggleTheme}
                className="hover:text-primary w-8 h-8 rounded-md bg-surface flex items-center justify-center"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              
              <Link 
                to="/join"
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                {t('nav.join')}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-md bg-surface flex items-center justify-center"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-text hover:bg-surface"
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-3 py-2 flex justify-between items-center border-t border-border mt-2">
                <button 
                  onClick={toggleLanguage}
                  className="font-medium"
                >
                  Switch Language ({i18n.language === 'ml' ? 'EN' : 'ML'})
                </button>
                <Link 
                  to="/join"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-primary font-bold"
                >
                  {t('nav.join')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
