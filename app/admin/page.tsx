"use client";

import { useEffect, useState } from "react";
import { Users, School, GraduationCap, BookOpen } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalClasses: 0,
    totalStudents: 0,
    todayJournals: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statCards = [
    {
      label: "Total Guru",
      value: stats.totalTeachers,
      icon: Users,
      color: "bg-blue-400/15 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-400/20 dark:border-blue-400/10",
    },
    {
      label: "Total Kelas",
      value: stats.totalClasses,
      icon: School,
      color: "bg-primary-400/15 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 border border-primary-400/20 dark:border-primary-400/10",
    },
    {
      label: "Total Siswa",
      value: stats.totalStudents,
      icon: GraduationCap,
      color: "bg-purple-400/15 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 border border-purple-400/20 dark:border-purple-400/10",
    },
    {
      label: "Jurnal Hari Ini",
      value: stats.todayJournals,
      icon: BookOpen,
      color: "bg-orange-400/15 dark:bg-orange-400/10 text-orange-600 dark:text-orange-400 border border-orange-400/20 dark:border-orange-400/10",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`glass-card-hover p-6 animate-glass-card-entrance ${
                index === 1
                  ? "animate-glass-card-entrance-delay-1"
                  : index === 2
                  ? "animate-glass-card-entrance-delay-2"
                  : index === 3
                  ? "animate-glass-card-entrance-delay-3"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl backdrop-blur-sm ${card.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {card.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {card.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
