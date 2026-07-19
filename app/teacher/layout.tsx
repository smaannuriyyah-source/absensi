"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar, { teacherNavItems } from "@/components/Sidebar";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileStatus, setProfileStatus] = useState<boolean | null>(null);

  useEffect(() => {
    checkProfile();
    const storedCollapsed = localStorage.getItem("sidebar-collapsed");
    if (storedCollapsed) {
      setCollapsed(storedCollapsed === "true");
    }
  }, []);

  const checkProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfileStatus(data.profileComplete);
    } catch {
      setProfileStatus(false);
    }
  };

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/5 dark:bg-primary-400/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/5 dark:bg-green-400/3 rounded-full blur-3xl" />
      </div>
      <Header
        title="Artier Attendance"
        accentColor="green"
        onToggleSidebar={toggleSidebar}
        profileWarning={
          profileStatus === false && pathname !== "/teacher/profile" ? (
            <div className="bg-yellow-400/10 dark:bg-yellow-400/5 border-b border-yellow-400/20 dark:border-yellow-400/10 backdrop-blur-sm px-4 py-2">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    Anda belum melengkapi profil. Silakan lengkapi profil terlebih dahulu.
                  </p>
                </div>
                <Link href="/teacher/profile">
                  <Button size="sm" variant="warning">
                    Lengkapi Profil
                  </Button>
                </Link>
              </div>
            </div>
          ) : undefined
        }
      />

      <div className="flex pt-14">
        <Sidebar
          navItems={teacherNavItems}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={closeSidebar}
          accentColor="green"
        />

        {/* Main content */}
        <main className={`flex-1 min-w-0 ${profileStatus === false ? "pt-10" : ""}`}>
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
