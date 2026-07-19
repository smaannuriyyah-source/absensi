"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

interface AcademicYear {
  id: number;
  year: string;
  isActive: boolean;
}

export default function SettingsPage() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [newYear, setNewYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const res = await fetch("/api/settings/academic-year");
      const data = await res.json();
      setYears(data);
    } catch {
      setAlert({ type: "error", message: "Gagal memuat data" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings/academic-year", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: newYear }),
      });

      if (!res.ok) {
        const data = await res.json();
        setAlert({ type: "error", message: data.error || "Gagal menambah" });
        return;
      }

      setAlert({ type: "success", message: "Tahun ajaran berhasil ditambahkan!" });
      setNewYear("");
      fetchYears();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  const handleSetActive = async (id: number) => {
    try {
      const res = await fetch(`/api/settings/academic-year/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });

      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal mengaktifkan tahun ajaran" });
        return;
      }

      setAlert({ type: "success", message: "Tahun ajaran aktif berhasil diubah!" });
      fetchYears();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus tahun ajaran ini?")) return;
    try {
      const res = await fetch(`/api/settings/academic-year/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal menghapus tahun ajaran" });
        return;
      }

      setAlert({ type: "success", message: "Tahun ajaran berhasil dihapus!" });
      fetchYears();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Pengaturan Tahun Ajaran</h2>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Add new year */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Tambah Tahun Ajaran</h3>
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Tahun Ajaran"
              type="text"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="Contoh: 2024/2025"
              required
            />
          </div>
          <Button type="submit" loading={saving}>
            Tambah
          </Button>
        </form>
      </div>

      {/* List of years */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-full">
            <thead>
              <tr className="glass-table-header border-b border-white/20 dark:border-white/10">
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Tahun Ajaran</th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-4 py-3.5 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {years.map((year) => (
                <tr key={year.id} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0">
                  <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 font-medium">{year.year}</td>
                  <td className="px-4 py-3.5">
                    {year.isActive ? (
                      <span className="glass-badge glass-badge-success">
                        Aktif
                      </span>
                    ) : (
                      <span className="glass-badge glass-badge-info">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex gap-2 justify-end">
                      {!year.isActive && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleSetActive(year.id)}
                        >
                          Aktifkan
                        </Button>
                      )}
                      {!year.isActive && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(year.id)}
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {years.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada tahun ajaran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
