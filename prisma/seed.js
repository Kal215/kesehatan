const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@klinik.com" },
    update: {},
    create: {
      email: "admin@klinik.com",
      name: "Administrator",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      admin: {
        create: {},
      },
    },
  });
  console.log("✓ Admin user created:", adminUser.email);

  // Create Midwife Users
  const midwife1 = await prisma.user.upsert({
    where: { email: "siti@klinik.com" },
    update: {},
    create: {
      email: "siti@klinik.com",
      name: "Ibu Siti",
      password: await bcrypt.hash("bidan123", 10),
      role: "BIDAN",
      midwife: {
        create: {
          sipb: "123456789001",
          phoneNumber: "081234567890",
          status: "AKTIF",
        },
      },
    },
  });
  console.log("✓ Midwife created:", midwife1.email);

  const midwife2 = await prisma.user.upsert({
    where: { email: "nur@klinik.com" },
    update: {},
    create: {
      email: "nur@klinik.com",
      name: "Ibu Nur",
      password: await bcrypt.hash("bidan123", 10),
      role: "BIDAN",
      midwife: {
        create: {
          sipb: "123456789002",
          phoneNumber: "082234567890",
          status: "AKTIF",
        },
      },
    },
  });
  console.log("✓ Midwife created:", midwife2.email);

  // Create Patient Users
  const patient1 = await prisma.user.upsert({
    where: { email: "siti.aminah@gmail.com" },
    update: {},
    create: {
      email: "siti.aminah@gmail.com",
      name: "Siti Aminah",
      password: await bcrypt.hash("pasien123", 10),
      role: "PASIEN",
      patient: {
        create: {
          nik: "3201234567890123",
          medicalRecordNo: "RM202400001",
          dateOfBirth: new Date("1995-05-15"),
          address: "Jl. Raya No. 10, Jakarta",
          phoneNumber: "081234567890",
          bloodType: "O_POSITIF",
          pregnancyHistory: "2 kali hamil",
        },
      },
    },
  });
  console.log("✓ Patient created:", patient1.email);

  const patient2 = await prisma.user.upsert({
    where: { email: "nuri.lestari@gmail.com" },
    update: {},
    create: {
      email: "nuri.lestari@gmail.com",
      name: "Nuri Lestari",
      password: await bcrypt.hash("pasien123", 10),
      role: "PASIEN",
      patient: {
        create: {
          nik: "3202345678901234",
          medicalRecordNo: "RM202400002",
          dateOfBirth: new Date("1998-08-20"),
          address: "Jl. Merdeka No. 5, Jakarta",
          phoneNumber: "082234567890",
          bloodType: "A_POSITIF",
          pregnancyHistory: "1 kali hamil",
        },
      },
    },
  });
  console.log("✓ Patient created:", patient2.email);

  // Create Sample Visit
  const patientRecord1 = await prisma.patient.findUnique({
    where: { userId: patient1.id },
  });
  const midwifeRecord1 = await prisma.midwife.findUnique({
    where: { userId: midwife1.id },
  });

  if (patientRecord1 && midwifeRecord1) {
    const timestamp = Date.now().toString().slice(-6);
    const visit = await prisma.visit.create({
      data: {
        visitNumber: `V202406${timestamp}`,
        patientId: patientRecord1.id,
        bidanId: midwifeRecord1.id,
        visitDate: new Date("2024-06-10"),
        serviceType: "Pemeriksaan Rutin",
        complaint: "Kontrol kehamilan rutin",
        diagnosis: "Kehamilan normal",
        notes: "Semua tanda vital normal",
        status: "SELESAI",
      },
    });
    console.log("✓ Sample visit created");

    // Create Pregnancy Examination
    await prisma.pregnancyExamination.create({
      data: {
        visitId: visit.id,
        patientId: patientRecord1.id,
        midwifeId: midwifeRecord1.id,
        maternalWeight: 70.5,
        bloodPressure: "120/80",
        fundusHeight: 28,
        pregnancyAge: 28,
        fetalWeight: 1200,
        complaint: "Tidak ada keluhan",
        notes: "Pemeriksaan lengkap, semua normal",
      },
    });
    console.log("✓ Pregnancy examination created");
  }

  // Create Notifications
  await prisma.notification.create({
    data: {
      userId: patient1.id,
      type: "REGISTRATION_SUCCESS",
      title: "Pendaftaran Berhasil",
      message:
        "Selamat datang di Klinik Bersalin. Akun Anda telah berhasil dibuat.",
      read: false,
    },
  });

  console.log("✅ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
