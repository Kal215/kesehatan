# FAQ - Frequently Asked Questions

## Installation & Setup

### Q: Bagaimana cara install aplikasi ini?
**A:** Ikuti QUICK_START.md untuk setup cepat:
```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

### Q: Apa saja yang diperlukan sebelum install?
**A:** Anda memerlukan:
- Node.js (v18+)
- npm atau yarn
- PostgreSQL (atau Neon cloud database)
- Text editor (VS Code recommended)
- Git

### Q: Bagaimana cara setup database?
**A:** Ada 2 pilihan:
1. **Local PostgreSQL**: Install lokal, update DATABASE_URL di .env.local
2. **Neon Cloud**: Buat account di neon.tech, copy connection string

## Authentication

### Q: Apa itu role dan untuk apa?
**A:** Ada 3 role:
- **Admin**: Mengelola user, midwife, sistem
- **Bidan**: Mengelola pasien, pemeriksaan, visit
- **Pasien**: Daftar, view history, lihat jadwal

### Q: Bagaimana cara login?
**A:** Gunakan demo accounts:
- Admin: admin@klinik.com / admin123
- Bidan: siti@klinik.com / bidan123
- Pasien: siti.aminah@gmail.com / pasien123

### Q: Bagaimana cara reset password?
**A:** Fitur password reset sedang dalam pengembangan. Saat ini gunakan Prisma Studio:
```bash
npm run db:studio
```

## Features

### Q: Bagaimana cara membuat visit baru?
**A:** 
1. Login sebagai Admin atau Bidan
2. Go to "Kunjungan" / "Visits"
3. Click "Tambah Kunjungan" / "Add Visit"
4. Isi form dan submit

### Q: Bagaimana cara record pemeriksaan kehamilan?
**A:**
1. Login sebagai Bidan
2. Go to "Pemeriksaan Kehamilan"
3. Pilih pasien
4. Isi data pemeriksaan (berat, tekanan darah, dll)
5. Submit

### Q: Bagaimana cara export laporan?
**A:** Feature export belum lengkap. Masih dalam development. Support PDF & Excel akan ditambahkan di v1.1.0

### Q: Bagaimana cara lihat history kunjungan?
**A:**
1. Login sebagai Pasien
2. Go to "History Kunjungan"
3. View semua visit history dengan status

## Database

### Q: Bagaimana backup database?
**A:** 
```bash
# Jika pakai Neon:
# Buka https://console.neon.tech -> Backups

# Jika pakai local PostgreSQL:
pg_dump dbname > backup.sql
```

### Q: Bagaimana restore database?
**A:**
```bash
psql dbname < backup.sql
```

### Q: Bagaimana tambah data dummy untuk testing?
**A:**
```bash
npx prisma db seed
```

## Development

### Q: Bagaimana cara develop fitur baru?
**A:**
1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes
3. Test: `npm run dev`
4. Lint: `npm run lint`
5. Commit & push
6. Create pull request

### Q: Bagaimana cara run tests?
**A:**
```bash
npm run test
```

### Q: Bagaimana cara debug?
**A:**
1. Use VS Code debugger
2. Check browser console (F12)
3. Check server logs di terminal
4. Use Prisma Studio: `npm run db:studio`

## Deployment

### Q: Bagaimana cara deploy ke production?
**A:** Ikuti DEPLOYMENT_GUIDE.md:
1. Setup Neon database
2. Create GitHub repo
3. Connect ke Vercel
4. Configure env variables
5. Deploy

### Q: Bagaimana setup custom domain?
**A:** Di Vercel dashboard:
1. Settings -> Domains
2. Add custom domain
3. Configure DNS records

### Q: Bagaimana setup email notifications?
**A:** Fitur email belum implemented. Roadmap untuk v1.1.0

## Security

### Q: Bagaimana password di-store?
**A:** Password di-hash menggunakan bcryptjs dengan 10 salt rounds. Never stored as plain text.

### Q: Apakah data aman?
**A:** 
- ✅ HTTPS/TLS encryption
- ✅ Password hashing
- ✅ SQL injection prevention (Prisma)
- ✅ CSRF protection
- ✅ Role-based access control
- ✅ Audit logging

### Q: Bagaimana lapor security issue?
**A:** Email ke security@example.com dengan detail lengkap

## Performance

### Q: Kenapa aplikasi lambat?
**A:** Possible causes:
1. Database connection slow - check CONNECTION_URL
2. Browser cache - clear cache
3. Network slow - check internet connection
4. Server overload - check Vercel dashboard

### Q: Bagaimana optimize performance?
**A:**
1. Enable caching
2. Optimize images
3. Paginate data
4. Use CDN
5. Monitor slow queries

## Troubleshooting

### Q: Database connection error
**A:**
```bash
# Check CONNECTION_URL format
# postgresql://user:password@host:5432/db

# Test connection
psql <connection-string>
```

### Q: Build failed on Vercel
**A:**
1. Check environment variables di Vercel dashboard
2. Ensure NEXTAUTH_SECRET is set
3. Run `npm run build` locally
4. Check build logs di Vercel

### Q: CORS error
**A:** Should not happen karena Server Actions digunakan. Jika terjadi:
1. Check CORS headers di next.config.js
2. Check API endpoints handling OPTIONS
3. Check NEXTAUTH_URL

### Q: Session expired / Login tidak work
**A:**
1. Clear browser cookies
2. Clear sessionStorage
3. Check NEXTAUTH_SECRET di .env
4. Check NEXTAUTH_URL
5. Restart dev server

### Q: Data tidak muncul
**A:**
1. Check database connection
2. Run: `npm run db:push`
3. Seed data: `npx prisma db seed`
4. Check query di Prisma Studio

## Getting Help

### Resources
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [README.md](./README.md) - Full documentation
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database details
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoints
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment steps

### External Resources
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://authjs.dev
- Tailwind: https://tailwindcss.com/docs
- PostgreSQL: https://www.postgresql.org/docs

### Contact
- Email: support@example.com
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions

---

Last Updated: 2024-06-15
