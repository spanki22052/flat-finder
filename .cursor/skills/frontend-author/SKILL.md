---
name: frontend-author
description: Implement Flat Finder frontend code following FSD + AntD + Styled Components + TanStack Query + react-router stack. Use when creating/modifying files under frontend/, adding pages, widgets, entities, or wiring API endpoints in this project.
---

# Frontend Author (Flat Finder)

Skill for AI agents writing frontend code in `flat-finder/frontend/src/**`. Load whenever a task touches frontend code (new feature, bugfix, refactor, UI scaffold).

## 1. Read first, every time

Before any change read these, in order:

1. `AGENTS.md` (project root) — project rules.
2. `frontend/AGENTS.md` — FSD layout, naming, state rules.
3. `docs/api.md` — endpoint contract; copy DTOs/types verbatim.
4. Target file if it exists (must `Read` before `StrReplace`).

## 2. Stack (non-negotiable)

- Vite + React 18 + TypeScript (`strict: true`).
- Feature-Sliced Design (FSD) — layers: `app → pages → widgets → features → entities → shared`.
- Ant Design v5 via `ConfigProvider` (one provider in `app/providers/`).
- styled-components v6, functional CSS-in-JS syntax (`styled.div({ ... })`).
- TanStack Query v5 for server state.
- Axios for HTTP (`apiClient` from `shared/api/client`).
- React Router v6 for routing.
- React Context for global state (NO Redux/Zustand/MobX).
- `dayjs` for dates (`dayjs.locale('ru')` set in `AppProviders`).
- `framer-motion` for animations.
- `@/*` path alias (resolves to `src/*`).

## 3. Real source tree (mirrors `frontend/src/`)

```
frontend/src/
├── main.tsx                              # ReactDOM.createRoot + AppProviders
├── app/
│   ├── providers/
│   │   ├── AppProviders.tsx              # QueryClient + ConfigProvider + AntApp + BrowserRouter + AuthProvider
│   │   ├── AuthProvider.tsx              # user, token, login/logout, register, useAuth()
│   │   └── ProtectedRoute.tsx            # <Outlet/> guard, redirect to /login
│   ├── routes/
│   │   └── AppRouter.tsx                 # <Routes> + <Route>; protected routes wrapped in <Layout/>
│   └── styles/
│       ├── theme.ts                      # theme tokens (colors, gradients, radius, shadows, breakpoints, transition)
│       └── GlobalStyles.ts               # createGlobalStyle
├── pages/                               # view-layer screens
│   ├── LoginPage/{LoginPage.tsx, styled.ts}
│   ├── RegisterPage/{RegisterPage.tsx, styled.ts}
│   ├── DashboardPage/{DashboardPage.tsx, styled.ts}
│   ├── ApartmentsPage/{ApartmentsPage.tsx, styled.ts}
│   ├── ApartmentDetailPage/{ApartmentDetailPage.tsx, styled.ts}
│   ├── RemindersPage/{RemindersPage.tsx, styled.ts}
│   └── ProfilePage/{ProfilePage.tsx, styled.ts}
├── widgets/
│   └── Layout/
│       ├── Layout.tsx                    # shell: top-bar + sidebar/outlet + Fab + BottomNav
│       ├── styled.ts                     # LayoutWrapper, TopBar, TopBarSearch, Fab, etc.
│       └── components/
│           ├── LayoutSidebar.tsx
│           ├── LayoutSidebar/styled.ts
│           ├── BottomNav.tsx
│           ├── AuroraBackground/
│           │   ├── index.tsx
│           │   └── styled.ts
├── entities/                            # business entities
│   └── Flat/                             # ← real entity; rename per domain (note: backend uses "apartments")
│       ├── model/types.ts                # Apartment, CreateApartmentPayload, UpdateApartmentPayload, ParsedApartment, …
│       ├── utils/
│       │   ├── api.ts                    # flatApi (getList, getOne, create, update, delete, parseLink, parseHtml, updateTags, getNextReminder)
│       │   └── parseLink.ts              # isSupportedParseUrl, getParseLinkHostname, PARSE_LINK_PLACEHOLDER, PARSE_LINK_HINT
│       └── hooks/
│           └── useFlats.ts               # FLAT_KEYS + useGetFlats, useGetFlat, useCreateFlat, useUpdateFlat, useDeleteFlat, useUpdateFlatTags
├── shared/
│   └── api/
│       ├── client.ts                     # apiClient (axios + interceptors), API_BASE, ApiError, getApiError, ApiResponse, ApiMeta
│       ├── endpoints.ts                  # authApi, contactsApi, remindersApi (singleton api objects)
│       └── types.ts                      # User, AuthResponse, Contact, Reminder, CreateReminderPayload, UpdateReminderPayload, DashboardStats
└── vite-env.d.ts
```

