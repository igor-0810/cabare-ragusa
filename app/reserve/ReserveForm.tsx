'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { BackBar } from '@/components/TopBar';
import { useLang } from '@/components/LangProvider';
import { CATEGORIES, MAX_GUESTS, validate, type CategoryId, type FieldErrors } from '@/lib/reservation';
import type { Key } from '@/lib/i18n';

type EventOpt = { id: number; title: string; startsAt: string };

const fmt = (iso: string, lang: string) =>
  new Date(iso).toLocaleString(lang === 'en' ? 'en-GB' : 'mk-MK', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Skopje' });

export function ReserveForm({ events }: { events: EventOpt[] }) {
  const { t, lang } = useLang();
  const params = useSearchParams();
  const initialCat = CATEGORIES.find((c) => c === params.get('cat')?.toUpperCase()) ?? 'GOLD';

  const [eventId, setEventId] = useState<number | null>(events[0]?.id ?? null);
  const [category, setCategory] = useState<CategoryId>(initialCat);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [doneId, setDoneId] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = {
      eventId,
      name: f.get('name'),
      phone: f.get('phone'),
      email: f.get('email'),
      guests: f.get('guests'),
      note: f.get('note'),
      category,
      lang,
    };

    const v = validate(payload);
    if (!v.ok) {
      setErrors(v.errors);
      return;
    }
    setErrors({});
    setServerError(false);
    setBusy(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v.data),
      });
      if (res.status === 422) {
        setErrors((await res.json()).fields ?? {});
      } else if (!res.ok) {
        setServerError(true);
      } else {
        setDoneId((await res.json()).id);
      }
    } catch {
      setServerError(true);
    } finally {
      setBusy(false);
    }
  }

  if (doneId !== null) {
    return (
      <main className="screen reserve">
        <div className="inner">
          <BackBar />
          <div className="done">
            <div className="diamond" />
            <h1>{t('okTitle')}</h1>
            <p>{t('okText')}</p>
            <p className="ref">{t('okRef')}: #{doneId}</p>
            <Link href="/" className="btn outline">{t('okHome')}</Link>
          </div>
        </div>
      </main>
    );
  }

  if (events.length === 0) {
    return (
      <main className="screen reserve">
        <div className="inner">
          <BackBar />
          <div className="done"><p>{t('noEvents')}</p></div>
        </div>
      </main>
    );
  }

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <span className="ferr" role="alert">{t(errors[k] as Key)}</span>
    ) : null;

  return (
    <main className="screen reserve">
      <div className="inner">
        <BackBar />

        <header className="seats-head">
          <h1>{t('reserveTitle')}</h1>
          <p>{t('reserveSub')}</p>
        </header>

        <form className="form" onSubmit={onSubmit} noValidate>
          <fieldset className="field">
            <legend>{t('fEvent')}</legend>
            <div className="event-pick">
              {events.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  aria-pressed={eventId === ev.id}
                  className={eventId === ev.id ? 'cat on' : 'cat'}
                  onClick={() => setEventId(ev.id)}
                >
                  <span className="cat-text">
                    <span className="cat-name">{ev.title}</span>
                    <span className="cat-desc">{fmt(ev.startsAt, lang)}</span>
                  </span>
                </button>
              ))}
            </div>
            {err('eventId')}
          </fieldset>

          <label className="field">
            <span>{t('fName')}</span>
            <input name="name" autoComplete="name" maxLength={120} aria-invalid={!!errors.name} />
            {err('name')}
          </label>

          <label className="field">
            <span>{t('fPhone')}</span>
            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} aria-invalid={!!errors.phone} />
            {err('phone')}
          </label>

          <label className="field">
            <span>{t('fEmail')}</span>
            <input name="email" type="email" autoComplete="email" maxLength={160} aria-invalid={!!errors.email} />
            {err('email')}
          </label>

          <label className="field">
            <span>{t('fGuests')}</span>
            <select name="guests" defaultValue="2">
              {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {err('guests')}
          </label>

          <fieldset className="field">
            <legend>{t('fCategory')}</legend>
            <div className="seg">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  className={category === c ? 'tab on' : 'tab'}
                  onClick={() => setCategory(c)}
                >
                  {c[0] + c.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            {err('category')}
          </fieldset>

          <label className="field">
            <span>{t('fNote')}</span>
            <textarea name="note" rows={3} maxLength={500} />
            {err('note')}
          </label>

          {serverError && <p className="ferr" role="alert">{t('errServer')}</p>}

          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? t('sending') : t('submit')}
          </button>
        </form>
      </div>
    </main>
  );
}
