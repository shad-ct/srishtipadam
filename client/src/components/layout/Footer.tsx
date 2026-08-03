import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const isMl = i18n.language === 'ml';

  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/groups/211210942820900/',
      color: '#1877F2',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/srishtipadham_publications?igsh=cXhrbjM3Z200bWpi',
      color: '#E1306C',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      )
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@srishtipadhammedia9488?si=l7WIFFYR6IMdGhUJ',
      color: '#FF0000',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  const quickLinks = [
    { to: '/', label: isMl ? 'ഹോം' : 'Home' },
    { to: '/about', label: isMl ? 'ഞങ്ങളെക്കുറിച്ച്' : 'About' },
    { to: '/books', label: isMl ? 'പുസ്തകങ്ങൾ' : 'Books' },
    { to: '/magazines', label: isMl ? 'മാസികകൾ' : 'Magazines' },
    { to: '/events', label: isMl ? 'പരിപാടികൾ' : 'Events' },
    { to: '/committee', label: isMl ? 'കമ്മിറ്റി' : 'Committee' }
  ];

  return (
    <footer className="w-full bg-[#EAE6DB] dark:bg-[#040906] border-t border-[#DCE8DF] dark:border-[#1E3626] transition-colors duration-300 relative z-20">
      
      {/* Dynamic top design element (fade emerald gradient) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3DB86B]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          
          {/* Logo & Info column */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#3DB86B]/30 shadow-lg">
                <img src={logo} alt="Srishtipadham Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-[#1F3E2F] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Srishtipadham
                </span>
                <p className="text-[10px] text-[#3DB86B] font-bold tracking-wider mt-0.5 uppercase">
                  സർഗ്ഗാത്മകതയ്ക്കൊരു സമഗ്രാവിഷ്കാരം
                </p>
              </div>
            </div>
            
            <p className="text-sm text-[#5B7566] dark:text-[#9CB3A6] max-w-md leading-relaxed font-medium">
              {isMl
                ? 'കേരളത്തിലുടനീളമുള്ള എഴുത്തുകാരെയും വായനക്കാരെയും ഒന്നിപ്പിക്കുന്നതിനും, മലയാള ഭാഷയും സർഗ്ഗാത്മകതയും പ്രോത്സാഹിപ്പിക്കുന്നതിനുമായി സമർപ്പിക്കപ്പെട്ട സാംസ്കാരിക കൂട്ടായ്മ.'
                : 'A vibrant literary and cultural community dedicated to supporting writers, promoting Malayalam language, and nurturing creativity across Kerala.'}
            </p>

            {/* Social Icons inside Logo & Info column for modern alignment */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#5B7566] hover:text-white bg-white/20 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-transparent transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  style={{ '--hover-color': s.color } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = s.color;
                    e.currentTarget.style.borderColor = s.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.borderColor = '';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-5">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#3DB86B] uppercase">
              {isMl ? 'ദ്രുത ലിങ്കുകൾ' : 'Quick Links'}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[13px] font-semibold text-[#5B7566] hover:text-[#3DB86B] dark:text-[#9CB3A6] dark:hover:text-white transition-colors duration-250 relative group flex items-center gap-1.5"
                  >
                    {/* Tiny bullet indicator */}
                    <span className="w-1 h-1 rounded-full bg-[#3DB86B] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 space-y-5">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#3DB86B] uppercase">
              {isMl ? 'ബന്ധപ്പെടാൻ' : 'Contact'}
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:srishtipadham@gmail.com"
                className="flex items-center gap-3 group text-[#5B7566] dark:text-[#9CB3A6] hover:text-[#3DB86B] dark:hover:text-white transition-colors duration-250"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20 dark:bg-white/5 border border-black/5 dark:border-white/10 group-hover:border-[#3DB86B]/40 transition-colors shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3DB86B]">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] block font-bold uppercase tracking-wider text-[#5B7566]/60 dark:text-[#9CB3A6]/40">Email</span>
                  <span className="text-xs font-semibold truncate block">srishtipadham@gmail.com</span>
                </div>
              </a>

              <div className="flex items-center gap-3 text-[#5B7566] dark:text-[#9CB3A6]">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20 dark:bg-white/5 border border-black/5 dark:border-white/10 shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3DB86B]">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] block font-bold uppercase tracking-wider text-[#5B7566]/60 dark:text-[#9CB3A6]/40">Location</span>
                  <span className="text-xs font-semibold block">{isMl ? 'കേരളം, ഇന്ത്യ' : 'Kerala, India'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-12 pt-8 border-t border-[#DCE8DF] dark:border-[#1E3626] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-semibold text-[#5B7566] dark:text-[#9CB3A6]/60">
            &copy; {new Date().getFullYear()} Srishtipadham. {isMl ? 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.' : 'All rights reserved.'}
          </p>
          
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3DB86B] animate-pulse" />
            <span className="text-[10px] font-bold text-[#5B7566] dark:text-[#9CB3A6]/70 uppercase tracking-wider">
              {isMl ? 'സർഗ്ഗാത്മക കൂട്ടായ്മ' : 'Creative Community'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
