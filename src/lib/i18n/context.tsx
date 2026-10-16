'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Locale, type TranslationsType } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationsType;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'id',
  setLocale: () => {},
  t: translations.id,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('id');
  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
