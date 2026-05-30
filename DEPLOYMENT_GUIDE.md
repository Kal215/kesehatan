# 🚀 Deployment Guide

## Pre-Deployment Checklist

- [ ] Semua test lokal sudah berhasil
- [ ] Database schema sudah final
- [ ] Environment variables sudah tersedia
- [ ] Prisma client sudah generate
- [ ] Build test: `npm run build`
- [ ] No console errors atau warnings
- [ ] Security headers sudah configured
- [ ] Database backup sudah ada

---

## Step 1: Prepare Repository

### 1.1 Initialize Git (jika belum)
```bash
cd d:\Testing\Aplikasi_Kesehatan
git init
git add .
git commit -m "Initial commit: Aplikasi Kesehatan Klinik Bersalin"
```

### 1.2 Create GitHub Repository
1. Buka https://github.com/new
2. Create repository: `aplikasi-kesehatan-klinik`
3. Follow instruksi untuk push local repository

```bash
git remote add origin https://github.com/username/aplikasi-kesehatan-klinik.git
git branch -M main
git push -u origin main
```

---

## Step 2: Setup Neon Database

### 2.1 Create Neon Account
1. Buka https://console.neon.tech
2. Sign up dengan GitHub atau email
3. Create new project

### 2.2 Configure Database
```bash
# Copy connection string
DATABASE_URL="postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/klinik_bersalin?sslmode=require"
```

### 2.3 Test Connection Lokal
```bash
# Update .env.local
DATABASE_URL="<neon-connection-string>"

# Push schema
npm run db:push

# Seed data
npx prisma db seed
```

---

## Step 3: Deploy to Vercel

### 3.1 Link Project to Vercel
1. Buka https://vercel.com
2. Login dengan GitHub
3. Click "New Project"
4. Select repository: `aplikasi-kesehatan-klinik`
5. Click "Import"

### 3.2 Configure Build Settings
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3.3 Add Environment Variables

Di Vercel Project Settings → Environment Variables, tambahkan:

```
DATABASE_URL = postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/klinik_bersalin?sslmode=require
NEXTAUTH_SECRET = <generated-secret-key>
NEXTAUTH_URL = https://aplikasi-kesehatan-klinik.vercel.app
NEXT_PUBLIC_API_URL = https://aplikasi-kesehatan-klinik.vercel.app/api
```

**Generate NEXTAUTH_SECRET:**
```bash
# Di terminal lokal
openssl rand -base64 33
```

### 3.4 Deploy
1. Click "Deploy"
2. Tunggu build process selesai (±3-5 menit)
3. Check deployment status di Vercel dashboard

---

## Step 4: Setup Database on Production

### 4.1 Run Migration
```bash
# Via Vercel CLI
vercel env pull .env.local
npm run db:push

# atau langsung via Vercel
vercel env pull --environment=production .env.production
npx prisma migrate deploy
```

### 4.2 Seed Production Data
```bash
# Create seed file untuk production
DATABASE_URL="<production-url>" npx prisma db seed
```

---

## Step 5: Verify Deployment

### 5.1 Check Application
1. Buka URL: https://aplikasi-kesehatan-klinik.vercel.app
2. Test login dengan demo accounts
3. Test CRUD operations

### 5.2 Check Logs
```bash
vercel logs aplikasi-kesehatan-klinik
```

### 5.3 Monitor Performance
- Vercel Analytics: https://vercel.com/projects
- Check build times, Cold starts, etc.

---

## Continuous Deployment

### Auto Deploy on Push
- Vercel automatically deploys on every push ke `main` branch
- Preview deployments untuk pull requests

### Manual Rollback
```bash
# Vercel dashboard → Deployments → Select → Promote
```

---

## Environment Configuration