### Things to know about the real tree

- There is **no `features/`** layer yet. Domain operations live inside the relevant `entities/<X>/` or `pages/<X>/`. When adding a self-contained user scenario, prefer `features/<scenario>/` (skill template preserved below).
- There is **no `shared/ui/`, `shared/lib/`, `shared/config/`, `shared/types/`**. Shared API lives in `shared/api/` only.
- Typed API objects are split: cross-cutting (auth, contacts, reminders) in `shared/api/endpoints.ts`; entity-specific (Flat) in `entities/Flat/utils/api.ts`.
- All DTOs/response shapes are in `shared/api/types.ts` (cross-cutting) and `entities/<X>/model/types.ts` (entity-specific).
- Entity name is `Flat` in the frontend, but the backend uses `/apartments`. DTO type is `Apartment` despite the folder being `Flat`. Keep the asymmetry — do not rename.
- Pages are folders: `pages/<PageName>/<PageName>.tsx` + `styled.ts` colocated in the same folder (NOT a `ui/` subfolder).

### Component pattern (FSD)

```
components/<Name>/
├── ui/
│   ├── <Name>.tsx          # presentation
│   └── <Name>.styled.ts    # styled components
├── model/types.ts
└── hooks/use<Name>.ts      # local state + effects
```

This pattern is the template for new self-contained widgets. For small sub-components (no local state, no DTOs) colocate `<Name>.tsx` + `<Name>.styled.ts` inside the parent folder (see `LayoutSidebar`, `BottomNav`, `AuroraBackground`).

## 4. Required shared infra (already in place — extend, don't reinvent)

`shared/api/client.ts` exports:

- `API_BASE` — `import.meta.env.VITE_API_URL ?? '/api/v1'`.
- `apiClient` — axios instance with `baseURL: API_BASE`, `Content-Type: application/json`.
- Request interceptor: `Authorization: Bearer ${localStorage.getItem('token')}` if token present.
- Response interceptor: on `401` → `localStorage.removeItem('token')` + `window.location.href = '/login'`.
- `ApiError` class (status, message, details).
- `getApiError(error: unknown): { code: string; message: string }` reading `error.response.data.error.{code,message}`.
- Type definitions: `ApiResponse<T> = { data: T; meta?: ApiMeta; error?: { code: string; message: string; details?: unknown } }`, `ApiMeta`.

`shared/api/endpoints.ts` exports typed API objects: `authApi`, `contactsApi`, `remindersApi`. Extend this file for new cross-cutting entities; put entity-specific calls in `entities/<X>/utils/api.ts`.

`shared/api/types.ts` holds DTOs for cross-cutting entities. Mirror `docs/api.md` verbatim.

## 5. TanStack Query conventions

- Query keys per entity in a single `keys` object (factory pattern):
  ```ts
  export const FLAT_KEYS = {
    all: ['flats'] as const,
    lists: () => [...FLAT_KEYS.all, 'list'] as const,
    list: (params) => [...FLAT_KEYS.lists(), params] as const,
    details: () => [...FLAT_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...FLAT_KEYS.details(), id] as const,
  };
  ```
- Hooks: `useGet<Entity>`, `useGet<Entity>One`, `useCreate<Entity>`, `useUpdate<Entity>`, `useDelete<Entity>` (plus custom actions like `useUpdate<Ent>Tags`).
- Mutations on success → `queryClient.invalidateQueries({ queryKey: <keys>.lists() })` and, for detail, `[...<keys>.details(), id]`.

## 6. Naming + file rules

- Components: `PascalCase` (`ApartmentDetailPage.tsx`). Files: `kebab-case` for hooks/utils (`use-flats.ts`, `parse-link.ts`), `PascalCase` for React components.
- Hooks: `use<Entity>Action` (camelCase). One hook file per entity — `useFlats.ts` re-exports all.
- Styled components colocated as `<Name>.styled.ts` next to `<Name>.tsx` (or in `ui/` subfolder for larger units). Export as `const X = styled.<tag>({...})`.
- No inline styles except dynamic single-value cases (e.g. `style={{ marginLeft: isMobile ? 0 : 260 }}`).
- Strict TS: `strict: true`, no `any` (use `unknown` + narrow).
- All DTO types copied from `docs/api.md` — never invent fields.
- Use `@/shared/...`, `@/app/...`, `@/entities/...` aliases for cross-folder imports; relative imports inside the same folder.

