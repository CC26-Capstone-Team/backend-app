# CarPathMu Backend App

CarPathMu adalah backend application service untuk platform rekomendasi dan bimbingan karir berbasis AI. Platform ini membantu pengguna memetakan jalur karir mereka dengan menyarankan kecocokan karir, memberikan rekomendasi kursus yang relevan, serta menampilkan lowongan pekerjaan di Indonesia yang dianalisis tingkat kecocokannya menggunakan kecerdasan buatan.

---

## Fitur Utama

- **Authentication & Authorization:** Sistem registrasi & login aman menggunakan JWT (HTTP-only Cookie), bcrypt, serta integrasi masuk dengan Google OAuth.
- **User Profile & Onboarding:** Input data pendidikan (tingkat pendidikan, jurusan, IPK) dan skill pengguna untuk proses analisis karir.
- **Career Match Prediction (ML Integration):** Integrasi dengan model Machine Learning eksternal untuk memprediksi top 5 karir yang cocok bagi pengguna.
- **AI-Powered Course Recommendations:** Rekomendasi kursus/topik pembelajaran terarah yang dihasilkan secara dinamis menggunakan **Google Gemini 2.5 Flash** berdasarkan karir target dan skill saat ini.
- **AI-Powered Job Recommendations:** Integrasi pencarian lowongan kerja real-time di Indonesia melalui **SerpAPI (Google Jobs Engine)**, yang kemudian dianalisis kecocokan nilainya (*match score* & *match reason*) secara cerdas oleh **Gemini 2.5 Flash**.
- **Interactive API Documentation:** Dokumentasi API interaktif otomatis menggunakan Swagger UI (`zod-openapi`).

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express v5
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma v7
- **Auth:** JWT + bcrypt + Google OAuth (Cookie-based auth)
- **Validation:** Zod v4
- **Logger:** Winston
- **API Docs:** Swagger UI (zod-openapi)
- **Linter:** ESLint + typescript-eslint
- **Formatter:** Prettier

---

## Prasyarat

- Node.js >= 18
- pnpm
- PostgreSQL

---

## Cara Menjalankan

### 1. Clone & Install Dependensi

```bash
pnpm install
```

### 2. Setup Environment

Salin file contoh konfigurasi `.env.example` ke file `.env` baru:

```bash
cp .env.example .env
```

Isi nilai-nilai konfigurasi berikut di dalam `.env`:

```env
# Server
PORT=4000
NODE_ENV=development

# Database Configuration
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carpathmu_db
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# JWT Auth
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS & Frontend Origin
FRONTEND_URL=http://localhost:3000

# File Upload Settings
MAX_FILE_SIZE=5242880 # 5MB

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# SerpAPI Key (Google Jobs Search)
SERPAPI_API_KEY=your_serpapi_api_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id

# Machine Learning API URL
ML_API_URL=http://localhost:8000/predict
```

### 3. Sinkronisasi Database (Migration & Seeding)

Jalankan migrasi database untuk membuat tabel, diikuti dengan menjalankan seed data (daftar karir dan skill default):

```bash
# Jalankan migration
pnpm db:migrateA

# Generate prisma client
pnpm db:generate

# Jalankan seeder
pnpm db:seed
```

### 4. Jalankan Aplikasi

```bash
# Development (dengan tsx watch)
pnpm dev

# Production Build & Start
pnpm build
pnpm start
```

---

## Scripts

| Script | Deskripsi |
|---|---|
| `pnpm dev` | Menjalankan server development dengan hot reload (`tsx`) |
| `pnpm build` | Melakukan kompilasi TypeScript setelah memeriksa linting |
| `pnpm start` | Menjalankan aplikasi hasil kompilasi production dari folder `dist/` |
| `pnpm db:migrate` | Membuat dan menjalankan migrasi database baru (development) |
| `pnpm db:migrate:prod` | Menjalankan migrasi di production |
| `pnpm db:generate` | Menghasilkan Prisma Client |
| `pnpm db:studio` | Membuka antarmuka visual database menggunakan Prisma Studio |
| `pnpm db:reset` | Mereset database (menghapus semua data dan skema) |
| `pnpm db:seed` | Mengisi database dengan data awal menggunakan seeder |
| `pnpm lint` | Memeriksa kepatuhan aturan kode menggunakan ESLint |
| `pnpm lint:fix` | Memperbaiki otomatis error linting yang didukung |
| `pnpm format` | Memformat kode menggunakan Prettier |
| `pnpm format:check` | Memeriksa formatting file |

