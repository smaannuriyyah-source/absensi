"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import Tabs from "@/components/ui/Tabs";
import { Search, ArrowUpDown, Upload, Plus, Edit2, Trash2, Users, ArrowUp, ArrowDown } from "lucide-react";

interface Student {
  id: number;
  name: string;
  classId: number;
  className?: string;
}

interface Class {
  id: number;
  name: string;
}

type SortField = "name" | "class";
type SortDirection = "asc" | "desc";

const tabs = [
  { id: "data", label: "Data Siswa", icon: Users },
  { id: "import", label: "Import Excel", icon: Upload },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState("data");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Add form
  const [newName, setNewName] = useState("");
  const [newClassId, setNewClassId] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit form
  const [editName, setEditName] = useState("");
  const [editClassId, setEditClassId] = useState("");

  // Import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<{ name: string; className: string }[]>([]);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

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

  const fetchStudents = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/students?classId=${selectedClass}`);
      const data = await res.json();
      setStudents(data);
    } catch {
      setAlert({ type: "error", message: "Gagal memuat data siswa" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, classId: parseInt(newClassId) }),
      });

      if (!res.ok) {
        const data = await res.json();
        setAlert({ type: "error", message: data.error || "Gagal menambah siswa" });
        return;
      }

      setAlert({ type: "success", message: "Siswa berhasil ditambahkan!" });
      setNewName("");
      setNewClassId("");
      setShowAdd(false);
      fetchStudents();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEdit) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/students/${showEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, classId: parseInt(editClassId) }),
      });

      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal mengupdate siswa" });
        return;
      }

      setAlert({ type: "success", message: "Siswa berhasil diupdate!" });
      setShowEdit(null);
      fetchStudents();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal menghapus siswa" });
        return;
      }
      setAlert({ type: "success", message: "Siswa berhasil dihapus!" });
      fetchStudents();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const XLSX = await import("xlsx");
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<{ Nama?: string; nama?: string; Kelas?: string; kelas?: string }>(sheet);

      const parsed = jsonData.map((row) => ({
        name: row.Nama || row.nama || "",
        className: row.Kelas || row.kelas || "",
      })).filter((r) => r.name);

      setImportData(parsed);
    } catch {
      setAlert({ type: "error", message: "Gagal membaca file Excel" });
    }
  };

  const handleImport = async () => {
    if (importData.length === 0) return;
    setImportLoading(true);

    try {
      const res = await fetch("/api/students/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: importData }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({ type: "error", message: data.error || "Gagal import" });
        return;
      }

      setAlert({
        type: "success",
        message: data.message || `Berhasil import ${data.imported} siswa!`,
      });
      setImportData([]);
      setActiveTab("data");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchStudents();
      fetchClasses();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setImportLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    let result = students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name, "id");
      } else if (sortField === "class") {
        comparison = (a.className || "").localeCompare(b.className || "", "id");
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [students, search, sortField, sortDirection]);

  const classOptions = [
    { value: "", label: "Semua Kelas" },
    ...classes.map((c) => ({ value: c.id, label: c.name })),
  ];

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortDirection === "asc" 
      ? <ArrowUp size={14} className="text-primary-600 dark:text-primary-400" />
      : <ArrowDown size={14} className="text-primary-600 dark:text-primary-400" />;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Siswa</h2>
        <div className="flex gap-2">
          <Button onClick={() => { setShowAdd(true); setNewClassId(selectedClass); }}>
            <Plus size={16} className="mr-1.5" />
            Tambah Siswa
          </Button>
        </div>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} accentColor="green" />

      {/* Tab: Data Siswa */}
      {activeTab === "data" && (
        <>
          {/* Filters */}
          <div className="glass-card p-4 mb-4 flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Select
                label="Pilih Kelas"
                options={classOptions}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cari Siswa
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ketik nama siswa..."
                  className="input-field pr-10"
                />
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => handleSort("name")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  sortField === "name"
                    ? "border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <SortIcon field="name" />
                <span>Nama</span>
              </button>
              <button
                onClick={() => handleSort("class")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  sortField === "class"
                    ? "border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <SortIcon field="class" />
                <span>Kelas</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="min-w-full">
                <thead>
                  <tr className="glass-table-header border-b border-white/20 dark:border-white/10">
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-12">No</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                      >
                        Nama
                        <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="px-4 py-3.5 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredAndSortedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        {search ? "Tidak ada siswa ditemukan" : "Belum ada siswa di kelas ini"}
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedStudents.map((student, index) => (
                      <tr key={student.id} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0 hover:bg-white/10 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 font-medium">{student.name}</td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setShowEdit(student);
                                setEditName(student.name);
                                setEditClassId(student.classId.toString());
                              }}
                              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredAndSortedStudents.length > 0 && (
              <div className="px-4 py-3 border-t border-white/10 dark:border-white/5 text-sm text-gray-500 dark:text-gray-400">
                Menampilkan {filteredAndSortedStudents.length} dari {students.length} siswa
              </div>
            )}
          </div>
        </>
      )}

      {/* Tab: Import Excel */}
      {activeTab === "import" && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Import Siswa dari Excel
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Format Excel: kolom <strong>Nama</strong> dan <strong>Kelas</strong>.
            Kelas akan dibuat otomatis jika belum ada.
          </p>
          
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="w-full text-sm text-gray-500 dark:text-gray-400 
                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                file:text-sm file:font-semibold 
                file:bg-primary-50 file:text-primary-700 
                dark:file:bg-primary-900/30 dark:file:text-primary-300
                hover:file:bg-primary-100 dark:hover:file:bg-primary-800/40"
            />
          </div>

          {importData.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Preview ({importData.length} siswa):
              </p>
              <div className="max-h-48 overflow-y-auto border border-white/20 dark:border-white/10 rounded-lg scrollbar-thin">
                <table className="w-full text-sm">
                  <thead className="glass-table-header sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">No</th>
                      <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Nama</th>
                      <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Kelas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.slice(0, 20).map((item, i) => (
                      <tr key={i} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0">
                        <td className="px-3 py-1 text-gray-900 dark:text-gray-100">{i + 1}</td>
                        <td className="px-3 py-1 text-gray-900 dark:text-gray-100">{item.name}</td>
                        <td className="px-3 py-1 text-gray-900 dark:text-gray-100">{item.className}</td>
                      </tr>
                    ))}
                    {importData.length > 20 && (
                      <tr>
                        <td colSpan={3} className="px-3 py-1 text-gray-500 dark:text-gray-400 text-center">
                          ... dan {importData.length - 20} lainnya
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => { setImportData([]); setActiveTab("data"); }}
            >
              Batal
            </Button>
            <Button
              onClick={handleImport}
              loading={importLoading}
              disabled={importData.length === 0}
            >
              <Upload size={16} className="mr-1.5" />
              Import {importData.length > 0 && `(${importData.length})`}
            </Button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Tambah Siswa">
        <form onSubmit={handleAdd}>
          <Input
            label="Nama Siswa"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama lengkap siswa"
            required
          />
          <Select
            label="Kelas"
            options={classes.map((c) => ({ value: c.id, label: c.name }))}
            value={newClassId}
            onChange={(e) => setNewClassId(e.target.value)}
            placeholder="Pilih kelas"
            required
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>
              Batal
            </Button>
            <Button type="submit" loading={saving}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!showEdit} onClose={() => setShowEdit(null)} title="Edit Siswa">
        <form onSubmit={handleEdit}>
          <Input
            label="Nama Siswa"
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          <Select
            label="Kelas"
            options={classes.map((c) => ({ value: c.id, label: c.name }))}
            value={editClassId}
            onChange={(e) => setEditClassId(e.target.value)}
            required
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={() => setShowEdit(null)}>
              Batal
            </Button>
            <Button type="submit" loading={saving}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
