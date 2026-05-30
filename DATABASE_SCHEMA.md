# 🗄️ Database Schema Documentation

## Diagram ERD (Entity Relationship Diagram)

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ email       │◄───┐
│ name        │    │
│ password    │    │
│ role        │    │
│ createdAt   │    │
│ updatedAt   │    │
│ deletedAt   │    │
└─────────────┘    │
       ▲           │
       │           │
    ┌──┴──────────┘
    │
┌───┼───────────────────────────────────────────┐
│   │                                           │
│   ▼                    ▼                       ▼
┌──────────┐        ┌──────────┐        ┌───────────┐
│ Admins   │        │ Midwives │        │ Patients  │
├──────────┤        ├──────────┤        ├───────────┤
│ id       │        │ id       │        │ id        │
│ userId*  │        │ userId*  │        │ userId*   │
│          │        │ sipb     │        │ nik       │
│          │        │ phone    │        │ medRM     │
│          │        │ status   │        │ dob       │
└──────────┘        │          │        │ address   │
                    └──────────┘        │ phone     │
                         ▲              │ blood     │
                         │              │ pregnancy │
                         │              │ created   │
                         │              │ updated   │
                         │              └───────────┘
                         │                   │
                         │                   │
                    ┌────┴───────────────────┴────┐
                    │                             │
                    ▼                             ▼
              ┌──────────┐              ┌────────────────┐
              │  Visits  │              │PregnancyExam   │
              ├──────────┤              ├────────────────┤
              │ id       │              │ id             │
              │ visit#   │              │ visitId*       │
              │ patientId*              │ patientId*     │
              │ bidanId* │              │ midwifeId*     │
              │ date     │              │ weight         │
              │ service  │              │ bloodPressure  │
              │ complaint               │ fundusHeight   │
              │ diagnosis               │ pregnancyAge   │
              │ notes    │              │ fetalWeight    │
              │ status   │              │ complaint      │
              │ created  │              │ notes          │
              │ updated  │              │ created        │
              └──────────┘              │ updated        │
                    ▲                   └────────────────┘
                    │
                    │
              ┌─────────────┐
              │Notifications│
              ├─────────────┤
              │ id          │
              │ userId*     │
              │ type        │
              │ title       │
              │ message     │
              │ read        │
              │ created     │
              │ updated     │
              └─────────────┘
