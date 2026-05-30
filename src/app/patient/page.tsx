"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { FileText, Calendar, History, CheckCircle } from "lucide-react";

export default function PatientDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Pasien</h1>
          <p className="text-gray-600 mt-2">Selamat datang, {session?.user?.name}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Profil"
            value="Lengkap"
            icon={<FileText size={32} />}
            color="pink"
          />
          <StatCard
            title="Kunjungan Mendatang"
            value={2}
            icon={<Calendar size={32} />}
            color="blue"
          />
          <StatCard
            title="Riwayat Kunjungan"
            value={8}
            icon={<History size={32} />}
            color="green"
          />
          <StatCard
            title="Pemeriksaan Selesai"
            value={8}
            icon={<CheckCircle size={32} />}
            color="yellow"
          />
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profil Pasien */}
          <Card title="Profil Saya" className="md:col-span-1">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Nama</label>
                <p className="font-semibold text-gray-800">{session?.user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-semibold text-gray-800">{session?.user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Nomor Rekam Medis</label>
                <p className="font-semibold text-gray-800">RM2024001</p>
              </div>
            </div>
          </Card>

          {/* Jadwal Pemeriksaan */}
          <Card title="Jadwal Pemeriksaan" className="md:col-span-1">
            <div className="space-y-3">
              <div className="border-l-4 border-pink-500 pl-4 py-2">
                <p className="font-semibold text-gray-800">Pemeriksaan Rutin</p>
                <p className="text-sm text-gray-600">15 Juni 2024 - 10:00</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-semibold text-gray-800">Pemeriksaan Lanjutan</p>
                <p className="text-sm text-gray-600">22 Juni 2024 - 14:00</p>
              </div>
            </div>
          </Card>

          {/* Status Pendaftaran */}
          <Card title="Status Pendaftaran" className="md:col-span-1">
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full">
                ✓ Lengkap
              </div>
              <p className="text-sm text-gray-600 mt-4">Semua data sudah terverifikasi</p>
            </div>
          </Card>

          {/* Riwayat Kunjungan */}
          <Card title="Riwayat Kunjungan" className="md:col-span-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-2">Tanggal</th>
                    <th className="text-left p-2">Bidan</th>
                    <th className="text-left p-2">Keluhan</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((item) => (
                    <tr key={item} className="border-b hover:bg-gray-50">
                      <td className="p-2">10 Juni 2024</td>
                      <td className="p-2">Ibu Siti</td>
                      <td className="p-2">Pemeriksaan rutin</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Selesai
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
