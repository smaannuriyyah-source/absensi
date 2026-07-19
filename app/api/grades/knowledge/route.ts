export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { students, academicYears, knowledgeGrades } from "@/lib/schema";
import { requireAuth } from "@/lib/dal";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const classId = req.nextUrl.searchParams.get("classId");
    const subjectId = req.nextUrl.searchParams.get("subjectId");
    const semester = req.nextUrl.searchParams.get("semester") || "1";
    if (!classId || !subjectId) return NextResponse.json({ error: "Kelas dan mapel wajib diisi" }, { status: 400 });

    const classStudents = await db.select().from(students).where(eq(students.classId, parseInt(classId)));
    const activeYear = await db.select().from(academicYears).where(eq(academicYears.isActive, true)).limit(1).then(r => r[0]);
    if (!activeYear) return NextResponse.json({ error: "Tidak ada tahun ajaran aktif. Hubungi admin." }, { status: 400 });

    const conditions = [
      eq(knowledgeGrades.classId, parseInt(classId)),
      eq(knowledgeGrades.subjectId, parseInt(subjectId)),
      eq(knowledgeGrades.academicYearId, activeYear.id),
      eq(knowledgeGrades.semester, parseInt(semester)),
    ];
    if (session.role === "teacher") conditions.push(eq(knowledgeGrades.teacherId, session.id));

    const grades = await db.select().from(knowledgeGrades).where(and(...conditions));
    return NextResponse.json({ students: classStudents, grades });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("GET knowledge grades error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { studentId, classId, subjectId, uh1, uh2, uh3, uts, uas, semester } = await req.json();
    if (!studentId || !classId || !subjectId) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

    const activeYear = await db.select().from(academicYears).where(eq(academicYears.isActive, true)).limit(1).then(r => r[0]);
    if (!activeYear) return NextResponse.json({ error: "Tidak ada tahun ajaran aktif. Hubungi admin." }, { status: 400 });
    const sem = semester || 1;

    const existing = await db.select().from(knowledgeGrades).where(
      and(
        eq(knowledgeGrades.studentId, studentId),
        eq(knowledgeGrades.teacherId, session.id),
        eq(knowledgeGrades.subjectId, subjectId),
        eq(knowledgeGrades.classId, classId),
        eq(knowledgeGrades.academicYearId, activeYear.id),
        eq(knowledgeGrades.semester, sem)
      )
    ).limit(1).then(r => r[0]);

    if (existing) {
      await db.update(knowledgeGrades).set({ uh1, uh2, uh3, uts, uas }).where(eq(knowledgeGrades.id, existing.id));
    } else {
      await db.insert(knowledgeGrades).values({
        studentId, teacherId: session.id, subjectId, classId,
        uh1, uh2, uh3, uts, uas, semester: sem, academicYearId: activeYear.id,
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("POST knowledge grades error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
