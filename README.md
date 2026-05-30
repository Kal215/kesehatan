# 📋 Sistem Informasi Klinik Bersalin

Sistem Informasi Klinik Bersalin berbasis web yang profesional dan modern untuk mengelola data pasien, jadwal kunjungan, pemeriksaan kehamilan, dan laporan klinik.

## 🎯 Fitur Utama

### 1. Authentication & Authorization
- ✅ Login dengan email dan password
- ✅ Registrasi self-service untuk pasien
- ✅ Role-based access control (Admin, Bidan, Pasien)
- ✅ Session management dengan NextAuth

### 2. Dashboard
- ✅ Dashboard Admin dengan statistik dan grafik
- ✅ Dashboard Bidan untuk manajemen pasien
- ✅ Dashboard Pasien untuk tracking kunjungan

### 3. Manajemen Data Pasien
- ✅ CRUD lengkap untuk data pasien
- ✅ Pencarian dan filter
- ✅ Riwayat kunjungan
- ✅ Data pemeriksaan

### 4. Manajemen Kunjungan
- ✅ Pendaftaran kunjungan online
- ✅ Status tracking (Menunggu, Diterima, Selesai, Dibatalkan)
- ✅ Catatan pemeriksaan
- ✅ Manajemen bidan

### 5. Pemeriksaan Kehamilan
- ✅ Pencatatan data pemeriksaan
- ✅ Riwayat pemeriksaan
- ✅ Tracking usia kehamilan

### 6. Laporan
- ✅ Export PDF
- ✅ Export Excel
- ✅ Statistik bulanan

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Next.js Server Actions & API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS + Shadcn UI
- **Form Validation**: Zod
- **Charts**: Recharts
- **Deployment**: Vercel

## 📦 Instalasi

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git
- Akun Neon (PostgreSQL)

### Langkah-langkah Instalasi

#### 1. Clone Repository
```bash
cd d:\Testing\Aplikasi_Kesehatan
```

#### 2. Install Dependencies
```bash
npm install
```

atau jika menggunakan yarn:
```bash
yarn install
```

#### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```bash
cp .env.example .env.local
```

Kemudian edit `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/klinik_bersalin"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-strong-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

