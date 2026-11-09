export const CATEGORIES = ['GOLD', 'SILVER', 'RED'] as const;
export type CategoryId = (typeof CATEGORIES)[number];

export const MAX_GUESTS = 12;

export type ReservationInput = {
  eventId: number;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  category: CategoryId;
  note?: string;
  lang: 'mk' | 'en';
};

export type FieldErrors = Partial<Record<keyof ReservationInput, string>>;

/** Shared by the form (client) and the API route (server). Error values are i18n keys. */
export function validate(raw: unknown): { ok: true; data: ReservationInput } | { ok: false; errors: FieldErrors } {
  const b = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const errors: FieldErrors = {};

  const eventId = Number(b.eventId);
  if (!Number.isInteger(eventId) || eventId < 1) errors.eventId = 'errEvent';

  const name = str(b.name);
  if (name.length < 2 || name.length > 120) errors.name = 'errName';

  const phone = str(b.phone);
  if (!/^\+?[0-9\s\-/()]{7,20}$/.test(phone)) errors.phone = 'errPhone';

  const email = str(b.email);
  if (email && (email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) errors.email = 'errEmail';

  const guests = Number(b.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) errors.guests = 'errGuests';

  const category = str(b.category).toUpperCase();
  if (!CATEGORIES.includes(category as CategoryId)) errors.category = 'errCategory';

  const note = str(b.note);
  if (note.length > 500) errors.note = 'errNote';

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    data: {
      eventId,
      name,
      phone,
      email: email || undefined,
      guests,
      category: category as CategoryId,
      note: note || undefined,
      lang: b.lang === 'en' ? 'en' : 'mk',
    },
  };
}
