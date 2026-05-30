# 🔐 Security Best Practices

## Authentication & Authorization

### 1. Password Security
- ✅ Hash dengan bcryptjs (min 10 rounds)
- ✅ Minimum 6 characters password
- ✅ Validate strong passwords
- ✅ Password reset via email
- ✅ Session timeout setelah inaktivitas

### 2. Session Management
- ✅ NextAuth JWT session
- ✅ Secure cookies dengan httpOnly
- ✅ CSRF protection
- ✅ Session validation di setiap request

### 3. Access Control
- ✅ Role-based access control (RBAC)
- ✅ Check role di middleware
- ✅ Check permissions di API routes
- ✅ Prevent privilege escalation

## Data Security

### 1. Data Encryption
```typescript
// Encrypt sensitive data sebelum store
import crypto from 'crypto';

const encrypt = (text: string, key: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};
```

### 2. Input Validation
```typescript
// Always validate input dengan Zod
import { z } from 'zod';

const patientSchema = z.object({
  nik: z.string().regex(/^\d{16}$/),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^(\+62|62|0)[0-9]{9,12}$/),
});

const data = patientSchema.parse(input);
```

### 3. SQL Injection Prevention
- ✅ Use Prisma ORM (parameterized queries)
- ✅ Never concat strings dalam SQL
- ✅ Validate enum values

## API Security

### 1. Rate Limiting
```typescript
// Implement rate limiting
import { Ratelimit } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'),
});

const { success } = await ratelimit.limit(req.ip!);
if (!success) return new Response('Too many requests', { status: 429 });
```

### 2. CORS & Headers
```typescript
// Set security headers
const headers = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000',
};
```

### 3. API Authentication
- ✅ All endpoints require session
- ✅ Validate user permissions
- ✅ Log API access untuk audit

## Database Security

### 1. Soft Delete
```typescript
// Implement soft delete untuk data pasien
data: {
  deletedAt: new Date()  // Instead of hard delete
}

// Query hanya active records
where: { deletedAt: null }
```

### 2. Audit Logging
```typescript
// Log semua perubahan penting
await prisma.auditLog.create({
  data: {
    action: 'UPDATE',
    entity: 'Patient',
    entityId: patientId,
    changes: JSON.stringify(changedFields),
    userId: session.user.id,
  }
});
```

### 3. Database Credentials
- ✅ Store di environment variables
- ✅ Use connection pooling
- ✅ Enable SSL connection
- ✅ Rotate credentials regularly

## Frontend Security

### 1. XSS Prevention
```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(userInput);
```

### 2. CSRF Protection
- ✅ NextAuth default CSRF protection
- ✅ Validate CSRF token di forms

### 3. Secure Storage
```typescript
// Sensitive data use sessionStorage (cleared on close)
// Not localStorage (persists)
sessionStorage.setItem('token', token);
```

## Infrastructure Security

### 1. Environment Variables
```
Never commit .env file
Always use .env.example
Rotate secrets regularly
```

### 2. HTTPS/TLS
- ✅ Vercel provides free HTTPS
- ✅ All traffic encrypted
- ✅ HSTS enabled

### 3. CDN Security
- ✅ DDoS protection via Vercel
- ✅ Rate limiting
- ✅ WAF (Web Application Firewall)

## Monitoring & Logging

### 1. Error Handling
```typescript
try {
  // Operation
} catch (error) {
  // Log error (not expose details)
  console.error('Operation failed:', error);
  // Return generic error to client
  return { error: 'Operation failed' };
}
```

### 2. Audit Trail
- ✅ Log login/logout
- ✅ Log data changes
- ✅ Log access denied attempts
- ✅ Monitor for anomalies

### 3. Alerting
- ✅ Multiple failed login attempts
- ✅ Unusual data access
- ✅ Database errors
- ✅ Performance degradation

## Compliance

### GDPR Compliance (if applicable)
- ✅ Data retention policy
- ✅ Right to be forgotten (data deletion)
- ✅ Consent management
- ✅ Data portability

### Security Standards
- ✅ Use HTTPS
- ✅ Password hashing
- ✅ Input validation
- ✅ Access control
- ✅ Audit logging

## Penetration Testing

### Common Vulnerabilities to Test
- SQL Injection
- XSS (Cross-site scripting)
- CSRF (Cross-site request forgery)
- Broken authentication
- Insecure direct object references
- Privilege escalation
- Sensitive data exposure

### Testing Tools
- OWASP ZAP
- Burp Suite
- Postman

## Incident Response

### 1. Breach Detection
- Monitor audit logs
- Set up alerts
- Regular security audits

### 2. Response Procedure
```
1. Identify breach
2. Contain impact
3. Eradicate vulnerability
4. Recover systems
5. Post-incident analysis
6. Communication
```

### 3. Communication Plan
- Notify affected users
- Update status page
- Provide remediation steps

## Regular Maintenance

### Security Checklist
- [ ] Update dependencies (`npm audit`)
- [ ] Review access logs
- [ ] Check for vulnerabilities
- [ ] Rotate secrets (quarterly)
- [ ] Backup databases
- [ ] Test disaster recovery
- [ ] Security training

### Tools
```bash
# Check vulnerabilities
npm audit

# Update packages
npm update

# Security linting
npm install --save-dev npm-check-updates
```

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Next.js Security: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- Prisma Security: https://www.prisma.io/docs/guides/security
- Auth.js Documentation: https://authjs.dev/
