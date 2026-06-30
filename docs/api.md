# Flat Finder — API Contract (`/api/v1`)

## Conventions

- Base URL: `/api/v1`.
- Auth header: `Authorization: Bearer <jwt>`.
- Success envelope: `{ "data": T, "meta"?: { ... } }`.
- Error envelope: `{ "error": { "code": string, "message": string, "details"?: unknown } }`.
- All timestamps are ISO-8601 strings (UTC).
- Pagination: query `?page=1&pageSize=20`; response `meta: { page, pageSize, total }`.
- Filtering uses query params per field (e.g. `?status=ACTIVE&city=Berlin`).
- Sorting: `?sort=createdAt:desc`.

## Auth

- `POST /auth/register` — body `{ username, password, name, email? }`. Returns `{ data: { user, accessToken } }`.
- `POST /auth/login` — body `{ login, password }`. `login` can be username or email. Returns `{ data: { user, accessToken } }`.
- `GET /auth/me` — returns `{ data: { user } }`.

User entity:
```
{
  id: string
  username: string
  email?: string
  name: string
  role: "USER" | "ADMIN"
  createdAt: string
}
```

## Users

- `GET /users` — list (admin/team scope).
- `GET /users/:id`.
- `PATCH /users/:id` — body partial.

## Apartments

Entity:

```
{
  id: string (uuid)
  title: string
  source: "MANUAL" | "LINK"
  sourceUrl?: string
  price: number
  currency: "EUR" | "USD" | "RUB" | "PLN"
  city: string
  district?: string
  address?: string
  rooms?: number
  area?: number
  floor?: number
  totalFloors?: number
  description?: string
  photos?: string[]
  status: "NEW" | "ACTIVE" | "CALLBACK" | "VIEWING" | "REJECTED" | "DONE"
  tags: string[]            // tag names
  contactId?: string
  assigneeId?: string       // user who owns it
  createdAt: string
  updatedAt: string
}
```

Endpoints:

- `GET /apartments` — supports `status`, `city`, `tag`, `assigneeId`, `q`, `page`, `pageSize`, `sort`.
- `GET /apartments/:id`.
- `POST /apartments` — body `CreateApartmentDto` (subset of entity, excludes `id/timestamps`).
- `PATCH /apartments/:id` — body `UpdateApartmentDto` (partial).
- `DELETE /apartments/:id`.
- `POST /apartments/parse-link` — body `{ url: string }`. Парсит объявление с поддерживаемого источника и возвращает поля для префилла формы (см. секцию [Parse Link](#parse-link)).

## Tags & Statuses

- Tags are free-form strings; managed per apartment.
- Statuses are enum-constrained (see entity above).

## Contacts

```
{
  id, name, phone?, telegram?, whatsapp?, email?, note?, createdAt, updatedAt
}
```

- `GET /contacts`, `GET /contacts/:id`, `POST /contacts`, `PATCH /contacts/:id`, `DELETE /contacts/:id`.

## Calls

```
{
  id, apartmentId, contactId?, userId, calledAt, durationSec?, outcome: "REACHED" | "NO_ANSWER" | "VOICEMAIL" | "BUSY" | "CALLBACK",
  notes?, createdAt
}
```

- `GET /calls` — supports `apartmentId`, `userId`, `from`, `to`, `page`, `pageSize`.
- `POST /calls`, `PATCH /calls/:id`, `DELETE /calls/:id`.

## Reminders

```
{
  id, apartmentId?, title, dueAt, status: "PENDING" | "DONE" | "CANCELED",
  assigneeId, createdAt, updatedAt
}
```

- `GET /reminders` — supports `status`, `assigneeId`, `from`, `to`.
- `POST /reminders`, `PATCH /reminders/:id`, `DELETE /reminders/:id`.

## Error codes

- `VALIDATION_ERROR` — 400, `details` is array of field errors.
- `UNAUTHORIZED` — 401.
- `FORBIDDEN` — 403.
- `NOT_FOUND` — 404.
- `CONFLICT` — 409 (e.g. email already in use).
- `INTERNAL` — 500.

## Parse Link

Endpoint: `POST /api/v1/apartments/parse-link`.

Запрос:

```
POST /apartments/parse-link
{ "url": "https://www.cian.ru/sale/flat/123456/" }
```

Успешный ответ (`200`):

```
{
  "data": {
    "source": "LINK",
    "sourceUrl": "https://www.cian.ru/sale/flat/123456/",
    "title": "2-к квартира, 54 м², 5/9 эт.",
    "price": 85000,
    "currency": "RUB",
    "city": "Москва",
    "district": "Тверской",
    "address": "ул. Пушкина, д. 10",
    "rooms": 2,
    "area": 54,
    "floor": 5,
    "totalFloors": 9,
    "description": "Светлая квартира с ремонтом",
    "photos": ["https://cdn.cian.ru/photo1.jpg"]
  }
}
```

Поддерживаемые источники: `cian.ru`, `avito.ru`, `yandex.ru/realty`/`realty.yandex.ru`, `domclick.ru`/`domclick.com`.

Ошибки:

- `PARSER_UNSUPPORTED_SOURCE` (`400`) — URL с неподдерживаемого источника.
- `PARSER_INVALID_PAGE` (`422`) — страница не похожа на карточку объявления.
- `PARSER_BLOCKED` (`502`) — сайт заблокировал парсинг (капча / anti-bot). На UI пользователю нужно показать подсказку заполнить вручную.
- `PARSER_TIMEOUT` (`504`) — таймаут 25 секунд.
- `PARSER_FAILED` (`502`) — прочие ошибки парсера.

UI flow:

1. Юзер вставляет ссылку → Drawer переключается в режим "Ссылка" (или отдельный модал "Импорт").
2. Фронт вызывает `POST /apartments/parse-link`.
3. На успех — фронт префиллит форму и переключает в режим "Форма" для редактирования.
4. Юзер правит и нажимает "Создать" (или "Сохранить").

При создании квартиры фронт должен проставить `source: 'LINK'` и `sourceUrl`, чтобы в БД сохранилось происхождение объявления.

## Versioning

- Breaking changes → `/api/v2`.
- Additive changes (new optional fields, new endpoints) → stay on v1.
