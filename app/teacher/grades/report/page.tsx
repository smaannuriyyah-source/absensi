"use client";

import { useEffect, useState } from "react";
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

interface KnowledgeGrade {
  studentId: number;
  uh1: number | null;
  uh2: number | null;
  uh3: number | null;
  uts: number | null;
  uas: number | null;
}

interface PracticeGrade {
  studentId: number;
  practice1: number | null;
  practice2: number | null;
}

export default function GradeReportPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [students, setStudents] = useState<Student[]>([]);
  const [knowledgeGrades, setKnowledgeGrades] = useState<Record<number, KnowledgeGrade>>({});
  const [practiceGrades, setPracticeGrades] = useState<Record<number, PracticeGrade>>({});
  const [loading, setLoading] = useState(false);
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

  const loadReport = async () => {
    if (!selectedClass || !selectedSubject) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/grades/knowledge?classId=${selectedClass}&subjectId=${selectedSubject}&semester=${selectedSemester}`
      );
      const data = await res.json();
      setStudents(data.students || []);

      const kMap: Record<number, KnowledgeGrade> = {};
      (data.grades || []).forEach((g: KnowledgeGrade) => {
        kMap[g.studentId] = g;
      });
      setKnowledgeGrades(kMap);

      const res2 = await fetch(
        `/api/grades/practice?classId=${selectedClass}&subjectId=${selectedSubject}&semester=${selectedSemester}`
      );
      const data2 = await res2.json();

      const pMap: Record<number, PracticeGrade> = {};
      (data2.grades || []).forEach((g: PracticeGrade) => {
        pMap[g.studentId] = g;
      });
      setPracticeGrades(pMap);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      loadReport();
    }
  }, [selectedClass, selectedSubject, selectedSemester]);

  const calcKnowledgeAvg = (g: KnowledgeGrade | undefined) => {
    if (!g) return "-";
    const vals = [g.uh1, g.uh2, g.uh3, g.uts, g.uas].filter(
      (v) => v !== null && v !== undefined
    ) as number[];
    if (vals.length === 0) return "-";
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return avg.toFixed(1);
  };

  const calcPracticeAvg = (g: PracticeGrade | undefined) => {
    if (!g) return "-";
    const vals = [g.practice1, g.practice2].filter(
      (v) => v !== null && v !== undefined
    ) as number[];
    if (vals.length === 0) return "-";
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return avg.toFixed(1);
  };

  const getPredicate = (avg: string) => {
    if (avg === "-") return "-";
    const n = parseFloat(avg);
    if (n >= 90) return "A";
    if (n >= 80) return "B";
    if (n >= 70) return "C";
    if (n >= 60) return "D";
    return "E";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Laporan Penilaian</h2>

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
          Pilih kelas dan mapel untuk menampilkan laporan.
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-full">
              <thead>
                <tr className="glass-table-header border-b border-white/20 dark:border-white/10">
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Nama</th>
                  <th className="px-4 py-3.5 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-l border-white/20 dark:border-white/10" colSpan={7}>Pengetahuan</th>
                  <th className="px-4 py-3.5 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-l border-white/20 dark:border-white/10" colSpan={4}>Praktek</th>
                </tr>
                <tr className="glass-table-header border-b border-white/20 dark:border-white/10">
                  {["UH1", "UH2", "UH3", "UTS", "UAS", "Rata", "Pred"].map((h) => (
                    <th key={h} className="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-l border-white/20 dark:border-white/10">{h}</th>
                  ))}
                  {["P1", "P2", "Rata", "Pred"].map((h) => (
                    <th key={h} className="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-l border-white/20 dark:border-white/10">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const k = knowledgeGrades[student.id];
                  const p = practiceGrades[student.id];
                  const kAvg = calcKnowledgeAvg(k);
                  const pAvg = calcPracticeAvg(p);

                  return (
                    <tr key={student.id} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0">
                      <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 font-medium">{student.name}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5">{k?.uh1 ?? "-"}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5">{k?.uh2 ?? "-"}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5">{k?.uh3 ?? "-"}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5">{k?.uts ?? "-"}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5">{k?.uas ?? "-"}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5 font-medium">{kAvg}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5 font-medium">{getPredicate(kAvg)}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5">{p?.practice1 ?? "-"}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5">{p?.practice2 ?? "-"}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5 font-medium">{pAvg}</td>
                      <td className="px-2 py-3.5 text-sm text-gray-600 dark:text-gray-400 text-center border-l border-white/10 dark:border-white/5 font-medium">{getPredicate(pAvg)}</td>
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
