'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BackBar } from '@/components/TopBar';
import { useLang } from '@/components/LangProvider';

const cats = [
  { id: 'gold', name: 'Gold', descKey: 'gold', color: 'linear-gradient(145deg,#f0cf8a,#b98a35)' },
  { id: 'silver', name: 'Silver', descKey: 'silver', color: 'linear-gradient(145deg,#e9e9ee,#9b9ba5)' },
  { id: 'red', name: 'Red', descKey: 'red', color: 'linear-gradient(145deg,#d8394f,#7a1424)' },
] as const;

export default function SeatsPage() {
  const { t } = useLang();
  const [cat, setCat] = useState<(typeof cats)[number]['id']>('gold');
  const current = cats.find((c) => c.id === cat)!;

  return (
    <main className="screen seats">
      <div className="inner">
        <BackBar right={<span className="datechip">02.12.2026 · 20:00</span>} />

        <header className="seats-head">
          <h1>{t('seatsTitle')}</h1>
          <p>{t('seatsSub')}</p>
        </header>

        <Image
          src="/images/map.jpg"
          alt={t('mapAlt')}
          width={662}
          height={523}
          priority
          className="map"
        />

        <div className="cats">
          {cats.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={cat === c.id}
              className={cat === c.id ? 'cat on' : 'cat'}
              onClick={() => setCat(c.id)}
            >
              <span className="dot" style={{ background: c.color }} />
              <span className="cat-text">
                <span className="cat-name">{c.name}</span>
                <span className="cat-desc">{t(c.descKey)}</span>
              </span>
              <span className="cat-price">{t('price')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bar">
        <div className="bar-text">
          <div className="bar-title">{current.name} {t('category')}</div>
          <div className="bar-sub">{t('perTable')}</div>
        </div>
        <Link href={`/reserve?cat=${cat}`} className="btn primary">{t('buyTicket')}</Link>
      </div>
    </main>
  );
}
