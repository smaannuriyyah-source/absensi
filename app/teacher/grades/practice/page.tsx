"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Alert from "@/components/ui/Alert";

interface Student {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface PracticeGrade {
  id?: number;
  studentId: number;
  practice1: number | null;
  practice2: number | null;
}

export default function PracticeGradePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Record<number, PracticeGrade>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/profile");
      const profile = await res.json();
      setSubjects(profile.subjects || []);

      const res2 = await fetch("/api/classes");
      const classesData = await res2.json();
      setClasses(classesData);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGrades = async () => {
    if (!selectedClass || !selectedSubject) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/grades/practice?classId=${selectedClass}&subjectId=${selectedSubject}&semester=${selectedSemester}`
      );
      const data = await res.json();

      setStudents(data.students || []);

      const gradesMap: Record<number, PracticeGrade> = {};
      (data.grades || []).forEach((g: PracticeGrade) => {
        gradesMap[g.studentId] = g;
      });
      setGrades(gradesMap);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      loadGrades();
    }
  }, [selectedClass, selectedSubject, selectedSemester]);

  const handleGradeChange = (
    studentId: number,
    field: keyof PracticeGrade,
    value: string
  ) => {
    const numValue = value === "" ? null : parseInt(value);
    if (value !== "" && (isNaN(numValue!) || numValue! < 0 || numValue! > 100)) return;

    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        [field]: numValue,
      },
    }));
  };

  const handleSave = async (studentId: number) => {
    const grade = grades[studentId];
    if (!grade) return;

    setSaving(true);
    try {
      const res = await fetch("/api/grades/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          classId: parseInt(selectedClass),
          subjectId: parseInt(selectedSubject),
          semester: parseInt(selectedSemester),
          practice1: grade.practice1,
          practice2: grade.practice2,
        }),
      });

      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal menyimpan nilai" });
        return;
      }

      setAlert({ type: "success", message: "Nilai berhasil disimpan!" });
      setEditing((prev) => ({ ...prev, [studentId]: false }));
      loadGrades();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (studentId: number) => {
    setEditing((prev) => ({ ...prev, [studentId]: true }));
  };

  const handleCancel = (studentId: number) => {
    setEditing((prev) => ({ ...prev, [studentId]: false }));
    loadGrades();
  };

  const hasGrade = (studentId: number) => {
    return grades[studentId]?.id != null;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Penilaian Praktek</h2>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

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
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Mata Pelajaran"
            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            placeholder="Pilih mapel"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Select
            label="Semester"
            options={[
              { value: "1", label: "Semester 1" },
              { value: "2", label: "Semester 2" },
            ]}
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : students.length === 0 ? (
        <div className="glass-card p-8 text-center text-gray-500 dark:text-gray-400">
          Pilih kelas dan mapel untuk menampilkan daftar siswa.
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-full">
              <thead>
                <tr className="glass-table-header border-b border-white/20 dark:border-white/10">
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-12">No</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Nama Siswa</th>
                  <th className="px-4 py-3.5 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 w-24">Praktek 1</th>
                  <th className="px-4 py-3.5 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 w-24">Praktek 2</th>
                  <th className="px-4 py-3.5 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 w-32">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const grade = grades[student.id] || {
                    studentId: student.id,
                    practice1: null,
                    practice2: null,
                  };
                  const isEditing = editing[student.id] || !hasGrade(student.id);

                  return (
                    <tr key={student.id} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0">
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 font-medium">{student.name}</td>
                      {(["practice1", "practice2"] as const).map((field) => (
                        <td key={field} className="px-2 py-3.5 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={grade[field] ?? ""}
                              onChange={(e) =>
                                handleGradeChange(
                                  student.id,
                                  field,
                                  e.target.value
                                )
                              }
                              className="w-16 px-2 py-1 rounded-lg text-center text-sm bg-white/50 dark:bg-white/[0.06] backdrop-blur-lg border border-white/30 dark:border-white/10 text-gray-900 dark:text-gray-100"
                              placeholder="-"
                            />
                          ) : (
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {grade[field] ?? "-"}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3.5 text-center">
                        {isEditing ? (
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="sm"
                              onClick={() => handleSave(student.id)}
                              loading={saving}
                            >
                              Simpan
                            </Button>
                            {hasGrade(student.id) && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleCancel(student.id)}
                              >
                                Batal
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEdit(student.id)}
                          >
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
