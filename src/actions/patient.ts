"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { registerPatientSchema } from "@/lib/validations/auth";
import { generateMedicalRecordNo, generateVisitNumber } from "@/lib/utils";

export async function registerPatient(data: unknown) {
  try {
    const validatedData = registerPatientSchema.parse(data);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email sudah terdaftar",
      };
    }

    // Check if NIK already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { nik: validatedData.nik },
    });

    if (existingPatient) {
      return {
        success: false,
        message: "NIK sudah terdaftar",
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user and patient
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        role: "PASIEN",
        patient: {
          create: {
            nik: validatedData.nik,
            medicalRecordNo: generateMedicalRecordNo(),
            dateOfBirth: new Date(validatedData.dateOfBirth),
            address: validatedData.address,
            phoneNumber: validatedData.phoneNumber,
          },
        },
      },
      include: {
        patient: true,
      },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "REGISTRATION_SUCCESS",
        title: "Pendaftaran Berhasil",
        message: "Selamat datang di Klinik Bersalin. Akun Anda telah berhasil dibuat.",
      },
    });

    return {
      success: true,
      message: "Pendaftaran berhasil. Silakan login untuk melanjutkan.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat pendaftaran",
    };
  }
}

export async function createPatient(data: any) {
  try {
    // Check if NIK already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { nik: data.nik },
    });

    if (existingPatient) {
      return {
        success: false,
        message: "NIK sudah terdaftar",
      };
    }

    // Create user first
    const hashedPassword = await hashPassword(data.email.split("@")[0] + "123");
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: "PASIEN",
      },
    });

    // Then create patient
    const patient = await prisma.patient.create({
      data: {
        nik: data.nik,
        medicalRecordNo: generateMedicalRecordNo(),
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        phoneNumber: data.phoneNumber,
        bloodType: data.bloodType || null,
        pregnancyHistory: data.pregnancyHistory || null,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    return {
      success: true,
      message: "Pasien berhasil ditambahkan",
      data: patient,
    };
  } catch (error) {
    console.error("Create patient error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menambahkan pasien",
    };
  }
}

export async function updatePatient(id: string, data: any) {
  try {
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        nik: data.nik,
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        phoneNumber: data.phoneNumber,
        bloodType: data.bloodType || null,
        pregnancyHistory: data.pregnancyHistory || null,
        user: {
          update: {
            name: data.name,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return {
      success: true,
      message: "Data pasien berhasil diperbarui",
      data: patient,
    };
  } catch (error) {
    console.error("Update patient error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui data pasien",
    };
  }
}

export async function deletePatient(id: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!patient) {
      return {
        success: false,
        message: "Pasien tidak ditemukan",
      };
    }

    // Soft delete patient
    await prisma.patient.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // Delete user
    await prisma.user.delete({
      where: { id: patient.userId },
    });

    return {
      success: true,
      message: "Pasien berhasil dihapus",
    };
  } catch (error) {
    console.error("Delete patient error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus pasien",
    };
  }
}
