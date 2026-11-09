'use client';

import Link from 'next/link';
import { useLang } from './LangProvider';

export function HomeTopBar() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="topbar">
      <div className="topnav">
        <Link href="/menu" className="navlink">{t('menu')}</Link>
        <Link href="/seats" className="navlink">{t('seats')}</Link>
      </div>
      <div className="langpill" role="group" aria-label="Language">
        <button type="button" className={lang === 'mk' ? 'on' : ''} aria-pressed={lang === 'mk'} onClick={() => setLang('mk')}>MK</button>
        <button type="button" className={lang === 'en' ? 'on' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
      </div>
    </div>
  );
}

export function BackBar({ right }: { right?: React.ReactNode }) {
  const { t } = useLang();
  return (
    <div className="topbar">
      <Link href="/" className="navlink back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d9b36c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        {t('back')}
      </Link>
      {right}
    </div>
  );
}
