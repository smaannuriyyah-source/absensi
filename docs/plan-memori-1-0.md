# Plan Memori 1.0 — Migrasi Prisma → Drizzle + Fix Fitur

**Tanggal**: 20 Juli 2026
**Project**: Absensi App (SMA An-Nuriyyah)
**Deploy**: https://absensi.smaannuriyyahbmy.sch.id

---

## Status Progress

### ✅ SUDAH SELESAI: Migrasi Prisma → Drizzle ORM

| # | Kategori | File | Status |
|---|----------|------|--------|
| 1 | Schema | `lib/schema.ts` | ✅ 11 models + 11 relations |
| 2 | DB Connection | `lib/db.ts` | ✅ Drizzle + Turso adapter |
| 3 | Config | `drizzle.config.ts` | ✅ Dialect turso |
| 4 | Auth | `lib/auth.ts` | ✅ Rewrite Drizzle |
| 5 | DAL | `lib/dal.ts` | ✅ Rewrite Drizzle |
| 6 | Seed | `lib/seed.ts` | ✅ Rewrite Drizzle |
| 7 | Auto-seed | `lib/auto-seed.ts` | ✅ Rewrite Drizzle |
| 8 | Login API | `app/api/auth/login/route.ts` | ✅ Rewrite Drizzle |
| 9 | Logout API | `app/api/auth/logout/route.ts` | ✅ Tidak perlu ubah |
| 10 | Seed API | `app/api/seed/route.ts` | ✅ Hapus execSync |
| 11 | Attendance | `app/api/attendance/route.ts` | ✅ Rewrite Drizzle |
| 12 | Classes | `app/api/classes/route.ts` | ✅ Rewrite Drizzle |
| 13 | Classes [id] | `app/api/classes/[id]/route.ts` | ✅ Rewrite Drizzle |
| 14 | Grades Knowledge | `app/api/grades/knowledge/route.ts` | ✅ Rewrite Drizzle |
| 15 | Grades Practice | `app/api/grades/practice/route.ts` | ✅ Rewrite Drizzle |
| 16 | Journals | `app/api/journals/route.ts` | ✅ Rewrite Drizzle |
| 17 | Journals Rekap | `app/api/journals/rekap/route.ts` | ✅ Rewrite Drizzle |
| 18 | Profile | `app/api/profile/route.ts` | ✅ Rewrite Drizzle |
| 19 | Academic Year | `app/api/settings/academic-year/route.ts` | ✅ Rewrite Drizzle |
| 20 | Academic Year [id] | `app/api/settings/academic-year/[id]/route.ts` | ✅ Rewrite Drizzle |
| 21 | Stats | `app/api/stats/route.ts` | ✅ Rewrite Drizzle |
| 22 | Students | `app/api/students/route.ts` | ✅ Rewrite Drizzle |
| 23 | Students [id] | `app/api/students/[id]/route.ts` | ✅ Rewrite Drizzle |
| 24 | Students Import | `app/api/students/import/route.ts` | ✅ Rewrite Drizzle |
| 25 | Subjects | `app/api/subjects/route.ts` | ✅ Rewrite Drizzle |
| 26 | Subjects [id] | `app/api/subjects/[id]/route.ts` | ✅ Rewrite Drizzle |
| 27 | Teachers | `app/api/teachers/route.ts` | ✅ Rewrite Drizzle |
| 28 | Teachers [id] | `app/api/teachers/[id]/route.ts` | ✅ Rewrite Drizzle |
| 29 | Access Code | `app/api/teachers/[id]/access-code/route.ts` | ✅ Rewrite Drizzle |
| 30 | Package.json | `package.json` | ✅ Scripts updated |
| 31 | Vercel | `vercel.json` | ✅ Hapus prisma build |
| 32 | Next Config | `next.config.js` | ✅ Hapus prisma external |
| 33 | Env Example | `.env.example` | ✅ Updated Turso |
| 34 | Env Local | `.env.local` | ✅ Updated local path |

### ✅ PRISMA SUDAH DIHAPUS BERSIH

| Item | Status |
|------|--------|
| `lib/prisma.ts` | ✅ Dihapus |
| `prisma/schema.prisma` | ✅ Dihapus |
| `prisma.config.ts` | ✅ Dihapus |
| `prisma/` folder | ✅ Dihapus |
| `@prisma/client` package | ✅ Dihapus dari package.json |
| `prisma` CLI package | ✅ Dihapus dari package.json |
| `@prisma/adapter-libsql` package | ✅ Dihapus dari package.json |
| Import `@/lib/prisma` di semua file | ✅ 0 ditemukan |
| `PrismaClient` di semua file | ✅ 0 ditemukan |

### ✅ DEPLOY & SEED BERHASIL

- Schema push ke Turso remote: ✅ 11 tabel
- Seed admin: ✅ admin/admin123
- Login test: ✅ OK
- Build test: ✅ Compile tanpa error

---

## BELUM DILAKUKAN: Fix Fitur

### Masalah yang Ditemukan

| # | Masalah | Lokasi | Severity |
|---|---------|--------|----------|
| 1 | **Siswa tidak ada NISN** | `lib/schema.ts` + API + UI | Tinggi |
| 2 | **Import Excel tanpa template** | `app/admin/students/page.tsx` | Sedang |
| 3 | **Dashboard guru: hanya 3 quick actions** | `app/teacher/page.tsx:100-140` | Sedang |
| 4 | **Profile warning tetap muncul meski admin sudah set mapel** | `app/api/teachers/[id]/route.ts` + `app/api/profile/route.ts` | Tinggi |

