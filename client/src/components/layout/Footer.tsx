import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-surface py-8 mt-auto border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="font-bold text-primary">Srishtipadam</span>
          </div>
          <div className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} Srishtipadam. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