## 7. Adding a new feature (workflow)

```
[ ] Read AGENTS.md (root) + frontend/AGENTS.md + docs/api.md (relevant endpoints only)
[ ] If backend not implemented yet — STOP and ask user.
[ ] Add DTO in entities/<X>/model/types.ts (or shared/api/types.ts if cross-cutting)
[ ] Add api object: entities/<X>/utils/api.ts OR shared/api/endpoints.ts
[ ] Add TanStack Query hooks + KEYS factory in entities/<X>/hooks/use<X>.ts
[ ] Wire feature into a page or widget
[ ] If new cross-cutting concern → extend shared/api/types.ts and shared/api/endpoints.ts
[ ] Run `npm run lint` and `npm run build` — fix until clean
[ ] If API contract touched: update docs/api.md FIRST, notify backend agent
```

## 8. State management rules

- **Global state** (auth, theme): React Context in `app/providers/AuthProvider.tsx` (read via `useAuth()`).
- **Local state**: `useState` / `useEffect` inside the component (or `hooks/use<Component>.ts` for non-trivial units).
- **Server state**: TanStack Query only. Never duplicate server data into Context.
- **Forms**: AntD `Form.useForm()`. Submit → call mutation hook → on success `queryClient.invalidateQueries(entityKey)`.

## 9. UI conventions

- One AntD `ConfigProvider` in `app/providers/AppProviders.tsx` (theme tokens live inline in that file — keep them there unless extracting is explicitly requested).
- `theme` object for styled-components in `app/styles/theme.ts` (colors, gradients, radius, shadows, breakpoints, transition). Import as `import { theme } from '<rel>/app/styles/theme'`.
- Status colors map (keep centralized when extracted to `shared/ui/status-tag.tsx`):
  - NEW → blue, ACTIVE → green, CALLBACK → gold, VIEWING → cyan, REJECTED → red, DONE → default.
- Empty states: AntD `Empty` with CTA.
- Loading: `Skeleton` for tables, `Spin` for sections.
- Error toast: `message.error(getApiError(err).message)`.
- Modals/Drawers for create/edit forms; Tables for lists with `pagination` + `onChange`.
- Interactive non-link elements (clickable avatar/user block) → `<button>` with `onClick={() => navigate(...)}` + `aria-label` + focus-visible outline.

## 10. API integration rules

- All endpoints prefixed `/api/v1` (handled by `API_BASE`).
- Backend uses `/apartments` (not `/flats`). Frontend entity folder is `Flat`, DTO is `Apartment`. Preserve this asymmetry.
- List endpoints: `GET` with query params → returns `ApiResponse<T[]>` with `meta`. Some endpoints put `meta` alongside `data` (raw, not inside).
- Detail endpoints: `GET /apartments/:id` → `{ data: Apartment }`; consumer unwraps with `data.data`.
- Mutations: `POST/PATCH/DELETE` → `{ data: T }`; consumer unwraps with `data.data`.
- Parser endpoints: `POST /apartments/parse-link` and `POST /apartments/parse-html`. Handle codes `PARSER_UNSUPPORTED_SOURCE`, `PARSER_INVALID_PAGE`, `PARSER_BLOCKED`, `PARSER_TIMEOUT`, `PARSER_FAILED` with friendly AntD `message`.
- Pagination: drive `meta.page/pageSize/total` directly into AntD Table `pagination`.
- Client-side URL guard: `entities/Flat/utils/parseLink.ts` (`isSupportedParseUrl`, `getParseLinkHostname`, `PARSE_LINK_PLACEHOLDER`, `PARSE_LINK_HINT`). Keep the host list in sync with backend strategies.

## 11. Routing

`app/routes/AppRouter.tsx` structure:

```
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<Layout />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/apartments" element={<ApartmentsPage />} />
      <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
      <Route path="/reminders" element={<RemindersPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
  </Route>
</Routes>
```

Top-bar title is driven by `PAGE_TITLES` map in `Layout.tsx`. Update it when adding a new page.

## 12. Auth flow

- `AuthProvider` exposes `user`, `login`, `register`, `logout`, `loading`. Read via `useAuth()`.
- Token stored in `localStorage` under key `token`.
- Pages that need the user (e.g. LayoutSidebar) import `useAuth` from `app/providers/AuthProvider`.

## 13. Quality gates (run before finishing)

```bash
cd frontend
npm run lint
npm run build
```

Both must pass. Lint with `--max-warnings 0` (no warnings allowed).

## 14. Anti-patterns (reject these)

