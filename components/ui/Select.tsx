"use client";

import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export default function Select({
  label,
  error,
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium
          bg-white/50 dark:bg-gray-800
          backdrop-blur-lg
          border border-white/30 dark:border-white/10
          text-gray-900 dark:text-gray-100
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400/50
          focus:shadow-[0_0_20px_rgba(34,197,94,0.1)]
          dark:focus:shadow-[0_0_20px_rgba(34,197,94,0.08)]
          appearance-none
          [&>option]:bg-white [&>option]:text-gray-900
          dark:[&>option]:bg-gray-800 dark:[&>option]:text-gray-100
          ${
            error
              ? "border-red-400/50 dark:border-red-400/30 focus:ring-red-500/30 focus:border-red-400/50"
              : ""
          }
          ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.75rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.25em 1.25em",
          paddingRight: "2.5rem",
        }}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
