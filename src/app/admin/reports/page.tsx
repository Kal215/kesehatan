"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Download, FileText } from "lucide-react";

export default function ReportsPage() {
  const { data: session } = useSession();
  const [reportType, setReportType] = useState("visits");
  const [month, setMonth] = useState("06");
  const [year, setYear] = useState("2024");

  const handleExportPDF = () => {
    alert("Mengekspor laporan ke PDF...");
  };

  const handleExportExcel = () => {
    alert("Mengekspor laporan ke Excel...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Laporan</h1>
          <p className="text-gray-600 mt-2">Lihat dan export laporan klinik</p>
        </div>

        {/* Filter Section */}
        <Card className="mt-8 mb-6">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <Select
              label="Jenis Laporan"
              options={[
                { value: "visits", label: "Total Kunjungan" },
                { value: "patients", label: "Total Pasien Baru" },
                { value: "examinations", label: "Total Pemeriksaan Kehamilan" },
                { value: "registrations", label: "Total Pendaftaran Online" },
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            />
            <Select
              label="Bulan"
              options={[
                { value: "01", label: "Januari" },
                { value: "02", label: "Februari" },
                { value: "03", label: "Maret" },
                { value: "04", label: "April" },
                { value: "05", label: "Mei" },
                { value: "06", label: "Juni" },
              ]}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <Select
              label="Tahun"
              options={[
                { value: "2023", label: "2023" },
                { value: "2024", label: "2024" },
                { value: "2025", label: "2025" },
              ]}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              <Download size={18} />
              Export PDF
            </Button>
            <Button
              variant="secondary"
              onClick={handleExportExcel}
              className="flex items-center gap-2"
            >
              <Download size={18} />
              Export Excel
            </Button>
          </div>
        </Card>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Total Visits */}
          <Card title="Total Kunjungan Bulan Juni 2024">
            <div className="text-center py-8">
              <p className="text-5xl font-bold text-pink-600">156</p>
              <p className="text-gray-600 mt-2">Kunjungan</p>
            </div>
          </Card>

          {/* New Patients */}
          <Card title="Total Pasien Baru Bulan Juni 2024">
            <div className="text-center py-8">
              <p className="text-5xl font-bold text-blue-600">45</p>
              <p className="text-gray-600 mt-2">Pasien</p>
            </div>
          </Card>

          {/* Pregnancy Examinations */}
          <Card title="Total Pemeriksaan Kehamilan Bulan Juni 2024">
            <div className="text-center py-8">
              <p className="text-5xl font-bold text-green-600">120</p>
              <p className="text-gray-600 mt-2">Pemeriksaan</p>
            </div>
          </Card>

          {/* Online Registrations */}
          <Card title="Total Pendaftaran Online Bulan Juni 2024">
            <div className="text-center py-8">
              <p className="text-5xl font-bold text-yellow-600">78</p>
              <p className="text-gray-600 mt-2">Pendaftaran</p>
            </div>
          </Card>
        </div>

        {/* Detailed Report */}
        <Card title="Rincian Laporan" className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-4">Kategori</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Persentase</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">Kunjungan Menunggu</td>
                  <td className="p-4">25</td>
                  <td className="p-4">16.0%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">Kunjungan Diterima</td>
                  <td className="p-4">45</td>
                  <td className="p-4">28.8%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">Kunjungan Selesai</td>
                  <td className="p-4">80</td>
                  <td className="p-4">51.3%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">Kunjungan Dibatalkan</td>
                  <td className="p-4">6</td>
                  <td className="p-4">3.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
