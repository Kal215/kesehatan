# 🔄 Flow Sistem

## 1. Authentication Flow

```
User Access
    │
    ▼
┌─────────────────┐
│ Check Session   │
│ (Middleware)    │
└────────┬────────┘
         │
    ┌────┴─────────────────────────────────┐
    │                                      │
    ▼                                      ▼
NO SESSION                            SESSION EXISTS
    │                                      │
    ▼                                      ▼
Redirect to Login      ┌──────────────────────────────────┐
    │                 │ Check Role & Route Access       │
    ▼                 └──────────────────────────────────┘
┌─────────────────┐              │
│ Login Page      │         ┌────┴──────────────┐
├─────────────────┤         │                   │
│ Email & Pass    │         ▼                   ▼
│   ↓             │    AUTHORIZED          NOT AUTHORIZED
│ Submit Form     │         │                   │
└────────┬────────┘         ▼                   ▼
         │          ┌────────────────┐   Redirect to
         ▼          │ Load Dashboard │   appropriate page
  ┌──────────────┐  └────────────────┘
  │ Credentials  │
  │ Provider     │
  ├──────────────┤
  │ Verify Email │
  │ Check Hash   │
  │ Password     │
  └──────┬───────┘
         │
    ┌────┴─────────┐
    │              │
    ▼              ▼
 VALID         INVALID
   │              │
   ▼              ▼
CREATE       Show Error
JWT         Message
SESSION    Retry Login
   │
   ▼
Set Cookie
   │
   ▼
Redirect to
Dashboard
```

## 2. Patient Registration Flow

```
┌───────────────────┐
│ Register Page     │
├───────────────────┤
│ Input Data:       │
│ - Name            │
│ - Email           │
│ - NIK             │
│ - DOB             │
│ - Address         │
│ - Phone           │
│ - Password        │
└─────────┬─────────┘
          │
          ▼
┌──────────────────────┐
│ Client Validation    │
│ (Zod Schema)         │
└──────────┬───────────┘
           │
      ┌────┴─────┐
      │           │
      ▼           ▼
   VALID      INVALID
      │           │
      │           ▼
      │      Show Errors
      │      Retry Form
      ▼
┌─────────────────────────┐
│ Server Action:          │
│ registerPatient()       │
└──────────┬──────────────┘
           │
      ┌────┴────────────────┐
      │                     │
      ▼                     ▼
Check Email         Check NIK
Exists              Exists
      │                     │
   ┌──┴──┐              ┌───┴──┐
   │     │              │      │
   YES   NO             YES    NO
   │     │              │      │
   ▼     ▼              ▼      ▼
ERROR  OK          ERROR    OK
         │                   │
         └───────┬───────────┘
                 ▼
         Hash Password
         (bcryptjs)
                 │
                 ▼
         Create User +
         Patient Record
                 │
                 ▼
         Create Welcome
         Notification
                 │
                 ▼
         Success Response
                 │
                 ▼
         Redirect to Login
```

## 3. Visit Creation Flow

```
┌─────────────────┐
│ Patient Login   │
│ Dashboard       │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Click "Daftar        │
│ Kunjungan"           │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Visit Form Modal     │
├──────────────────────┤
│ - Visit Date         │
│ - Service Type       │
│ - Complaint (opt)    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Submit Form          │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Server Action:       │
│ createVisit()        │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Validate Input       │
│ (Zod)                │
└────────┬─────────────┘
         │
      ┌──┴──┐
      │     │
      ▼     ▼
   VALID INVALID
      │     │
      │     ▼
      │  Error Message
      │  Retry Form
      ▼
Create Visit Record
(Status: MENUNGGU)
      │
      ▼
Generate Visit Number
      │
      ▼
Create Notification
for Patient
      │
      ▼
Success Response
      │
      ▼
Show Confirmation
Refresh Visit List
```

## 4. Pregnancy Examination Flow

```
┌─────────────────┐
│ Bidan Login     │
│ Dashboard       │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Click "Pemeriksaan   │
│ Kehamilan"           │
└────────┬─────────────┘
         │
         ▼
┌─────────────────────────┐
│ Examination Form Modal   │
├─────────────────────────┤
│ - Patient Name          │
│ - Maternal Weight       │
│ - Blood Pressure        │
│ - Fundus Height         │
│ - Pregnancy Age         │
│ - Fetal Weight          │
│ - Complaint             │
│ - Notes                 │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────┐
│ Submit Form          │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Server Action:       │
│ addPregnancy         │
│ Examination()        │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Validate Input       │
│ (Zod)                │
└────────┬─────────────┘
         │
      ┌──┴──┐
      │     │
      ▼     ▼
   VALID INVALID
      │     │
      │     ▼
      │  Error Message
      │  Retry Form
      ▼
Create Examination
Record
      │
      ▼
Link to Visit
      │
      ▼
Store Data in DB
      │
      ▼
Success Response
      │
      ▼
Show Confirmation
Refresh List
```

