"use client";

import React from "react";
import { X } from "lucide-react";
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

const typeConfig: Record<string, { styles: string; icon: React.ReactNode }> = {
  success: {
    styles: "glass-alert-success",
    icon: <CheckCircle size={18} className="text-green-600 dark:text-green-400 flex-shrink-0" />,
  },
  error: {
    styles: "glass-alert-error",
    icon: <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0" />,
  },
  warning: {
    styles: "glass-alert-warning",
    icon: <AlertTriangle size={18} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />,
  },
  info: {
    styles: "glass-alert-info",
    icon: <Info size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />,
  },
};

export default function Alert({ type, message, onClose }: AlertProps) {
  const config = typeConfig[type];

  return (
    <div
      className={`glass-alert px-4 py-3 mb-4 flex items-center gap-3 ${config.styles}`}
    >
      {config.icon}
      <span className="flex-1 text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
