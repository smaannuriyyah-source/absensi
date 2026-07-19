"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";

interface Subject {
  id: number;
  name: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<Subject | null>(null);
  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data);
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
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setAlert({ type: "error", message: data.error || "Gagal menambah mapel" });
        return;
      }

      setAlert({ type: "success", message: "Mapel berhasil ditambahkan!" });
      setName("");
      setShowAdd(false);
      fetchSubjects();
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
      const res = await fetch(`/api/subjects/${showEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });

      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal mengupdate mapel" });
        return;
      }

      setAlert({ type: "success", message: "Mapel berhasil diupdate!" });
      setShowEdit(null);
      fetchSubjects();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus mapel ini?")) return;
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal menghapus mapel" });
        return;
      }
      setAlert({ type: "success", message: "Mapel berhasil dihapus!" });
      fetchSubjects();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Mata Pelajaran</h2>
        <Button onClick={() => setShowAdd(true)}>+ Tambah Mapel</Button>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-full">
            <thead>
              <tr className="glass-table-header border-b border-white/20 dark:border-white/10">
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">No</th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Nama Mapel</th>
                <th className="px-4 py-3.5 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={subject.id} className="glass-table-row border-b border-white/10 dark:border-white/5 last:border-b-0">
                  <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400 font-medium">{subject.name}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setShowEdit(subject);
                          setEditName(subject.name);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(subject.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada mata pelajaran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Tambah Mapel">
        <form onSubmit={handleAdd}>
          <Input
            label="Nama Mata Pelajaran"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Matematika"
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
      <Modal
        isOpen={!!showEdit}
        onClose={() => setShowEdit(null)}
        title="Edit Mapel"
      >
        <form onSubmit={handleEdit}>
          <Input
            label="Nama Mata Pelajaran"
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
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
