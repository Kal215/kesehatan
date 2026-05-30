"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { getStatusLabel, getStatusColor } from "@/lib/utils";

export default function BidanVisitsPage() {
  const { data: session } = useSession();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setVisits([
          {
            id: "1",
            visitNumber: "V20240610001",
            patientName: "Siti Aminah",
            visitDate: "2024-06-10",
            status: "SELESAI",
            serviceType: "Pemeriksaan Rutin",
          },
        ]);
      } catch (error) {
        console.error("Error fetching visits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Data Kunjungan</h1>
            <p className="text-gray-600 mt-2">Kelola kunjungan pasien Anda</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={18} />
            Kunjungan Baru
          </Button>
        </div>

        <Card loading={loading} title="Daftar Kunjungan">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-4">No. Kunjungan</th>
                  <th className="text-left p-4">Nama Pasien</th>
                  <th className="text-left p-4">Tanggal</th>
                  <th className="text-left p-4">Jenis Layanan</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{visit.visitNumber}</td>
                    <td className="p-4">{visit.patientName}</td>
                    <td className="p-4">{visit.visitDate}</td>
                    <td className="p-4">{visit.serviceType}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(visit.status)}`}>
                        {getStatusLabel(visit.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visits.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                Tidak ada data kunjungan
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
