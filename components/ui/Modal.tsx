"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Glass Backdrop */}
      <div
        className="fixed inset-0 glass-modal-backdrop"
        onClick={onClose}
      />

      {/* Glass Modal Panel */}
      <div className="relative glass-modal max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto scrollbar-thin animate-glass-card-entrance">
        {/* Top highlight line */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-white/10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
              bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10
              border border-white/20 dark:border-white/10
              transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