## 5. Visit Status Update Flow (Admin/Bidan)

```
┌─────────────────────┐
│ Admin/Bidan View    │
│ Visit List          │
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│ Click on Visit       │
│ or Status Dropdown   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Select New Status:   │
│ - MENUNGGU           │
│ - DITERIMA           │
│ - SELESAI            │
│ - DIBATALKAN         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Server Action:       │
│ updateVisitStatus()  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Update DB Record     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Create Notification  │
│ for Patient          │
└────────┬─────────────┘
         │
         ▼
✓ Success
         │
         ▼
Refresh View
Show Confirmation
```

## 6. Report Generation Flow

```
┌─────────────────┐
│ Admin Dashboard │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Click "Laporan"      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Select Filter:       │
│ - Report Type        │
│ - Month              │
│ - Year               │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ API Call:            │
│ /api/reports/        │
│ statistics           │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Query Database:      │
│ Count visits         │
│ Count patients       │
│ Count exams          │
│ Group by status      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Aggregate Results    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Return JSON Data     │
└────────┬─────────────┘
         │
      ┌──┴──────────────┐
      │                 │
      ▼                 ▼
   View in UI    Export (PDF/Excel)
   - Display     - Generate Document
   - Charts      - Download File
```

## 7. Data Retrieval Flow

```
┌──────────────────┐
│ Client Component │
│ (useEffect)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Fetch API Data   │
│ GET /api/...     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Server Handler   │
│ (Route Handler)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Authenticate     │
│ User/Session     │
└────────┬─────────┘
         │
      ┌──┴──┐
      │     │
      ▼     ▼
  VALID  INVALID
      │     │
      │     ▼
      │  401 Unauthorized
      │  Return Error
      ▼
┌──────────────────┐
│ Query Database   │
│ (Prisma)         │
└────────┬─────────┘
         │
      ┌──┴──┐
      │     │
      ▼     ▼
  FOUND  NOT FOUND
      │     │
      │     ▼
      │  Return 404
      ▼
┌──────────────────┐
│ Format Response  │
│ (JSON)           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Send Response    │
│ 200 OK           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Client Receives  │
│ Data             │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update State     │
│ (useState)       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Re-render        │
│ Component        │
└────────┬─────────┘
         │
         ▼
Display Data
to User
```

## 8. Role-Based Access Control Flow

```
┌─────────────────────┐
│ User Requests Page  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Middleware Check    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Get Session/User    │
└────────┬────────────┘
         │
      ┌──┴──┐
      │     │
      ▼     ▼
 SESSION NO SESSION
      │     │
      ▼     ▼
 Get Role  Redirect to
      │     Login
      ▼
┌─────────────────────┐
│ Check Route Access  │
└────────┬────────────┘
         │
    ┌────┴─────────────────────┐
    │                          │
    ▼                          ▼
ADMIN ROUTE              BIDAN ROUTE
    │                          │
    ▼                          ▼
Role == ADMIN?          Role == BIDAN?
    │ YES                      │ YES
    │                          │
    ▼                          ▼
  Allow             Allow
  Access           Access
    │                  │
    ▼                  ▼
  Load Page         Load Page
    
    
NO PATH:
│
▼
Role == PASIEN?
│ YES
│
▼
Redirect to /patient
```

## 9. Error Handling Flow

```
┌─────────────┐
│ Operation   │
└────┬────────┘
     │
     ▼
┌─────────────┐
│ Validate    │
│ Input       │
└────┬────────┘
     │
  ┌──┴──┐
  │     │
  ▼     ▼
VALID ERROR
  │     │
  │     ▼
  │  Return Error
  │  Message & Status
  │
  ▼
┌─────────────┐
│ Execute     │
│ Operation   │
└────┬────────┘
     │
  ┌──┴──┐
  │     │
  ▼     ▼
 OK   ERROR
  │     │
  │     ▼
  │  Log Error
  │  Send Error Response
  │  Notify User
  │
  ▼
Return Result
to User
```

## Data Flow Summary

```
User Input → Validation → Server Action/API → Database Query → 
Response → Client Update → UI Render
```

## Security Flow

```
Request → Authentication → Authorization → Validation → 
Execution → Response → Audit Log
```
