"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar, { adminNavItems } from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const storedCollapsed = localStorage.getItem("sidebar-collapsed");
    if (storedCollapsed) {
      setCollapsed(storedCollapsed === "true");
    }
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative">
      {/* Ambient glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-400/5 dark:bg-primary-600/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-primary-300/5 dark:bg-primary-700/3 rounded-full blur-[100px] pointer-events-none" />

      <Header
        title="Artier Attendance"
        accentColor="green"
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex pt-14 relative z-10">
        <Sidebar
          navItems={adminNavItems}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={closeSidebar}
          accentColor="green"
        />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
