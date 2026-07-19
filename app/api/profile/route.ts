export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teachers, teacherSubjects, subjects } from "@/lib/schema";
import { requireAuth, getTeacherSubjects } from "@/lib/dal";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await requireAuth();
    const teacher = await db.select().from(teachers).where(eq(teachers.id, session.id)).limit(1).then(r => r[0]);
    if (!teacher) return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    const subjectList = await getTeacherSubjects(session.id);
    const { passwordHash, ...teacherData } = teacher;
    return NextResponse.json({ ...teacherData, subjects: subjectList });
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

    await db.update(teachers).set({ name, profileComplete: true }).where(eq(teachers.id, session.id));
    await db.delete(teacherSubjects).where(eq(teacherSubjects.teacherId, session.id));
    await db.insert(teacherSubjects).values(
      subjectIds.map((subjectId: number) => ({ teacherId: session.id, subjectId }))
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("PUT profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
