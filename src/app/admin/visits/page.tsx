"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Select } from "@/components/ui/Select";
import { Eye, Calendar, User, Clipboard, Stethoscope, ChevronRight, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { getStatusLabel, getStatusColor } from "@/lib/utils";

export default function VisitManagementPage() {
  const { data: session } = useSession();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("SEMUA");
  const [message, setMessage] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/visits");
      if (!response.ok) throw new Error("Failed to fetch visits");
      const data = await response.json();
      
      const formattedVisits = data.map((v: any) => ({
        id: v.id,
        visitNumber: v.visitNumber,
        patientName: v.patient?.user?.name || "Pasien Umum",
        patientRecordNo: v.patient?.medicalRecordNo || "-",
        patientNik: v.patient?.nik || "-",
        patientDob: v.patient?.dateOfBirth ? new Date(v.patient.dateOfBirth).toLocaleDateString("id-ID") : "-",
        patientPhone: v.patient?.phoneNumber || "-",
        patientAddress: v.patient?.address || "-",
        bidanName: v.bidan?.user?.name || "Belum Ditentukan",
        visitDate: new Date(v.visitDate).toLocaleDateString("id-ID"),
        serviceType: v.serviceType,
        status: v.status,
        complaint: v.complaint || "Tidak ada keluhan",
        diagnosis: v.diagnosis || "Belum ada diagnosa",
        notes: v.notes || "Tidak ada catatan",
        examinations: v.examinations || [],
      }));
      setVisits(formattedVisits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      setMessage("Gagal mengambil data kunjungan dari database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const filteredVisits =
    filterStatus === "SEMUA"
      ? visits
      : visits.filter((v) => v.status === filterStatus);

  const handleUpdateStatus = async (visitId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/visits/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      
      setMessage("Status kunjungan berhasil diperbarui");
      fetchVisits();
      if (selectedVisit && selectedVisit.id === visitId) {
        setSelectedVisit({ ...selectedVisit, status: newStatus });
      }
    } catch (error) {
      console.error(error);
      setMessage("Gagal memperbarui status kunjungan di server");
    }
  };

  const handleOpenDetail = (visit: any) => {
    setSelectedVisit(visit);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/20 via-white to-blue-50/20">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Title */}
        <div className="relative bg-gradient-to-r from-blue-500 to-pink-500 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-100/50 mb-10 overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
          
          <div className="relative">
            <span className="bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Sistem Pelacakan Pasien
            </span>
            <h1 className="text-3xl md:text-5xl font-black mt-3">Manajemen Kunjungan</h1>
            <p className="text-white/80 mt-2 text-sm md:text-base font-light">
              Pantau antrian, diagnosa, dan riwayat pemeriksaan medis kunjungan secara real-time.
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-6 animate-in fade-in duration-300">
            <Alert
              type="success"
              message={message}
              onClose={() => setMessage("")}
            />
          </div>
        )}

        {/* Filter Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-xl shadow-gray-100/40 border border-gray-100 mb-8 max-w-sm">
          <Select
            label="Filter Status Kunjungan"
            options={[
              { value: "SEMUA", label: "Semua Kunjungan" },
              { value: "MENUNGGU", label: "Menunggu Pemeriksaan" },
              { value: "DITERIMA", label: "Sedang Diperiksa" },
              { value: "SELESAI", label: "Selesai Pemeriksaan" },
              { value: "DIBATALKAN", label: "Dibatalkan" },
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>

        {/* Visits Table */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Memuat data kunjungan...</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/55 border-b border-gray-100 text-gray-700 font-semibold">
                    <th className="text-left p-5 pl-8">No. Kunjungan</th>
                    <th className="text-left p-5">Informasi Pasien</th>
                    <th className="text-left p-5">Bidan Pemeriksa</th>
                    <th className="text-left p-5">Tanggal</th>
                    <th className="text-left p-5">Jenis Layanan</th>
                    <th className="text-left p-5">Status</th>
                    <th className="text-center p-5 pr-8">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVisits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-blue-50/10 transition-colors">
                      <td className="p-5 pl-8 font-bold text-gray-800">{visit.visitNumber}</td>
                      <td className="p-5">
                        <div>
                          <div className="font-semibold text-gray-800">{visit.patientName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">RM: {visit.patientRecordNo}</div>
                        </div>
                      </td>
                      <td className="p-5 text-gray-600 font-medium">{visit.bidanName}</td>
                      <td className="p-5 text-gray-600">{visit.visitDate}</td>
                      <td className="p-5">
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-bold">
                          {visit.serviceType}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${getStatusColor(visit.status)}`}>
                          {getStatusLabel(visit.status)}
                        </span>
                      </td>
                      <td className="p-5 pr-8 text-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenDetail(visit)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border-0 font-bold px-4 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 mx-auto"
                        >
                          <Eye size={14} className="stroke-[2.5]" />
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filteredVisits.length === 0 && (
              <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center gap-2">
                <Calendar size={40} className="stroke-[1.5] text-gray-300" />
                <div className="font-semibold text-lg text-gray-600">Tidak Ada Kunjungan</div>
                <div className="text-sm max-w-xs">Belum ada aktivitas kunjungan pasien dengan status ini di sistem.</div>
              </div>
            )}
          </div>
        </div>

        {/* Visit Detail Modal (Poin 2 Fix) */}
        {showDetail && selectedVisit && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-100 transform transition-all scale-100 animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-pink-500 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">Detail Medis Kunjungan</h2>
                    <p className="text-xs text-white/70 mt-0.5">No: {selectedVisit.visitNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors text-xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
                
                {/* Status & Service Section */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold">Jenis Layanan</span>
                    <span className="text-base font-bold text-blue-700">{selectedVisit.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold mb-1">Status Kunjungan</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${getStatusColor(selectedVisit.status)}`}>
                      {getStatusLabel(selectedVisit.status)}
                    </span>
                  </div>
                </div>

                {/* Patient Information */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <User size={16} className="text-pink-500" strokeWidth={2.5} />
                    Informasi Biodata Pasien
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 bg-pink-50/10 p-5 rounded-2xl border border-pink-100/30">
                    <div>
                      <div className="text-xs text-gray-400">Nama Lengkap</div>
                      <div className="font-bold text-gray-800 text-base">{selectedVisit.patientName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">No. Rekam Medis (RM)</div>
                      <div className="font-mono font-bold text-blue-600">{selectedVisit.patientRecordNo}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">NIK (Nomor Induk Kependudukan)</div>
                      <div className="font-medium text-gray-700">{selectedVisit.patientNik}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Tanggal Lahir</div>
                      <div className="font-medium text-gray-700">{selectedVisit.patientDob}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-400">Alamat Tempat Tinggal</div>
                      <div className="font-medium text-gray-700 mt-0.5">{selectedVisit.patientAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Medical Records (Complaint & Diagnosis) */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <Stethoscope size={16} className="text-blue-500" strokeWidth={2.5} />
                    Pemeriksaan & Catatan Medis
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50/30 border border-yellow-100 rounded-xl">
                      <div className="text-xs font-bold text-yellow-800 flex items-center gap-1.5 mb-1">
                        <AlertCircle size={14} />
                        Keluhan Utama
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed italic">
                        "{selectedVisit.complaint}"
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50/10 border border-blue-100/50 rounded-xl">
                      <div className="text-xs font-bold text-blue-800 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 size={14} />
                        Diagnosa Bidan
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed font-semibold">
                        {selectedVisit.diagnosis}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200/50 rounded-xl">
                      <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mb-1">
                        <Clipboard size={14} />
                        Catatan Tindakan & Resep Obat
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {selectedVisit.notes}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Examiner / Midwife Name */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl border border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    B
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">Bidan Penanggung Jawab</span>
                    <span className="font-bold text-gray-800">{selectedVisit.bidanName}</span>
                  </div>
                </div>

              </div>

              {/* Modal Footer (Admin Quick Actions) */}
              <div className="bg-gray-50 px-6 py-5 border-t border-gray-100 flex flex-wrap gap-3 justify-end items-center">
                {selectedVisit.status === "MENUNGGU" && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateStatus(selectedVisit.id, "DITERIMA")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
                    >
                      Terima Pasien
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedVisit.id, "DIBATALKAN")}
                      className="border-red-200 text-red-600 hover:bg-red-50 font-bold py-2 px-4 rounded-xl"
                    >
                      Batalkan
                    </Button>
                  </>
                )}
                {selectedVisit.status === "DITERIMA" && (
                  <Button
                    variant="primary"
                    onClick={() => handleUpdateStatus(selectedVisit.id, "SELESAI")}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl"
                  >
                    Selesaikan Pemeriksaan
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowDetail(false)}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 font-bold py-2 px-4 rounded-xl"
                >
                  Tutup
                </Button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

