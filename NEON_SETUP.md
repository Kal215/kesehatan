# 🔗 Panduan Setup Neon PostgreSQL

## Step 1: Buat Akun Neon

1. Buka https://console.neon.tech
2. Click **"Sign Up"**
3. Pilih login dengan:
   - GitHub (recommended)
   - Google
   - Email

## Step 2: Buat Project Baru

1. Setelah login, klik **"Create project"**
2. Isi details:
   - **Project name**: `klinik-bersalin` (atau nama pilihan Anda)
   - **Region**: Pilih terdekat dengan lokasi Anda (Asia Southeast - Singapore recommended)
   - **PostgreSQL version**: 15 atau lebih tinggi
3. Klik **"Create project"**

Tunggu 1-2 menit sampai project selesai dibuat.

## Step 3: Ambil Connection String

### Method 1: Dashboard
1. Di Neon Console, project Anda akan muncul
2. Klik project tersebut
3. Cari bagian **"Connection string"**
4. Copy yang bertuliskan **"Connection string"** (bukan pooler dulu)

Format:
```
postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/klinik_bersalin?sslmode=require
```

### Method 2: Direct Query
```
postgresql://neon_user:password@ep-xxxxx.eu-west-1.aws.neon.tech/neon_db?sslmode=require
```

## Step 4: Update .env.local

Di file `d:\Testing\Aplikasi_Kesehatan\.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/klinik_bersalin?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-a-strong-secret-key-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Node Environment
NODE_ENV="development"
```

### Generate NEXTAUTH_SECRET

Di PowerShell/Terminal:
```powershell
# Windows PowerShell
$bytes = New-Object Byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

Atau use online generator:
- https://generate-secret.vercel.app/

## Step 5: Test Connection

Di terminal, jalankan:

```bash
# Verifikasi DATABASE_URL correct
npm run db:generate
```

Jika success, akan terlihat:
```
✓ Generated Prisma Client
```

## Step 6: Push Schema

```bash
npm run db:push
```

Output akan terlihat:
```
PostgreSQL database schema pushed to Neon
```

## Step 7: Seed Data (Optional)

```bash
npx prisma db seed
```

## Step 8: Verify Connection

Buka Prisma Studio:
```bash
npm run db:studio
```

Akan membuka browser ke http://localhost:5555

Anda akan melihat:
- users table
- patients table
- visits table
- dll.

---

## ⚠️ Troubleshooting

### Error: "ECONNREFUSED" atau "Connection timeout"

**Masalah**: Database URL salah atau network issue

**Solusi**:
1. Copy connection string dari Neon Console lagi
2. Pastikan Internet connection stabil
3. Check firewall/proxy settings

### Error: "Password authentication failed"

**Masalah**: Password di connection string salah

**Solusi**:
1. Reset password di Neon Console
2. Copy connection string baru
3. Update .env.local

### Error: "SSL certificate error"

**Masalah**: SSL verification gagal

**Solusi**:
Tambahkan `?sslmode=require` di connection string (sudah include di Neon)

### Database sudah ada tapi schema tidak push

**Solusi**:
```bash
# Force push
npm run db:push -- --force-reset

# ATAU manually migrate
npm run db:migrate
```

---

## 🎯 Verify Semuanya Jalan

```bash
# 1. Terminal 1 - Jalankan dev server
npm run dev

# 2. Terminal 2 - Buka Prisma Studio
npm run db:studio
```

Buka browser:
- http://localhost:3000 - Aplikasi
- http://localhost:5555 - Prisma Studio

Login dengan demo account:
- Email: `admin@klinik.com`
- Password: `admin123`

---

## 📱 Connection String Format

```
postgresql://user:password@host:port/database?sslmode=require
         ↑     ↑      ↑       ↑     ↑   ↑
    protocol  user  password  host  database
```

Neon akan provide lengkap. Anda hanya copy-paste.

---

## 🔐 Security Tips

1. ✅ JANGAN commit .env.local ke Git
2. ✅ Check .gitignore include `.env.local`
3. ✅ Reset password Neon secara berkala (production)
4. ✅ Use strong NEXTAUTH_SECRET
5. ✅ Keep DATABASE_URL confidential

---

## 📚 Reference

- Neon Docs: https://neon.tech/docs
- Prisma Connection: https://www.prisma.io/docs/concepts/database-connectors/postgresql
- NextAuth Setup: https://authjs.dev/guides/configuring-neon

---

**Status**: Ready to connect! 🚀
