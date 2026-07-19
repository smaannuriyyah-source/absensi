"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

interface Subject {
  id: number;
  name: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/profile");
      const profile = await res.json();
      setName(profile.name || "");
      setProfileComplete(profile.profileComplete || false);

      const res2 = await fetch("/api/subjects");
      const subjects = await res2.json();
      setAllSubjects(subjects);

      if (profile.subjects) {
        setSelectedSubjects(profile.subjects.map((s: Subject) => s.id));
      }
    } catch {
      setAlert({ type: "error", message: "Gagal memuat data profil" });
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (id: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      setAlert({ type: "error", message: "Pilih minimal 1 mata pelajaran" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subjectIds: selectedSubjects }),
      });

      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal menyimpan profil" });
        return;
      }

      setAlert({ type: "success", message: "Profil berhasil disimpan!" });
      setProfileComplete(true);
      router.refresh();
      window.dispatchEvent(new Event("profile-updated"));
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Profil Guru</h2>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {profileComplete && (
        <div className="bg-green-400/10 dark:bg-green-400/5 border border-green-400/20 dark:border-green-400/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <p className="text-green-800 dark:text-green-200 text-sm">
            Profil Anda sudah lengkap. Anda dapat melakukan absensi.
          </p>
        </div>
      )}

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Lengkap"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap Anda"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mata Pelajaran yang Diajar <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allSubjects.map((subject) => (
                <label
                  key={subject.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSubjects.includes(subject.id)
                      ? "bg-primary-400/10 dark:bg-primary-400/5 border-primary-400/25 dark:border-primary-400/15 backdrop-blur-sm"
                      : "bg-white/40 dark:bg-white/[0.06] border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/[0.1]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject.id)}
                    onChange={() => toggleSubject(subject.id)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100">{subject.name}</span>
                </label>
              ))}
            </div>
            {allSubjects.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Belum ada mata pelajaran. Hubungi admin.
              </p>
            )}
          </div>

          <Button type="submit" loading={saving}>
            Simpan Profil
          </Button>
        </form>
      </div>
    </div>
  );
}