```

## Tabel Detail

### 1. **users** (Pengguna Sistem)
Menyimpan data pengguna untuk semua role.

| Field | Type | Constraints | Deskripsi |
|-------|------|-----------|-----------|
| id | String | PRIMARY KEY | UUID/CUID |
| email | String | UNIQUE | Email pengguna |
| name | String | NOT NULL | Nama lengkap |
| password | String | NOT NULL | Hash password |
| role | Enum | NOT NULL | ADMIN, BIDAN, PASIEN |
| createdAt | DateTime | DEFAULT now() | Waktu dibuat |
| updatedAt | DateTime | AUTO UPDATE | Waktu diperbarui |
| deletedAt | DateTime | NULLABLE | Soft delete |

### 2. **admins** (Administrator)
Menyimpan data administrator klinik.

| Field | Type | Constraints | Deskripsi |
|-------|------|-----------|-----------|
| id | String | PRIMARY KEY | UUID/CUID |
| userId | String | UNIQUE, FK | Referensi ke users |
| createdAt | DateTime | DEFAULT now() | Waktu dibuat |
| updatedAt | DateTime | AUTO UPDATE | Waktu diperbarui |

### 3. **midwives** (Bidan)
Menyimpan data bidan yang bekerja di klinik.

| Field | Type | Constraints | Deskripsi |
|-------|------|-----------|-----------|
| id | String | PRIMARY KEY | UUID/CUID |
| userId | String | UNIQUE, FK | Referensi ke users |
| sipb | String | UNIQUE | Surat Ijin Praktik Bidan |
| phoneNumber | String | NOT NULL | Nomor HP |
| status | Enum | DEFAULT AKTIF | AKTIF, NONAKTIF |
| createdAt | DateTime | DEFAULT now() | Waktu dibuat |
| updatedAt | DateTime | AUTO UPDATE | Waktu diperbarui |

### 4. **patients** (Pasien)
Menyimpan data pasien klinik.

| Field | Type | Constraints | Deskripsi |
|-------|------|-----------|-----------|
| id | String | PRIMARY KEY | UUID/CUID |
| userId | String | UNIQUE, FK | Referensi ke users |
| nik | String | UNIQUE | Nomor Induk Kependudukan |
| medicalRecordNo | String | UNIQUE | Nomor Rekam Medis |
| dateOfBirth | DateTime | NOT NULL | Tanggal lahir |
| address | String | NOT NULL | Alamat lengkap |
| phoneNumber | String | NOT NULL | Nomor HP |
| bloodType | Enum | NULLABLE | O+, O-, A+, A-, B+, B-, AB+, AB- |
| pregnancyHistory | String | NULLABLE | Riwayat kehamilan |
| createdAt | DateTime | DEFAULT now() | Waktu dibuat |
| updatedAt | DateTime | AUTO UPDATE | Waktu diperbarui |
| deletedAt | DateTime | NULLABLE | Soft delete |

### 5. **visits** (Kunjungan)
Menyimpan data kunjungan pasien ke klinik.

| Field | Type | Constraints | Deskripsi |
|-------|------|-----------|-----------|
| id | String | PRIMARY KEY | UUID/CUID |
| visitNumber | String | UNIQUE | Nomor kunjungan |
| patientId | String | FK | Referensi ke patients |
| bidanId | String | FK, NULLABLE | Referensi ke users (bidan) |
| visitDate | DateTime | NOT NULL | Tanggal kunjungan |
| serviceType | String | NOT NULL | Jenis layanan |
| complaint | String | NULLABLE | Keluhan pasien |
| diagnosis | String | NULLABLE | Diagnosa |
| notes | String | NULLABLE | Catatan umum |
| status | Enum | DEFAULT MENUNGGU | MENUNGGU, DITERIMA, SELESAI, DIBATALKAN |
| createdAt | DateTime | DEFAULT now() | Waktu dibuat |
| updatedAt | DateTime | AUTO UPDATE | Waktu diperbarui |

### 6. **pregnancy_examinations** (Pemeriksaan Kehamilan)
Menyimpan data pemeriksaan kehamilan pasien.

| Field | Type | Constraints | Deskripsi |
|-------|------|-----------|-----------|
| id | String | PRIMARY KEY | UUID/CUID |
| visitId | String | FK | Referensi ke visits |
| patientId | String | FK | Referensi ke patients |
| midwifeId | String | FK | Referensi ke midwives |
| maternalWeight | Float | NOT NULL | Berat badan ibu (kg) |
| bloodPressure | String | NOT NULL | Tekanan darah (mmHg) |
| fundusHeight | Float | NULLABLE | Tinggi fundus (cm) |
| pregnancyAge | Int | NULLABLE | Usia kehamilan (minggu) |
| fetalWeight | Float | NULLABLE | Berat janin (gram) |
| complaint | String | NULLABLE | Keluhan |
| notes | String | NULLABLE | Catatan bidan |
| createdAt | DateTime | DEFAULT now() | Waktu dibuat |
| updatedAt | DateTime | AUTO UPDATE | Waktu diperbarui |

### 7. **notifications** (Notifikasi)
Menyimpan notifikasi sistem untuk pengguna.

| Field | Type | Constraints | Deskripsi |
|-------|------|-----------|-----------|
| id | String | PRIMARY KEY | UUID/CUID |
| userId | String | FK | Referensi ke users |
| type | Enum | NOT NULL | REGISTRATION_SUCCESS, VISIT_STATUS_CHANGED, EXAMINATION_SCHEDULED |
| title | String | NOT NULL | Judul notifikasi |
| message | String | NOT NULL | Pesan notifikasi |
| read | Boolean | DEFAULT false | Status baca |
| createdAt | DateTime | DEFAULT now() | Waktu dibuat |
| updatedAt | DateTime | AUTO UPDATE | Waktu diperbarui |

### 8. **audit_logs** (Log Audit)
Menyimpan log perubahan data untuk audit trail.

| Field | Type | Constraints | Deskripsi |
|-------|------|-----------|-----------|
| id | String | PRIMARY KEY | UUID/CUID |
| action | String | NOT NULL | CREATE, UPDATE, DELETE |
| entity | String | NOT NULL | Nama entity yang berubah |
| entityId | String | NOT NULL | ID entity |
| changes | JSON | NULLABLE | Data perubahan |
| userId | String | FK, NULLABLE | User yang melakukan perubahan |
| createdAt | DateTime | DEFAULT now() | Waktu perubahan |

## Relasi Database

```
┌─ One-to-Many Relationship
└─ One-to-One Relationship

