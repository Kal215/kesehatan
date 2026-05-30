"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

export default function PatientManagementPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nik: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    bloodType: "",
    pregnancyHistory: "",
  });

  useEffect(() => {
    // Fetch patients data
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patients");
        if (!response.ok) throw new Error("Failed to fetch patients");
        const data = await response.json();
        
        // Map API response to table format
        const formattedPatients = data.map((patient: any) => ({
          id: patient.id,
          name: patient.user.name,
          email: patient.user.email,
          nik: patient.nik,
          medicalRecordNo: patient.medicalRecordNo,
          dateOfBirth: patient.dateOfBirth,
          address: patient.address,
          phoneNumber: patient.phoneNumber,
          bloodType: patient.bloodType,
          pregnancyHistory: patient.pregnancyHistory,
          userId: patient.userId,
        }));
        
        setPatients(formattedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setMessage("Gagal mengambil data pasien");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nik.includes(searchTerm) ||
      patient.medicalRecordNo.includes(searchTerm)
  );

  const handleAddPatient = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      nik: "",
      dateOfBirth: "",
      address: "",
      phoneNumber: "",
      bloodType: "",
      pregnancyHistory: "",
    });
    setShowForm(true);
  };

  const handleEditPatient = (patient: any) => {
    setEditingId(patient.id);
    setFormData(patient);
    setShowForm(true);
  };

  const handleDeletePatient = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pasien ini?")) {
      setPatients(patients.filter((p) => p.id !== id));
      setMessage("Pasien berhasil dihapus");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // First, create the user account
      const userResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: "PASIEN",
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        setMessage(errorData.error || "Gagal membuat akun pengguna");
        return;
      }

      const userData = await userResponse.json();

      // Then, create the patient record
      const patientResponse = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          nik: formData.nik,
          medicalRecordNo: `RM${new Date().getFullYear()}${String(patients.length + 1).padStart(5, "0")}`,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          bloodType: formData.bloodType || null,
          pregnancyHistory: formData.pregnancyHistory || null,
        }),
      });

      if (!patientResponse.ok) {
        throw new Error("Gagal membuat data pasien");
      }

      // Refresh patient list
      const patientsResponse = await fetch("/api/patients");
      if (patientsResponse.ok) {
        const data = await patientsResponse.json();
        const formattedPatients = data.map((patient: any) => ({
          id: patient.id,
          name: patient.user.name,
          email: patient.user.email,
          nik: patient.nik,
          medicalRecordNo: patient.medicalRecordNo,
          dateOfBirth: patient.dateOfBirth,
          address: patient.address,
          phoneNumber: patient.phoneNumber,
          bloodType: patient.bloodType,
          pregnancyHistory: patient.pregnancyHistory,
          userId: patient.userId,
        }));
        setPatients(formattedPatients);
      }

      setShowForm(false);
      setMessage("Pasien berhasil ditambahkan");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Terjadi kesalahan saat menambahkan pasien");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Data Pasien</h1>
            <p className="text-gray-600 mt-2">Kelola data pasien klinik</p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddPatient}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Tambah Pasien
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
                placeholder="Cari berdasarkan nama, NIK, atau nomor rekam medis..."
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
            <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Pasien" : "Tambah Pasien"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-2xl font-bold text-gray-400"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
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
                  {!editingId && (
                    <Input
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  )}
                  <Input
                    label="NIK"
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value })
                    }
                    maxLength={16}
                    required
                  />
                  <Input
                    label="Tanggal Lahir"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
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
                </div>
                <Input
                  label="Alamat"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
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
                  <th className="text-left p-4">No. Rekam Medis</th>
                  <th className="text-left p-4">Nama</th>
                  <th className="text-left p-4">NIK</th>
                  <th className="text-left p-4">Nomor HP</th>
                  <th className="text-left p-4">Alamat</th>
                  <th className="text-center p-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{patient.medicalRecordNo}</td>
                    <td className="p-4">{patient.name}</td>
                    <td className="p-4">{patient.nik}</td>
                    <td className="p-4">{patient.phoneNumber}</td>
                    <td className="p-4">{patient.address}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length === 0 && (
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
