# 🌐 API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.vercel.app/api
```

## Authentication

All endpoints require authentication through NextAuth session.

### Headers
```
Content-Type: application/json
```

---

## Endpoints

### 1. Patients

#### Get All Patients
```http
GET /api/patients
```

**Response:**
```json
[
  {
    "id": "clx1234567",
    "nik": "3201234567890123",
    "medicalRecordNo": "RM2024001",
    "dateOfBirth": "1995-05-15T00:00:00.000Z",
    "address": "Jl. Raya No. 10",
    "phoneNumber": "081234567890",
    "bloodType": "O_POSITIF",
    "pregnancyHistory": "2 kali hamil",
    "userId": "user123",
    "user": {
      "id": "user123",
      "email": "pasien@klinik.com",
      "name": "Siti Aminah"
    },
    "createdAt": "2024-06-01T10:00:00.000Z",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  }
]
```

#### Get Patient by ID
```http
GET /api/patients/:id
```

**Response:**
```json
{
  "id": "clx1234567",
  "nik": "3201234567890123",
  "medicalRecordNo": "RM2024001",
  "dateOfBirth": "1995-05-15T00:00:00.000Z",
  "address": "Jl. Raya No. 10",
  "phoneNumber": "081234567890",
  "bloodType": "O_POSITIF",
  "pregnancyHistory": "2 kali hamil",
  "user": {
    "id": "user123",
    "email": "pasien@klinik.com",
    "name": "Siti Aminah"
  },
  "visits": [
    {
      "id": "visit123",
      "visitNumber": "V20240610001",
      "visitDate": "2024-06-10T00:00:00.000Z",
      "status": "SELESAI"
    }
  ],
  "examinations": [
    {
      "id": "exam123",
      "maternalWeight": 70,
      "bloodPressure": "120/80",
      "createdAt": "2024-06-10T10:00:00.000Z"
    }
  ]
}
```

#### Create Patient
```http
POST /api/patients
Content-Type: application/json

{
  "nik": "3201234567890123",
  "medicalRecordNo": "RM2024001",
  "dateOfBirth": "1995-05-15",
  "address": "Jl. Raya No. 10",
  "phoneNumber": "081234567890",
  "bloodType": "O_POSITIF",
  "pregnancyHistory": "2 kali hamil",
  "userId": "user123"
}
```

**Response (201):**
```json
{
  "id": "clx1234567",
  "nik": "3201234567890123",
  "medicalRecordNo": "RM2024001",
  "dateOfBirth": "1995-05-15T00:00:00.000Z",
  "address": "Jl. Raya No. 10",
  "phoneNumber": "081234567890",
  "bloodType": "O_POSITIF",
  "pregnancyHistory": "2 kali hamil",
  "userId": "user123",
  "user": { ... }
}
```

#### Update Patient
```http
PUT /api/patients/:id
Content-Type: application/json

{
  "nik": "3201234567890123",
  "name": "Siti Aminah Updated",
  "dateOfBirth": "1995-05-15",
  "address": "Jl. Raya No. 20",
  "phoneNumber": "081234567891",
  "bloodType": "O_POSITIF",
  "pregnancyHistory": "3 kali hamil"
}
```

**Response:**
```json
{
  "id": "clx1234567",
  "nik": "3201234567890123",
  "address": "Jl. Raya No. 20",
  "phoneNumber": "081234567891",
  ...
}
```

#### Delete Patient
```http
DELETE /api/patients/:id
```

**Response:**
```json
{
  "message": "Patient deleted successfully"
}
```

---

### 2. Visits

#### Get All Visits
```http
GET /api/visits
```

**Query Parameters:**
- `status`: Filter by status (MENUNGGU, DITERIMA, SELESAI, DIBATALKAN)
- `patientId`: Filter by patient ID
- `month`: Filter by month (1-12)
- `year`: Filter by year

**Response:**
```json
[
  {
    "id": "visit123",
    "visitNumber": "V20240610001",
    "patientId": "patient123",
    "bidanId": "bidan123",
    "visitDate": "2024-06-10T00:00:00.000Z",
    "serviceType": "Pemeriksaan Rutin",
    "complaint": "Kontrol kehamilan",
    "diagnosis": "Kehamilan normal",
    "notes": "Semua baik",
    "status": "SELESAI",
    "patient": {
      "id": "patient123",
      "name": "Siti Aminah",
      "user": { ... }
    },
    "bidan": { ... },
    "createdAt": "2024-06-10T10:00:00.000Z",
    "updatedAt": "2024-06-10T15:00:00.000Z"
  }
]
```

#### Get Visit by ID
```http
GET /api/visits/:id
```

**Response:**
```json
{
  "id": "visit123",
  "visitNumber": "V20240610001",
  "patientId": "patient123",
  "bidanId": "bidan123",
  "visitDate": "2024-06-10T00:00:00.000Z",
  "serviceType": "Pemeriksaan Rutin",
  "status": "SELESAI",
  "patient": { ... },
  "bidan": { ... },
  "examinations": [
    {
      "id": "exam123",
      "maternalWeight": 70,
      "bloodPressure": "120/80",
      "fundusHeight": 28,
      "pregnancyAge": 28,
      "fetalWeight": 1200,
      "notes": "Semua normal"
    }
  ]
}
```

#### Create Visit
```http
POST /api/visits
Content-Type: application/json

