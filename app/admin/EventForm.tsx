'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createEvent } from './actions';

export function EventForm() {
  const [state, action, pending] = useActionState(createEvent, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state && 'ok' in state) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="form">
      <label className="field"><span>Наслов</span><input name="title" required maxLength={160} /></label>
      <label className="field"><span>Датум и час</span><input name="startsAt" type="datetime-local" required /></label>
      <label className="field"><span>Локација</span><input name="location" maxLength={200} /></label>
      <label className="field"><span>Опис</span><textarea name="description" rows={3} maxLength={1000} /></label>
      <div className="three">
        <label className="field"><span>Gold ден.</span><input name="priceGold" type="number" min={0} inputMode="numeric" /></label>
        <label className="field"><span>Silver ден.</span><input name="priceSilver" type="number" min={0} inputMode="numeric" /></label>
        <label className="field"><span>Red ден.</span><input name="priceRed" type="number" min={0} inputMode="numeric" /></label>
      </div>
      <label className="check"><input name="published" type="checkbox" defaultChecked /> Објавен (видлив за резервации)</label>
      {state && 'error' in state && <p className="ferr" role="alert">{state.error}</p>}
      {state && 'ok' in state && <p className="okmsg">Настанот е креиран.</p>}
      <button className="btn primary" disabled={pending}>{pending ? 'Се зачувува...' : 'Креирај настан'}</button>
    </form>
  );
}
