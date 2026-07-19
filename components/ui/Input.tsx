"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium
          bg-white/50 dark:bg-white/[0.06]
          backdrop-blur-lg
          border border-white/30 dark:border-white/10
          text-gray-900 dark:text-gray-100
          placeholder-gray-400/60 dark:placeholder-gray-500/60
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400/50
          focus:shadow-[0_0_20px_rgba(34,197,94,0.1)]
          dark:focus:shadow-[0_0_20px_rgba(34,197,94,0.08)]
          ${
            error
              ? "border-red-400/50 dark:border-red-400/30 focus:ring-red-500/30 focus:border-red-400/50"
              : ""
          }
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