### Production (.env.production)
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="long-random-string"
NEXTAUTH_URL="https://aplikasi-kesehatan-klinik.vercel.app"
NEXT_PUBLIC_API_URL="https://aplikasi-kesehatan-klinik.vercel.app/api"
NODE_ENV="production"
```

### Staging (.env.staging)
```env
DATABASE_URL="postgresql://staging-instance/..."
NEXTAUTH_SECRET="another-random-string"
NEXTAUTH_URL="https://staging.aplikasi-kesehatan-klinik.vercel.app"
NEXT_PUBLIC_API_URL="https://staging.aplikasi-kesehatan-klinik.vercel.app/api"
NODE_ENV="production"
```

---

## Performance Optimization

### 1. Image Optimization
```typescript
// next.config.js
images: {
  unoptimized: false,  // Enable image optimization
  formats: ['image/webp'],
  deviceSizes: [640, 750, 828, 1080],
  imageSizes: [16, 32, 48, 64, 96]
}
```

### 2. Database Connection Pooling
```env
# Neon connection string dengan pool
DATABASE_URL="postgresql://...?sslmode=require&sslcert=path-to-cert"
```

### 3. Enable Compression
```typescript
// next.config.js
compress: true
```

---

## Security Configuration

### 1. CORS Headers
```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ]
    }
  ];
}
```

### 2. Content Security Policy
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  return response;
}
```

### 3. Rate Limiting
```bash
# Install package
npm install @vercel/kv
```

```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@vercel/kv';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});
```

---

## Monitoring & Logging

### 1. Setup Monitoring
- Vercel Analytics: Built-in
- Sentry for error tracking:
  ```bash
  npm install @sentry/nextjs
  ```

### 2. Database Monitoring
- Neon Console: https://console.neon.tech
- Check slow queries, connections, etc.

### 3. Application Logs
```bash
# View logs
vercel logs <project-name>

# Stream logs
vercel logs <project-name> --follow
```

---

## Backup & Recovery

### 1. Database Backup
```bash
# Neon automatic backups (every 6 hours)
# Or manual backup via Neon Console

# Backup to local
pg_dump <connection-string> > backup.sql
```

### 2. Code Backup
```bash
# GitHub automatically backs up code
# Create GitHub releases untuk version tagging
git tag v1.0.0
git push origin v1.0.0
```

---

## Troubleshooting

### Issue: Build Failed
```bash
# Check build logs di Vercel
# Common issues:
# 1. Missing environment variables
# 2. Prisma client not generated
# 3. TypeScript errors

# Solution:
npm install
npm run db:generate
npm run build
```

### Issue: Database Connection Error
```bash
# Check connection string format
# DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Test connection
psql <connection-string>
```

### Issue: CORS Errors
```bash
# Check CORS headers di next.config.js
# Check API endpoints handling OPTIONS requests
```

### Issue: NextAuth Session Not Working
```bash
# Verify NEXTAUTH_SECRET is set
# Verify NEXTAUTH_URL matches deployment URL
# Clear cookies dan test login ulang
```

---

## Post-Deployment

### 1. Update Demo Accounts
```bash
DATABASE_URL="production-url" npx prisma studio
# Update passwords dan user data sesuai kebutuhan
```

### 2. Setup Custom Domain (Optional)
1. Vercel Dashboard → Settings → Domains
2. Add custom domain
3. Update DNS records sesuai instruksi

### 3. Enable HTTPS
- Vercel automatic HTTPS
- Free SSL certificate via Let's Encrypt

### 4. Setup Monitoring & Alerts
- Vercel Alerts untuk deployment failures
- Email notifications

---

## Scaling Guidelines

### Database Scaling
- Neon auto-scaling: Enabled by default
- Monitor connections dan queries

### Application Scaling
- Vercel auto-scaling: Automatic
- Monitor serverless function duration

### Cost Optimization
- Use Vercel Pro ($20/month):
  - Unlimited teams
  - Priority support
  - Advanced analytics

---

## Version Management

### Semantic Versioning
```
v1.0.0
├─ Major (Breaking changes)
├─ Minor (New features)
└─ Patch (Bug fixes)
```

### Release Process
```bash
# Create release tag
git tag v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# Create GitHub release dengan changelog
```

---

## Documentation

Maintain deployment documentation:
- Installation steps
- Configuration guide
- Troubleshooting guide
- Disaster recovery plan

---

## Support

Need help?
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
