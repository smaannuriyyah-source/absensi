"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import Tabs from "@/components/ui/Tabs";
import { BookOpen, ClipboardCheck } from "lucide-react";

interface Subject {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

interface Journal {
  id: number;
  hour: number;
  subjectId: number;
  subjectName: string;
  material: string;
  classId: number;
  className: string;
}

const tabs = [
  { id: "journal", label: "Jurnal Mengajar", icon: BookOpen },
  { id: "attendance", label: "Absensi Siswa", icon: ClipboardCheck },
];

export default function AttendancePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("journal");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [todayJournals, setTodayJournals] = useState<Journal[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Journal form
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [material, setMaterial] = useState("");
  const [journalSaving, setJournalSaving] = useState(false);

  // Attendance
  const [students, setStudents] = useState<{ id: number; name: string }[]>([]);
  const [attendanceData, setAttendanceData] = useState<
    Record<number, { status: string; evidence: string }>
  >({});
  const [attendanceSaving, setAttendanceSaving] = useState(false);
  const [selectedJournalClass, setSelectedJournalClass] = useState("");
  const [selectedJournalSubject, setSelectedJournalSubject] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/profile");
      const profile = await res.json();
      setProfileComplete(profile.profileComplete || false);
      setSubjects(profile.subjects || []);

      const res2 = await fetch("/api/classes");
      const classesData = await res2.json();
      setClasses(classesData);

      const res3 = await fetch(`/api/journals?date=${today}`);
      const journals = await res3.json();
      setTodayJournals(journals);

      // If journals exist, go to attendance tab
      if (journals.length > 0) {
        setActiveTab("attendance");
        setSelectedJournalClass(journals[0].classId.toString());
        setSelectedJournalSubject(journals[0].subjectId.toString());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleHour = (hour: number) => {
    setSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHours.length === 0 || !selectedSubject || !selectedClass || !material) {
      setAlert({ type: "error", message: "Semua field wajib diisi" });
      return;
    }

    setJournalSaving(true);
    try {
      for (const hour of selectedHours) {
        const res = await fetch("/api/journals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId: parseInt(selectedClass),
            subjectId: parseInt(selectedSubject),
            date: today,
            hour,
            material,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setAlert({ type: "error", message: data.error || "Gagal menyimpan jurnal" });
          setJournalSaving(false);
          return;
        }
      }

      setAlert({ type: "success", message: "Jurnal berhasil disimpan!" });
      setSelectedHours([]);
      setMaterial("");
      fetchData();
      setActiveTab("attendance");
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setJournalSaving(false);
    }
  };

  const loadStudents = async (classId: string, subjectId: string) => {
    if (!classId) return;
    try {
      const res = await fetch(`/api/students?classId=${classId}`);
      const data = await res.json();
      setStudents(data);

      const attRes = await fetch(
        `/api/attendance?classId=${classId}&subjectId=${subjectId}&date=${today}`
      );
      const existingAtt = await attRes.json();

      const initial: Record<number, { status: string; evidence: string }> = {};

      if (Array.isArray(existingAtt) && existingAtt.length > 0) {
        existingAtt.forEach((record: { studentId: number; status: string; evidence: string | null }) => {
          initial[record.studentId] = {
            status: record.status,
            evidence: record.evidence || "",
          };
        });
        data.forEach((s: { id: number }) => {
          if (!initial[s.id]) {
            initial[s.id] = { status: "hadir", evidence: "" };
          }
        });
      } else {
        data.forEach((s: { id: number }) => {
          initial[s.id] = { status: "hadir", evidence: "" };
        });
      }

      setAttendanceData(initial);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedJournalClass && selectedJournalSubject) {
      loadStudents(selectedJournalClass, selectedJournalSubject);
    }
  }, [selectedJournalClass, selectedJournalSubject]);

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleEvidenceChange = (studentId: number, evidence: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], evidence },
    }));
  };

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setAttendanceSaving(true);
    try {
      const records = Object.entries(attendanceData).map(([studentId, data]) => ({
        studentId: parseInt(studentId),
        classId: parseInt(selectedJournalClass),
        subjectId: parseInt(selectedJournalSubject),
        date: today,
        status: data.status,
        evidence: data.evidence || null,
      }));

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });

      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal menyimpan absensi" });
        return;
      }

      setAlert({ type: "success", message: "Absensi berhasil disimpan!" });
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setAttendanceSaving(false);
    }
  };

  const statusOptions = [
    { value: "hadir", label: "Hadir" },
    { value: "sakit", label: "Sakit" },
    { value: "alpha", label: "Alpha" },
    { value: "izin", label: "Izin" },
    { value: "bolos", label: "Bolos" },
  ];

  if (!profileComplete) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Absensi</h2>
        <div className="glass-card p-8 text-center">
          <p className="text-yellow-800 dark:text-yellow-200 text-lg mb-4">
            Anda belum melengkapi profil. Silakan lengkapi profil terlebih dahulu.
          </p>
          <Button onClick={() => router.push("/teacher/profile")}>
            Lengkapi Profil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Absensi</h2>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} accentColor="green" />

      {/* Tab: Journal */}
      {activeTab === "journal" && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Jurnal Mengajar
          </h3>

          {todayJournals.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jurnal hari ini sudah ada:
              </p>
              <div className="space-y-2">
                {todayJournals.map((j) => (
                  <div
                    key={j.id}
                    className="bg-primary-400/10 dark:bg-primary-400/5 border border-primary-400/20 dark:border-primary-400/10 backdrop-blur-sm rounded-lg p-3 text-sm text-primary-800 dark:text-primary-200"
                  >
                    Jam {j.hour} - {j.subjectName} ({j.className}): {j.material}
                  </div>
                ))}
              </div>
              <Button
                className="mt-4"
                onClick={() => setActiveTab("attendance")}
              >
                Lanjut ke Absensi
              </Button>
            </div>
          )}

          <form onSubmit={handleJournalSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jam Mengajar <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }, (_, i) => i + 1).map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => toggleHour(hour)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedHours.includes(hour)
                        ? "bg-primary-400/10 dark:bg-primary-400/5 border-primary-400/25 dark:border-primary-400/15 backdrop-blur-sm text-primary-700 dark:text-primary-300"
                        : "bg-white/40 dark:bg-white/[0.06] border-white/20 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/[0.1]"
                    }`}
                  >
                    Jam {hour}
                  </button>
                ))}
              </div>
            </div>

            <Select
              label="Kelas"
              options={classes.map((c) => ({ value: c.id, label: c.name }))}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              placeholder="Pilih kelas"
              required
            />

            <Select
              label="Mata Pelajaran"
              options={subjects.map((s) => ({ value: s.id, label: s.name }))}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              placeholder="Pilih mapel"
              required
            />

            <Input
              label="Materi"
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="Materi yang diajarkan"
              required
            />

            <Button
              type="submit"
              loading={journalSaving}
              disabled={
                selectedHours.length === 0 ||
                !selectedSubject ||
                !selectedClass ||
                !material.trim()
              }
            >
              Simpan Jurnal & Lanjut
            </Button>
          </form>
        </div>
      )}

      {/* Tab: Attendance */}
      {activeTab === "attendance" && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Absensi Siswa
          </h3>

          <div className="flex gap-4 mb-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Select
                label="Kelas"
                options={classes.map((c) => ({ value: c.id, label: c.name }))}
                value={selectedJournalClass}
                onChange={(e) => setSelectedJournalClass(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Select
                label="Mapel"
                options={subjects.map((s) => ({ value: s.id, label: s.name }))}
                value={selectedJournalSubject}
                onChange={(e) => setSelectedJournalSubject(e.target.value)}
              />
            </div>
          </div>

          {students.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Pilih kelas dan mapel untuk menampilkan daftar siswa.
            </p>
          ) : (
            <form onSubmit={handleAttendanceSubmit}>
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Default: Semua siswa <strong>Hadir</strong>. Ubah status jika diperlukan.
              </div>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="min-w-full">
                    <thead>
                      <tr className="glass-table-header border-b border-white/20 dark:border-white/10">
                        <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">No</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Nama Siswa</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Alasan/Bukti</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => {
                        const data = attendanceData[student.id] || {
                          status: "hadir",
                          evidence: "",
                        };
                        const needsEvidence =
                          data.status === "sakit" || data.status === "izin";

                        return (
                          <tr key={student.id} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0">
                            <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
                            <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 font-medium">{student.name}</td>
                            <td className="px-4 py-3">
                              <select
                                value={data.status}
                                onChange={(e) =>
                                  handleStatusChange(student.id, e.target.value)
                                }
                                className="w-full px-3 py-1.5 rounded-lg text-sm font-medium
                                  bg-white/50 dark:bg-gray-800
                                  backdrop-blur-lg
                                  border border-white/30 dark:border-white/10
                                  text-gray-900 dark:text-gray-100
                                  focus:outline-none focus:ring-2 focus:ring-primary-500/30
                                  [&>option]:bg-white [&>option]:text-gray-900
                                  dark:[&>option]:bg-gray-800 dark:[&>option]:text-gray-100"
                              >
                                {statusOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              {needsEvidence ? (
                                <input
                                  type="text"
                                  value={data.evidence}
                                  onChange={(e) =>
                                    handleEvidenceChange(student.id, e.target.value)
                                  }
                                  placeholder="Wajib diisi"
                                  className={`input-field py-1.5 text-sm ${
                                    !data.evidence ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20" : ""
                                  }`}
                                />
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setActiveTab("journal")}
                >
                  Kembali ke Jurnal
                </Button>
                <Button type="submit" loading={attendanceSaving}>
                  Simpan Absensi
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
