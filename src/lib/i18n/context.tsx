'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Locale, type TranslationsType } from './translations';
import { applyTranslationOverrides } from '@/lib/content-defaults';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationsType;
  siteContent: Record<string, string>;
  refreshContent: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'id',
  setLocale: () => {},
  t: translations.id,
  siteContent: {},
  refreshContent: async () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('id');
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});

  const refreshContent = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      try {
        const local = window.localStorage.getItem('rider-horse-content');
        if (local) setSiteContent(JSON.parse(local));
      } catch {
        // Keep bundled defaults when local preview data is unavailable.
      }
      return;
    }
    const supabase = createClient();
    const { data } = await supabase.from('site_content').select('key,value');
    if (data) {
      setSiteContent(Object.fromEntries(data.map((item) => [item.key, item.value])));
    }
  }, []);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem('rider-horse-locale');
    const timeout = window.setTimeout(() => {
      if (savedLocale === 'id' || savedLocale === 'en') setLocale(savedLocale);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem('rider-horse-locale', locale);
  }, [locale]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void refreshContent(), 0);
    const handleUpdate = () => void refreshContent();
    window.addEventListener('rider-content-updated', handleUpdate);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('rider-content-updated', handleUpdate);
    };
  }, [refreshContent]);

  const t = useMemo(
    () => applyTranslationOverrides(translations[locale], locale, siteContent) as TranslationsType,
    [locale, siteContent]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, siteContent, refreshContent }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
