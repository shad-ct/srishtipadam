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

  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      className="fixed w-full z-50 backdrop-blur-md"
      style={{
        background: 'rgba(var(--color-bg-base-rgb, 12, 24, 16), 0.88)',
        borderBottom: '1px solid var(--color-border-base)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
            <img src={logo} alt="Srishtipadham" className="w-9 h-9 object-contain rounded-full" />
            <span className="font-heading font-bold text-lg" style={{ color: 'var(--color-brand-primary)' }}>
              Srishtipadham
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-sm font-medium transition-colors duration-200 pb-0.5"
                style={{ color: isActive(link.path) ? 'var(--color-brand-primary)' : 'var(--color-text-muted)' }}
              >
                {link.name}
                {/* Active underline */}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--color-brand-primary)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Controls */}
            <div className="flex items-center gap-2 ml-2 pl-4" style={{ borderLeft: '1px solid var(--color-border-base)' }}>
              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{
                  background: 'var(--color-surface-raised)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border-base)',
                }}
                aria-label="Toggle Language"
              >
                {i18n.language === 'ml' ? 'EN' : 'ML'}
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all hover:opacity-80"
                style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-base)' }}
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              {/* Join CTA */}
              <Link
                to="/join"
                className="font-medium text-sm px-5 py-2 rounded-lg text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
                style={{
                  background: 'var(--color-brand-primary)',
                  boxShadow: '0 2px 10px rgba(74,154,104,0.3)',
                }}
              >
                {t('nav.join')}
              </Link>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-base)' }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center"
              style={{ color: 'var(--color-text-base)' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'var(--color-surface-base)', borderBottom: '1px solid var(--color-border-base)' }}
          >
            <div className="px-4 pt-3 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: isActive(link.path) ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                    background: isActive(link.path) ? 'rgba(74,154,104,0.1)' : 'transparent',
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border-base)' }}>
                <button onClick={toggleLanguage} className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Switch to {i18n.language === 'ml' ? 'English' : 'മലയാളം'}
                </button>
                <Link
                  to="/join"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-bold text-sm px-4 py-2 rounded-lg text-white"
                  style={{ background: 'var(--color-brand-primary)' }}
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
