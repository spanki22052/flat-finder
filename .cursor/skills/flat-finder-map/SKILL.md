---
name: flat-finder-map
description: Internal map of the Flat Finder monorepo (backend NestJS+Prisma, frontend Vite+React+FSD+AntD+styled-components, browser extension, Prisma schema). Use this skill whenever the user asks to explore, refactor, add a feature, or debug anything in /Users/tigrotigro/Git/flat-finder — for example: "add a new parser source", "add a field to Apartment end-to-end", "where is the X endpoint handled", "which file owns Y behavior", "explain the parser pipeline", "add a page", "wire a new Prisma field", "trace room-scoped auth", "what does the extension do", "show effective move-in cost", "how is deposit/commission parsed". Read this skill before touching any file you don't already know by name.
---

# Flat Finder — codebase map

Purpose: give the model a structural overview so the first tool calls land on the right file instead of burning tokens exploring. Read sections relevant to the current task; skip the rest.

Repo root: `/Users/tigrotigro/Git/flat-finder`. Three packages: `frontend/` (Vite + React), `backend/` (NestJS + Prisma), `extension/` (Chrome MV3). Rules live at `AGENTS.md` (project), `frontend/AGENTS.md`, `backend/AGENTS.md`.

---

## 1. Top-level layout

```
flat-finder/
├── AGENTS.md                 # cross-cutting: roles, .env, /api/v1, migrations via Prisma, docs/api.md sync
├── docs/
│   ├── api.md                # canonical /api/v1 contract — read before changing any DTO or shape
│   └── parser.md             # parser subsystem architecture
├── frontend/                 # Vite + React + FSD-lite + AntD + Styled Components + TanStack Query
│   ├── AGENTS.md             # frontend-specific conventions (FSD intent, query keys, axios rules)
│   ├── src/                  # see §3
│   ├── vite.config.ts        # proxy /api → http://localhost:3001, @/ → src/
│   └── tsconfig.json         # paths "@/*" → src/*
├── backend/                  # NestJS + Prisma + Postgres
│   ├── AGENTS.md
│   ├── prisma/               # schema.prisma + migrations/ + seed.ts
│   └── src/                  # see §2
└── extension/                # Chrome MV3 — see §5
```

Two long HTML dumps at repo root (`cianexample.html`, `domclick.html`) are gitignored debug fixtures; not part of source.

---

## 2. Backend (`backend/src/`)

Stack: **NestJS 10**, **Prisma 5 + Postgres**, **JWT** (`@nestjs/jwt` + `passport-jwt`), **bcrypt**, **cheerio**, **rebrowser-playwright 1.49.1** + `fingerprint-generator`/`fingerprint-injector` for stealth, **undici**, **class-validator** + **class-transformer**. Tests: **Jest 30** via `ts-jest`.

### 2.1 Bootstrap & globals — `src/main.ts`, `src/app.module.ts`

- `app.setGlobalPrefix('api/v1')` — every route lives under `/api/v1`.
- `app.use(json({ limit: '10mb' }))` — note: `parse-html` DTO enforces 2 MB cap on `html`.
- Global `ValidationPipe`: `whitelist + forbidNonWhitelisted + transform + enableImplicitConversion`.
- Global `AllExceptionsFilter` (`src/common/all-exceptions.filter.ts`) → `{ error: { code, message, details? } }` envelope.
- Global `TransformInterceptor` (`src/common/transform.interceptor.ts`) → wraps payloads in `{ data, meta? }`.
- CORS: `CORS_ORIGIN ?? http://localhost:5173`, credentials true.
- Port `process.env.PORT ?? 3001`.
- `AppModule` imports (order matters for DI): `ConfigModule.forRoot({ isGlobal: true })` → `PrismaModule, AuthModule, UsersModule, RoomsModule, ApartmentsModule, ContactsModule, RemindersModule`.

### 2.2 Auth scheme

- JWT via `Authorization: Bearer <token>`, 7-day expiry, secret from `JWT_SECRET` (fallback `dev-secret`).
- `JwtStrategy.validate()` resolves to `{ id, username, email?, role }` and is read by `@CurrentUser('id')` decorator.
- `RoomGuard` (`src/modules/rooms/guards/room.guard.ts`) reads `X-Room-Id` header, verifies membership, sets `request.roomId`. Decorate controllers with `@UseGuards(JwtAuthGuard, RoomGuard)` for room-scoped routes.
- `Public` decorator (`auth/decorators/public.decorator.ts`) marks routes that skip auth (`/auth/login`, `/auth/register`).
- Passwords hashed with bcrypt, `BCRYPT_ROUNDS` (default 10) from `.env`.

### 2.3 Common — `src/common/`

- `dto/pagination.dto.ts` — `PaginationDto`, `SortDto`, `parseSortParam()` for `?sort=field:order`.
- `transform.interceptor.ts` — wraps all responses in `{ data, meta? }`.
- `all-exceptions.filter.ts` — NestJS `HttpException` → error code mapping; catches body-parser `entity.too.large` → 413 `PAYLOAD_TOO_LARGE`.
- `response.ts` — `ApiResponse<T>`, `ApiMeta`, `ApiError`, `success()`, `paginated()` helpers.

### 2.4 Module map (one line each)

