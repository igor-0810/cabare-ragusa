'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { dict, type Key, type Lang } from '@/lib/i18n';

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string };

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('mk');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'mk' || saved === 'en') setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {}
  }, []);

  const t = useCallback((k: Key) => dict[lang][k] as string, [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
