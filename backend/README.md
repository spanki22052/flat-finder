# Flat Finder — Backend

## Prerequisites

- **Node.js** 20+
- **Postgres 15+** running locally (Docker recommended):
  ```bash
  docker run -d \
    --name flatfinder-db \
    -e POSTGRES_DB=flatfinder \
    -e POSTGRES_USER=flatfinder \
    -e POSTGRES_PASSWORD=flatfinder \
    -p 5432:5432 \
    postgres:16-alpine
  ```

## Setup

```bash
cp .env.example .env
# edit .env — DATABASE_URL already points to the Docker command above

npm install
npx prisma generate
npx prisma migrate dev --name init

npm run prisma:seed   # creates demo users
```

## Start

```bash
npm run start:dev
# → http://localhost:3001/api/v1
```

## Demo accounts

| Email | Password | Role |
|---|---|---|
| admin@flatfinder.local | password123 | ADMIN |
| demo@flatfinder.local | password123 | USER |

## Scripts

- `npm run start:dev` — watch mode
- `npm run build` — production build
- `npm run start:prod` — run built output
- `npx prisma studio` — GUI for the DB
- `npx prisma migrate dev` — create new migration
