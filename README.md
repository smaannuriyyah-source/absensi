# Absensi & Penilaian

Aplikasi web untuk manajemen absensi dan penilaian siswa berbasis Next.js + Turso (SQLite).

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** Turso (SQLite via libSQL)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS
- **Auth:** iron-session (cookie-based)
- **Deploy:** Vercel

## Fitur

### Admin
- Kelola akun guru (CRUD + auto-generate kode akses 6 digit)
- Kelola mata pelajaran
- Kelola kelas
- Kelola siswa (manual + import Excel/CSV)
- Rekap jurnal mengajar per kelas per hari
- Pengaturan tahun ajaran

### Guru
- Login dengan username/password atau kode akses unik
- Profil (wajib diisi sebelum absensi)
- Jurnal mengajar (jam, mapel, materi)
- Absensi siswa (default Hadir, status: Hadir/Sakit/Alpha/Izin/Bolos)
- Penilaian pengetahuan (UH1-3, UTS, UAS) dengan tombol Edit
- Penilaian praktek (Praktek 1-2) dengan tombol Edit
- Laporan rekap nilai

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Turso Database

1. Install Turso CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Login:
```bash
turso auth login
```

3. Buat database:
```bash
turso create absensi-db
```

4. Dapatkan URL:
```bash
turso show absensi-db --url
```

5. Buat token:
```bash
turso tokens create absensi-db
```

### 3. Setup Environment

Edit `.env.local`:

```env
TURSO_DATABASE_URL=libsql://absensi-db-xxx.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
SESSION_SECRET=this-is-a-secret-key-at-least-32-chars-long!!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Push Database Schema

```bash
npm run db:push
```

### 5. Seed Database

```bash
npm run db:seed
```

Ini akan membuat:
- Akun admin (default: `admin` / `admin123`)
- Mata pelajaran default
- Tahun ajaran 2024/2025
- Kelas default (X.1, X.2, XI.1, XI.2, XII.1, XII.2)

### 6. Jalankan Aplikasi

```bash
npm run dev
```

Buka http://localhost:3000

## Deploy ke Vercel

1. Push ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `SESSION_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
4. Deploy

## Struktur Folder

```
app/
├── admin/           # Halaman admin
│   ├── teachers/    # Kelola guru
│   ├── subjects/    # Kelola mapel
│   ├── classes/     # Kelola kelas
│   ├── students/    # Kelola siswa
│   ├── journals/    # Rekap jurnal
│   └── settings/    # Pengaturan
├── teacher/         # Halaman guru
│   ├── profile/     # Profil guru
│   ├── attendance/  # Jurnal & absensi
│   ├── grades/      # Penilaian
│   └── history/     # Riwayat absensi
├── api/             # API routes
├── login/           # Halaman login
lib/
├── db.ts            # Koneksi Turso
├── schema.ts        # Database schema
├── auth.ts          # Session & auth helper
└── dal.ts           # Data access layer
components/
└── ui/              # Komponen UI
```

## Login

### Admin
- Username & Password (default: `admin` / `admin123`)

### Guru
- Username & Password, atau
- Kode Akses 6 digit (unik per guru, auto-generate oleh admin)
