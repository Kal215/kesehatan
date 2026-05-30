# Quick Start Guide

Panduan cepat untuk memulai development Aplikasi Kesehatan Klinik Bersalin.

## 1. Setup Awal

### Install Dependencies
```bash
npm install
```

### Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local dengan database URL Anda
```

### Generate Prisma Client
```bash
npm run db:generate
```

### Setup Database
```bash
npm run db:push
```

### Seed Data
```bash
npx prisma db seed
```

## 2. Jalankan Development Server

```bash
npm run dev
```

Akses di: http://localhost:3000

## 3. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@klinik.com | admin123 |
| Bidan | siti@klinik.com | bidan123 |
| Pasien | siti.aminah@gmail.com | pasien123 |

## 4. File Penting

- `README.md` - Dokumentasi lengkap
- `DATABASE_SCHEMA.md` - Skema database
- `SYSTEM_FLOW.md` - Flow sistem
- `API_DOCUMENTATION.md` - Dokumentasi API
- `DEPLOYMENT_GUIDE.md` - Deployment ke Vercel
- `SECURITY_GUIDELINES.md` - Panduan keamanan

## 5. Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Prisma
npm run db:push      # Push schema
npm run db:migrate   # Create migration
npm run db:generate  # Generate client
npm run db:studio    # Open Prisma Studio

# Lint
npm run lint
```

## 6. Struktur Folder

```
src/
├── app/                # Pages & API routes
├── components/         # React components
├── lib/               # Utilities & configuration
├── actions/           # Server actions
└── middleware.ts      # NextAuth middleware

prisma/
├── schema.prisma      # Database schema
└── seed.ts            # Seed data

docs/
├── README.md
├── DATABASE_SCHEMA.md
├── SYSTEM_FLOW.md
├── API_DOCUMENTATION.md
├── DEPLOYMENT_GUIDE.md
└── SECURITY_GUIDELINES.md
```

## 7. Development Tips

- Use TypeScript for type safety
- Always validate input dengan Zod
- Use Server Components untuk data fetching
- Keep components small & reusable
- Follow naming conventions

## 8. Next Steps

1. Familiarize dengan codebase
2. Read dokumentasi
3. Setup database lokal
4. Test login dengan demo accounts
5. Explore features
6. Customize sesuai kebutuhan

## 9. Need Help?

- Read README.md untuk dokumentasi lengkap
- Check DATABASE_SCHEMA.md untuk database details
- See API_DOCUMENTATION.md untuk API endpoints
- Review DEPLOYMENT_GUIDE.md sebelum deploy

---

Happy coding! 🚀
