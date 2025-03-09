import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  // Load translations via http
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Initialize react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    supportedLngs: ['en-US', 'zh-CN'],
    ns: ['common', 'header', 'footer', 'index'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'diprush-language',
    },
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
