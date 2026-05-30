import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs;
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(date: Date | string) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function calculateAge(dateOfBirth: Date | string) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function generateMedicalRecordNo() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `RM${timestamp}${random}`.slice(0, 20);
}

export function generateVisitNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000);
  return `V${year}${month}${day}${String(random).padStart(4, "0")}`;
}

export const getRoleLabel = (role: string) => {
  const roles: Record<string, string> = {
    ADMIN: "Administrator",
    BIDAN: "Bidan",
    PASIEN: "Pasien",
  };
  return roles[role] || role;
};

export const getStatusLabel = (status: string) => {
  const statuses: Record<string, string> = {
    MENUNGGU: "Menunggu",
    DITERIMA: "Diterima",
    SELESAI: "Selesai",
    DIBATALKAN: "Dibatalkan",
    AKTIF: "Aktif",
    NONAKTIF: "Non-aktif",
  };
  return statuses[status] || status;
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-800",
    DITERIMA: "bg-blue-100 text-blue-800",
    SELESAI: "bg-green-100 text-green-800",
    DIBATALKAN: "bg-red-100 text-red-800",
    AKTIF: "bg-green-100 text-green-800",
    NONAKTIF: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
