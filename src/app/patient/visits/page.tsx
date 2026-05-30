"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Plus } from "lucide-react";

export default function PatientVisitsPage() {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [visits, setVisits] = useState([
    {
      id: "1",
      visitNumber: "V20240610001",
      visitDate: "2024-06-10",
      serviceType: "Pemeriksaan Rutin",
      status: "SELESAI",
    },
  ]);

  const [formData, setFormData] = useState({
    visitDate: "",
    serviceType: "Pemeriksaan Rutin",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setMessage("Kunjungan berhasil didaftarkan");
    setFormData({
      visitDate: "",
      serviceType: "Pemeriksaan Rutin",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pendaftaran Kunjungan</h1>
            <p className="text-gray-600 mt-2">Daftar kunjungan ke klinik</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Daftar Kunjungan
          </Button>
        </div>

        {message && (
          <Alert
            type="success"
            message={message}
            onClose={() => setMessage("")}
          />
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Pendaftaran Kunjungan Baru</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-2xl font-bold text-gray-400"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Tanggal Kunjungan"
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) =>
                    setFormData({ ...formData, visitDate: e.target.value })
                  }
                  required
                />

                <Select
                  label="Jenis Layanan"
                  options={[
                    { value: "Pemeriksaan Rutin", label: "Pemeriksaan Rutin" },
                    { value: "Pemeriksaan Lanjutan", label: "Pemeriksaan Lanjutan" },
                    { value: "Konsultasi", label: "Konsultasi" },
                    { value: "Tindakan", label: "Tindakan" },
                  ]}
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceType: e.target.value })
                  }
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    Daftar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Visits List */}
        <Card title="Riwayat Kunjungan">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-4">No. Kunjungan</th>
                  <th className="text-left p-4">Tanggal</th>
                  <th className="text-left p-4">Jenis Layanan</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit: any) => (
                  <tr key={visit.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{visit.visitNumber}</td>
                    <td className="p-4">{visit.visitDate}</td>
                    <td className="p-4">{visit.serviceType}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {visit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
