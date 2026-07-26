import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationML from './locales/ml/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  ml: {
    translation: translationML
  }
};

const savedLang = localStorage.getItem('language') || 'ml';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'ml',
    interpolation: {
      escapeValue: false
    }
  });

// Update html lang attribute on init
document.documentElement.lang = savedLang;

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
});

export default i18n;
