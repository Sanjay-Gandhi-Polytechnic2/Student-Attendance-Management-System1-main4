// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load translation resources (you can add more languages and keys)
import translationEN from '../public/locales/en/translation.json';
import translationES from '../public/locales/es/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      // we manually handle detection via localStorage
    },
  });

export default i18n;
