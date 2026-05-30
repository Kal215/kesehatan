"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";

export default function BidanPatientsPage() {
  const { data: session } = useSession();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setPatients([
          {
            id: "1",
            name: "Siti Aminah",
            nik: "3201234567890123",
            medicalRecordNo: "RM2024001",
            phoneNumber: "081234567890",
            pregnancyAge: "6 bulan",
            status: "Aktif",
          },
        ]);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Data Pasien</h1>
          <p className="text-gray-600 mt-2">Kelola data pasien yang Anda layani</p>
        </div>

        <Card loading={loading} title="Daftar Pasien">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-4">No. Rekam Medis</th>
                  <th className="text-left p-4">Nama</th>
                  <th className="text-left p-4">NIK</th>
                  <th className="text-left p-4">Nomor HP</th>
                  <th className="text-left p-4">Usia Kehamilan</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{patient.medicalRecordNo}</td>
                    <td className="p-4">{patient.name}</td>
                    <td className="p-4">{patient.nik}</td>
                    <td className="p-4">{patient.phoneNumber}</td>
                    <td className="p-4">{patient.pregnancyAge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                Tidak ada data pasien
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
