"use client";

import React from "react";
import { Loader } from "lucide-react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export function Card({ title, children, className = "", loading = false }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin text-pink-500" size={32} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