{
  "visitNumber": "V20240610002",
  "patientId": "patient123",
  "bidanId": "bidan123",
  "visitDate": "2024-06-10T10:00:00Z",
  "serviceType": "Pemeriksaan Rutin",
  "complaint": "Kontrol kehamilan"
}
```

**Response (201):**
```json
{
  "id": "visit123",
  "visitNumber": "V20240610002",
  "patientId": "patient123",
  "bidanId": "bidan123",
  "visitDate": "2024-06-10T10:00:00.000Z",
  "serviceType": "Pemeriksaan Rutin",
  "complaint": "Kontrol kehamilan",
  "status": "MENUNGGU",
  "patient": { ... },
  "bidan": { ... }
}
```

#### Update Visit Status
```http
PATCH /api/visits/:id
Content-Type: application/json

{
  "status": "SELESAI",
  "diagnosis": "Kehamilan normal",
  "notes": "Pemeriksaan lengkap"
}
```

**Response:**
```json
{
  "id": "visit123",
  "visitNumber": "V20240610001",
  "status": "SELESAI",
  "diagnosis": "Kehamilan normal",
  "notes": "Pemeriksaan lengkap",
  ...
}
```

---

### 3. Pregnancy Examinations

#### Create Examination
```http
POST /api/visits/:visitId/examinations
Content-Type: application/json

{
  "maternalWeight": 70.5,
  "bloodPressure": "120/80",
  "fundusHeight": 28,
  "pregnancyAge": 28,
  "fetalWeight": 1200,
  "complaint": "Tidak ada",
  "notes": "Semua normal"
}
```

**Response (201):**
```json
{
  "id": "exam123",
  "visitId": "visit123",
  "patientId": "patient123",
  "midwifeId": "midwife123",
  "maternalWeight": 70.5,
  "bloodPressure": "120/80",
  "fundusHeight": 28,
  "pregnancyAge": 28,
  "fetalWeight": 1200,
  "complaint": "Tidak ada",
  "notes": "Semua normal",
  "createdAt": "2024-06-10T15:00:00.000Z"
}
```

---

### 4. Midwives

#### Get All Midwives
```http
GET /api/midwives
```

**Response:**
```json
[
  {
    "id": "midwife123",
    "userId": "user123",
    "sipb": "123456789",
    "phoneNumber": "081234567890",
    "status": "AKTIF",
    "user": {
      "id": "user123",
      "email": "bidan@klinik.com",
      "name": "Ibu Siti"
    },
    "createdAt": "2024-06-01T10:00:00.000Z",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  }
]
```

---

### 5. Reports

#### Get Statistics
```http
GET /api/reports/statistics?month=6&year=2024
```

**Query Parameters:**
- `month`: Month (1-12)
- `year`: Year

**Response:**
```json
{
  "month": 6,
  "year": 2024,
  "totalVisits": 156,
  "totalPatients": 45,
  "totalExaminations": 120,
  "newPatients": 12,
  "visitsByStatus": {
    "MENUNGGU": 10,
    "DITERIMA": 20,
    "SELESAI": 120,
    "DIBATALKAN": 6
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- No rate limiting in development
- Production: 100 requests per minute per IP

---

## Pagination

For large data sets, use pagination:

```http
GET /api/patients?page=1&limit=10
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Filtering & Searching

### Patients
```http
GET /api/patients?search=siti&status=aktif&sortBy=createdAt&sortOrder=desc
```

### Visits
```http
GET /api/visits?status=SELESAI&patientId=xxx&month=6&year=2024
```

---

## Example Requests

### cURL

```bash
# Get all patients
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer <token>"

# Create visit
curl -X POST http://localhost:3000/api/visits \
  -H "Content-Type: application/json" \
  -d '{
    "visitNumber": "V20240610001",
    "patientId": "patient123",
    "visitDate": "2024-06-10T10:00:00Z",
    "serviceType": "Pemeriksaan Rutin"
  }'

# Update visit status
curl -X PATCH http://localhost:3000/api/visits/visit123 \
  -H "Content-Type: application/json" \
  -d '{"status": "SELESAI"}'
```

### JavaScript/Fetch

```javascript
// Get all patients
const response = await fetch('/api/patients');
const patients = await response.json();

// Create visit
const response = await fetch('/api/visits', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    visitNumber: 'V20240610001',
    patientId: 'patient123',
    visitDate: '2024-06-10T10:00:00Z',
    serviceType: 'Pemeriksaan Rutin'
  })
});
const visit = await response.json();
```

---

## Webhook Events (Future)

```
- patient.created
- patient.updated
- patient.deleted
- visit.created
- visit.status_changed
- examination.created
```
