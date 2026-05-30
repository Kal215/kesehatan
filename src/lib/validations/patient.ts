import { z } from "zod";

// Create/Update Patient validation
export const patientSchema = z.object({
  nik: z
    .string()
    .min(16, "NIK harus 16 digit")
    .max(16, "NIK harus 16 digit"),
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter"),
  dateOfBirth: z
    .string()
    .min(1, "Tanggal lahir diperlukan"),
  address: z
    .string()
    .min(5, "Alamat minimal 5 karakter"),
  phoneNumber: z
    .string()
    .min(10, "Nomor HP minimal 10 digit"),
  bloodType: z
    .enum(["O_POSITIF", "O_NEGATIF", "A_POSITIF", "A_NEGATIF", "B_POSITIF", "B_NEGATIF", "AB_POSITIF", "AB_NEGATIF"])
    .optional(),
  pregnancyHistory: z
    .string()
    .optional(),
});

export type PatientInput = z.infer<typeof patientSchema>;

// Create Visit validation
export const visitSchema = z.object({
  patientId: z.string().min(1, "Pasien diperlukan"),
  visitDate: z.string().min(1, "Tanggal kunjungan diperlukan"),
  serviceType: z.string().min(1, "Jenis layanan diperlukan"),
  complaint: z.string().optional(),
});

export type VisitInput = z.infer<typeof visitSchema>;

// Update Visit Status validation
export const updateVisitStatusSchema = z.object({
  status: z.enum(["MENUNGGU", "DITERIMA", "SELESAI", "DIBATALKAN"]),
});

export type UpdateVisitStatusInput = z.infer<typeof updateVisitStatusSchema>;

// Pregnancy Examination validation
export const pregnancyExaminationSchema = z.object({
  maternalWeight: z.number().positive("Berat badan harus angka positif"),
  bloodPressure: z.string().min(1, "Tekanan darah diperlukan"),
  fundusHeight: z.number().positive("Tinggi fundus harus angka positif").optional(),
  pregnancyAge: z.number().int().positive("Usia kehamilan harus angka positif").optional(),
  fetalWeight: z.number().positive("Berat janin harus angka positif").optional(),
  complaint: z.string().optional(),
  notes: z.string().optional(),
});

export type PregnancyExaminationInput = z.infer<typeof pregnancyExaminationSchema>;

// Midwife validation
export const midwifeSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  sipb: z.string().min(1, "SIPB diperlukan"),
  phoneNumber: z.string().min(10, "Nomor HP minimal 10 digit"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
});

export type MidwifeInput = z.infer<typeof midwifeSchema>;