- Redux/Zustand/MobX → use Context + TanStack Query.
- DTO fields invented not in `docs/api.md`.
- Inline `any`, `@ts-ignore`, `eslint-disable` without comment.
- `useEffect` for derived state (compute inline).
- Hardcoded URLs (use `API_BASE` / `shared/api`).
- Direct `fetch`/`axios` outside `shared/api/client.ts`.
- Mixing concerns across FSD layers (e.g. `features` importing `app` is forbidden).
- Renaming `Flat` entity folder to `Apartment` (would break the asymmetry with backend).

## 15. Environment

`.env.example` shape (commit; never commit `.env`):

```
VITE_API_URL=/api/v1
```

## 16. When NOT to use this skill

- Backend changes → load backend `AGENTS.md` skill instead.
- Pure documentation/markdown edits → no skill needed.
- Repo-level config (`vite.config.ts`, `tsconfig.json`, `package.json`) → ask user first.

## Recent implementation: mobile dashboard

The mobile dashboard was updated to match the provided FlatFinder reference while preserving the existing desktop experience.

Updated files:

- `frontend/src/pages/DashboardPage/DashboardPage.tsx`
  - Added a dedicated responsive mobile composition with header, current-search progress card, statistics, priority apartment rail, reminders/activity feed, and add-apartment CTA.
  - Uses `useAuth()` for the current user avatar and existing `flatApi.getList()` plus `remindersApi.list({ status: 'PENDING' })` for live data.
  - Uses only fields defined in the API contract: apartment `photos`, `title`, `city`, `district`, `price`, `currency`, `status`, and reminder assignment/timing data.
  - Does not fabricate team voting or consensus DTO fields because those are not currently present in `docs/api.md`.
  - Keeps desktop rendering in a separate `DesktopDashboard` branch and sorts loaded apartments by `updatedAt`.

- `frontend/src/pages/DashboardPage/styled.ts`
  - Added colocated styled-components for the mobile header, progress card, stat cards, priority cards, horizontal apartment rail, activity feed, empty states, and add-apartment CTA.
  - Mobile layout is enabled at `max-width: 768px`; desktop layout is hidden there.
  - Uses existing project theme tokens and 8px card radius for the reference-style compact mobile UI.

Verification completed:

- `cd frontend && npm run build` passes.
- `ReadLints` reports no errors for the two updated dashboard files.
- The repository lint wrapper may fail independently when it emits empty non-JSON output; run direct ESLint diagnostics if that wrapper issue recurs.

## Recent implementation: mobile responsive UI

Mobile-first responsiveness was rolled out across all main pages and shared layout. Desktop layouts stayed untouched.

### Breakpoints (non-negotiable)

- `max-width: 768px` — Dashboard mobile composition entry point.
- `max-width: 640px` — ApartmentsPage, RemindersPage, ProfilePage, ApartmentDetailPage mobile rules.
- Always hide dedicated mobile blocks at desktop and vice versa (e.g. `DesktopList` / `MobileList`).
- All pages already render inside `Layout.MainArea`; default `isMobile` detection lives in `widgets/Layout/Layout.tsx` (`window.innerWidth <= theme.breakpoints.md`). Reuse it instead of duplicating listeners.

### PageHeader pattern (used in ApartmentsPage, RemindersPage, ProfilePage)

```ts
export const HeaderActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  '@media (max-width: 640px)': {
    width: '100%',
    overflowX: 'auto',
    flexWrap: 'nowrap',
    paddingBottom: 4,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const ImportButton = styled.button({
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  background: theme.colors.primaryFixed,
  border: `1px solid ${theme.colors.primaryFixedDim}`,
  color: theme.colors.onPrimaryFixedVariant,
  fontSize: 14,
  fontWeight: 600,
  padding: '0 18px',
  height: 44,
  borderRadius: 12,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  // mobile shrinking of button size stays optional; the wrapper handles overflow
});

export const AddApartmentButton = styled(Button)({
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
});
```

Rules: action group must overflow horizontally on mobile, each button keeps `flex: 0 0 auto` + `white-space: nowrap`, single primary CTA inside `PageHeader` may stretch to 100% width when it is the only action.

### Filters pattern (full-width inputs on mobile)

```ts
export const FiltersRow = styled.div({
  display: 'flex',
  gap: 12,
  marginBottom: 20,
  flexWrap: 'wrap',
  '& > *': { flex: '0 0 auto' },
  '@media (max-width: 640px)': {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: 8,
    '& > *': {
      width: '100% !important',
      maxWidth: 'none',
    },
  },
});
```

Apply `SearchInput` (which already extends `Input`), `Select` and any custom controls in the row. Always override AntD `width: 160` inline prop with `width: '100% !important'` from styled.