users → admins (One-to-One)
users → midwives (One-to-One)
users → patients (One-to-One)
users → visits (One-to-Many, sebagai bidan)
users → notifications (One-to-Many)

patients → visits (One-to-Many)
patients → pregnancy_examinations (One-to-Many)

midwives → pregnancy_examinations (One-to-Many)

visits → pregnancy_examinations (One-to-Many)
```

## Indexes

Untuk optimasi query:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_patients_nik ON patients(nik);
CREATE INDEX idx_patients_medical_record ON patients(medicalRecordNo);
CREATE INDEX idx_visits_patient ON visits(patientId);
CREATE INDEX idx_visits_visit_date ON visits(visitDate);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_exams_patient ON pregnancy_examinations(patientId);
CREATE INDEX idx_exams_visit ON pregnancy_examinations(visitId);
CREATE INDEX idx_notifications_user ON notifications(userId);
CREATE INDEX idx_notifications_read ON notifications(read);
```

## Enum Values

```typescript
enum Role {
  ADMIN       // Administrator
  BIDAN       // Bidan
  PASIEN      // Pasien
}

enum VisitStatus {
  MENUNGGU    // Menunggu
  DITERIMA    // Diterima
  SELESAI     // Selesai
  DIBATALKAN  // Dibatalkan
}

enum BloodType {
  O_POSITIF
  O_NEGATIF
  A_POSITIF
  A_NEGATIF
  B_POSITIF
  B_NEGATIF
  AB_POSITIF
  AB_NEGATIF
}

enum MidwifeStatus {
  AKTIF       // Aktif
  NONAKTIF    // Non-aktif
}

enum NotificationType {
  REGISTRATION_SUCCESS      // Pendaftaran berhasil
  VISIT_STATUS_CHANGED      // Status kunjungan berubah
  EXAMINATION_SCHEDULED     // Pemeriksaan dijadwalkan
  NEW_VISIT_CREATED         // Kunjungan baru dibuat
}
```

## Data Type Mapping

| Prisma | PostgreSQL | Deskripsi |
|--------|-----------|-----------|
| String (id) | UUID/TEXT | Primary key |
| String | VARCHAR | Text hingga 255 karakter |
| Int | INTEGER | Angka bulat |
| Float | DECIMAL(10,2) | Angka desimal |
| DateTime | TIMESTAMP | Tanggal dan waktu |
| Boolean | BOOLEAN | True/False |
| Json | JSONB | JSON data |
| Enum | ENUM | Nilai terbatas |

## Soft Delete Strategy

Beberapa tabel menggunakan soft delete:

```typescript
// Ketika menghapus, set deletedAt
await prisma.patient.update({
  where: { id: patientId },
  data: { deletedAt: new Date() }
});

// Query hanya data yang belum dihapus
await prisma.patient.findMany({
  where: { deletedAt: null }
});
```

## Performance Considerations

1. **Indexes**: Query sering di-index untuk performa
2. **Connection Pooling**: Gunakan connection pooling untuk database
3. **Lazy Loading**: Load relasi hanya jika diperlukan
4. **Pagination**: Implementasikan pagination untuk data besar
5. **Caching**: Cache data yang sering diakses

## Security Considerations

1. **Password Hashing**: Semua password di-hash dengan bcrypt
2. **SQL Injection**: Gunakan Prisma parameterized queries
3. **Access Control**: Implementasi RBAC di aplikasi level
4. **Data Encryption**: Sensitive data di-encrypt
5. **Audit Logs**: Log semua perubahan data penting
