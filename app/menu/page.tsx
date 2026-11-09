'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BackBar } from '@/components/TopBar';
import { useLang } from '@/components/LangProvider';
import { menuItems, menuTabs, type TabId } from '@/lib/menu-data';

export default function MenuPage() {
  const { lang, t } = useLang();
  const [tab, setTab] = useState<TabId>('cocktails');

  return (
    <main className="screen menu">
      <Image src="/images/tray.jpg" alt="" width={290} height={270} priority className="deco tray" />

      <div className="inner">
        <BackBar
          right={
            <Link href="/seats" className="btn outline small">{t('tickets')}</Link>
          }
        />

        <header className="menu-head">
          <div className="diamond" />
          <h1 className="menu-title">{t('menuTitle')}</h1>
          <p className="menu-sub">{t('menuSub')}</p>
        </header>

        <div className="tabs" role="tablist">
          {menuTabs.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={tab === m.id}
              className={tab === m.id ? 'tab on' : 'tab'}
              onClick={() => setTab(m.id)}
            >
              {m.label[lang]}
            </button>
          ))}
        </div>

        <div className="list">
          {menuItems[tab].map((it) => (
            <div className="row" key={it.mk.name}>
              <div className="row-name">{it[lang].name}</div>
              <div className="row-desc">{it[lang].desc}</div>
            </div>
          ))}
        </div>

        <div className="menu-foot">
          <p>{t('menuNote')}</p>
          <Link href="/seats" className="btn primary small">{t('buyTicket')}</Link>
        </div>
      </div>
    </main>
  );
}
