"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-blue-400 rounded-lg mb-4">
            <span className="text-2xl font-bold text-white">K</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Klinik Bersalin</h1>
          <p className="text-gray-600 mt-2">Sistem Informasi Kesehatan</p>
          <p className="text-gray-600 mt-2">Oleh : Fianny Ascory</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Masuk</h2>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password Anda"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sedang masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-gray-600 text-center">
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="text-pink-600 font-semibold hover:text-pink-700"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">Demo Akun:</p>
          <p className="text-sm text-blue-800">
            <strong>Admin:</strong> admin@klinik.com | admin123
          </p>
          <p className="text-sm text-blue-800">
            <strong>Bidan:</strong> siti@klinik.com | bidan123
          </p>
          <p className="text-sm text-blue-800">
            <strong>Pasien:</strong> siti.aminah@gmail.com | pasien123
          </p>
        </div> */}
      </div>
    </div>
  );
}
