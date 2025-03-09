# DipRush Translation Refactoring Plan

This document outlines a comprehensive plan for refactoring the DipRush application's internationalization (i18n) approach. The goal is to move from embedded translations within component files to a structured, maintainable translation system using a mature i18n library.

## Current State Analysis

The codebase currently uses:
- A mix of translation approaches
- Hardcoded translation objects in component files (e.g., `index.tsx`, `Header.tsx`)
- Some structured translations in `/public/locales/en/common.json` and `/public/locales/zh/common.json`
- A `LanguageContext.tsx` that toggles between 'en' and 'zh'

Example of current pattern in components:
```typescript
const translations = {
  en: {
    title: 'DipRush - Market Dip Detection',
    // other translations...
  },
  zh: {
    title: 'DipRush - 市场下跌检测',
    // other translations...
  },
};

const t = language === 'zh' ? translations.zh : translations.en;

return (
  <h1>{t.title}</h1>
  // ...
);
```

## Target State

We will implement:
1. A dedicated `/src/locales` directory (✅ Completed)
2. Structured translation files by language and component
3. A mature i18n library (react-i18next) with React 19 compatibility
4. A streamlined approach to translation usage in components

## Implementation Plan

### 1. Set Up i18next with React 19 Support

Install required packages:
```bash
npm install i18next react-i18next i18next-http-backend i18next-browser-languagedetector
```

### 2. Create Localization Directory Structure

```
/src/locales
  /en-US
    common.json        # App-wide translations
    header.json        # Component-specific
    footer.json
    index.json         # Page-specific translations
    ...
  /zh-CN
    common.json
    header.json
    footer.json
    index.json
    ...
```

### 3. Configure i18next

Create a central configuration file:

```typescript
// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

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
      loadPath: '/src/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'diprush-language',
    },
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
```

### 4. Adapt Language Context to Use i18next

```typescript
// src/context/LanguageContext.tsx
import { useTranslation } from 'react-i18next';
import { type ReactNode, createContext, useContext } from 'react';
import type { Language } from '@/types/ui';

// Update type definition to match locale codes
export type Language = 'en-US' | 'zh-CN';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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
```

### 5. Initialize i18n in Application Root

```typescript
// src/main.tsx
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import './i18n'; // Import configuration

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Suspense>
  </React.StrictMode>
);
```

### 6. Extract Translations

For each component with embedded translations:

1. Identify all translatable text
2. Categorize by component/page and create respective JSON files
3. Extract translations to the appropriate files

Example transformation for the Header component:

**Before:**
```typescript
const translations = {
  en: {
    dashboard: 'Dashboard',
    // Other translations...
  },
  zh: {
    dashboard: '仪表盘',
    // Other translations...
  },
};

const t = language === 'zh' ? translations.zh : translations.en;
```

**After (`/locales/en-US/header.json`):**
```json
{
  "dashboard": "Dashboard",
  "screener": "Screener",
  "settings": "Settings",
  "apiSettings": "API Settings",
  "language": "Language",
  "theme": "Theme",
  "about": "About",
  "logout": "Logout",
  "light": "Light",
  "dark": "Dark",
  "system": "System",
  "english": "English",
  "chinese": "Chinese",
  "apiKeyStatus": "API Key Status:",
  "valid": "Valid",
  "invalid": "Not Set",
  "menu": "Menu",
  "logoIcon": "DipRush Logo"
}
```

**After (`/locales/zh-CN/header.json`):**
```json
{
  "dashboard": "仪表盘",
  "screener": "筛选器",
  "settings": "设置",
  "apiSettings": "API 设置",
  "language": "语言",
  "theme": "主题",
  "about": "关于",
  "logout": "登出",
  "light": "亮色",
  "dark": "暗色",
  "system": "系统",
  "english": "英语",
  "chinese": "中文",
  "apiKeyStatus": "API 密钥状态:",
  "valid": "有效",
  "invalid": "未设置",
  "menu": "菜单",
  "logoIcon": "DipRush 标志"
}
```

### 7. Refactor Components to Use Translation Hooks

**Before:**
```typescript
const t = language === 'zh' ? translations.zh : translations.en;

return (
  <h1>{t.title}</h1>
);
```

**After:**
```typescript
import { useTranslation } from 'react-i18next';

// Inside component:
const { t } = useTranslation('header');

return (
  <h1>{t('title')}</h1>
);
```

### 8. Handle Special Cases

#### Dynamic Content/Interpolation
```typescript
// Translation file
{
  "welcome": "Welcome, {{name}}!"
}

// Component
t('welcome', { name: userName })
```

#### Pluralization
```typescript
// Translation file
{
  "result": "{{count}} result",
  "result_plural": "{{count}} results"
}

// Component
t('result', { count: resultCount })
```

### 9. Migration Strategy

1. **Phase 1: Infrastructure Setup**
   - Install i18next and related packages
   - Configure i18next
   - Adapt LanguageContext to work with i18next
   - Set up directory structure

2. **Phase 2: Component-by-Component Migration**
   - Start with the most frequently used components
   - Extract translations to JSON files
   - Update components to use translation hooks
   - Test each component after migration

3. **Phase 3: Clean Up**
   - Remove unused translation code
   - Consolidate common translations
   - Document translation patterns

### 10. Testing & Validation

Test the application thoroughly after migration:
- Verify language switching works correctly
- Check that all translated content appears properly
- Test dynamic content with interpolation
- Ensure proper fallback for missing translations

## Timeline

- **Week 1:** Infrastructure setup, extract translations from main pages
- **Week 2:** Migrate remaining components, testing
- **Week 3:** Final clean-up, documentation, validation

## Benefits

This refactoring will:
- Improve code maintainability and readability
- Enable easier addition of new languages
- Provide better separation of concerns
- Make translation updates easier (without code changes)
- Support advanced i18n features like pluralization and formatting