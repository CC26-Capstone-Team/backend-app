# Backend App

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express v5
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma v7
- **Auth:** JWT + bcrypt + Google OAuth
- **Validation:** Zod v4
- **Logger:** Winston
- **API Docs:** Swagger UI (zod-openapi)
- **Linter:** ESLint + typescript-eslint
- **Formatter:** Prettier

## Prasyarat

- Node.js >= 18
- pnpm
- PostgreSQL

## Cara Menjalankan

### 1. Clone & Install

```bash
pnpm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Isi nilai yang diperlukan di `.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

### 3. Jalankan Migration

```bash
pnpm db:migrate
```

### 4. Jalankan Server

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

## Scripts

| Script | Deskripsi |
|---|---|
| `pnpm dev` | Jalankan server development dengan hot reload |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Jalankan hasil build |
| `pnpm db:migrate` | Buat dan jalankan migration baru |
| `pnpm db:migrate:prod` | Jalankan migration di production |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:studio` | Buka Prisma Studio |
| `pnpm db:reset` | Reset database |
| `pnpm db:seed` | Jalankan seeder |
| `pnpm lint` | Cek linting |
| `pnpm lint:fix` | Auto fix linting |
| `pnpm format` | Format semua file |
| `pnpm format:check` | Cek formatting |

## Struktur Folder

```
src/
├── app/
│   ├── auth/
│   ├── onboarding/
│   ├── profile/
│   ├── skill/
│   └── route.ts
├── database/
│   ├── migrations/
│   └── seeders/
├── lib/
├── middleware/
└── app.ts
server.ts
```

## API Endpoints

Dokumentasi interaktif tersedia di `/api-docs` saat server berjalan.
