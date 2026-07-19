export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getTeacherSubjects } from "@/lib/dal";

export async function GET() {
  try {
    const session = await requireAuth();
    const teacher = await prisma.teacher.findUnique({ where: { id: session.id } });
    if (!teacher) return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    const subjects = await getTeacherSubjects(session.id);
    return NextResponse.json({ ...teacher, passwordHash: undefined, subjects });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("GET profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { name, subjectIds } = await req.json();
    if (!name) return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    if (!subjectIds || subjectIds.length === 0) return NextResponse.json({ error: "Pilih minimal 1 mata pelajaran" }, { status: 400 });

    await prisma.teacher.update({ where: { id: session.id }, data: { name, profileComplete: true } });
    await prisma.teacherSubject.deleteMany({ where: { teacherId: session.id } });
    await prisma.teacherSubject.createMany({
      data: subjectIds.map((subjectId: number) => ({ teacherId: session.id, subjectId })),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("PUT profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
