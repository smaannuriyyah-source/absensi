"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getDailyQuote, getGreeting } from "@/lib/quotes";
import { ClipboardList, BookOpen, BarChart3, AlertTriangle, Clock } from "lucide-react";

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<{ name: string; profileComplete: boolean } | null>(null);
  const [todayJournals, setTodayJournals] = useState<{ id: number; hour: number; subjectName: string; material: string }[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");

  const quote = getDailyQuote();
  const { greeting, emoji } = getGreeting();

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);

      const today = new Date().toISOString().split("T")[0];
      const res2 = await fetch(`/api/journals?date=${today}`);
      const journals = await res2.json();
      setTodayJournals(journals);
    } catch (error) {
      console.error(error);
    }
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Greeting Card */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {emoji} {greeting}, {profile?.name || "Guru"}!
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              <span>{today}</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="font-mono">{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Profile Warning */}
        {profile && !profile.profileComplete && (
          <div className="mt-4 bg-yellow-400/10 dark:bg-yellow-400/5 border border-yellow-400/20 dark:border-yellow-400/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Profil belum lengkap
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Silakan lengkapi profil untuk dapat melakukan absensi.
                </p>
                <Link href="/teacher/profile">
                  <Button size="sm" variant="warning" className="mt-2">
                    Lengkapi Profil
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quote */}
        <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/5">
          <blockquote className="italic text-gray-600 dark:text-gray-400 text-sm">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            &mdash; {quote.author}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/teacher/attendance">
          <div className="glass-card-hover p-6 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-400/15 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 border border-primary-400/20 dark:border-primary-400/10 rounded-xl group-hover:bg-primary-400/25 dark:group-hover:bg-primary-400/15 transition-colors">
                <ClipboardList size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Absensi</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Isi jurnal & absensi siswa</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/teacher/grades/knowledge">
          <div className="glass-card-hover p-6 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-400/15 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-400/20 dark:border-blue-400/10 rounded-xl group-hover:bg-blue-400/25 dark:group-hover:bg-blue-400/15 transition-colors">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Penilaian</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Input & edit nilai siswa</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/teacher/grades/report">
          <div className="glass-card-hover p-6 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-400/15 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 border border-purple-400/20 dark:border-purple-400/10 rounded-xl group-hover:bg-purple-400/25 dark:group-hover:bg-purple-400/15 transition-colors">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Laporan</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lihat rekap nilai</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Today's journals */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Jurnal Hari Ini
        </h3>
        {todayJournals.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Belum ada jurnal hari ini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayJournals.map((journal) => (
              <div
                key={journal.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-primary-400/10 dark:bg-primary-400/5 border border-primary-400/20 dark:border-primary-400/10 backdrop-blur-sm hover:bg-primary-400/15 dark:hover:bg-primary-400/8 transition-colors"
              >
                <div className="bg-primary-400/15 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 border border-primary-400/20 dark:border-primary-400/10 rounded-lg px-3 py-1.5 text-sm font-bold">
                  Jam {journal.hour}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {journal.subjectName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {journal.material}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
