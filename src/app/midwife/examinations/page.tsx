"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Select } from "@/components/ui/Select";
import { Plus } from "lucide-react";

export default function ExaminationPage() {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [examinations, setExaminations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    patientName: "",
    maternalWeight: "",
    bloodPressure: "",
    fundusHeight: "",
    pregnancyAge: "",
    fetalWeight: "",
    complaint: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setMessage("Pemeriksaan kehamilan berhasil dicatat");
    setFormData({
      patientName: "",
      maternalWeight: "",
      bloodPressure: "",
      fundusHeight: "",
      pregnancyAge: "",
      fetalWeight: "",
      complaint: "",
      notes: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pemeriksaan Kehamilan</h1>
            <p className="text-gray-600 mt-2">Catat dan kelola pemeriksaan kehamilan</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Pemeriksaan Baru
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
            <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Pemeriksaan Kehamilan Baru</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-2xl font-bold text-gray-400"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama Pasien"
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Berat Badan Ibu (kg)"
                    type="number"
                    step="0.1"
                    value={formData.maternalWeight}
                    onChange={(e) =>
                      setFormData({ ...formData, maternalWeight: e.target.value })
                    }
                    required
                  />

                  <Input
                    label="Tekanan Darah (mmHg)"
                    value={formData.bloodPressure}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodPressure: e.target.value })
                    }
                    placeholder="120/80"
                    required
                  />

                  <Input
                    label="Tinggi Fundus (cm)"
                    type="number"
                    step="0.1"
                    value={formData.fundusHeight}
                    onChange={(e) =>
                      setFormData({ ...formData, fundusHeight: e.target.value })
                    }
                  />

                  <Input
                    label="Usia Kehamilan (minggu)"
                    type="number"
                    value={formData.pregnancyAge}
                    onChange={(e) =>
                      setFormData({ ...formData, pregnancyAge: e.target.value })
                    }
                  />

                  <Input
                    label="Berat Janin (gram)"
                    type="number"
                    value={formData.fetalWeight}
                    onChange={(e) =>
                      setFormData({ ...formData, fetalWeight: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="Keluhan"
                  value={formData.complaint}
                  onChange={(e) =>
                    setFormData({ ...formData, complaint: e.target.value })
                  }
                />

                <TextArea
                  label="Catatan Bidan"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    Simpan Pemeriksaan
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

        {/* Examinations List */}
        <Card title="Riwayat Pemeriksaan">
          {examinations.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              Belum ada pemeriksaan tercatat
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-4">Tanggal</th>
                    <th className="text-left p-4">Pasien</th>
                    <th className="text-left p-4">Berat Ibu</th>
                    <th className="text-left p-4">Tekanan Darah</th>
                    <th className="text-left p-4">Usia Kehamilan</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state */}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
