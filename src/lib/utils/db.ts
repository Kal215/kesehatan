// src/lib/utils/db.ts

import { prisma } from "@/lib/prisma";

// Patient utilities
export async function getPatientWithDetails(patientId: string) {
  return prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      user: true,
      visits: {
        orderBy: { visitDate: "desc" },
        take: 10,
      },
      examinations: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getAllPatients(skip: number = 0, take: number = 10) {
  return prisma.patient.findMany({
    where: { deletedAt: null },
    include: { user: true },
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function searchPatients(query: string) {
  return prisma.patient.findMany({
    where: {
      deletedAt: null,
      OR: [
        { user: { name: { contains: query, mode: "insensitive" } } },
        { nik: { contains: query } },
        { medicalRecordNo: { contains: query } },
        { user: { email: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: { user: true },
    take: 10,
  });
}

// Visit utilities
export async function getVisitDetails(visitId: string) {
  return prisma.visit.findUnique({
    where: { id: visitId },
    include: {
      patient: { include: { user: true } },
      bidan: true,
      examinations: true,
    },
  });
}

export async function getPatientVisits(patientId: string) {
  return prisma.visit.findMany({
    where: { patientId },
    include: {
      patient: { include: { user: true } },
      bidan: true,
    },
    orderBy: { visitDate: "desc" },
  });
}

export async function getBidanVisits(bidanId: string) {
  return prisma.visit.findMany({
    where: { bidanId },
    include: {
      patient: { include: { user: true } },
      bidan: true,
    },
    orderBy: { visitDate: "desc" },
  });
}

export async function getVisitsByStatus(status: string) {
  return prisma.visit.findMany({
    where: { status: status as any },
    include: {
      patient: { include: { user: true } },
      bidan: true,
    },
    orderBy: { visitDate: "desc" },
  });
}

// Statistics utilities
export async function getPatientStats() {
  const total = await prisma.patient.count({ where: { deletedAt: null } });
  const thisMonth = await prisma.patient.count({
    where: {
      deletedAt: null,
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });

  return { total, thisMonth };
}

export async function getVisitStats() {
  const total = await prisma.visit.count();
  const thisMonth = await prisma.visit.count({
    where: {
      visitDate: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });
  const completed = await prisma.visit.count({
    where: { status: "SELESAI" },
  });
  const pending = await prisma.visit.count({
    where: { status: "MENUNGGU" },
  });

  return { total, thisMonth, completed, pending };
}

export async function getMidwifeStats() {
  const total = await prisma.midwife.count();
  const active = await prisma.midwife.count({
    where: { status: "AKTIF" },
  });

  return { total, active };
}

// Notification utilities
export async function getUnreadNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId, read: false },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

// Audit log utilities
export async function createAuditLog(
  action: string,
  entity: string,
  entityId: string,
  changes?: any,
  userId?: string
) {
  return prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      changes: changes ? (changes as any) : undefined,
      userId,
    },
  });
}

export async function getAuditLogs(entityId: string) {
  return prisma.auditLog.findMany({
    where: { entityId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
