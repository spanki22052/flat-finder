# Parser — модуль парсинга объявлений

Бэкенд-модуль `backend/src/modules/apartments/parser/` извлекает поля из карточек
объявлений о квартирах на поддерживаемых сайтах: CIAN, Avito, Яндекс Недвижимость,
DomClick.

## Архитектура

```
parser/
├── parser.module.ts          # NestJS модуль
├── parser.service.ts         # оркестратор: выбор стратегии, таймаут, мап ошибок
├── parser.controller.ts      # POST /api/v1/apartments/parse-link
├── dto/parse-link.dto.ts     # валидация URL (class-validator)
├── strategies/
│   ├── base.strategy.ts      # ListingParser interface + matches()
│   ├── cian.strategy.ts      # light-fetch → SSR-state → Playwright
│   ├── avito.strategy.ts     # light-fetch → __INITIAL_STATE__ → Playwright
│   ├── yandex.strategy.ts    # light-fetch → __INITIAL_STATE__ → Playwright
│   └── domclick.strategy.ts  # light-fetch → Playwright HTML download → __SSR_STATE__/og/DOM
├── utils/
│   ├── stealth.ts            # playwright launch с anti-bot патчами
│   ├── delays.ts             # рандомные задержки
│   ├── user-agents.ts        # пул реальных UA
│   └── light-fetch.ts        # HTTP без браузера + extractors (JSON-LD, __NEXT_DATA__, _cianConfig, __INITIAL_STATE__)
└── __tests__/                # unit-тесты стратегий, light-fetch и ParserService
```

Каждая стратегия наследует `BaseListingParser` и реализует:
- `name` — короткий идентификатор (`cian`, `avito`, `yandex`, `domclick`);
- `hostnamePattern` — regex для определения источника по URL;
- `parse(url)` — возвращает `ParsedListing`.

`ParserService.parseLink(url)`:
1. Находит подходящую стратегию по hostname.
2. Запускает парсинг с общим таймаутом 25 секунд.
3. Маппит ошибки в стандартные HTTP-коды:
   - `PARSER_UNSUPPORTED_SOURCE` → 400
   - `PARSER_INVALID_PAGE` → 422
   - `PARSER_BLOCKED` → 502
   - `PARSER_TIMEOUT` → 504
   - `PARSER_FAILED` → 502

## Двухфазный парсинг: light-fetch → Playwright

Браузерный парсинг дорогой: запускает Chromium, жрёт RAM, палится антиботом по TLS fingerprint. Поэтому стратегии **сначала пробуют лёгкий fetch**:

1. **Phase 1 — light-fetch** ([utils/light-fetch.ts](utils/light-fetch.ts)):
   - HTTP GET с реалистичными заголовками (`User-Agent`, `Accept-Language`, `Sec-Fetch-*`).
   - Ищет блок-маркеры (`smartcaptcha`, `cf-challenge`, `qrator`).
   - Парсит через регулярки:
     - `<script type="application/ld+json">` → JSON-LD с `@type ∈ {Apartment, Offer, Residence, Product, ...}`.
     - `<script id="__NEXT_DATA__">` / `window.__INITIAL_STATE__` → SSR-payload (Next.js / SPA).
     - `window._cianConfig` / `window.cianConfig` → SSR-state CIAN.
2. **Phase 2 — Playwright + stealth** (если light-fetch вернул null):
   - запускает Chromium с anti-bot патчами;
   - повторно парсит SSR-state (доступен после рендера);
   - fallback на DOM-селекторы.

Так CIAN/Avito часто отдают данные в SSR-state без Cloudflare-проверки. А если упёрлись — есть второй шанс через браузер.

## Технологический выбор

- **Light-fetch** — `fetch` (Node 18+) или `undici` при `PARSER_PROXY_URL`. Без браузера, легко проксируется.
- **CIAN, Avito, Яндекс** — Playwright (Chromium) + stealth-патчи в `utils/stealth.ts`:
  - `navigator.webdriver` сброшен;
  - поддельные `plugins`, `languages`;
  - WebGL vendor/params подменены на Intel Iris;
  - `chrome.runtime` присутствует;
  - `--disable-blink-features=AutomationControlled` в launch args.
