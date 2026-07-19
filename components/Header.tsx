"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Button from "./ui/Button";

interface HeaderProps {
  title: string;
  accentColor?: "green" | "blue";
  onToggleSidebar: () => void;
  profileWarning?: React.ReactNode;
}

export default function Header({
  title,
  accentColor = "green",
  onToggleSidebar,
  profileWarning,
}: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const titleColorClass =
    accentColor === "green"
      ? "text-primary-600 dark:text-primary-400"
      : "text-blue-600 dark:text-blue-400";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        {/* Top refraction highlight */}
        <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/15 to-transparent" />

        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400
                bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10
                border border-white/20 dark:border-white/10
                transition-all duration-200 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className={`text-lg font-bold ${titleColorClass}`}>
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Button variant="glass-danger" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-1.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Warning */}
      {profileWarning && (
        <div className="fixed top-14 left-0 right-0 z-40">
          {profileWarning}
        </div>
      )}
    </>
  );
}
