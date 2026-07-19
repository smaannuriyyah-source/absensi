"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "glass" | "glass-primary" | "glass-danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-primary-600/90 hover:bg-primary-700/90 backdrop-blur-md border border-primary-500/30 text-white shadow-glass",
  secondary:
    "bg-white/50 hover:bg-white/70 dark:bg-white/8 dark:hover:bg-white/12 backdrop-blur-xl border border-white/30 dark:border-white/10 text-gray-800 dark:text-gray-100 shadow-glass dark:shadow-glass-dark",
  danger:
    "bg-red-600/90 hover:bg-red-700/90 backdrop-blur-md border border-red-500/30 text-white shadow-glass",
  success:
    "bg-green-600/90 hover:bg-green-700/90 backdrop-blur-md border border-green-500/30 text-white shadow-glass",
  warning:
    "bg-yellow-500/90 hover:bg-yellow-600/90 backdrop-blur-md border border-yellow-400/30 text-white shadow-glass",
  glass:
    "bg-white/50 hover:bg-white/70 dark:bg-white/8 dark:hover:bg-white/12 backdrop-blur-xl border border-white/30 dark:border-white/10 text-gray-800 dark:text-gray-100 shadow-glass dark:shadow-glass-dark",
  "glass-primary":
    "bg-primary-500/15 hover:bg-primary-500/25 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 backdrop-blur-xl border border-primary-400/30 dark:border-primary-400/15 text-primary-700 dark:text-primary-300 shadow-glass dark:shadow-glass-dark",
  "glass-danger":
    "bg-red-500/15 hover:bg-red-500/25 dark:bg-red-500/10 dark:hover:bg-red-500/20 backdrop-blur-xl border border-red-400/30 dark:border-red-400/15 text-red-700 dark:text-red-300 shadow-glass dark:shadow-glass-dark",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-base rounded-xl",
  lg: "px-6 py-3 text-lg rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-300 relative overflow-hidden ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Light sweep effect on hover */}
      <span className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500">
        <span className="absolute top-0 left-[-100%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-15deg] group-hover:animate-light-sweep" />
      </span>
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
