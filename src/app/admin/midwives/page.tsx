"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

export default function MidwifeManagementPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [midwives, setMidwives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sipb: "",
    phoneNumber: "",
    status: "AKTIF",
  });

  useEffect(() => {
    const fetchMidwives = async () => {
      try {
        // Mock data
        setMidwives([
          {
            id: "1",
            name: "Ibu Siti",
            email: "siti@klinik.com",
            sipb: "123456",
            phoneNumber: "081234567890",
            status: "AKTIF",
          },
        ]);
      } catch (error) {
        console.error("Error fetching midwives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMidwives();
  }, []);

  const filteredMidwives = midwives.filter(
    (midwife) =>
      midwife.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      midwife.sipb.includes(searchTerm) ||
      midwife.email.includes(searchTerm)
  );

  const handleAddMidwife = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      sipb: "",
      phoneNumber: "",
      status: "AKTIF",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setMessage(editingId ? "Bidan berhasil diperbarui" : "Bidan berhasil ditambahkan");
  };

  const handleDeleteMidwife = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus bidan ini?")) {
      setMidwives(midwives.filter((m) => m.id !== id));
      setMessage("Bidan berhasil dihapus");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Data Bidan</h1>
            <p className="text-gray-600 mt-2">Kelola data bidan klinik</p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddMidwife}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Tambah Bidan
          </Button>
        </div>

        {message && (
          <Alert
            type="success"
            message={message}
            onClose={() => setMessage("")}
          />
        )}

        {/* Search Bar */}
        <Card className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama, SIPB, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Bidan" : "Tambah Bidan"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-2xl font-bold text-gray-400"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <Input
                  label="SIPB"
                  value={formData.sipb}
                  onChange={(e) =>
                    setFormData({ ...formData, sipb: e.target.value })
                  }
                  required
                />
                <Input
                  label="Nomor HP"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                />
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    Simpan
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

        {/* Table */}
        <Card loading={loading}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-4">Nama</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">SIPB</th>
                  <th className="text-left p-4">Nomor HP</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-center p-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMidwives.map((midwife) => (
                  <tr key={midwife.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{midwife.name}</td>
                    <td className="p-4">{midwife.email}</td>
                    <td className="p-4">{midwife.sipb}</td>
                    <td className="p-4">{midwife.phoneNumber}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {midwife.status}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(midwife.id);
                          setFormData(midwife);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteMidwife(midwife.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMidwives.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                Tidak ada data bidan
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
