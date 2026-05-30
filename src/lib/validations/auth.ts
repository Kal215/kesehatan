import { z } from "zod";

// Login validation
export const loginSchema = z.object({
  email: z
    .string()
    .email("Email tidak valid")
    .min(1, "Email diperlukan"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .min(1, "Password diperlukan"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register Patient validation
export const registerPatientSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").min(1, "Nama diperlukan"),
  email: z
    .string()
    .email("Email tidak valid")
    .min(1, "Email diperlukan"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .min(1, "Password diperlukan"),
  confirmPassword: z
    .string()
    .min(1, "Konfirmasi password diperlukan"),
  nik: z
    .string()
    .min(16, "NIK harus 16 digit")
    .max(16, "NIK harus 16 digit")
    .min(1, "NIK diperlukan"),
  dateOfBirth: z
    .string()
    .min(1, "Tanggal lahir diperlukan"),
  address: z
    .string()
    .min(5, "Alamat minimal 5 karakter")
    .min(1, "Alamat diperlukan"),
  phoneNumber: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .min(1, "Nomor HP diperlukan"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type RegisterPatientInput = z.infer<typeof registerPatientSchema>;

// Update profile validation
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  phoneNumber: z.string().min(10, "Nomor HP minimal 10 digit"),
  address: z.string().min(5, "Alamat minimal 5 karakter").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
