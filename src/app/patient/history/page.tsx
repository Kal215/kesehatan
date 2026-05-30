"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";

export default function PatientHistoryPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Riwayat Kunjungan</h1>
          <p className="text-gray-600 mt-2">Lihat riwayat pemeriksaan dan kunjungan Anda</p>
        </div>

        <Card title="Riwayat Pemeriksaan">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-4">Tanggal</th>
                  <th className="text-left p-4">Bidan</th>
                  <th className="text-left p-4">Keluhan</th>
                  <th className="text-left p-4">Berat Badan</th>
                  <th className="text-left p-4">Tekanan Darah</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">10 Juni 2024</td>
                  <td className="p-4">Ibu Siti</td>
                  <td className="p-4">Tidak ada keluhan</td>
                  <td className="p-4">70 kg</td>
                  <td className="p-4">120/80 mmHg</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">3 Juni 2024</td>
                  <td className="p-4">Ibu Siti</td>
                  <td className="p-4">Pusing ringan</td>
                  <td className="p-4">69 kg</td>
                  <td className="p-4">118/78 mmHg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
