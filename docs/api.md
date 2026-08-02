# Flat Finder — API Contract (`/api/v1`)

## Conventions

- Base URL: `/api/v1`.
- Auth header: `Authorization: Bearer <jwt>`.
- Room header: `X-Room-Id: <roomId>` — required on all room-scoped endpoints (see [Rooms](#rooms)).
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

- `GET /users/:id` — возвращает `User` (`id`, `username`, `email?`, `name`, `role`, `createdAt`, `updatedAt`).
- `PATCH /users/:id` — body partial (only own profile fields: `name`, `email`; `role` осталась в DTO для админских нужд, но обычные пользователи не могут её менять сами — проверка на уровне сервиса не входит в объём этой задачи).

Глобального списка пользователей больше нет — участники видны только в контексте комнаты, см. `GET /rooms/:id/members`.

## Rooms

Комната (Room) — это общее пространство для квартир/контактов/напоминаний/тегов. Пользователь может быть участником нескольких комнат и переключаться между ними на фронте; сервер не хранит "текущую" комнату в токене — клиент передаёт её явно в каждом запросе.

Room entity:

```
{
  id: string
  name: string
  inviteCode: string       // 8 символов, для присоединения других пользователей
  role: "OWNER" | "MEMBER" // роль текущего пользователя в этой комнате
  membersCount: number
  createdAt: string
}
```

RoomMember entity (в `GET /rooms/:id/members`):

```
{
  id: string          // userId
  name: string
  email?: string
  role: "OWNER" | "MEMBER"
  joinedAt: string
}
```

Endpoints (guard: только JWT, без `X-Room-Id` — это управление списком комнат самого пользователя):

- `POST /rooms` — body `{ name: string }`. Создаёт комнату, текущий пользователь становится `OWNER`, генерируется уникальный `inviteCode`. Возвращает `{ data: Room }`.
- `POST /rooms/join` — body `{ inviteCode: string }`. Добавляет текущего пользователя как `MEMBER`. Если код не найден — `NOT_FOUND` (`ROOM_NOT_FOUND`). Если пользователь уже состоит в этой комнате — `CONFLICT` (`ROOM_ALREADY_MEMBER`). Возвращает `{ data: Room }`.
- `GET /rooms` — список комнат текущего пользователя (для экрана выбора комнаты после логина). Возвращает `{ data: Room[] }`.
- `GET /rooms/:id` — детали комнаты, включая `inviteCode`, видна только участникам, иначе `FORBIDDEN` (`ROOM_ACCESS_DENIED`).
- `PATCH /rooms/:id` — body `{ name: string }`. Переименовать комнату, только `OWNER`, иначе `FORBIDDEN`. Возвращает `{ data: Room }`.
- `POST /rooms/:id/invite-code/regenerate` — перегенерировать `inviteCode`. Только `OWNER`, иначе `FORBIDDEN`. Возвращает `{ data: Room }`.
- `DELETE /rooms/:id/leave` — выйти из комнаты. `OWNER` не может выйти (`CONFLICT`, код `ROOM_OWNER_CANNOT_LEAVE`) — передача владения и удаление комнаты не входят в эту итерацию.
- `GET /rooms/:id/members` — список участников комнаты, только для участников.
- `DELETE /rooms/:id/members/:userId` — удалить участника из комнаты. Только `OWNER`, иначе `FORBIDDEN`. `OWNER` не может выгнать сам себя (`CONFLICT`, код `ROOM_OWNER_CANNOT_LEAVE`). Несуществующий участник → `NOT_FOUND`.

Все остальные ресурсы (`apartments`, `contacts`, `reminders`, tags, парсер) требуют заголовок `X-Room-Id` с id одной из комнат пользователя:

- Заголовок отсутствует → `400` (`ROOM_REQUIRED`).
- Пользователь не состоит в указанной комнате → `403` (`ROOM_ACCESS_DENIED`).
- Комната не найдена → `403` (`ROOM_ACCESS_DENIED`) (не раскрываем существование чужих комнат через `404`).

UI flow:

1. После логина/регистрации фронт вызывает `GET /rooms`.
2. Если комнат 0 — экран "Создать комнату" / "Присоединиться по коду".
3. Если комнат 1+ — экран выбора комнаты (можно сразу создать/присоединиться к ещё одной). Пользователь выбирает комнату → фронт запоминает `roomId`, дальше передаёт его в `X-Room-Id` для всех запросов к apartments/contacts/reminders.
4. После выбора комнаты — обычный дашборд и остальные страницы.
5. Свитчер комнаты (например, в профиле/сайдбаре) сбрасывает `roomId` и возвращает на экран выбора комнаты.

## Apartments

Все endpoints требуют заголовок `X-Room-Id` (см. [Rooms](#rooms)); данные видны и создаются только в рамках указанной комнаты.

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
  phones?: string[]
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
- `GET /apartments/:id/next-reminder` — возвращает ближайшее `PENDING` напоминание, привязанное к квартире, у которого `dueAt >= now()`. Ответ: `{ data: Reminder | null }` (полная форма Reminder; `null` если ничего не запланировано).
- `POST /apartments/parse-link` — body `{ url: string }`. Парсит объявление с поддерживаемого источника и возвращает поля для префилла формы (см. секцию [Parse Link](#parse-link)).
- `POST /apartments/parse-html` — body `{ source: "avito" | "domclick", html: string, sourceUrl?: string }`. Разбирает сохранённый HTML карточки без загрузки сайта; возвращает поля для префилла формы.

## Tags & Statuses

- Tags are free-form strings, unique per room; managed per apartment. Требует `X-Room-Id`.
- Statuses are enum-constrained (see entity above).

## Contacts

Все endpoints требуют заголовок `X-Room-Id`; контакты общие для всех участников комнаты.

```
{
  id, name, phone?, telegram?, whatsapp?, email?, note?, createdAt, updatedAt
}
```

- `GET /contacts`, `GET /contacts/:id`, `POST /contacts`, `PATCH /contacts/:id`, `DELETE /contacts/:id`.

## Reminders

Все endpoints требуют заголовок `X-Room-Id`; напоминания общие для всех участников комнаты (но `assigneeId` указывает конкретного ответственного).

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
- `ROOM_REQUIRED` — 400, заголовок `X-Room-Id` не передан.
- `FORBIDDEN` — 403.
- `ROOM_ACCESS_DENIED` — 403, пользователь не состоит в указанной комнате.
- `NOT_FOUND` — 404.
- `CONFLICT` — 409 (e.g. email already in use).
- `ROOM_ALREADY_MEMBER` — 409, пользователь уже состоит в комнате.
- `ROOM_OWNER_CANNOT_LEAVE` — 409, владелец не может выйти из своей комнаты.
- `INTERNAL` — 500.

## Parse Link

Endpoint: `POST /api/v1/apartments/parse-link`. Требует заголовок `X-Room-Id` (парсер не создаёт запись, но живёт в модуле apartments, который room-scoped).

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
    "photos": ["https://cdn.cian.ru/photo1.jpg"],
    "phones": ["+79991234567"]
  }
}
```

Поддерживаемые источники: `cian.ru`, `avito.ru`, `yandex.ru/realty`/`realty.yandex.ru`, `domclick.ru`/`domclick.com` (включая региональные поддомены, напр. `tyumen.domclick.ru/card/rent__flat__…`).

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

Парсер пытается извлечь телефон(ы) из `description` страницы (российские форматы `+7…` / `8…`); найденные номера возвращаются в `phones`, нормализованные к виду `+7XXXXXXXXXX`.

## Parse HTML

Endpoint: `POST /api/v1/apartments/parse-html`.

Запрос:

```
POST /apartments/parse-html
{
  "source": "avito",
  "html": "<!doctype html><html>...</html>",
  "sourceUrl": "https://www.avito.ru/moskva/kvartiry/..."
}
```

`source` обязателен: `avito`, `domclick`, `cian` или `yandex`. `sourceUrl` необязателен: без него в результате будет URL главной страницы выбранного источника. Сервер не выполняет сетевой запрос к площадке, а разбирает переданный HTML и возвращает тот же объект, что `parse-link`.

Ошибки: `PARSER_INVALID_PAGE` (`422`), `PARSER_BLOCKED` (`502`), `PARSER_FAILED` (`502`).

### Источник: расширение браузера

Помимо ручного экспорта HTML-файла, `parse-html` используется расширением Chrome «Flat Finder Importer» (см. `extension/`). Расширение:

1. На странице объявления (cian.ru, avito.ru, realty.yandex.ru/yandex.ru, domclick.ru/.com) показывает плавающую кнопку «+».
2. По клику собирает `outerHTML` документа и текущий `location.href`.
3. Кодирует `{ source, html, sourceUrl }` в `base64` и открывает `{FRONTEND_URL}/import#data=<base64>` в новой вкладке (адрес фронтенда задаётся в настройках расширения).
4. Фронтенд (`/import`) декодирует хэш на клиенте, вызывает `POST /apartments/parse-html` с уже открытой пользовательской сессией (JWT + `X-Room-Id`), показывает превью формы — пользователь проверяет и сохраняет как обычно.

Хэш никогда не попадает на сервер как отдельный токен — обмен идёт через тело `parse-html`, backend не хранит никаких временных записей для этого потока.

## Versioning

- Breaking changes → `/api/v2`.
- Additive changes (new optional fields, new endpoints) → stay on v1.