- **DomClick** — light-fetch, при блоке/пустых данных — Playwright скачивает HTML, потом тот же разбор:
  1. `window.__SSR_STATE__.productCard` (основной источник на карточках `/card/…`);
  2. JSON-LD `@type=Apartment|…` (если есть);
  3. `og:title` / `og:description` / `og:image`;
  4. DOM-селекторы (`h1`, `data-testid=price-value`).
  Региональные хосты (`tyumen.domclick.ru` и т.п.) поддерживаются тем же `hostnamePattern`.
  `PARSER_BLOCKED` только если браузер тоже получил капчу/блок.
- **JSON-LD парсинг** — при наличии `<script type="application/ld+json">` сначала
  пробуем достать данные оттуда. Устойчивее, чем CSS-селекторы.

## Переменные окружения

| Имя                  | Описание                                                       | По умолчанию |
|----------------------|----------------------------------------------------------------|--------------|
| `PARSER_PROXY_URL`   | URL прокси в формате `http://user:pass@host:port`              | не задан     |
| `PARSER_HEADLESS`    | Запуск браузера в headless-режиме                             | `true`       |

Пример:
```
PARSER_PROXY_URL=http://user:pass@residential-proxy.example.com:8000
PARSER_HEADLESS=true
```

## Прокси-стратегия

На CIAN и Avito активно блокируют дата-центр прокси:
- CIAN — после 30–50 запросов с одного IP.
- Avito — после ~100 запросов.

В проде обязательны **RU резидентские прокси** с ротацией:
- CIAN: каждые 5–10 запросов.
- Avito: каждые 10–20 запросов.
- Задержки между запросами: 3–8 секунд (CIAN), 8–15 секунд (Avito).

Без прокси парсер работает только в режиме разработки (low-rate).

## Установка браузера Playwright

После `npm install` нужно скачать браузер Chromium:

```bash
npx playwright install chromium
```

## Тестирование

```bash
# Все unit-тесты парсера
npm test -- parser

# Или точечно
npm test -- parser.service
npm test -- cian.strategy
```

Текущие тесты покрывают:
- определение hostname каждой стратегии;
- парсинг JSON-LD (для CIAN и DomClick);
- парсинг DOM-fallback для Avito / Yandex;
- маппинг ошибок в `ParserService` (блок, invalid page, success).

E2E против реальных сайтов CIAN/Avito **не запускаются в CI** (требуют
прокси и нестабильны). Перед релизом каждой стратегии рекомендуется прогон
вручную на свежих примерах URL.

## Известные ограничения и риски

- **Антибот в проде.** Без RU резидентских прокси парсер быстро упрётся в
  блокировки. На UI это отображается как `PARSER_BLOCKED` + подсказка
  "заполните вручную".
- **CAPTCHA.** Если сайт выдал капчу, мы не пытаемся её решить — возвращаем
  `PARSER_BLOCKED`. Полноценный bypass через 2Captcha/CapSolver не входит в MVP.
- **Ротация селекторов.** CIAN/Avito периодически меняют вёрстку. Стратегии
  держат фикстуры HTML в `__tests__/` и CI-тесты на парсинг каждого поля.
- **Юридический аспект.** Парсинг должен выполняться ответственно: с
  уважением к ToS источников, разумным rate-limit и только для личных нужд.
  Массовый сбор данных запрещён.

## Как добавить новый источник

1. Создать `strategies/<name>.strategy.ts`, наследующий `BaseListingParser`.
2. Реализовать `name`, `hostnamePattern`, `parse(url)`.
3. Вернуть `ParsedListing` или выбросить `ParserInvalidPageError` /
   `ParserBlockedError`.
4. Добавить стратегию в массив в `parser.service.ts`.
5. Покрыть unit-тестами в `__tests__/`.