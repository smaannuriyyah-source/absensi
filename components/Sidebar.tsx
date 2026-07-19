"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  ClipboardList,
  BookOpen,
  FlaskConical,
  BarChart3,
  History,
  Users,
  School,
  GraduationCap,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const teacherNavItems: NavItem[] = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/profile", label: "Profil", icon: User },
  { href: "/teacher/attendance", label: "Absensi", icon: ClipboardList },
  { href: "/teacher/grades/knowledge", label: "Nilai Pengetahuan", icon: BookOpen },
  { href: "/teacher/grades/practice", label: "Nilai Praktek", icon: FlaskConical },
  { href: "/teacher/grades/report", label: "Laporan Nilai", icon: BarChart3 },
  { href: "/teacher/history", label: "Riwayat", icon: History },
];

export const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/teachers", label: "Guru", icon: Users },
  { href: "/admin/subjects", label: "Mapel", icon: BookOpen },
  { href: "/admin/classes", label: "Kelas", icon: School },
  { href: "/admin/students", label: "Siswa", icon: GraduationCap },
  { href: "/admin/journals", label: "Rekap Jurnal", icon: FileText },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  navItems: NavItem[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
  accentColor?: "green" | "blue";
}

export default function Sidebar({
  navItems,
  collapsed,
  onToggleCollapse,
  sidebarOpen,
  onCloseSidebar,
  accentColor = "green",
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={onCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-14 bottom-0 z-40
          glass-sidebar
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)]
          ${collapsed ? "w-16" : "w-64"}
          flex flex-col
        `}
      >
        {/* Right refraction highlight */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-white/40 via-white/20 to-white/40 dark:from-white/10 dark:via-white/5 dark:to-white/10" />

        {/* Sidebar Header */}
        <div
          className={`flex items-center h-14 px-3 border-b border-white/20 dark:border-white/10 flex-shrink-0 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              Menu
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-gray-500 dark:text-gray-400
              bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10
              border border-white/20 dark:border-white/10
              transition-all duration-200 hidden lg:flex"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/teacher" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseSidebar}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium 
                  transition-all duration-300 group relative
                  ${
                    isActive
                      ? accentColor === "green"
                        ? "bg-primary-500/15 border border-primary-400/20 dark:border-primary-400/10 text-primary-700 dark:text-primary-300 backdrop-blur-sm shadow-sm"
                        : "bg-blue-500/15 border border-blue-400/20 dark:border-blue-400/10 text-blue-700 dark:text-blue-300 backdrop-blur-sm shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5 border border-transparent"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${
                    isActive
                      ? accentColor === "green"
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900/90 dark:bg-gray-700/90 backdrop-blur-md text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-white/20 dark:border-white/10 flex-shrink-0">
          <button
            onClick={onToggleCollapse}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium 
              text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5
              transition-all duration-200 w-full lg:hidden border border-transparent
              ${collapsed ? "justify-center" : ""}
            `}
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
            {!collapsed && <span>Tutup Sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
