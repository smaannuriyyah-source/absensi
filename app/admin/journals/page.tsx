"use client";

import { useEffect, useState } from "react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

interface JournalEntry {
  id: number;
  teacherName: string;
  className: string;
  subjectName: string;
  hour: number;
  material: string;
  date: string;
}

interface Class {
  id: number;
  name: string;
}

export default function JournalsRekapPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchJournals();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setClasses(data);
      if (data.length > 0) {
        setSelectedClass(data[0].id.toString());
      }
    } catch {
      setAlert({ type: "error", message: "Gagal memuat data kelas" });
    }
  };

  const fetchJournals = async () => {
    if (!selectedClass || !selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/journals/rekap?classId=${selectedClass}&date=${selectedDate}`
      );
      const data = await res.json();
      setJournals(data);
    } catch {
      setAlert({ type: "error", message: "Gagal memuat data jurnal" });
    } finally {
      setLoading(false);
    }
  };

  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }));

  // Group journals by hour
  const journalsByHour: Record<number, JournalEntry[]> = {};
  for (let i = 1; i <= 8; i++) {
    journalsByHour[i] = journals.filter((j) => j.hour === i);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Rekap Jurnal Mengajar</h2>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      <div className="glass-card p-4 mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Kelas"
            options={classOptions}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Input
            label="Tanggal"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-full">
              <thead>
                <tr className="glass-table-header border-b border-white/20 dark:border-white/10">
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-24">Jam Ke-</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Guru</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Mapel</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Materi</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((hour) => {
                  const entries = journalsByHour[hour] || [];
                  if (entries.length === 0) {
                    return (
                      <tr key={hour} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0">
                        <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 font-medium">Jam {hour}</td>
                        <td colSpan={3} className="px-4 py-3.5 text-sm text-gray-400 dark:text-gray-500 italic">
                          Tidak ada jurnal
                        </td>
                      </tr>
                    );
                  }
                  return entries.map((entry, idx) => (
                    <tr key={`${hour}-${idx}`} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0">
                      {idx === 0 && (
                        <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 font-medium" rowSpan={entries.length}>
                          Jam {hour}
                        </td>
                      )}
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{entry.teacherName}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{entry.subjectName}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{entry.material}</td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
