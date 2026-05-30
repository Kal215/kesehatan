"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Users, Calendar, Activity, Clock } from "lucide-react";

export default function MidwifeDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Bidan</h1>
          <p className="text-gray-600 mt-2">Selamat datang kembali, {session?.user?.name}</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Pasien Hari Ini"
            value={12}
            icon={<Users size={32} />}
            color="pink"
          />
          <StatCard
            title="Jadwal Pemeriksaan"
            value={8}
            icon={<Calendar size={32} />}
            color="blue"
          />
          <StatCard
            title="Kunjungan Hari Ini"
            value={10}
            icon={<Activity size={32} />}
            color="green"
          />
          <StatCard
            title="Menunggu Verifikasi"
            value={5}
            icon={<Clock size={32} />}
            color="yellow"
          />
        </div>

        {/* Content Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Jadwal Pemeriksaan Hari Ini">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="border-l-4 border-pink-500 pl-4 py-2">
                  <p className="font-semibold text-gray-800">Pasien {item}</p>
                  <p className="text-sm text-gray-600">Jam: 08:00 - Pemeriksaan Rutin</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Pasien Terbaru">
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-gray-800">Nama Pasien {item}</p>
                  <p className="text-sm text-gray-600">Pendaftaran: 10 menit lalu</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
