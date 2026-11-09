import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';
import { deleteEvent, logout, setStatus, togglePublished } from './actions';
import { EventForm } from './EventForm';

export const dynamic = 'force-dynamic';

const fmt = (d: Date) =>
  d.toLocaleString('mk-MK', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Skopje' });

const label = { PENDING: 'Чека одобрување', CONFIRMED: 'Одобрена', CANCELLED: 'Одбиена' } as const;

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login');

  const [events, reservations] = await Promise.all([
    prisma.event.findMany({ orderBy: { startsAt: 'desc' }, include: { _count: { select: { reservations: true } } } }),
    prisma.reservation.findMany({ orderBy: [{ status: 'asc' }, { createdAt: 'desc' }], take: 200, include: { event: { select: { title: true } } } }),
  ]);

  return (
    <main className="admin">
      <div className="admin-wrap">
        <header className="admin-head">
          <h1>Admin</h1>
          <form action={logout}><button className="btn outline small">Одјава</button></form>
        </header>

        <section className="admin-card">
          <h2>Нов настан</h2>
          <EventForm />
        </section>

        <section className="admin-card">
          <h2>Настани ({events.length})</h2>
          {events.length === 0 && <p className="muted">Нема настани.</p>}
          <div className="tbl">
            {events.map((e) => (
              <div className="trow" key={e.id}>
                <div>
                  <strong>{e.title}</strong>
                  <div className="muted">{fmt(e.startsAt)}{e.location ? ` · ${e.location}` : ''}</div>
                  <div className="muted">Резервации: {e._count.reservations} · {e.published ? 'Објавен' : 'Скриен'}</div>
                </div>
                <div className="acts">
                  <form action={togglePublished}>
                    <input type="hidden" name="id" value={e.id} />
                    <button className="btn outline small">{e.published ? 'Скриј' : 'Објави'}</button>
                  </form>
                  {e._count.reservations === 0 && (
                    <form action={deleteEvent}>
                      <input type="hidden" name="id" value={e.id} />
                      <button className="btn outline small">Избриши</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h2>Резервации ({reservations.length}) · чекаат: {reservations.filter((r) => r.status === 'PENDING').length}</h2>
          {reservations.length === 0 && <p className="muted">Нема резервации.</p>}
          <div className="tbl">
            {reservations.map((r) => (
              <div className="trow" key={r.id}>
                <div>
                  <strong>#{r.id} {r.name}</strong> · {r.guests} гости · {r.category}
                  <div className="muted">{r.event.title}</div>
                  <div className="muted">{r.phone}{r.email ? ` · ${r.email}` : ''}</div>
                  {r.note && <div className="muted">„{r.note}"</div>}
                </div>
                <div className="acts">
                  <span className={`badge ${r.status.toLowerCase()}`}>{label[r.status]}</span>
                  {r.status !== 'CONFIRMED' && (
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="CONFIRMED" />
                      <button className="btn primary small">Одобри</button>
                    </form>
                  )}
                  {r.status !== 'CANCELLED' && (
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="CANCELLED" />
                      <button className="btn outline small">Одбиј</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
