# Cabaret Night (Next.js)

Next.js (App Router) + TypeScript. Три страни: почетна, мени, седишта. MK/EN прекинувач.

## Старт

```bash
npm install
npm run dev
```

Отвори http://localhost:3000. Дизајнот е мобилен (макс. 430px) и стои во средина на поголеми екрани.

## Структура

- `app/page.tsx`, `app/menu/page.tsx`, `app/seats/page.tsx`: страниците
- `app/globals.css`: целиот стил и бојата/фонтовите како CSS променливи
- `components/`: `LangProvider` (MK/EN) и `TopBar`
- `lib/i18n.ts`: преводи; `lib/menu-data.ts`: примерно мени
- `public/images/`: логото и сликите исечени од скриншотовите

## Што да заменеш

1. **Слики:** `public/images/*.jpg` се исечени од скриншот (720px). Замени ги со оригиналите, по можност PNG/WebP со проѕирна позадина. Со проѕирна позадина може да се тргне `mix-blend-mode: lighten` и маските во `globals.css`.
2. **Содржина:** `[ЦЕНА]` и `[ЛОКАЦИЈА]` во `lib/i18n.ts`, и примерното мени во `lib/menu-data.ts`.
3. **Билети:** копчето „Купи билет" на `/seats` сега нема акција. Закачи го на klikart.mk линк или на вашиот checkout.
4. **Мапа:** сега е слика, па се избира категорија, не поединечна маса. За избор на маса треба мапа со броеви и податоци за зафатеност.

## Резервации (Prisma + MySQL)

```bash
docker compose up -d          # MySQL (или користи свој MySQL и смени DATABASE_URL во .env)
npm run db:push               # ги креира Event и Reservation табелата Reservation
npm run dev
```

- Админ панел: `/admin` (лозинка = `ADMIN_TOKEN` од `.env`). Креирање/објавување/бришење настани, преглед на резервации и промена на статус
- Табела `Event` (наслов, датум/час, локација, опис, цени, објавен). Секоја резервација припаѓа на настан
- `GET /api/events`: јавна листа на претстојни објавени настани
- Форма: `/reserve` (се стигнува од `/seats`, категоријата се пренесува како `?cat=gold`)
- `POST /api/reservations`: зачувува резервација (валидација во `lib/reservation.ts`, иста на клиент и сервер)
- `GET /api/reservations`: листа, само со `Authorization: Bearer <ADMIN_TOKEN>` (од `.env`)
- Преглед на податоци: `npm run db:studio`
- Модел: `prisma/schema.prisma` (име, телефон, е-пошта, гости, категорија, забелешка, статус PENDING/CONFIRMED/CANCELLED)
- Пред продукција смени `ADMIN_TOKEN`
