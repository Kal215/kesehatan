"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { generateVisitNumber } from "@/lib/utils";

export async function createVisit(data: {
  patientId: string;
  visitDate: string;
  serviceType: string;
  complaint?: string;
}) {
  try {
    const visit = await prisma.visit.create({
      data: {
        visitNumber: generateVisitNumber(),
        patientId: data.patientId,
        visitDate: new Date(data.visitDate),
        serviceType: data.serviceType,
        complaint: data.complaint || null,
        status: "MENUNGGU",
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    // Create notification for patient
    await prisma.notification.create({
      data: {
        userId: visit.patient.userId,
        type: "NEW_VISIT_CREATED",
        title: "Kunjungan Baru Dibuat",
        message: `Kunjungan Anda pada ${new Date(data.visitDate).toLocaleDateString("id-ID")} telah berhasil dibuat.`,
      },
    });

    return {
      success: true,
      message: "Kunjungan berhasil dibuat",
      data: visit,
    };
  } catch (error) {
    console.error("Create visit error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat kunjungan",
    };
  }
}

export async function updateVisitStatus(
  visitId: string,
  status: "MENUNGGU" | "DITERIMA" | "SELESAI" | "DIBATALKAN"
) {
  try {
    const visit = await prisma.visit.update({
      where: { id: visitId },
      data: { status },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    // Create notification
    const statusLabels: Record<string, string> = {
      MENUNGGU: "Menunggu",
      DITERIMA: "Diterima",
      SELESAI: "Selesai",
      DIBATALKAN: "Dibatalkan",
    };

    await prisma.notification.create({
      data: {
        userId: visit.patient.userId,
        type: "VISIT_STATUS_CHANGED",
        title: "Status Kunjungan Berubah",
        message: `Status kunjungan Anda berubah menjadi ${statusLabels[status]}.`,
      },
    });

    return {
      success: true,
      message: "Status kunjungan berhasil diperbarui",
      data: visit,
    };
  } catch (error) {
    console.error("Update visit status error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui status kunjungan",
    };
  }
}

export async function addPregnancyExamination(data: {
  visitId: string;
  patientId: string;
  midwifeId: string;
  maternalWeight: number;
  bloodPressure: string;
  fundusHeight?: number;
  pregnancyAge?: number;
  fetalWeight?: number;
  complaint?: string;
  notes?: string;
}) {
  try {
    const examination = await prisma.pregnancyExamination.create({
      data: {
        visitId: data.visitId,
        patientId: data.patientId,
        midwifeId: data.midwifeId,
        maternalWeight: data.maternalWeight,
        bloodPressure: data.bloodPressure,
        fundusHeight: data.fundusHeight || null,
        pregnancyAge: data.pregnancyAge || null,
        fetalWeight: data.fetalWeight || null,
        complaint: data.complaint || null,
        notes: data.notes || null,
      },
      include: {
        visit: true,
        patient: true,
        midwife: true,
      },
    });

    return {
      success: true,
      message: "Pemeriksaan kehamilan berhasil ditambahkan",
      data: examination,
    };
  } catch (error) {
    console.error("Add pregnancy examination error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menambahkan pemeriksaan kehamilan",
    };
  }
}

export async function createMidwife(data: {
  name: string;
  email: string;
  sipb: string;
  phoneNumber: string;
  password?: string;
}) {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email sudah terdaftar",
      };
    }

    // Check if SIPB already exists
    const existingMidwife = await prisma.midwife.findUnique({
      where: { sipb: data.sipb },
    });

    if (existingMidwife) {
      return {
        success: false,
        message: "SIPB sudah terdaftar",
      };
    }

    // Hash password (use default if not provided)
    const password = data.password || "Bidan123!";
    const hashedPassword = await hashPassword(password);

    // Create user and midwife
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: "BIDAN",
        midwife: {
          create: {
            sipb: data.sipb,
            phoneNumber: data.phoneNumber,
          },
        },
      },
      include: {
        midwife: true,
      },
    });

    return {
      success: true,
      message: "Bidan berhasil ditambahkan",
      data: user,
    };
  } catch (error) {
    console.error("Create midwife error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menambahkan bidan",
    };
  }
}

export async function updateMidwife(
  midwifeId: string,
  data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  }
) {
  try {
    const midwife = await prisma.midwife.findUnique({
      where: { id: midwifeId },
      include: { user: true },
    });

    if (!midwife) {
      return {
        success: false,
        message: "Bidan tidak ditemukan",
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: midwife.userId },
      data: {
        name: data.name || midwife.user.name,
        email: data.email || midwife.user.email,
        midwife: {
          update: {
            phoneNumber: data.phoneNumber || midwife.phoneNumber,
          },
        },
      },
      include: {
        midwife: true,
      },
    });

    return {
      success: true,
      message: "Data bidan berhasil diperbarui",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update midwife error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui data bidan",
    };
  }
}

export async function deleteMidwife(midwifeId: string) {
  try {
    const midwife = await prisma.midwife.findUnique({
      where: { id: midwifeId },
      include: { user: true },
    });

    if (!midwife) {
      return {
        success: false,
        message: "Bidan tidak ditemukan",
      };
    }

    // Delete midwife and user
    await prisma.midwife.delete({
      where: { id: midwifeId },
    });

    await prisma.user.delete({
      where: { id: midwife.userId },
    });

    return {
      success: true,
      message: "Bidan berhasil dihapus",
    };
  } catch (error) {
    console.error("Delete midwife error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus bidan",
    };
  }
}
