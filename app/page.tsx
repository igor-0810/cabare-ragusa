'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HomeTopBar } from '@/components/TopBar';
import { useLang } from '@/components/LangProvider';

export default function Home() {
  const { t } = useLang();

  return (
    <main className="screen home">
      <Image src="/images/chandelier.jpg" alt="" width={720} height={344} priority className="deco chandelier" />
      <Image src="/images/lady.jpg" alt="" width={290} height={585} className="deco lady" />
      <Image src="/images/champagne.jpg" alt="" width={280} height={335} className="deco champagne" />

      <div className="inner">
        <HomeTopBar />

        <section className="hero">
          <h1 className="visually-hidden">Cabaret Park by Ragusa Group</h1>
          <Image src="/images/logo.jpg" alt="Cabaret Park by Ragusa Group" width={420} height={125} priority className="logo" />
          <p className="show">{t('show')}</p>
          <div className="rule" />
          <h2 className="tagline">{t('tagline')}</h2>
        </section>

        <div className="ticket">
          <div className="cell">
            <div className="big">02</div>
            <div className="label">{t('dateMonth')}</div>
          </div>
          <div className="cell grow">
            <div className="mid">{t('dateWeekday')}</div>
            <div className="label">{t('dateYear')}</div>
          </div>
          <div className="cell last">
            <div className="time">{t('time')}</div>
            <div className="label">{t('start')}</div>
          </div>
        </div>

        <div className="ctas">
          <Link href="/seats" className="btn primary">{t('buyTicket')}</Link>
          <Link href="/menu" className="btn outline">{t('viewMenu')}</Link>
        </div>
      </div>

      <p className="foot">
        {t('location')}
        <br />
        {t('pricesFrom')}
      </p>
    </main>
  );
}
