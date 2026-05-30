"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { registerPatient } from "@/actions/patient";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nik: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await registerPatient(formData);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">K</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">Klinik Bersalin</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Pendaftaran Pasien</h1>
          <p className="text-gray-600 mt-2">Buat akun untuk mengakses sistem</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
            />
          )}

          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
              />

              <Input
                label="NIK"
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="Masukkan NIK (16 digit)"
                maxLength={16}
                required
              />

              <Input
                label="Tanggal Lahir"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />

              <Input
                label="Nomor HP"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Masukkan nomor HP"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <Input
              label="Alamat"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Masukkan alamat lengkap"
              required
            />

            <Input
              label="Konfirmasi Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sedang mendaftar..." : "Daftar"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-gray-600 text-center">
              Sudah punya akun?{" "}
              <Link
                href="/auth/login"
                className="text-pink-600 font-semibold hover:text-pink-700"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
