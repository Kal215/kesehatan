"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Plus, Edit2, Trash2, Search, UserCheck, Heart, MapPin, Phone, Calendar, Mail, FileSpreadsheet } from "lucide-react";
import { createPatient, updatePatient, deletePatient } from "@/actions/patient";
import { generateMedicalRecordNo } from "@/lib/utils";

export default function PatientManagementPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nik: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    bloodType: "",
    pregnancyHistory: "",
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      
      const formattedPatients = data.map((patient: any) => ({
        id: patient.id,
        name: patient.user.name,
        email: patient.user.email,
        nik: patient.nik,
        medicalRecordNo: patient.medicalRecordNo,
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split("T")[0] : "",
        address: patient.address,
        phoneNumber: patient.phoneNumber,
        bloodType: patient.bloodType || "",
        pregnancyHistory: patient.pregnancyHistory || "",
        userId: patient.userId,
      }));
      
      setPatients(formattedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setMessage("Gagal mengambil data pasien");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    setFormData({
      name: patient.name,
      email: patient.email,
      nik: patient.nik,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
      phoneNumber: patient.phoneNumber,
      bloodType: patient.bloodType,
      pregnancyHistory: patient.pregnancyHistory,
    });
    setShowForm(true);
  };

  const handleDeletePatient = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pasien ini dari sistem?")) {
      setLoading(true);
      setMessage("");
      try {
        const result = await deletePatient(id);
        if (result.success) {
          setMessage("Data pasien berhasil dihapus");
          setMessageType("success");
          fetchPatients();
        } else {
          setMessage(result.message || "Gagal menghapus data pasien");
          setMessageType("error");
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        setMessage("Terjadi kesalahan sistem saat menghapus");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      if (editingId) {
        // Update Patient
        const result = await updatePatient(editingId, {
          name: formData.name,
          nik: formData.nik,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          bloodType: formData.bloodType || null,
          pregnancyHistory: formData.pregnancyHistory || null,
        });

        if (result.success) {
          setMessage("Data pasien berhasil diperbarui");
          setMessageType("success");
          fetchPatients();
          setShowForm(false);
        } else {
          setMessage(result.message || "Gagal memperbarui data pasien");
          setMessageType("error");
        }
      } else {
        // Create Patient (Poin 5 Fix: RM is generated cleanly with RM-YYYYMMDD-XXXX format in Action)
        const result = await createPatient({
          name: formData.name,
          email: formData.email,
          nik: formData.nik,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          bloodType: formData.bloodType || null,
          pregnancyHistory: formData.pregnancyHistory || null,
        });

        if (result.success) {
          setMessage("Pasien baru berhasil didaftarkan");
          setMessageType("success");
          fetchPatients();
          setShowForm(false);
        } else {
          setMessage(result.message || "Gagal mendaftarkan pasien");
          setMessageType("error");
        }
      }
    } catch (error) {
      console.error("Error submitting patient:", error);
      setMessage("Terjadi kesalahan sistem saat menyimpan data");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-blue-50/30">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Hero Section */}
        <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-blue-500 rounded-3xl p-8 md:p-12 shadow-2xl shadow-pink-100/50 mb-10 overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                Manajemen Registrasi Medis
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
                Portal Data Pasien
              </h1>
              <p className="text-white/80 mt-2 text-sm md:text-base font-light max-w-xl">
                Kelola rekam medis, biodata ibu hamil, riwayat kehamilan, dan dokumen pendaftaran pasien klinik bersalin secara rapi.
              </p>
            </div>
            
            <button
              onClick={handleAddPatient}
              className="bg-white hover:bg-pink-50 font-bold px-6 py-4 rounded-2xl shadow-lg border-0 transition-transform active:scale-95 flex items-center gap-2 self-start md:self-auto"
            >
              <Plus size={20} className="stroke-[3] text-pink-600" />
              <span className="text-pink-600 font-bold">Daftarkan Pasien Baru</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 animate-in fade-in duration-300">
            <Alert
              type={messageType}
              message={message}
              onClose={() => setMessage("")}
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-gray-100/40 border border-gray-100 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari pasien berdasarkan nama lengkap, NIK, atau nomor rekam medis (RM)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full border border-gray-100 transform transition-all scale-100 animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-pink-100 rounded-xl text-pink-600">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-800">
                      {editingId ? "Ubah Profil Pasien" : "Pendaftaran Pasien Ibu Hamil"}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Lengkapi formulir registrasi rekam medis pasien di bawah ini.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto flex-1 pr-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Nama Lengkap Ibu Hamil"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Masukkan nama lengkap pasien"
                    required
                  />
                  <Input
                    label="Alamat Email Akun"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="nama@email.com"
                    required
                    disabled={!!editingId}
                  />
                  <Input
                    label="Nomor Induk Kependudukan (NIK)"
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value })
                    }
                    maxLength={16}
                    placeholder="16 Digit NIK KTP"
                    required
                  />
                  <Input
                    label="Tanggal Lahir Pasien"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Nomor HP / WhatsApp Aktif"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="Contoh: 0812XXXXXXXX"
                    required
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Golongan Darah</label>
                    <select
                      value={formData.bloodType}
                      onChange={(e) =>
                        setFormData({ ...formData, bloodType: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-gray-700 text-sm"
                    >
                      <option value="">Pilih Golongan Darah</option>
                      <option value="A_POSITIF">A+</option>
                      <option value="A_NEGATIF">A-</option>
                      <option value="B_POSITIF">B+</option>
                      <option value="B_NEGATIF">B-</option>
                      <option value="O_POSITIF">O+</option>
                      <option value="O_NEGATIF">O-</option>
                      <option value="AB_POSITIF">AB+</option>
                      <option value="AB_NEGATIF">AB-</option>
                    </select>
                  </div>
                </div>
                
                <Input
                  label="Alamat Tempat Tinggal Sekarang"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan"
                  required
                />
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Riwayat Kehamilan Sebelumnya (Paritas)</label>
                  <textarea
                    value={formData.pregnancyHistory}
                    onChange={(e) =>
                      setFormData({ ...formData, pregnancyHistory: e.target.value })
                    }
                    placeholder="Contoh: G2P1A0 (Kehamilan ke-2, melahirkan 1 kali, keguguran 0 kali)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-gray-700 text-sm h-20"
                  />
                </div>

                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 font-bold py-3.5 rounded-xl shadow-lg"
                  >
                    Simpan Data Pasien
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-200 text-gray-500 hover:bg-gray-50 font-bold py-3.5 rounded-xl"
                    onClick={() => setShowForm(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Patients Table */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Memuat data pasien...</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/55 border-b border-gray-100 text-gray-700 font-semibold">
                    <th className="text-left p-5 pl-8">Pasien & No Rekam Medis</th>
                    <th className="text-left p-5">Nomor NIK</th>
                    <th className="text-left p-5">Tanggal Lahir</th>
                    <th className="text-left p-5">Kontak WhatsApp</th>
                    <th className="text-left p-5">Golongan Darah</th>
                    <th className="text-left p-5">Alamat Domisili</th>
                    <th className="text-center p-5 pr-8">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-pink-50/10 transition-colors">
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-200 flex items-center justify-center text-white font-bold shadow-md shadow-blue-100">
                            {patient.name.split(" ").pop()?.charAt(0) || patient.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 text-base">{patient.name}</div>
                            <div className="text-blue-600 font-mono font-bold text-xs flex items-center gap-1 mt-0.5">
                              <FileSpreadsheet size={13} />
                              {patient.medicalRecordNo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-gray-700 font-medium">{patient.nik}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{patient.dateOfBirth}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-pink-400" />
                          <span>{patient.phoneNumber}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        {patient.bloodType ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
                            <Heart size={10} className="fill-current" />
                            {patient.bloodType.replace("_POSITIF", "+").replace("_NEGATIF", "-")}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-5 max-w-xs truncate text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-400 shrink-0" />
                          <span className="truncate">{patient.address}</span>
                        </div>
                      </td>
                      <td className="p-5 pr-8">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleEditPatient(patient)}
                            title="Edit Data Pasien"
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            title="Hapus Data Pasien"
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filteredPatients.length === 0 && (
              <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center gap-2">
                <Search size={40} className="stroke-[1.5] text-gray-300" />
                <div className="font-semibold text-lg text-gray-600">Data Pasien Tidak Ditemukan</div>
                <div className="text-sm max-w-xs">Silakan periksa kembali kata kunci pencarian Anda atau daftarkan pasien baru.</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
