# Flat Finder

Система для сбора и работы с объявлениями о квартирах: ручной ввод, MVP-парсер по ссылке, теги/статусы, напоминания, multi-user доступ.

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18 + Vite + TypeScript + FSD |
| UI | Ant Design 5 + Styled Components + Framer Motion |
| Backend | NestJS + Prisma + Postgres + JWT |
| Auth | JWT Bearer tokens |

## Проекты

```
flat-finder/
├── docs/api.md          ← API-контракт (источник правды)
├── frontend/            ← React SPA
│   ├── .env.example
│   └── README.md
└── backend/             ← NestJS API
    ├── .env.example
    ├── prisma/
    └── README.md
```

## Быстрый старт

### 1. Backend

```bash
# Postgres в Docker
docker run -d --name flatfinder-db \
  -e POSTGRES_DB=flatfinder \
  -e POSTGRES_USER=flatfinder \
  -e POSTGRES_PASSWORD=flatfinder \
  -p 5432:5432 postgres:16-alpine

cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed    # demo: admin@flatfinder.local / password123

npm run start:dev      # → http://localhost:3001/api/v1
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # → http://localhost:5173
```

## Дизайн-система

Тёмная glass-morphism тема с aurora-градиентами, accent-цветами indigo/fuchsia, bento-grid дашборд, Framer Motion анимации, Inter + JetBrains Mono шрифты.

## API Routes

| Method | Path | Description |
|---|---|---|
| POST | /api/v1/auth/register | Регистрация |
| POST | /api/v1/auth/login | Логин |
| GET | /api/v1/auth/me | Текущий пользователь |
| GET | /api/v1/apartments | Список квартир |
| POST | /api/v1/apartments | Создать квартиру |
| GET/PATCH/DELETE | /api/v1/apartments/:id | CRUD |
| GET/POST/PATCH/DELETE | /api/v1/reminders | Напоминания |
| GET/POST | /api/v1/contacts | Контакты |