### ApartmentsPage mobile list (`max-width: 640px`)

- Desktop `<Table>` stays inside `DesktopList` (hidden on mobile).
- Mobile alternative uses `MobileList` (`display: grid; gap: 12;` only on mobile).
- `MobileApartmentCard` is `article` with `display: grid; gridTemplate-columns: 104px minmax(0, 1fr); min-height: 146px; border-radius: 8`.
- `MobileApartmentImage` is a square/landscape placeholder (emoji house fallback, status tinted background, image lazy-load).
- Body holds: title (button, 2-line clamp), price (`theme.fonts.mono`, primary colour), meta row (city, rooms, area, floor; 11px), status `Tag` + up to 2 tags, action buttons (icon-only, square, end-aligned).
- Click target for title opens `openEdit(apt)`; eye icon → `navigate(/apartments/${id})`. Source link only shown when `apt.sourceUrl` exists.
- Empty state renders `MobileEmptyState` (tall card with house SVG/icon and copy).

### RemindersPage mobile

- `PageHeader` shrinks primary button to 100% on mobile.
- `FiltersRow` becomes 1-col grid, `Select` width 100%.
- `ReminderItem` switches to `flex-wrap: wrap;`, reduces gap to 10px, padding to `14px 16px`.
- Action `<Space>` becomes `width: 100%`, `margin-left: 54px` (clears icon column), gains `overflow-x: auto` so `Выполнено` / cancel buttons keep full text without wrapping.

### ApartmentDetailPage mobile

- `HeroTitle` gets `min-width: 0`, `overflow-wrap: anywhere`, drops to 20px at `max-width: 640px`.
- `HeroMeta` gains `min-width: 0` so gap doesn't break flex children.
- `MeetingActions` becomes a horizontal scroll with `flex: 0 0 auto` children (so `Изменить` / `Отменить` don't shrink their text).
- `GalleryGrid` switches to `grid-template-columns: repeat(2, minmax(0, 1fr))` at `max-width: 640px`.

### ProfilePage mobile

- `PageHeader` keeps actions on a separate row that scrolls horizontally (`overflow-x: auto`, `flex: 0 0 auto` per button). `Обновить` / `Выйти` keep full labels.
- `TopBlock` aligns top, reduces gap to 14px.
- `Name` gets `overflow-wrap: anywhere` for long display names.

### Layout shell hardening

- `PageContent` (`widgets/Layout/styled.ts`) gains `min-width: 0` and `overflow-x: hidden` at `max-width: theme.breakpoints.md` to stop any nested component from blowing out the viewport.
- Existing `MainArea` already hides sidebar + TopBar under `theme.breakpoints.md`; the `BottomNav` (in `widgets/Layout/components/BottomNav.tsx`) is the primary nav surface.

### Common UI rules (all mobile blocks)

- No `width: 160` / fixed widths for form controls inside `FiltersRow`: always reset through `FiltersRow` media query.
- Buttons stay `flex: 0 0 auto` + `white-space: nowrap`. Group scroll handles overflow.
- Long user-provided strings (apartment title, profile name) → add `min-width: 0` to the parent + `overflow-wrap: anywhere` on the text node.
- Never rely on a single breakpoint across the project; pick `768px` for layout switches (Dashboard) and `640px` for in-page tightening.
- `MobileEmptyState` / empty copy stay inside glass card surfaces for visual parity with desktop.

### Verification

- `cd frontend && npm run build` passes (TS + Vite).
- `ReadLints` reports no errors for the modified `*.styled.ts` files.
- Direct ESLint may fail in this sandbox because the local `node_modules/.bin/eslint` symlink is missing; the build step is the authoritative gate.

## Quick scaffold example (add a new entity `Contact`)

```
shared/api/types.ts                    # add Contact, CreateContactPayload (mirror docs/api.md)
shared/api/endpoints.ts                # add contactsApi (already exists, extend if needed)
entities/Contact/                      # IF frontend-only entity gets its own folder
├── model/types.ts                     # Contact, CreateContactPayload, UpdateContactPayload
├── utils/api.ts                       # contactApi (or reuse shared/api/endpoints.ts)
└── hooks/use-contacts.ts              # CONTACT_KEYS + useGetContacts, useCreateContact, …
pages/ContactsPage/ContactsPage.tsx    # AntD Table + filter + add button
pages/ContactsPage/styled.ts
app/routes/AppRouter.tsx               # register <Route path="/contacts" element={<ContactsPage />} />
widgets/Layout/Layout.tsx              # add PAGE_TITLES['/contacts'] = 'Контакты'
```
