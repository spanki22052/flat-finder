# Frontend AGENTS.md

## Стек
- Vite + React + TypeScript
- Feature-Sliced Design (FSD)
- Ant Design (AntD) + ConfigProvider
- Styled Components
- React Context для глобального состояния
- TanStack Query для серверного состояния
- Axios для HTTP-запросов

## Структура FSD
```
frontend/src/
├── app/               # Инициализация, провайдеры, маршрутизация
│   ├── providers/     # Context, AntD ConfigProvider, QueryClient
│   ├── routes/        # Route-компоненты
│   └── styles/        # Глобальные стили, theme
├── pages/             # Страницы (view-слой)
├── widgets/           # Композитные блоки (например, Sidebar, Filters)
├── features/          # Сценарии (например, add-apartment, call-log)
├── entities/          # Бизнес-сущности (Apartment, User, Tag)
│   └── <entity>/
│       ├── model/types.ts    # Типы сущности (DTO, интерфейсы)
│       ├── utils/api.ts      # API-ручки для сущности
│       └── hooks/            # TanStack Query хуки + use<Entity>.ts
└── shared/            # UI-кит, утилиты, константы, API-клиент
    └── api/client.ts  # Axios instance с interceptors
```

## Структура компонента (FSD)
Каждый компонент/фича следует паттерну:
```
components/<Name>/
├── ui/
│   ├── <Name>.tsx       # Презентационный компонент
│   └── <Name>.styled.ts # Styled Components
├── model/types.ts       # Локальные типы
└── hooks/
    └── use<Name>.ts     # Логика компонента (useState, useEffect, etc.)
```

## State Management
- Глобальное состояние: React Context (не Redux).
- Локальное состояние: хуки в `hooks/useComponent.ts`.
- Серверное состояние: TanStack Query хуки в `entities/<entity>/hooks/`.

## API
- Axios instance в `shared/api/client.ts` с request/response interceptors.
- Request interceptor: добавляет `Authorization: Bearer <token>` из localStorage.
- Response interceptor: при 401 удаляет токен и редиректит на /login.
- API-ручки живут в `entities/<entity>/utils/api.ts`.
- Типы запросов/ответов — в `entities/<entity>/model/types.ts`.
- Обработка ошибок через `getApiError()` из `shared/api/client.ts`.

## UI и стили
- AntD используем через ConfigProvider, чтобы централизовать тему.
- Styled Components для кастомных стилей — в `ui/<Name>.styled.ts`.
- Синтаксис CSS-in-JS (функциональный):
  ```typescript
  const Container = styled.div({ display: 'flex', gap: 8 });
  const Title = styled.h2({ color: 'blue', fontSize: 16 });
  ```
- Избегаем инлайн-стилей, кроме точечных динамических значений.
- Компоненты именуем PascalCase, файлы — kebab-case.

## Работа с контрактами
- При изменении API на бэкенде обновляем типы и сценарии на фронте.
- Не добавляем поля в UI, если их нет в DTO.
