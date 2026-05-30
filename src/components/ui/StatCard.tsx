"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "pink" | "blue" | "green" | "yellow";
}

export function StatCard({ title, value, icon, color = "pink" }: StatCardProps) {
  const colorClass = {
    pink: "bg-pink-50 text-pink-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        {icon && <div className={`text-3xl ${colorClass[color]} p-3 rounded-lg`}>{icon}</div>}
      </div>
    </div>
  );
}
