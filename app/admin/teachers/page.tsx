"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Table from "@/components/ui/Table";
import Alert from "@/components/ui/Alert";

interface Teacher {
  id: number;
  username: string;
  accessCode: string;
  name: string;
  profileComplete: boolean;
  subjects?: { id: number; name: string }[];
}

interface Subject {
  id: number;
  name: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState<Teacher | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Add form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState("");

  // Edit form
  const [editName, setEditName] = useState("");
  const [editSubjects, setEditSubjects] = useState<number[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  // New access code display
  const [newAccessCode, setNewAccessCode] = useState("");

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  // Refresh data when page is focused (e.g., after teacher updates profile)
  useEffect(() => {
    const handleFocus = () => fetchTeachers();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      setTeachers(data);
    } catch {
      setAlert({ type: "error", message: "Gagal memuat data guru" });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setAllSubjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          name: newName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({ type: "error", message: data.error || "Gagal menambah guru" });
        return;
      }

      setCreatedCode(data.accessCode);
      setAlert({ type: "success", message: "Guru berhasil ditambahkan!" });
      setNewUsername("");
      setNewPassword("");
      setNewName("");
      fetchTeachers();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showDetail) return;
    setEditLoading(true);

    try {
      const res = await fetch(`/api/teachers/${showDetail.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          subjectIds: editSubjects,
        }),
      });

      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal mengupdate guru" });
        return;
      }

      setAlert({ type: "success", message: "Guru berhasil diupdate!" });
      setShowDetail(null);
      fetchTeachers();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleRegenerateAccessCode = async (teacherId: number) => {
    try {
      const res = await fetch(`/api/teachers/${teacherId}/access-code`, {
        method: "PUT",
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({ type: "error", message: data.error || "Gagal mengubah kode akses" });
        return;
      }

      setNewAccessCode(data.accessCode);
      setAlert({ type: "success", message: "Kode akses berhasil diubah!" });
      fetchTeachers();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus guru ini?")) return;

    try {
      const res = await fetch(`/api/teachers/${id}`, { method: "DELETE" });

      if (!res.ok) {
        setAlert({ type: "error", message: "Gagal menghapus guru" });
        return;
      }

      setAlert({ type: "success", message: "Guru berhasil dihapus!" });
      fetchTeachers();
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan" });
    }
  };

  const toggleEditSubject = (id: number) => {
    setEditSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const openDetail = (teacher: Teacher) => {
    setShowDetail(teacher);
    setEditName(teacher.name || "");
    setEditSubjects(teacher.subjects?.map((s) => s.id) || []);
    setNewAccessCode("");
  };

  const columns = [
    { key: "name", header: "Nama" },
    { key: "username", header: "Username" },
    {
      key: "subjects",
      header: "Mapel",
      render: (item: Teacher) => (
        <div className="flex flex-wrap gap-1">
          {item.subjects && item.subjects.length > 0 ? (
            item.subjects.map((s) => (
              <span
                key={s.id}
                className="glass-badge glass-badge-info"
              >
                {s.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">Belum ada</span>
          )}
        </div>
      ),
    },
    {
      key: "accessCode",
      header: "Kode Akses",
      render: (item: Teacher) => (
        <code className="bg-white/40 dark:bg-white/[0.06] backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-lg px-2 py-1 text-sm font-mono text-gray-900 dark:text-gray-100">
          {item.accessCode}
        </code>
      ),
    },
    {
      key: "profileComplete",
      header: "Profil",
      render: (item: Teacher) => (
        <span
          className={`glass-badge ${
            item.profileComplete
              ? "glass-badge-success"
              : "glass-badge-danger"
          }`}
        >
          {item.profileComplete ? "Lengkap" : "Belum"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (item: Teacher) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openDetail(item)}>
            Detail
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Guru</h2>
        <Button onClick={() => { setShowAdd(true); setCreatedCode(""); }}>
          + Tambah Guru
        </Button>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      <div className="glass-card">
        <Table columns={columns} data={teachers} loading={loading} emptyMessage="Belum ada data guru" />
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAdd}
        onClose={() => { setShowAdd(false); setCreatedCode(""); }}
        title="Tambah Guru"
      >
        {createdCode ? (
          <div className="text-center py-4">
            <div className="text-green-600 dark:text-green-400 text-5xl mb-4">&#10003;</div>
            <p className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Guru berhasil ditambahkan!</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Kode akses guru:</p>
            <div className="bg-white/40 dark:bg-white/[0.06] backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-lg p-4 mb-4">
              <code className="text-3xl font-bold tracking-widest text-blue-600 dark:text-blue-400">
                {createdCode}
              </code>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Simpan kode akses ini untuk diberikan kepada guru.
            </p>
            <Button onClick={() => { setShowAdd(false); setCreatedCode(""); }}>
              Tutup
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAdd}>
            <Input
              label="Nama"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama guru"
              required
            />
            <Input
              label="Username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Username untuk login"
              required
            />
            <Input
              label="Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Kode akses (6 digit) akan di-generate otomatis setelah disimpan.
            </p>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>
                Batal
              </Button>
              <Button type="submit" loading={addLoading}>
                Simpan
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={!!showDetail}
        onClose={() => { setShowDetail(null); setNewAccessCode(""); }}
        title="Detail Guru"
      >
        {showDetail && (
          <div>
            <form onSubmit={handleEdit}>
              <Input
                label="Nama"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              <Input
                label="Username"
                type="text"
                value={showDetail.username}
                disabled
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kode Akses
                </label>
                <div className="flex items-center gap-2">
                  <code className="bg-white/40 dark:bg-white/[0.06] backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-lg px-3 py-2 text-lg font-mono flex-1 text-gray-900 dark:text-gray-100">
                    {newAccessCode || showDetail.accessCode}
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="warning"
                    onClick={() => handleRegenerateAccessCode(showDetail.id)}
                  >
                    Ubah
                  </Button>
                </div>
                {newAccessCode && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Kode akses baru telah di-generate!
                  </p>
                )}
              </div>

              {/* Subject Management */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mata Pelajaran yang Diajar
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-white/20 dark:border-white/10 rounded-lg p-3">
                  {allSubjects.map((subject) => (
                    <label
                      key={subject.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${
                        editSubjects.includes(subject.id)
                          ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={editSubjects.includes(subject.id)}
                        onChange={() => toggleEditSubject(subject.id)}
                        className="rounded"
                      />
                      <span className="text-gray-900 dark:text-gray-100">{subject.name}</span>
                    </label>
                  ))}
                  {allSubjects.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">
                      Belum ada mata pelajaran
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { setShowDetail(null); setNewAccessCode(""); }}
                >
                  Tutup
                </Button>
                <Button type="submit" loading={editLoading}>
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
