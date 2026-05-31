"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Plus, Edit2, Trash2, Search, UserCheck, Phone, Mail, Award, CheckCircle } from "lucide-react";
import { createMidwife, updateMidwife, deleteMidwife } from "@/actions/visit";

export default function MidwifeManagementPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [midwives, setMidwives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sipb: "",
    phoneNumber: "",
    status: "AKTIF",
  });

  const fetchMidwives = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/midwives");
      if (!response.ok) throw new Error("Failed to fetch midwives");
      const data = await response.json();
      
      const formattedMidwives = data.map((midwife: any) => ({
        id: midwife.id,
        name: midwife.user.name,
        email: midwife.user.email,
        sipb: midwife.sipb,
        phoneNumber: midwife.phoneNumber,
        status: midwife.status,
      }));
      
      setMidwives(formattedMidwives);
    } catch (error) {
      console.error("Error fetching midwives:", error);
      setMessage("Gagal mengambil data bidan dari server");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        // Update midwife
        const result = await updateMidwife(editingId, {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        });

        if (result.success) {
          setMessage("Data bidan berhasil diperbarui");
          setMessageType("success");
          fetchMidwives();
          setShowForm(false);
        } else {
          setMessage(result.message || "Gagal memperbarui bidan");
          setMessageType("error");
        }
      } else {
        // Create midwife
        const result = await createMidwife({
          name: formData.name,
          email: formData.email,
          sipb: formData.sipb,
          phoneNumber: formData.phoneNumber,
        });

        if (result.success) {
          setMessage("Bidan baru berhasil ditambahkan");
          setMessageType("success");
          fetchMidwives();
          setShowForm(false);
        } else {
          setMessage(result.message || "Gagal menambahkan bidan");
          setMessageType("error");
        }
      }
    } catch (error) {
      console.error("Error submitting midwife:", error);
      setMessage("Terjadi kesalahan sistem saat menyimpan data");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMidwife = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus bidan ini dari sistem?")) {
      setLoading(true);
      setMessage("");
      try {
        const result = await deleteMidwife(id);
        if (result.success) {
          setMessage("Bidan berhasil dihapus dari sistem");
          setMessageType("success");
          fetchMidwives();
        } else {
          setMessage(result.message || "Gagal menghapus bidan");
          setMessageType("error");
        }
      } catch (error) {
        console.error("Error deleting midwife:", error);
        setMessage("Terjadi kesalahan sistem saat menghapus");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-blue-50/30">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-pink-500 to-blue-500 rounded-3xl p-8 md:p-12 shadow-2xl shadow-pink-100/50 mb-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-white">
              <span className="bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                Portal Administrator
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
                Manajemen Data Bidan
              </h1>
              <p className="text-white/80 mt-2 text-sm md:text-base font-light">
                Kelola kredensial, kontak, dan status aktif bidan profesional di klinik Anda.
              </p>
            </div>
            
            <button
              onClick={handleAddMidwife}
              className="bg-white hover:bg-pink-50 font-bold px-6 py-4.5 rounded-2xl shadow-lg border-0 transition-transform active:scale-95 flex items-center gap-2 max-w-max self-start md:self-auto"
            >
              <Plus size={20} className="stroke-[3] text-pink-600" />
              <span className="text-pink-600 font-bold">Tambah Bidan Baru</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <Alert
              type={messageType}
              message={message}
              onClose={() => setMessage("")}
            />
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-gray-100/40 border border-gray-100 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari bidan berdasarkan nama, nomor SIPB, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full border border-gray-100 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-pink-100 rounded-xl text-pink-600">
                    <UserCheck size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-800">
                    {editingId ? "Edit Profil Bidan" : "Daftar Bidan Baru"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Nama Lengkap & Gelar"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Bd. Siti Aminah, S.Tr.Keb"
                  required
                />
                
                <Input
                  label="Alamat Email Resmi"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="siti@klinikbersalin.com"
                  required
                  disabled={!!editingId}
                />
                
                <Input
                  label="Nomor SIPB (Surat Izin Praktik Bidan)"
                  value={formData.sipb}
                  onChange={(e) =>
                    setFormData({ ...formData, sipb: e.target.value })
                  }
                  placeholder="Contoh: SIPB.12345/2026"
                  required
                  disabled={!!editingId}
                />
                
                <Input
                  label="Nomor Telepon Seluler"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="Contoh: 081234567890"
                  required
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 font-bold py-3.5 rounded-xl shadow-lg shadow-pink-100"
                  >
                    Simpan
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

        {/* Table/List View */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Memuat data bidan...</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/55 border-b border-gray-100 text-gray-700 font-semibold">
                    <th className="text-left p-5 pl-8">Informasi Bidan</th>
                    <th className="text-left p-5">Kredensial SIPB</th>
                    <th className="text-left p-5">Hubungi</th>
                    <th className="text-left p-5">Status Layanan</th>
                    <th className="text-center p-5 pr-8">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMidwives.map((midwife) => (
                    <tr key={midwife.id} className="hover:bg-pink-50/10 transition-colors">
                      {/* Name & Email Info */}
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-200 flex items-center justify-center text-white font-bold shadow-md shadow-pink-100">
                            {midwife.name.split(" ").pop()?.charAt(0) || midwife.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 text-base">{midwife.name}</div>
                            <div className="text-gray-400 flex items-center gap-1.5 mt-0.5">
                              <Mail size={13} />
                              {midwife.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* SIPB Credentials */}
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <Award size={16} className="text-blue-500" />
                          <span>{midwife.sipb}</span>
                        </div>
                      </td>
                      
                      {/* Phone Number */}
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-pink-400" />
                          <span>{midwife.phoneNumber}</span>
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-bold uppercase tracking-wider">
                          <CheckCircle size={12} className="stroke-[3]" />
                          {midwife.status}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="p-5 pr-8">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingId(midwife.id);
                              setFormData(midwife);
                              setShowForm(true);
                            }}
                            title="Edit Profil Bidan"
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteMidwife(midwife.id)}
                            title="Hapus Bidan dari Klinik"
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
            {!loading && filteredMidwives.length === 0 && (
              <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center gap-2">
                <Search size={40} className="stroke-[1.5] text-gray-300" />
                <div className="font-semibold text-lg text-gray-600">Data Bidan Tidak Ditemukan</div>
                <div className="text-sm max-w-xs">Silakan periksa kembali kata kunci pencarian Anda atau tambahkan bidan baru.</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
