"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Users, UserCheck, Calendar, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalMidwives: 0,
    totalVisits: 0,
    todayRegistrations: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        // Simulate API call
        setStats({
          totalPatients: 45,
          totalMidwives: 8,
          totalVisits: 156,
          todayRegistrations: 5,
        });

        // Sample chart data
        setChartData([
          { month: "Jan", visits: 10, newPatients: 5 },
          { month: "Feb", visits: 15, newPatients: 8 },
          { month: "Mar", visits: 12, newPatients: 6 },
          { month: "Apr", visits: 20, newPatients: 10 },
          { month: "May", visits: 25, newPatients: 12 },
          { month: "Jun", visits: 30, newPatients: 15 },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={session?.user?.role} userName={session?.user?.name} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Selamat datang kembali, {session?.user?.name}</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Pasien"
            value={stats.totalPatients}
            icon={<Users size={32} />}
            color="pink"
          />
          <StatCard
            title="Total Bidan"
            value={stats.totalMidwives}
            icon={<UserCheck size={32} />}
            color="blue"
          />
          <StatCard
            title="Total Kunjungan"
            value={stats.totalVisits}
            icon={<Calendar size={32} />}
            color="green"
          />
          <StatCard
            title="Pendaftaran Hari Ini"
            value={stats.todayRegistrations}
            icon={<FileText size={32} />}
            color="yellow"
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Grafik Kunjungan Bulanan" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits" fill="#ec4899" name="Kunjungan" />
                <Bar dataKey="newPatients" fill="#0ea5e9" name="Pasien Baru" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Grafik Pasien Baru Per Bulan" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newPatients"
                  stroke="#0ea5e9"
                  name="Pasien Baru"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>
    </div>
  );
}
