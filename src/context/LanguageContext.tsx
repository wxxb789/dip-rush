import type { Language } from '@/types/ui';
import { type ReactNode, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();

  // Get current language from i18n
  const language = i18n.language as Language;

  const setLanguage = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
    // i18next will handle storage through the LanguageDetector plugin
  };

  const toggleLanguage = () => {
    const newLanguage = language.startsWith('en') ? 'zh-CN' : 'en-US';
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