---

## Struktur Folder

Berikut adalah struktur folder utama aplikasi ini:

```
src/
├── app/
│   ├── auth/            # Registrasi, login, logout, & Google OAuth
│   ├── metadata/        # Data statis untuk formulir (pendidikan, dll.)
│   ├── onboarding/      # Proses inisialisasi profil & skill baru user
│   ├── prediction/      # Integrasi dan analisis ulang model ML
│   ├── profile/         # Pengaturan profil, skill user, & upload avatar
│   ├── recommendation/  # AI Course & Job recommendations (Gemini & SerpAPI)
│   ├── skill/           # Pengambilan daftar skill global
│   └── route.ts         # Pendaftaran sub-router API utama
├── config/              # JSON metadata fitur model ML
├── database/            # Skema migrasi & file seeder Prisma
├── generated/           # Output file auto-generate Prisma client
├── lib/                 # Utilitas umum (jwt, logger, multer, response, dll.)
├── middleware/          # Express middlewares (auth, error, logger, validate)
├── app.ts               # Setup Express application & routing
└── server.ts            # Entrypoint utama server
```

---

## Ringkasan API Endpoints

Semua endpoint API diawali dengan `/api`.

### 1. Autentikasi (`/auth`)
- `POST /auth/register` - Pendaftaran user baru
- `POST /auth/login` - Masuk menggunakan email & password (mengatur token di cookie)
- `POST /auth/google` - Masuk / pendaftaran otomatis menggunakan Google ID Token
- `POST /auth/logout` - Keluar dan menghapus token di cookie

### 2. User Profile & Onboarding (`/user` & `/onboarding`)
- `POST /onboarding` - Proses onboarding awal (profil pendidikan & skill pilihan)
- `POST /onboarding/from-prediction` - Alternatif onboarding dari hasil prediksi
- `GET /user/profile` - Mengambil profil user yang sedang login
- `POST /user/profile` - Membuat profil user baru secara manual
- `PUT /user/profile` - Memperbarui informasi profil pendidikan & IPK
- `GET /user/profile/skill` - Mengambil skill yang saat ini dimiliki oleh user
- `PUT /user/profile/skill` - Memperbarui daftar skill milik user
- `POST /user/profile/avatar` - Mengupload foto avatar profil user

### 3. Rekomendasi & AI (`/recommendations` & `/predictions`)
- `GET /recommendations/latest` - Mengambil riwayat rekomendasi karir terbaru beserta daftar skill
- `GET /recommendations/history` - Mengambil seluruh riwayat sesi rekomendasi user
- `GET /recommendations/history/:session_id` - Detail riwayat rekomendasi spesifik berdasarkan Session ID
- `POST /predictions/re-analyze` - Memicu analisis ulang prediksi karir dari model ML dengan memperbarui skill user
- `GET /recommendations/course/:target_career` - Menghasilkan rekomendasi kursus berbasis AI (Gemini 2.5 Flash) berdasarkan karir target
- `GET /recommendations/jobs/:target_career` - Mengambil lowongan kerja real-time (SerpAPI) dan menganalisis kecocokannya dengan AI

### 4. Metadata & Skill Umum (`/metadata` & `/skills`)
- `GET /metadata/education` - Mendapatkan opsi list tingkat pendidikan & jurusan default
- `GET /skills` - Mendapatkan seluruh daftar pilihan skill yang terdaftar di sistem

---

## Dokumentasi API (Swagger UI)

Saat server berjalan di mode development (`pnpm dev`), dokumentasi API interaktif yang lengkap dapat diakses secara langsung pada tautan berikut:
- **Swagger Docs UI:** `http://localhost:4000/api-docs`
- **Raw JSON OpenAPI Spec:** `http://localhost:4000/api-docs.json`