### Detail Masalah

#### 1. Siswa Tidak Ada NISN
- Tabel `students` sekarang hanya punya: `id, name, classId`
- **Perlu ditambah**: `nisn` (NISN)

#### 2. Import Excel Tanpa Template
- User harus tebak format kolom: `Nama`, `Kelas`
- **Perlu**: Download template Excel dengan header: `NISN, Nama, Kelas`

#### 3. Dashboard Guru Hanya 3 Quick Actions
- Dashboard sekarang:
  ```
  Absensi → /teacher/attendance
  Penilaian → /teacher/grades/knowledge  (hanya 1)
  Laporan → /teacher/grades/report
  ```
- **Perlu**: 4 kartu:
  ```
  Absensi → /teacher/attendance
  Penilaian Pengetahuan → /teacher/grades/knowledge
  Penilaian Praktek → /teacher/grades/practice
  Laporan → /teacher/grades/report
  ```

#### 4. Profile Warning Tetap Muncul
- Admin update mapel guru via `PUT /api/teachers/[id]` → **tidak update `profileComplete`**
- Guru buka dashboard → `GET /api/profile` → return `profileComplete: false` (default) → warning muncul
- Guru harus ke `/teacher/profile` dan save sendiri untuk set `profileComplete: true`
- **Fix**: Saat admin update teacher subjects → auto `profileComplete: true`

---

## Rencana Perbaikan: 8 File

| # | File | Perubahan |
|---|------|-----------|
| 1 | `lib/schema.ts` | Tambah `nisn: text("nisn")` di tabel `students` |
| 2 | `app/api/students/route.ts` | GET return `nisn`, POST accept `nisn` |
| 3 | `app/api/students/[id]/route.ts` | PUT handle `nisn` |
| 4 | `app/api/students/import/route.ts` | Import accept `nisn` dari Excel |
| 5 | `app/admin/students/page.tsx` | Tambah kolom NISN, form NISN, tombol download template |
| 6 | `app/api/teachers/[id]/route.ts` | Admin update subjects → auto `profileComplete: true` |
| 7 | `app/api/profile/route.ts` | GET: override `profileComplete` berdasarkan jumlah subjects |
| 8 | `app/teacher/page.tsx` | Quick actions jadi 4: + Penilaian Praktek |

### Fase Eksekusi

#### Fase 1: Database Schema — Tambah NISN
- `lib/schema.ts`: Tambah kolom `nisn` di tabel `students`

#### Fase 2: API Routes — Handle NISN
- `app/api/students/route.ts`: GET return `nisn`, POST accept `nisn`
- `app/api/students/[id]/route.ts`: GET/PUT handle `nisn`
- `app/api/students/import/route.ts`: Import dari Excel accept kolom `NISN`

#### Fase 3: Admin Students — NISN + Template + Fix Display
- `app/admin/students/page.tsx`:
  1. Tambah kolom "NISN" di tabel
  2. Form add/edit ada field NISN
  3. Tombol "Download Template Excel"
  4. Import preview tampilkan NISN
  5. Setelah add, fetch semua siswa (bukan filter kelas saja)
  6. Tambah filter "Semua Kelas" default

#### Fase 4: Fix Profile Warning
- `app/api/teachers/[id]/route.ts`: Admin update teacher subjects → auto `profileComplete: true`
- `app/api/profile/route.ts`: GET profile: override `profileComplete` berdasarkan jumlah subjects (kalau punya ≥1 subject → true)

#### Fase 5: Dashboard Guru — 4 Quick Actions
- `app/teacher/page.tsx`: Grid 4 kolom: Absensi, Penilaian Pengetahuan, Penilaian Praktek, Laporan
- Import `FlaskConical` icon dari lucide-react

#### Fase 6: Push Schema + Build Test
- `npx next build`: Test compile
- `drizzle-kit push`: Push schema ke Turso remote

---

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | Turso (libSQL/SQLite remote) via Drizzle ORM |
| Auth | iron-session (session-based) |
| Styling | Tailwind CSS + Custom Glass UI |
| Chart | Lucide React icons |
| Excel | xlsx library (client-side) |
| Deploy | Vercel |

## Database Schema (Drizzle ORM)

11 Models:
1. `admins` — id, username, passwordHash
2. `teachers` — id, username, passwordHash, accessCode, name, profileComplete
3. `subjects` — id, name
4. `teacherSubjects` — teacherId, subjectId (junction)
5. `classes` — id, name
6. `students` — id, nisn, name, classId ← **PERLU TAMBAH NISN**
7. `academicYears` — id, year, isActive
8. `teachingJournals` — id, teacherId, classId, date, hour, subjectId, material, academicYearId, createdAt
9. `attendance` — id, studentId, teacherId, subjectId, classId, date, status, evidence
10. `knowledgeGrades` — id, studentId, teacherId, subjectId, classId, uh1-3, uts, uas, semester, academicYearId
11. `practiceGrades` — id, studentId, teacherId, subjectId, classId, practice1-2, semester, academicYearId

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TURSO_DATABASE_URL` | `libsql://xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | JWT token dari Turso dashboard |
| `SESSION_SECRET` | Minimal 32 karakter |
| `ADMIN_USERNAME` | Default: `admin` |
| `ADMIN_PASSWORD` | Default: `admin123` |

## Deploy Checklist

1. Buat database di https://turso.tech
2. Push schema: `TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx drizzle-kit push`
3. Set env vars di Vercel Dashboard
4. Push kode ke GitHub → Vercel auto-deploy
5. Hit `/api/seed` untuk seed admin
6. Login: admin / admin123
