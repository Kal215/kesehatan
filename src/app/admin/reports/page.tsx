"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Download, FileText, Calendar, TrendingUp, Users, HeartPulse, ShieldAlert, CheckCircle2, FileSpreadsheet, UserCheck } from "lucide-react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

export default function ReportsPage() {
  const { data: session } = useSession();
  const [month, setMonth] = useState(() => String(new Date().getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalPatients: 0,
    totalExaminations: 0,
    newPatients: 0,
    visitsByStatus: {
      MENUNGGU: 0,
      DITERIMA: 0,
      SELESAI: 0,
      DIBATALKAN: 0,
    } as Record<string, number>,
  });

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports/statistics?month=${month}&year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch report statistics");
      const data = await response.json();
      
      setStats({
        totalVisits: data.totalVisits || 0,
        totalPatients: data.totalPatients || 0,
        totalExaminations: data.totalExaminations || 0,
        newPatients: data.newPatients || 0,
        visitsByStatus: {
          MENUNGGU: data.visitsByStatus?.MENUNGGU || 0,
          DITERIMA: data.visitsByStatus?.DITERIMA || 0,
          SELESAI: data.visitsByStatus?.SELESAI || 0,
          DIBATALKAN: data.visitsByStatus?.DIBATALKAN || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [month, year]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header styling
    doc.setFillColor(236, 72, 153); // Pink theme color
    doc.rect(0, 0, 210, 45, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("LAPORAN KLINIK BERSALIN", 14, 20);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Sistem Informasi Operasional & Kesehatan Digital - Oleh: Fianny Ascory`, 14, 28);
    doc.text(`Periode Laporan: ${getMonthLabel(month)} ${year}`, 14, 35);
    
    // Document metadata
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleString("id-ID")}`, 14, 52);
    doc.text(`Kategori Ekspor: Laporan Eksekutif Bulanan`, 14, 57);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 62, 196, 62);
    
    // Summary Cards style
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 68, 86, 32, 3, 3, "F");
    doc.roundedRect(110, 68, 86, 32, 3, 3, "F");
    
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("RINGKASAN AKTIVITAS", 20, 75);
    doc.text("STATISTIK PASIEN", 116, 75);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Total Kunjungan: ${stats.totalVisits} pasien`, 20, 83);
    doc.text(`Total Pemeriksaan Kehamilan: ${stats.totalExaminations} kali`, 20, 90);
    doc.text(`Total Pasien Terdaftar: ${stats.totalPatients} orang`, 116, 83);
    doc.text(`Pasien Baru Terdaftar: ${stats.newPatients} orang`, 116, 90);
    
    // Detailed Table for visits by status
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(236, 72, 153);
    doc.text("Distribusi Kunjungan Berdasarkan Status", 14, 115);
    
    // Table borders & rows
    doc.setDrawColor(241, 245, 249);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 122, 182, 10, "F");
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text("Kategori Status Pemeriksaan", 18, 128);
    doc.text("Jumlah Kunjungan", 100, 128);
    doc.text("Persentase Distribusi", 150, 128);
    
    const statuses = [
      { name: "Menunggu Antrian", value: stats.visitsByStatus.MENUNGGU },
      { name: "Sedang Diperiksa Bidan", value: stats.visitsByStatus.DITERIMA },
      { name: "Selesai Pemeriksaan", value: stats.visitsByStatus.SELESAI },
      { name: "Pendaftaran Dibatalkan", value: stats.visitsByStatus.DIBATALKAN },
    ];
    
    let y = 138;
    statuses.forEach((item) => {
      const percentage = stats.totalVisits > 0 
        ? ((item.value / stats.totalVisits) * 100).toFixed(1) + "%"
        : "0.0%";
        
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(item.name, 18, y + 2);
      doc.text(String(item.value), 100, y + 2);
      doc.text(percentage, 150, y + 2);
      
      doc.line(14, y + 6, 196, y + 6);
      y += 10;
    });
    
    // Footer / Sign
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text("Dokumen ini dihasilkan secara otomatis oleh Sistem Informasi Kesehatan Klinik Bersalin.", 14, 280);
    
    doc.save(`Laporan_Klinik_${month}_${year}.pdf`);
  };

  const handleExportExcel = () => {
    const data = [
      { Parameter: "Laporan Klinik Bersalin", Nilai: `${getMonthLabel(month)} ${year}` },
      { Parameter: "Total Kunjungan", Nilai: stats.totalVisits },
      { Parameter: "Total Seluruh Pasien", Nilai: stats.totalPatients },
      { Parameter: "Pasien Baru Terdaftar", Nilai: stats.newPatients },
      { Parameter: "Total Pemeriksaan Kehamilan", Nilai: stats.totalExaminations },
      { Parameter: "Status Kunjungan - Menunggu Antrian", Nilai: stats.visitsByStatus.MENUNGGU },
      { Parameter: "Status Kunjungan - Sedang Diperiksa", Nilai: stats.visitsByStatus.DITERIMA },
      { Parameter: "Status Kunjungan - Selesai Pemeriksaan", Nilai: stats.visitsByStatus.SELESAI },
      { Parameter: "Status Kunjungan - Dibatalkan", Nilai: stats.visitsByStatus.DIBATALKAN },
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistik Klinik");
    XLSX.writeFile(workbook, `Laporan_Klinik_${month}_${year}.xlsx`);
  };

  const getMonthLabel = (m: string) => {
    const months: Record<string, string> = {
      "01": "Januari", "02": "Februari", "03": "Maret", "04": "April",
      "05": "Mei", "06": "Juni", "07": "Juli", "08": "Agustus",
      "09": "September", "10": "Oktober", "11": "November", "12": "Desember"
    };
    return months[m] || m;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-blue-50/30">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Hero */}
        <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-blue-500 rounded-3xl p-8 md:p-12 shadow-2xl shadow-pink-100/50 mb-10 overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative">
            <span className="bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Laporan Eksekutif Bulanan
            </span>
            <h1 className="text-3xl md:text-5xl font-black mt-3">Laporan & Statistik</h1>
            <p className="text-white/80 mt-2 text-sm md:text-base font-light">
              Tarik, telaah, dan unduh laporan kinerja medis klinik bersalin Anda dalam format PDF dan Excel.
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-100/40 border border-gray-100 mb-8">
          <div className="grid md:grid-cols-2 gap-6 items-end">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Bulan Laporan"
                options={[
                  { value: "01", label: "Januari" },
                  { value: "02", label: "Februari" },
                  { value: "03", label: "Maret" },
                  { value: "04", label: "April" },
                  { value: "05", label: "Mei" },
                  { value: "06", label: "Juni" },
                  { value: "07", label: "Juli" },
                  { value: "08", label: "Agustus" },
                  { value: "09", label: "September" },
                  { value: "10", label: "Oktober" },
                  { value: "11", label: "November" },
                  { value: "12", label: "Desember" }
                ]}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
              <Select
                label="Tahun Laporan"
                options={[
                  { value: "2023", label: "2023" },
                  { value: "2024", label: "2024" },
                  { value: "2025", label: "2025" },
                  { value: "2026", label: "2026" }
                ]}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="primary"
                onClick={handleExportPDF}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-pink-100 flex items-center gap-2"
              >
                <FileText size={18} />
                Ekspor ke PDF
              </Button>
              <Button
                variant="secondary"
                onClick={handleExportExcel}
                className="bg-green-600 hover:bg-green-700 text-white border-0 font-bold py-3 px-6 rounded-2xl shadow-lg shadow-green-100 flex items-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Ekspor ke Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Reports Statistics Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Mengkalkulasi laporan statistik...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Visits */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-4 hover:shadow-2xl transition-all duration-300">
                <div className="p-4 bg-pink-50 rounded-2xl text-pink-500">
                  <Calendar size={28} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-400">Total Kunjungan</div>
                  <div className="text-3xl font-black text-gray-800 mt-1">{stats.totalVisits}</div>
                  <div className="text-xs text-pink-500 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp size={12} />
                    {getMonthLabel(month)}
                  </div>
                </div>
              </div>

              {/* Patients */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-4 hover:shadow-2xl transition-all duration-300">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-500">
                  <Users size={28} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-400">Total Seluruh Pasien</div>
                  <div className="text-3xl font-black text-gray-800 mt-1">{stats.totalPatients}</div>
                  <div className="text-xs text-blue-500 font-semibold mt-1">Terdaftar Aktif</div>
                </div>
              </div>

              {/* Examinations */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-4 hover:shadow-2xl transition-all duration-300">
                <div className="p-4 bg-green-50 rounded-2xl text-green-500">
                  <HeartPulse size={28} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-400">Pemeriksaan Kehamilan</div>
                  <div className="text-3xl font-black text-gray-800 mt-1">{stats.totalExaminations}</div>
                  <div className="text-xs text-green-500 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp size={12} />
                    Kunjungan Hamil
                  </div>
                </div>
              </div>

              {/* New Patients */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-4 hover:shadow-2xl transition-all duration-300">
                <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600">
                  <UserCheck size={28} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-400">Pasien Baru Bulan Ini</div>
                  <div className="text-3xl font-black text-gray-800 mt-1">{stats.newPatients}</div>
                  <div className="text-xs text-yellow-600 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp size={12} />
                    Pasien Baru
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gray-55 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Distribusi Kunjungan Pasien</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Persentase status pemeriksaan periode {getMonthLabel(month)} {year}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-700 font-semibold">
                      <th className="text-left p-5 pl-8">Status Kunjungan</th>
                      <th className="text-left p-5">Jumlah Kunjungan</th>
                      <th className="text-left p-5">Persentase</th>
                      <th className="text-left p-5 pr-8">Visualisasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Status Menunggu */}
                    <tr className="hover:bg-pink-50/5 transition-colors">
                      <td className="p-5 pl-8 font-bold text-yellow-600 flex items-center gap-2">
                        <ShieldAlert size={16} />
                        Menunggu Antrian
                      </td>
                      <td className="p-5 font-bold text-gray-800">{stats.visitsByStatus.MENUNGGU} Kunjungan</td>
                      <td className="p-5 font-semibold text-gray-500">
                        {stats.totalVisits > 0 ? ((stats.visitsByStatus.MENUNGGU / stats.totalVisits) * 100).toFixed(1) + "%" : "0.0%"}
                      </td>
                      <td className="p-5 pr-8">
                        <div className="w-48 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalVisits > 0 ? (stats.visitsByStatus.MENUNGGU / stats.totalVisits) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>

                    {/* Status Diterima */}
                    <tr className="hover:bg-pink-50/5 transition-colors">
                      <td className="p-5 pl-8 font-bold text-blue-600 flex items-center gap-2">
                        <HeartPulse size={16} />
                        Sedang Diperiksa Bidan
                      </td>
                      <td className="p-5 font-bold text-gray-800">{stats.visitsByStatus.DITERIMA} Kunjungan</td>
                      <td className="p-5 font-semibold text-gray-500">
                        {stats.totalVisits > 0 ? ((stats.visitsByStatus.DITERIMA / stats.totalVisits) * 100).toFixed(1) + "%" : "0.0%"}
                      </td>
                      <td className="p-5 pr-8">
                        <div className="w-48 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalVisits > 0 ? (stats.visitsByStatus.DITERIMA / stats.totalVisits) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>

                    {/* Status Selesai */}
                    <tr className="hover:bg-pink-50/5 transition-colors">
                      <td className="p-5 pl-8 font-bold text-green-600 flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        Selesai Pemeriksaan
                      </td>
                      <td className="p-5 font-bold text-gray-800">{stats.visitsByStatus.SELESAI} Kunjungan</td>
                      <td className="p-5 font-semibold text-gray-500">
                        {stats.totalVisits > 0 ? ((stats.visitsByStatus.SELESAI / stats.totalVisits) * 100).toFixed(1) + "%" : "0.0%"}
                      </td>
                      <td className="p-5 pr-8">
                        <div className="w-48 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalVisits > 0 ? (stats.visitsByStatus.SELESAI / stats.totalVisits) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>

                    {/* Status Dibatalkan */}
                    <tr className="hover:bg-pink-50/5 transition-colors">
                      <td className="p-5 pl-8 font-bold text-red-600 flex items-center gap-2">
                        <ShieldAlert size={16} />
                        Pendaftaran Dibatalkan
                      </td>
                      <td className="p-5 font-bold text-gray-800">{stats.visitsByStatus.DIBATALKAN} Kunjungan</td>
                      <td className="p-5 font-semibold text-gray-500">
                        {stats.totalVisits > 0 ? ((stats.visitsByStatus.DIBATALKAN / stats.totalVisits) * 100).toFixed(1) + "%" : "0.0%"}
                      </td>
                      <td className="p-5 pr-8">
                        <div className="w-48 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-red-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalVisits > 0 ? (stats.visitsByStatus.DIBATALKAN / stats.totalVisits) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
