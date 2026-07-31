import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout } = useAdminAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ml' ? 'en' : 'ml';
    i18n.changeLanguage(nextLang);
  };

  const links = [
    { name: t('admin.dashboard'), path: '/admin' },
    { name: t('admin.manageBooks'), path: '/admin/books' },
    { name: t('admin.manageEvents'), path: '/admin/events' },
    { name: t('admin.manageMagazines'), path: '/admin/magazines' },
    { name: t('admin.manageCommittee'), path: '/admin/committee' },
  ];

  return (
    <aside className="w-64 bg-surface-raised border-r border-border flex flex-col h-full md:h-screen sticky top-0 shadow-lg md:shadow-none">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Srishtipadham</h2>
          <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">Admin Dashboard</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-text-secondary hover:text-text">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/admin'}
            onClick={onClose}
            className={({ isActive }) => 
              `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary' 
                  : 'text-text-secondary hover:bg-surface hover:text-text'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto flex flex-col gap-4">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-3 w-full p-3 rounded-md text-text-secondary hover:text-primary hover:bg-surface transition-colors font-medium text-sm text-left"
        >
          <span>🌐</span>
          Switch to {i18n.language === 'ml' ? 'English' : 'മലയാളം'}
        </button>
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full p-3 rounded-md text-text-secondary hover:text-error hover:bg-surface transition-colors font-medium text-sm text-left"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