| Module | Folder | Purpose | Key files |
| --- | --- | --- | --- |
| Auth | `src/modules/auth/` | register/login/me, JWT, bcrypt | `auth.{module,controller,service}.ts`, `strategies/jwt.strategy.ts`, `guards/jwt-auth.guard.ts`, `decorators/{current-user,public}.decorator.ts`, `dto/{login,register}.dto.ts` |
| Users | `src/modules/users/` | profile read/update (`GET /users/:id`, `PATCH /users/:id`); no global list — members surfaced through room | `users.{module,controller,service}.ts`, `dto/update-user.dto.ts` |
| Rooms | `src/modules/rooms/` | multi-room workspaces, owners/members, invite codes | `rooms.{module,controller,service}.ts`, `guards/room.guard.ts`, `decorators/current-room.decorator.ts`, `dto/{create,update,join}-room.dto.ts` |
| Apartments | `src/modules/apartments/` | CRUD + tags + parser pipeline (the richest module) | `apartments.{module,controller,service}.ts`, `dto/{create,update,list}-apartment.dto.ts`, `parser/` (see §2.5) |
| Contacts | `src/modules/contacts/` | per-room seller/landlord contacts | `contacts.{module,controller,service}.ts`, `dto/contact.dto.ts` |
| Reminders | `src/modules/reminders/` | per-room (optionally per-apartment) reminders | `reminders.{module,controller,service}.ts`, `dto/reminder.dto.ts` |

The Prisma service is at `src/prisma/prisma.{module,service}.ts`, `@Global PrismaModule` exporting `PrismaService extends PrismaClient` with `onModuleInit`/`onModuleDestroy` lifecycle hooks.

### 2.5 Apartments parser — `src/modules/apartments/parser/` (deepest)

```
parser/
├── parser.module.ts          # imports RoomsModule, registers ParserController+ParserService
├── parser.controller.ts      # POST /apartments/parse-link, POST /apartments/parse-html (JwtAuthGuard+RoomGuard)
├── parser.service.ts         # orchestrator, withTimeout(55s), error mapping; instantiates strategies in ctor
├── dto/
│   ├── parse-link.dto.ts     # ParseLinkDto { url: IsUrl({ protocols: [http, https], require_protocol: true }) }
│   └── parse-html.dto.ts     # ParseHtmlDto { source∈HTML_PARSE_SOURCES, html ≤ 2_000_000 chars, sourceUrl? }
├── strategies/
│   ├── base.strategy.ts      # BaseListingParser + ParsedListing interface — read first
│   ├── cian.strategy.ts      # exports ParserBlockedError, ParserInvalidPageError (consumed cross-strategy)
│   ├── avito.strategy.ts
│   ├── yandex.strategy.ts
│   └── domclick.strategy.ts  # exports isDomclickBlocked, detectBlockMarkers, extractDomclickSsrState; helpers inline (parsePrice/matchMeta/htmlTitle/decodeEntities/inferCityFromUrl/extractRooms/extractArea/extractFloor)
├── utils/
│   ├── light-fetch.ts        # lightFetch(), BLOCK_MARKERS, looksBlocked(), extractJsonLd, extractNextData,
│   │                         # extractInlineConfig, extractCianBargainTerms, normalizeCurrency, getString, getNumber
│   ├── stealth.ts            # launchStealthBrowser(), createStealthContext(), navigator/canvas/webgl patches
│   ├── delays.ts             # randomDelay(minMs, maxMs)
│   ├── user-agents.ts        # randomUserAgent() — pool of 13 hand-picked modern UAs
│   ├── meta-parse.ts         # matchMeta, htmlTitle, decodeEntities, extractRoomsFromText, extractAreaFromText,
│   │                         # extractFloorFromTitle, inferCityFromUrl, parsePriceFromText, findParamNumber,
│   │                         # parseFloorFromParams
│   └── phones.ts             # extractPhones(text), extractPhonesFromTelLinks(html) → +7XXXXXXXXXX
└── __tests__/
    ├── fixtures/
    │   └── cian-sample.html  # used by cian-real.spec
    ├── parser.service.spec.ts
    ├── light-fetch.spec.ts
    ├── cian.strategy.spec.ts
    ├── cian-real.spec.ts     # reads cian-sample.html fixture (asserts bargainTerms)
    ├── avito.strategy.spec.ts
    ├── domclick.strategy.spec.ts
    ├── yandex.strategy.spec.ts
    └── phones.spec.ts
```

**Base interface** — `strategies/base.strategy.ts`:

```ts
export interface ParsedListing {
  source: ApartmentSource;          // 'MANUAL' | 'LINK' from @prisma/client
  sourceUrl: string;
  title: string;
  price: number;
  /** Залог (та же валюта, что price), одноразовый платёж. Parser-источники: cian, domclick. */
  deposit?: number;
  /** Комиссия риелтору, % от price, одноразовый платёж от арендатора. Parser-источники: cian, domclick. */
  agentCommissionPercent?: number;
  currency: Currency;               // 'EUR' | 'USD' | 'RUB' | 'PLN'
  city: string;
  district?: string;
  address?: string;
  rooms?: number;
  area?: number;
  floor?: number;
  totalFloors?: number;
  description?: string;
  photos?: string[];
  phones?: string[];
}

export abstract class BaseListingParser {
  abstract readonly name: string;
  abstract readonly hostnamePattern: RegExp;
  matches(url: string): boolean;       // this.hostnamePattern.test(new URL(url).hostname)
  abstract parse(url: string): Promise<ParsedListing>;
}
```

`deposit` / `agentCommissionPercent` are *optional*. Every strategy that doesn't extract them returns the base object — the UI falls back to a single price column.

**Deposit & commission source map (canonical — keep these in sync with `docs/api.md`)**:

| Strategy | `deposit` | `agentCommissionPercent` | Source path |
| --- | --- | --- | --- |
| `CianParser` | `bargainTerms.deposit` | `bargainTerms.clientFee` | `extractCianBargainTerms()` walks `"bargainTerms":{...}` in heavy SSR webpack chunk — balanced-bracket extractor (CIAN's `window._cianConfig['frontend-offer-card']` is not strict JSON). Falls back: also called from `mapJsonLd`/`mapFromMetaTags`. |
| `DomClickParser` | `productCard.priceInfo.deposit` | `productCard.priceInfo.commission` | `mapFromSsrState()` reads `window.__SSR_STATE__.productCard.priceInfo`. SSR state is not strict JSON: `undefined` literals replaced with `null` before `JSON.parse`. |
| `AvitoParser` | — | — | not extracted; user fills manually |
| `YandexRealtyParser` | — | — | not extracted; user fills manually |

**Strategies summary:**

| Strategy | `name` | hostnamePattern | Pipeline |
| --- | --- | --- | --- |
| `CianParser` | `'cian'` | `/(^\|\.)cian\.ru$/i` | `lightParse` → `heavyParse`. Light: JSON-LD → og:meta → `extractInlineConfig([_cianConfig, cianConfig, __INITIAL_STATE__])` → `extractNextData`. Heavy: Playwright + stealth, repeat mappers, fallback `extractFromDom(page)` (selects `data-name="OfferTitle"`/`PriceInfo`). Bargain terms read from any path via `extractCianBargainTerms()`. |
| `AvitoParser` | `'avito'` | `/(^\|\.)avito\.ru$/i` | CSR — light-fetch detects blocks; heavy always Playwright, waits for `[data-marker="item-view/title-info"]` then `extractFromDom` + `parseHtml` (cheerio). |
| `YandexRealtyParser` | `'yandex'` | `/(^\|\.)yandex\.ru$\|(^\|\.)realty\.yandex\.ru$/i` | Light: JSON-LD → `__INITIAL_STATE__` → `__NEXT_DATA__` (`extractNextData` covers Next/Nuxt/Avito `__preloadedState__`). Heavy: Playwright, repeat, fallback `extractFromDom` (`[data-testid="offer-title"]`). |
| `DomClickParser` | `'domclick'` | `/(^\|\.)domclick\.ru$\|(^\|\.)domclick\.com$/i` | Always Playwright (`PARSER_DOMCLICK_USE_CHROME` → system Chrome; default `headless: process.env.PARSER_HEADLESS`). Post-render `parseHtml()`: `mapFromSsrState` (window.__SSR_STATE__.productCard) → `mapFromJsonLd` → `mapFromMetaTags` (og:title regex `по адресу …`) → `extractFromDom(cheerio.load)`. `isDomclickBlocked()` ignores "forbidden" when `__SSR_STATE__` + `productCard` present. Photo URLs normalised to `https://img.dmclk.ru/...`. |

**Pipeline orchestration** (`parser.service.ts`):
- `parseLink(url)` → strategy match by `hostnamePattern` → `withTimeout(strategy.parse(url), TIMEOUT_MS)` (default 55 s, `PARSER_TIMEOUT_MS`).
- `parseHtml(dto)` → dispatch by `dto.source` to that strategy's `parseHtml(html, sourceUrl)`. DomClick: `throwOnFail: true`.
- `handleParseError` maps:
  - `ParserBlockedError` → 502 `PARSER_BLOCKED`
  - `ParserInvalidPageError` → 422 `PARSER_INVALID_PAGE`
  - `BadRequestException` → rethrow
  - timeout (`Error.message ~ /timeout/i`) → 504 `PARSER_TIMEOUT`
  - default → 502 `PARSER_FAILED`
- Default `sourceUrl` per source is used when `parse-html` doesn't supply one (`defaultSourceUrl(source)`).

**Anti-bot markers** (`BLOCK_MARKERS` in `light-fetch.ts`): `smartcaptcha`, `captcha-container`, `cf-challenge`, `cf-chl-bypass`, `checking your browser`, `access denied`, `forbidden`, `qrator`, `antibot`, `ваш браузер`. `extractDomclickSsrState()` replaces JS `undefined` literals with `null` before `JSON.parse` — DomClick's SSR isn't strict JSON. Anti-bot anti-fingerprint tuning lives in the sibling `super-parser` skill.

**Validation decorators used everywhere:** `class-validator` (`IsString IsNumber IsInt IsEmail IsUrl IsEnum IsArray IsOptional IsDateString IsIn Min Max MinLength MaxLength Length`) + `class-transformer` (`Type(() => Number)`).

### 2.6 Prisma — `backend/prisma/schema.prisma`

Postgres, generator `prisma-client-js`. One line per model:

- **`User`** — id (uuid), email? (@unique), username (@unique), password, name, role: `UserRole(USER|ADMIN)`, timestamps; relations: apartments (assignee), reminders (assignee), roomMemberships.
- **`Room`** — id, name, inviteCode (@unique), timestamps; relations: members, apartments, contacts, reminders, tags.
- **`RoomMember`** — id, roomId, userId, role: `RoomRole(OWNER|MEMBER)`, joinedAt; @@unique([roomId, userId]) @@index([userId]). FKs cascade on update, restrict on delete (re-attached by the deposit/commission migration).
- **`Apartment`** — id, roomId, title, source: `ApartmentSource(MANUAL|LINK)`, sourceUrl?, price (Float), **deposit? Float**, **agentCommissionPercent? Float**, currency: `Currency(EUR|USD|RUB|PLN)` (default `EUR`), city, district?, address?, rooms? Int, area? Float, floor? Int, totalFloors? Int, description?, photos String[] default [], phones String[] default [], status: `ApartmentStatus(NEW|ACTIVE|CALLBACK|VIEWING|REJECTED|DONE)`, contactId?, assigneeId?, timestamps; relations: room, contact, assignee (User "AssignedApartments"), reminders, tags. Indexes: roomId, status, city, assigneeId.
- **`ApartmentTag`** — id, roomId, name; @@unique([roomId, name]) @@index([roomId]); m2m with Apartment.
- **`Contact`** — id, roomId, name, phone?, telegram?, whatsapp?, email?, note?, timestamps; @@index([roomId]).
- **`Reminder`** — id, roomId, apartmentId?, title, dueAt, status: `ReminderStatus(PENDING|DONE|CANCELED)`, assigneeId, timestamps; relations: room, apartment, assignee ("AssignedReminders"). Indexes: roomId, status, assigneeId.

### 2.7 Migrations — `backend/prisma/migrations/`

Provider `postgresql`. Existing migrations:

```
20260630121149_init/
20260630124500_add_username/
20260702204436_add_apartment_phones/
20260709133352_drop_calls_module/      # removed an earlier "calls" module
20260726063123_add_rooms/              # adds Room + RoomMember + roomId columns
20260802140200_add_apartment_deposit_commission/   # adds Apartment.deposit + Apartment.agentCommissionPercent + re-attaches RoomMember FKs
migration_lock.toml                    # provider = "postgresql"
```

New fields → `npx prisma migrate dev --name <slug>` (committed via `backend/prisma/migrations/`).

### 2.8 Seed — `backend/prisma/seed.ts` (ts-node)

- bcrypt-hashes `password123` (10 rounds).
- Upserts `admin` (ADMIN) and `demo` (USER) users.
- Creates "Demo Room" with both users as members (demo = OWNER, admin = MEMBER).
- Creates tags `центр`, `новый дом`, `с ремонтом` (room-scoped).
- Inserts three demo apartments:
  - `2-к Москва ACTIVE` — MANUAL, RUB, deposit=85000, agentCommissionPercent=50 (shows effective price in UI).
  - `Studio Park Gorkogo NEW` — LINK + sourceUrl, RUB, no deposit/commission (parser-fills-the-rest).
  - `3-к СПб CALLBACK` — MANUAL, EUR, no deposit/commission.

### 2.9 Tests

`cd backend && npm test` (Jest 30 + ts-jest). Pre-existing known issues — do not assume "the suite is broken" if you see these:

- `parser.service.spec.ts` has a 30-s timeout test that intentionally uses a never-resolving promise to assert `PARSER_TIMEOUT` mapping — slow but correct.
- `domclick.strategy.spec.ts` and `avito.strategy.spec.ts` access internals via `as unknown as { … }.method` casts — fragile if internal renames happen.
- `light-fetch.spec.ts` covers `extractCianBargainTerms()` directly (fixture in spec), and `cian-real.spec.ts` reads `fixtures/cian-sample.html` and asserts `deposit: 15000, agentCommissionPercent: 70` end-to-end.

### 2.10 Backend scripts — `backend/package.json`

```
build                nest build
start / start:dev / start:prod / lint / test / test:watch / test:coverage
prisma:generate / prisma:migrate / prisma:migrate:deploy / prisma:studio / prisma:seed
```

---

## 3. Frontend (`frontend/src/`)

Stack: **React 18**, **Vite 5**, **TypeScript 5.5** (strict, ESNext), **Ant Design 5.19** (themed via `ConfigProvider`), **styled-components 6**, **@tanstack/react-query 5.101**, **react-router-dom 6.26**, **axios 1.18**, **dayjs 1.11** (+ `relativeTime` plugin), **framer-motion 11**. `@/*` path alias → `src/*`.

### 3.1 Layout FSD-lite

FSD is *intent* here, not strict hierarchy. Real structure:

```
src/
├── main.tsx                   # entry — ReactDOM.createRoot + import './app/config/dayjs' + AppProviders > AppRouter
├── app/
│   ├── config/
│   │   └── dayjs.ts           # dayjs.extend(relativeTime), dayjs.locale('ru'); imported once from main.tsx
│   ├── providers/
│   │   ├── AppProviders.tsx   # queryClient + AntD ConfigProvider (ru_RU, custom theme) + AntdApp + BrowserRouter + AuthProvider + RoomProvider + GlobalStyles
│   │   ├── AuthProvider.tsx   # localStorage('token'), /auth/me on mount, login/register/logout/refresh
│   │   ├── RoomProvider.tsx   # useGetRooms + localStorage('roomId'), selectRoom/clearRoom/refetchRooms
│   │   ├── ProtectedRoute.tsx # redirects unauthenticated → /login
│   │   └── RequireRoom.tsx    # redirects to /rooms when no currentRoomId
│   ├── routes/AppRouter.tsx   # react-router-dom Routes — see §3.4
│   └── styles/
│       ├── theme.ts           # Warm Hearth tokens (theme.colors.bg/text/primary/status, theme.gradients, theme.fonts, theme.radius, theme.shadows, theme.breakpoints, theme.transition)
│       └── GlobalStyles.ts    # createGlobalStyle — resets, body bg, scrollbar
├── pages/
│   ├── LoginPage/             # public
│   ├── RegisterPage/          # public
│   ├── RoomsPage/             # room selection / join (post-login)
│   ├── RoomManagePage/        # owner settings, invite-code regenerate, member list
│   ├── DashboardPage/         # stats, recent apartments, upcoming reminders
│   ├── ApartmentsPage/        # list + filter + Drawer form; mobile shell with cards + filters
│   ├── ApartmentDetailPage/   # hero card with price+deposit+commission; gallery; info; meeting modal
│   ├── ImportPage/            # decodes the extension's `#data=<base64>` hash, calls parse-html
│   ├── RemindersPage/         # full reminders CRUD; pending/completed split; mobile shell
│   ├── ProfilePage/           # own profile + teammate card variant at /users/:id
│   └── TeamPage/              # useTeamData hook + member UI (desktop + mobile variants)
├── widgets/
│   └── Layout/
│       ├── Layout.tsx               # desktop TopBar (search + room switcher + bell + settings) | mobile room bar + bottom nav
│       ├── styled.ts                # all layout styling
│       ├── components/
│       │   ├── LayoutSidebar.tsx    # nav (dashboard/apartments/reminders/team/profile) + role + logout
│       │   ├── BottomNav.tsx        # mobile nav with reminder badge
│       │   ├── NotificationsDropdown.tsx       # pending reminders preview, markDone action, uses dayjs (relativeTime)
│       │   ├── AuroraBackground/    # ambient gradient backdrop
│       │   └── (styled.ts files colocated)
│       └── hooks/usePendingReminders.ts        # polls /reminders?status=PENDING every 60 s + on visibilitychange
├── entities/
│   ├── Flat/
│   │   ├── model/types.ts                  # Apartment, ApartmentSource, ApartmentStatus, Currency, CreateApartmentPayload (incl. deposit/agentCommissionPercent), UpdateApartmentPayload, GetApartmentsParams, ApartmentsMeta, ApartmentsResponse, HtmlParseSource, ParsedApartment (incl. deposit/agentCommissionPercent)
│   │   ├── utils/
│   │   │   ├── api.ts                      # flatApi.* — REST methods (getList, getOne, create, update, delete, updateTags, parseLink, parseHtml, getNextReminder)
│   │   │   ├── parseLink.ts                # isSupportedParseUrl(hostname regex array — mirrors backend strategies), PARSE_LINK_PLACEHOLDER, PARSE_LINK_HINT
│   │   │   ├── price.ts                    # getEffectiveMoveInCost(apt) — returns price + deposit + price*agentCommissionPercent/100; undefined if neither deposit nor commission set
│   │   │   └── importHash.ts               # decodes the extension hash for /import
│   │   └── hooks/useFlats.ts               # FLAT_KEYS + useGetFlats, useGetFlat, useCreateFlat (invalidates lists), useUpdateFlat (invalidates detail + lists), useDeleteFlat, useUpdateFlatTags
│   └── Room/
│       ├── model/types.ts                  # Room, RoomMember, RoomRole, CreateRoomPayload, JoinRoomPayload
│       ├── utils/api.ts                    # roomApi.* (getList, getOne, create, join, getMembers, regenerateInviteCode, removeMember, update, leave)
│       └── hooks/useRooms.ts               # ROOM_KEYS + useGetRooms(enabled), useGetRoom, useGetRoomMembers, useCreateRoom, useJoinRoom, useRegenerateInviteCode, useUpdateRoom, useRemoveRoomMember, useLeaveRoom
└── shared/
    └── api/
        ├── client.ts                       # apiClient (axios instance), ApiResponse<T>, ApiMeta, ApiError, getApiError — request interceptor adds Bearer + X-Room-Id; response interceptor handles 401 (token clear + redirect /login) and ROOM_REQUIRED/ROOM_ACCESS_DENIED (roomId clear + redirect /rooms)
        ├── endpoints.ts                    # authApi, usersApi, contactsApi, remindersApi — generic resources not yet split into entities/
        └── types.ts                        # User, AuthResponse, Contact, Reminder, ReminderStatus, CreateReminderPayload, UpdateReminderPayload, DashboardStats
```

#### 3.1.1 Deposit & commission on the frontend

- `entities/Flat/model/types.ts` → `Apartment`, `CreateApartmentPayload`, `ParsedApartment` (parser prefilled) carry `deposit?` and `agentCommissionPercent?`.
- Form (ApartmentsPage Drawer) — "Параметры" section has two extra inputs: `Залог` (number) and `Комиссия риелтору, %` (number).
- `getEffectiveMoveInCost()` (in `entities/Flat/utils/price.ts`) is the single source of truth for "с учётом всего" — used by:
  - `ApartmentsPage` desktop `PriceTagMeta` + mobile `MobilePriceMeta`
  - `ApartmentDetailPage` `PriceMeta` line under hero price
  - Returns `undefined` when neither deposit nor commission is set → callers hide the secondary line entirely.
- `applyParsedData()` in `ApartmentsPage` populates both fields from parser output → user can edit before save.

### 3.2 Provider order (matters)

`AppProviders.tsx` wraps in this order, outermost to innermost: **QueryClientProvider → ConfigProvider(ru_RU, theme={token, components}) → AntApp → BrowserRouter → AuthProvider → RoomProvider → GlobalStyles → children**. Dayjs is configured outside the React tree (`main.tsx` → `import './app/config/dayjs'`) so `relativeTime` is available everywhere before first render.

### 3.3 Theme — `app/styles/theme.ts` (Warm Hearth tokens)

Single source of truth for styled-components. Token groups:

- `theme.colors.bg.{surface, surfaceDim, surfaceLow, surfaceContainer, surfaceContainerHigh, surfaceContainerHighest, card}` (M3-derived names; aliases `base`, `deep`, `cardHover`, `glass`, `glassBorder` kept for older styled files).
- `theme.colors.text.{primary, secondary, muted, onPrimary, inverse}`.
- `theme.colors.{primary, primaryHover, primaryFixed, primaryFixedDim, onPrimaryFixed, onPrimaryFixedVariant, secondary, secondaryContainer, tertiary, tertiaryContainer, tertiaryFixed, tertiaryFixedDim, outline, outlineVariant, error, onError, errorContainer}`.
- `theme.colors.accent.{primary, primaryLight, secondary, tertiary, highlight}` (legacy nesting).
- `theme.colors.status.{NEW, ACTIVE, CALLBACK, VIEWING, REJECTED, DONE}` — same key names as `ApartmentStatus`.
- `theme.gradients.{primaryHero, warmSurface, amberGlow, sunset, accent, success, warning, danger, aurora1-3, card}`.
- `theme.radius.{sm, md, lg, xl, pill, full}`, `theme.shadows.{card, cardHover, soft, sidebar, primary, glow, glowSecondary}`, `theme.fonts.{sans, mono}`, `theme.breakpoints.{sm, md, lg, xl, xxl}`, `theme.transition`.

AntD `token` + per-component overrides live **inside `AppProviders.tsx`** (parallel system). Brand color is `#964325`; hover `#b55b3b`; active `#7a2f12`; bg base `#fff8f5`. **Touch both files when changing brand colors.**

### 3.4 Routes — `app/routes/AppRouter.tsx`

```
/login, /register              — public
<ProtectedRoute>
  /rooms                       — choose / create / join room
  <RequireRoom>
    <Layout>
      /                        → /dashboard
      /dashboard, /rooms/manage, /apartments, /apartments/:id, /import, /reminders,
      /profile, /users/:id, /team
```

### 3.5 TanStack Query convention

- Query keys: one object per entity: `FLAT_KEYS`, `ROOM_KEYS` (look in `entities/<E>/hooks/use<Entity>s.ts`). Pattern: `['entity']` → `['entity', 'list', params]` → `['entity', 'detail', id]`.
- Mutations `onSuccess` invalidate the relevant `lists()` / `detail(id)`.
- Mutation hooks live next to the query hooks in the same `<entity>/hooks/` file.

### 3.6 Shared API client — `shared/api/client.ts`

- `API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1'`.
- Request interceptor: adds `Authorization: Bearer <localStorage.token>` and `X-Room-Id: <localStorage.roomId>`.
- Response interceptor: 401 → clear token + redirect `/login`; `ROOM_REQUIRED` / `ROOM_ACCESS_DENIED` → clear roomId + redirect `/rooms` (only if not already there).
- `ApiError`, `getApiError()` — standard error extraction.

### 3.7 Frontend scripts

```
dev          vite
build        tsc -b && vite build
lint         eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0
preview      vite preview
```

`vite.config.ts` proxies `/api → http://localhost:3001` (so frontend can use relative `/api/v1/...` in dev).

---

## 4. API contract — `docs/api.md` (canonical)

- Base URL `/api/v1`. Auth: `Authorization: Bearer <jwt>`. Room: `X-Room-Id: <roomId>` on every room-scoped endpoint.
- Envelopes: success `{ data, meta? }`; error `{ error: { code, message, details? } }`.
- Pagination: `?page=1&pageSize=20`, response `meta: { page, pageSize, total }`. Sorting: `?sort=createdAt:desc`. Filters per field.

**Endpoints (auth = JWT, room = `X-Room-Id`):**

| Method | Path | Auth | Room | Notes |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | — | — | body `{ username, password, name, email? }` |
| POST | `/auth/login` | — | — | body `{ login (username OR email), password }` |
| GET | `/auth/me` | ✓ | — | `{ data: { user } }` |
| GET / PATCH | `/users/:id` | ✓ | — | profile only |
| POST | `/rooms` / `/rooms/join` / `/rooms/:id/invite-code/regenerate` | ✓ | — | manage own rooms |
| GET / PATCH / DELETE | `/rooms/:id` (+ `/leave`, `/members`, `/members/:userId`) | ✓ | — | members / owners only |
| GET / GET / POST / PATCH / DELETE | `/apartments` / `/apartments/:id` / … | ✓ | ✓ | tags + status + assignee |
| GET | `/apartments/:id/next-reminder` | ✓ | ✓ | nearest pending reminder |
| POST | `/apartments/parse-link` | ✓ | ✓ | body `{ url }` → PrefilledApartment (incl. deposit/agentCommissionPercent) |
| POST | `/apartments/parse-html` | ✓ | ✓ | body `{ source: 'avito'\|'cian'\|'domclick'\|'yandex', html, sourceUrl? }` |
| GET / POST / PATCH / DELETE | `/contacts` family | ✓ | ✓ | |
| GET / POST / PATCH / DELETE | `/reminders` family | ✓ | ✓ | filters: status, assigneeId, from, to |

**Error codes catalogue:** `VALIDATION_ERROR 400`, `UNAUTHORIZED 401`, `ROOM_REQUIRED 400`, `FORBIDDEN 403`, `ROOM_ACCESS_DENIED 403`, `NOT_FOUND 404`, `CONFLICT 409`, `ROOM_ALREADY_MEMBER 409`, `ROOM_OWNER_CANNOT_LEAVE 409`, `INTERNAL 500`. Parser-specific: `PARSER_UNSUPPORTED_SOURCE 400`, `PARSER_INVALID_PAGE 422`, `PARSER_BLOCKED 502`, `PARSER_TIMEOUT 504`, `PARSER_FAILED 502`.

**Apartment entity field list (also used as PrefilledApartment from parsers):** `id, title, source: 'MANUAL'|'LINK', sourceUrl?, price, deposit?, agentCommissionPercent?, currency, city, district?, address?, rooms?, area?, floor?, totalFloors?, description?, photos?, phones?, status, tags[], contactId?, assigneeId?, createdAt, updatedAt`.

`deposit` / `agentCommissionPercent` filled by parser **only** for:
- **cian.ru** — from `bargainTerms.deposit` (`integer`, RUB) and `bargainTerms.clientFee` (`integer`, % of price). `extractCianBargainTerms` walks the heavy webpack chunk; called from `mapJsonLd`, `mapFromMetaTags` (and effectively from `mapCianConfig` because the heavy SSR state always contains the block).
- **domclick.ru** / `domclick.com` — from `productCard.priceInfo.deposit` (number, RUB) and `productCard.priceInfo.commission` (number, % of price) inside `window.__SSR_STATE__`.

For Avito and Yandex fields are not extracted; the form (or user) fills them manually. The UI calls `getEffectiveMoveInCost(apt)` (`price + deposit + price * agentCommissionPercent / 100`) to render "с учётом всего" / "Действительная стоимость" only when either field is present.

Auth flow summary: register/login → JWT in localStorage + `Authorization: Bearer`. After login → `GET /rooms` → pick/create/join → store roomId in localStorage → next requests carry `X-Room-Id`. Invalid/empty room code path: backend returns `ROOM_REQUIRED` / `ROOM_ACCESS_DENIED` → frontend interceptor strips roomId and redirects to `/rooms`.

---

## 5. Browser extension (`extension/`)

Chrome MV3. Manifest `manifest_version: 3`. Purpose: on listing pages of avito.ru / cian.ru / domclick.ru / domclick.com / realty.yandex.ru / yandex.ru / realty.ya.ru, inject a floating "+" button that grabs `outerHTML` of the doc + `location.href`, base64-encodes `{ source, html, sourceUrl }`, and opens `{FRONTEND_URL}/import#data=<base64>` in a new tab. Frontend `/import` decodes the hash, calls `POST /apartments/parse-html` (already authenticated), shows form preview, user saves normally. Backend stores nothing intermediate — the hash is a pure transport envelope.

Files: `manifest.json`, `src/background.js` (service worker), `src/content.js` (floating button + payload capture), `src/content.css`, `src/options.html`, `src/options.js` (frontend URL setting), `icons/icon{16,32,48,128}.png`.

---

## 6. Cross-cutting conventions

- TypeScript strict everywhere. Backend `module: commonjs` + ES2022 + `emitDecoratorMetadata`; backend uses `.js` import suffix on TS sources (ESM-style in CommonJS module). Frontend `module: ESNext` + `@/*` path alias.
- **API prefix `/api/v1/`.** Document breaking changes by bumping `/api/v2`; additive changes stay on v1.
- **No Docker in dev** except Postgres. Backend + frontend run as separate processes; Postgres is the only container.
- **`.env` per project half** (`backend/.env`, `frontend/.env`). No secrets in repo. Frontend's only env is `VITE_API_URL` (optional, defaults to `/api/v1`).
- **Prisma migrations only via `prisma migrate`.** Never manually SQL the schema. Migration names: `<date>_<slug>/migration.sql`.
- **API contract changes sync rule:** edit `docs/api.md` *before* implementing the change. Then DTO/service/UI updates follow.
- **Adding a new field to an existing entity:** `prisma migrate dev` → update DTOs → service `APARTMENT_SELECT` / equivalent → frontend types in `entities/<E>/model/types.ts` → UI usages. If the field participates in display derivation (e.g. `getEffectiveMoveInCost`), add a util in `entities/Flat/utils/`. Document in `docs/api.md`.
- Russian UI text everywhere; code comments mixed RU/EN. Names prioritized over abbreviations — no silent shortening (e.g. `flatApi.getList`, not `flatApi.gL`).
- TypeScript source filenames kebab-case where React idiomatic (but the existing code uses PascalCase like `ApartmentsPage.tsx` for top-level component files).
- **Dayjs plugins** must be registered in `app/config/dayjs.ts` before any `dayjs.format()` call expects relative-time; import the file from `main.tsx` so it runs once at startup.

---

## 7. AGENTS.md pointer summary (cross-reference)

- Root `AGENTS.md`: roles (Frontend / Backend / Integration), `.env` per half, `/api/v1/` prefix, migrations only via Prisma, no manual schema edits, no committed secrets, names over abbreviations, doc sync rule.
- `backend/AGENTS.md`: NestJS + Prisma + Postgres in Docker, modules layout, JWT auth, `class-validator` for DTOs, migrations atomic + meaningful name, response envelope `{ data, meta?, error? }`.
- `frontend/AGENTS.md`: Vite + React + FSD + AntD ConfigProvider + Context (no Redux) + TanStack Query + Axios. Layout intent is FSD; `shared/api/client.ts` interceptor pattern. Components kebab-case-or-PascalCase per existing pattern. `*.styled.ts` files. Russian labels.
- Sibling skill `super-parser` (in `~/.cursor/skills/super-parser`) — go there for: anti-bot specifics (rebrowser-playwright modes, TLS, canvas, behavioral signals), per-site extraction recipes, env-var tuning, debugging block markers.

---

## 8. Quick-reference matrix for common tasks

| Task | Backend touch points | Frontend touch points | Docs |
| --- | --- | --- | --- |
| Add parser source | new file `parser/strategies/<x>.strategy.ts` extending `BaseListingParser`; register in `parser.service.ts` strategy array; util helpers in `parser/utils/` if reusable; tests in `parser/__tests__/` | add hostname regex to `entities/Flat/utils/parseLink.ts` `SUPPORTED_HOST_PATTERNS` | bump `docs/api.md` Parsers section |
| Add field to Apartment end-to-end | `prisma/schema.prisma` + new migration in `prisma/migrations/`; DTOs `dto/{create,update,list}-apartment.dto.ts`; expand `APARTMENT_SELECT` in `apartments.service.ts`; if parser-relevant, also add to `strategies/base.strategy.ts` `ParsedListing`, add mapper paths in each strategy that can extract it, and (for cian) consider `extractCianBargainTerms`. Add tests | `entities/Flat/model/types.ts` `Apartment`/`CreateApartmentPayload`/`ParsedApartment`; consume in pages (ApartmentsPage / ApartmentDetailPage); if it's a derived display (e.g. `getEffectiveMoveInCost`), add helper in `entities/Flat/utils/` | `docs/api.md` Apartment entity block + parser field note if extracted from listings |
| Add frontend page | n/a | new `pages/<PageName>/<PageName>.tsx` + `styled.ts`; import + route in `app/routes/AppRouter.tsx`; if data-driven, add API in `shared/api/endpoints.ts` or new `entities/<E>/` | n/a |
| Add backend API endpoint | `modules/<m>/<m>.controller.ts` + `<m>.service.ts` + `dto/<m>.dto.ts`; @UseGuards auth + RoomGuard if room-scoped; update `APARTMENT_SELECT` etc. if it returns entities | consume in new/existing page; add to `shared/api/endpoints.ts` or matching entity `utils/api.ts`; add to `entities/<E>/hooks/use<Entity>s.ts` `KEYS` + mutation hook | `docs/api.md` — add the row to the endpoints table; describe request/response shape |
| Add Prisma model field (non-Apartment) | `prisma/schema.prisma` + migration; DTOs for the related entity; service SELECT | `entities/<E>/model/types.ts` `<E>` payload + DTO; consumers | `docs/api.md` — add field to the entity block |
| Change theme color | n/a | `app/styles/theme.ts` `theme.colors.*` **and** `app/providers/AppProviders.tsx` AntD theme `token` (`colorPrimary`, `colorPrimaryHover`, `colorPrimaryActive`, etc.) — keep the two parallel systems in sync | n/a |
| Add new entity | `prisma/schema.prisma`; new `modules/<m>/`; DTOs | new `entities/<E>/` with `model/types.ts`, `utils/api.ts`, `hooks/use<Entity>s.ts`; consume in pages | `docs/api.md` — new section + endpoints table |
| Add shared API method | n/a (uses existing endpoint) | add to `shared/api/endpoints.ts` or `entities/<E>/utils/api.ts`; add TanStack wrapper in `entities/<E>/hooks/use<Entity>s.ts` | n/a |
| Render move-in cost | n/a | call `getEffectiveMoveInCost(apt)` from `entities/Flat/utils/price`; shows `price + deposit + price*% / 100`; hide line when undefined | n/a |
| Wire a new dayjs format/relative-time helper | n/a | ensure `app/config/dayjs.ts` is imported from `main.tsx`; add the plugin there; export helpers from `shared/datetime` if reused | n/a |
| Tune parser anti-bot | env (`PARSER_HEADLESS`, `PARSER_PROXY_URL`, `PARSER_TIMEOUT_MS`, `REBROWSER_PATCHES_RUNTIME_FIX_MODE=alwaysIsolated`, `REBROWSER_PATCHES_UTILITY_WORLD_NAME`) → see `super-parser` skill | n/a | n/a |

---

## 9. Working style reminders

- **`AGENTS.md` first** — read the relevant AGENTS.md before assuming a convention ("Frontend AGENTS.md" or "Backend AGENTS.md"). Quick violations (e.g. abbreviating names, committing secrets) cause rework.
- **`docs/api.md` is the contract** — for any change to a DTO shape, contract, or error code, edit it in the same change. The frontend `entities/<E>/model/types.ts` is the implementation; `docs/api.md` is the source of truth.
- **For parser changes**, every strategy has its own `.spec.ts`. Read both `base.strategy.ts` (interface contract) and the existing strategy you are extending before you write anything. For CIAN specifically, `extractCianBargainTerms` is the canonical place to start if you're touching deposit/commission logic.
- **For migrations**, run `npx prisma migrate dev --name <slug>` from `backend/` after every schema change.
- **For commands**, work in the right directory: `cd backend && …` or `cd frontend/...`. Never run cross-package scripts.
- **Known flaky / slow tests** (§2.9) — do not chase them as regressions; they pass with longer timeout or are intentionally slow. If a non-flaky test fails, fix it.
- **Theme has two parallel systems** — `theme.ts` (used by styled-components via `theme.colors`) and AntD `ConfigProvider` token map in `AppProviders.tsx`. Touch both when changing brand colors.
- **`X-Room-Id` is mandatory on every room-scoped endpoint.** Forgetting it leads to `ROOM_REQUIRED` 400; the user lands on `/rooms` automatically via response interceptor.
- **Parser dev** — `PARSER_HEADLESS=true` (default), `PARSER_PROXY_URL` (optional), `PARSER_DOMCLICK_USE_CHROME=true` (default → uses system Chrome via `chromium.launch({ channel: 'chrome' })`). Don't trigger browser from sandboxed environments — `npx jest` is fine, `parse-link` against a live site is not.
- **Parser anti-bot tuning** belongs to the `super-parser` skill; this map only tracks the wiring on the backend. Don't duplicate CDP/runtime-mode details here.
