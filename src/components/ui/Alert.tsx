"use client";

import React from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface AlertProps {
  type: "error" | "success" | "info";
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const styles = {
    error: "bg-red-50 text-red-800 border-red-200",
    success: "bg-green-50 text-green-800 border-green-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const icons = {
    error: <AlertCircle size={20} />,
    success: <CheckCircle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className={`border rounded-lg p-4 flex items-center gap-3 ${styles[type]}`}>
      {icons[type]}
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg font-bold opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
