"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Select } from "@/components/ui/Select";
import { Plus, Eye } from "lucide-react";
import { getStatusLabel, getStatusColor } from "@/lib/utils";

export default function VisitManagementPage() {
  const { data: session } = useSession();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("SEMUA");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        // Mock data
        setVisits([
          {
            id: "1",
            visitNumber: "V20240610001",
            patientName: "Siti Aminah",
            bidanName: "Ibu Siti",
            visitDate: "2024-06-10",
            serviceType: "Pemeriksaan Rutin",
            status: "SELESAI",
            complaint: "Kontrol rutin kehamilan",
          },
          {
            id: "2",
            visitNumber: "V20240611001",
            patientName: "Nuri Lestari",
            bidanName: "-",
            visitDate: "2024-06-11",
            serviceType: "Pemeriksaan Pertama",
            status: "MENUNGGU",
            complaint: "Pemeriksaan awal kehamilan",
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

  const filteredVisits =
    filterStatus === "SEMUA"
      ? visits
      : visits.filter((v) => v.status === filterStatus);

  const handleUpdateStatus = (visitId: string, newStatus: string) => {
    setVisits(
      visits.map((v) => (v.id === visitId ? { ...v, status: newStatus } : v))
    );
    setMessage("Status kunjungan berhasil diperbarui");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Kunjungan</h1>
            <p className="text-gray-600 mt-2">Kelola kunjungan pasien</p>
          </div>
        </div>

        {message && (
          <Alert
            type="success"
            message={message}
            onClose={() => setMessage("")}
          />
        )}

        {/* Filter */}
        <Card className="mb-6">
          <div className="flex gap-4">
            <Select
              label="Filter Status"
              options={[
                { value: "SEMUA", label: "Semua Status" },
                { value: "MENUNGGU", label: "Menunggu" },
                { value: "DITERIMA", label: "Diterima" },
                { value: "SELESAI", label: "Selesai" },
                { value: "DIBATALKAN", label: "Dibatalkan" },
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
          </div>
        </Card>

        {/* Table */}
        <Card loading={loading}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-4">No. Kunjungan</th>
                  <th className="text-left p-4">Nama Pasien</th>
                  <th className="text-left p-4">Bidan</th>
                  <th className="text-left p-4">Tanggal</th>
                  <th className="text-left p-4">Jenis Layanan</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-center p-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{visit.visitNumber}</td>
                    <td className="p-4">{visit.patientName}</td>
                    <td className="p-4">{visit.bidanName}</td>
                    <td className="p-4">{visit.visitDate}</td>
                    <td className="p-4">{visit.serviceType}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(visit.status)}`}>
                        {getStatusLabel(visit.status)}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye size={16} />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVisits.length === 0 && (
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