**Cara generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 33
```

#### 4. Generate Prisma Client
```bash
npm run db:generate
```

#### 5. Setup Database

Pilih salah satu:

**Option A: Push Schema to Database**
```bash
npm run db:push
```

**Option B: Create Migration**
```bash
npm run db:migrate
```

#### 6. Seed Data (Opsional)

Buat file `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  // Create Admin
  await prisma.user.create({
    data: {
      email: "admin@klinik.com",
      name: "Administrator",
      password: await hashPassword("admin123"),
      role: "ADMIN",
    },
  });

  // Create Bidan
  await prisma.user.create({
    data: {
      email: "bidan@klinik.com",
      name: "Ibu Siti",
      password: await hashPassword("bidan123"),
      role: "BIDAN",
      midwife: {
        create: {
          sipb: "123456789",
          phoneNumber: "081234567890",
        },
      },
    },
  });

  // Create Patient
  await prisma.user.create({
    data: {
      email: "pasien@klinik.com",
      name: "Siti Aminah",
      password: await hashPassword("pasien123"),
      role: "PASIEN",
      patient: {
        create: {
          nik: "3201234567890123",
          medicalRecordNo: "RM2024001",
          dateOfBirth: new Date("1995-05-15"),
          address: "Jl. Raya No. 10",
          phoneNumber: "081234567890",
        },
      },
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Kemudian jalankan:
```bash
npx prisma db seed
```

#### 7. Jalankan Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@klinik.com | admin123 |
| Bidan | bidan@klinik.com | bidan123 |
| Pasien | pasien@klinik.com | pasien123 |

## 📂 Struktur Folder

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # Authentication
│   │   ├── patients/          # Patient CRUD
│   │   ├── visits/            # Visit Management
│   │   ├── midwives/          # Midwife Management
│   │   └── reports/           # Reports
│   ├── auth/                  # Auth Pages (Login, Register)
│   ├── admin/                 # Admin Pages
│   ├── midwife/               # Bidan Pages
│   ├── patient/               # Pasien Pages
│   ├── layout.tsx             # Root Layout
│   ├── page.tsx               # Root Page
│   └── globals.css            # Global Styles
├── components/
│   ├── ui/                    # UI Components (Button, Input, Card, dll)
│   ├── forms/                 # Form Components
│   └── layout/                # Layout Components (Header, Footer, dll)
├── lib/
│   ├── auth/                  # Auth Configuration
│   ├── validations/           # Zod Schemas
│   ├── utils.ts               # Utility Functions
│   └── prisma.ts              # Prisma Client
├── actions/                   # Server Actions
├── middleware.ts              # NextAuth Middleware
└── public/                    # Static Assets

prisma/
├── schema.prisma              # Database Schema
└── seed.ts                    # Seed Data

```

## 🗄️ Database Schema

### Tabel Utama

**users**
- id, email, name, password, role, createdAt, updatedAt, deletedAt

**patients**
- id, userId, nik, medicalRecordNo, dateOfBirth, address, phoneNumber, bloodType, pregnancyHistory, createdAt, updatedAt, deletedAt

**midwives**
- id, userId, sipb, phoneNumber, status, createdAt, updatedAt

**visits**
- id, visitNumber, patientId, bidanId, visitDate, serviceType, complaint, diagnosis, notes, status, createdAt, updatedAt

**pregnancy_examinations**
- id, visitId, patientId, midwifeId, maternalWeight, bloodPressure, fundusHeight, pregnancyAge, fetalWeight, complaint, notes, createdAt, updatedAt

**notifications**
- id, userId, type, title, message, read, createdAt, updatedAt

**audit_logs**
- id, action, entity, entityId, changes, userId, createdAt

## 🚀 Deployment ke Vercel

### 1. Persiapan
```bash
# Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <github-repo>
git push -u origin main
```

### 2. Setup di Vercel

1. Buka https://vercel.com
2. Login dengan GitHub account
3. Click "Import Project"
4. Pilih repository
5. Klik "Import"

### 3. Environment Variables di Vercel

Di project settings, tambahkan environment variables:

```env
DATABASE_URL=<neon-postgresql-url>
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=<vercel-domain>
NEXT_PUBLIC_API_URL=<vercel-domain>/api
```

### 4. Database Migration

Setelah deploy, jalankan migration di Vercel:

```bash
vercel env pull .env.local
npm run db:push
```

### 5. Deploy

Vercel akan automatically deploy saat Anda push ke GitHub.

## 📊 API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/[id]` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient

### Visits
- `GET /api/visits` - Get all visits
- `GET /api/visits/[id]` - Get visit by ID
- `POST /api/visits` - Create visit
- `PATCH /api/visits/[id]` - Update visit status

### Midwives
- `GET /api/midwives` - Get all midwives

### Reports
- `GET /api/reports/statistics` - Get statistics

## 🔑 Key Features Implementation

### 1. Authentication Flow
```
Login Form → NextAuth → Credentials Provider → Database → Session
```

### 2. Role-Based Access
```
Middleware → Check Role → Redirect to appropriate dashboard
```

### 3. Data Management
```
Server Components → Server Actions/API Routes → Prisma → Database
```

### 4. Notifications
```
Action Triggered → Create Notification → Store in Database → Display
```

## 🐛 Troubleshooting

### Error: "DATABASE_URL not found"
```bash
# Make sure .env.local is created and has DATABASE_URL
cp .env.example .env.local
# Edit .env.local with correct credentials
```

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Error: "Migration pending"
```bash
npm run db:push
# atau
npm run db:migrate
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## 📚 Best Practices

- ✅ Use TypeScript untuk type safety
- ✅ Validate all inputs dengan Zod
- ✅ Use Server Components for data fetching
- ✅ Implement proper error handling
- ✅ Use environment variables untuk sensitive data
- ✅ Implement proper logging
- ✅ Test API endpoints
- ✅ Use database indexes untuk performance

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## 📄 License

MIT License - Feel free to use this project for educational or commercial purposes.

## 📞 Support

Untuk bantuan lebih lanjut:
- Email: support@klinikbersalin.com
- Documentation: https://docs.klinikbersalin.com

## 🙏 Terima Kasih

Dibuat dengan ❤️ untuk membantu manajemen klinik bersalin yang lebih baik.
