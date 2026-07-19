"use client";

import { useEffect, useState } from "react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";

interface HistoryEntry {
  id: number;
  date: string;
  studentName: string;
  className: string;
  subjectName: string;
  status: string;
  evidence: string | null;
}

interface Class {
  id: number;
  name: string;
}

export default function HistoryPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHistory = async (classId: string) => {
    if (!classId) return;
    setLoading(true);
    try {
      let url = `/api/attendance?classId=${classId}`;
      if (startDate) url += `&date=${startDate}`;
      const res = await fetch(url);
      let data = await res.json();

      // Filter by date range on client side if endDate is set
      if (startDate && endDate) {
        data = data.filter((entry: HistoryEntry) => entry.date >= startDate && entry.date <= endDate);
      } else if (startDate) {
        data = data.filter((entry: HistoryEntry) => entry.date === startDate);
      }

      setHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchHistory(selectedClass);
    }
  }, [selectedClass, startDate, endDate]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "hadir": return "glass-badge glass-badge-success";
      case "sakit": return "glass-badge glass-badge-warning";
      case "alpha": return "glass-badge glass-badge-danger";
      case "izin": return "glass-badge glass-badge-info";
      case "bolos": return "glass-badge glass-badge-warning";
      default: return "glass-badge glass-badge-info";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Riwayat Absensi</h2>

      <div className="glass-card p-4 mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Kelas"
            options={classes.map((c) => ({ value: c.id, label: c.name }))}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            placeholder="Pilih kelas"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Input
            label="Dari Tanggal"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Input
            label="Sampai Tanggal"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : history.length === 0 ? (
        <div className="glass-card p-8 text-center text-gray-500 dark:text-gray-400">
          {selectedClass ? "Tidak ada data absensi ditemukan." : "Pilih kelas untuk melihat riwayat."}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-full">
              <thead>
                <tr className="glass-table-header border-b border-white/20 dark:border-white/10">
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Siswa</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Mapel</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Alasan/Bukti</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0">
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{entry.date}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 font-medium">{entry.studentName}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{entry.subjectName}</td>
                    <td className="px-4 py-3.5">
                      <span className={getStatusBadgeClass(entry.status)}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                      {entry.evidence || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
