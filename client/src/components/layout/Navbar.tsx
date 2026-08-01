import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

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
      <nav
        className="fixed top-5 left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] z-50 rounded-full px-2 py-1.5 transition-all duration-500"
        style={theme === 'dark' ? {
          background: 'rgba(7, 14, 11, 0.85)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(61, 184, 107, 0.12)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(61,184,107,0.06)',
        } : {
          background: 'rgba(244, 241, 234, 0.88)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(220, 232, 223, 0.7)',
          boxShadow: '0 4px 24px rgba(31,62,47,0.07), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        <div className="flex justify-between items-center h-12 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#1F3E2F] dark:bg-[#3DB86B] rounded-full flex items-center justify-center text-white font-extrabold text-base tracking-tight transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#3DB86B]/30"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              S
            </div>
            <span
              className="text-[#1F3E2F] dark:text-white text-[20px] font-extrabold tracking-tight leading-none"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
            >
              Srishtipadam
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-[13.5px] font-semibold transition-all duration-200 ${
                    active
                      ? 'text-[#1F3E2F] dark:text-white bg-[#1F3E2F]/08 dark:bg-white/08'
                      : 'text-[#3B5A4B] dark:text-[#9DB3A6] hover:text-[#1F3E2F] dark:hover:text-white hover:bg-[#1F3E2F]/05 dark:hover:bg-white/05'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#3DB86B]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold tracking-widest text-[#1F3E2F] dark:text-[#A3D9B1] border border-[#1F3E2F]/15 dark:border-[#A3D9B1]/20 hover:bg-[#1F3E2F]/08 dark:hover:bg-[#A3D9B1]/10 transition-all duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {i18n.language === 'ml' ? 'EN' : 'ML'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#1F3E2F] dark:text-[#EAF4EE] hover:bg-[#1F3E2F]/08 dark:hover:bg-white/08 transition-all duration-200 text-base"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* CTA */}
            <Link
              to="/join"
              className="px-5 py-2 rounded-full text-white text-[13px] font-bold tracking-wide transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-[#3DB86B]/30 active:scale-95"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: 'linear-gradient(135deg, #3DB86B 0%, #2d9d57 100%)',
                boxShadow: '0 2px 12px rgba(61,184,107,0.25)',
              }}
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <button onClick={toggleTheme} className="text-[#1F3E2F] dark:text-[#EAF4EE] text-lg">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-[#1F3E2F] dark:text-[#EAF4EE] p-1"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
            className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
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
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="lg:hidden fixed inset-y-0 right-0 w-72 z-50 shadow-2xl flex flex-col"
            style={{
              background: 'rgba(244, 241, 234, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* Drawer header */}
            <div className="p-5 flex justify-between items-center border-b border-[#E8E2D2] dark:border-[#24392C]">
              <span
                className="font-extrabold text-xl text-[#1F3E2F] dark:text-white tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
              >
                Srishtipadam
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#3B5A4B] dark:text-[#9DB3A6] hover:bg-[#1F3E2F]/08 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14.5px] font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-[#1F3E2F]/10 dark:bg-white/08 text-[#1F3E2F] dark:text-white'
                        : 'text-[#3B5A4B] dark:text-[#9DB3A6] hover:bg-[#E8E2D2]/60 dark:hover:bg-[#24392C]'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#3DB86B] shrink-0" />}
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E8E2D2] dark:border-[#24392C] space-y-3">
              <button
                onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#1F3E2F]/06 dark:bg-white/06 text-[#1F3E2F] dark:text-[#EAF4EE] text-sm font-semibold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <span>Language</span>
                <span className="font-bold text-[#3DB86B]">{i18n.language === 'ml' ? 'EN' : 'ML'}</span>
              </button>
              <Link
                to="/join"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full block text-center text-white px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-[#3DB86B]/30"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background: 'linear-gradient(135deg, #3DB86B 0%, #2d9d57 100%)',
                }}
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
