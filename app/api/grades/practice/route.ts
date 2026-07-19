export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { students, academicYears, practiceGrades } from "@/lib/schema";
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
      eq(practiceGrades.classId, parseInt(classId)),
      eq(practiceGrades.subjectId, parseInt(subjectId)),
      eq(practiceGrades.academicYearId, activeYear.id),
      eq(practiceGrades.semester, parseInt(semester)),
    ];
    if (session.role === "teacher") conditions.push(eq(practiceGrades.teacherId, session.id));

    const grades = await db.select().from(practiceGrades).where(and(...conditions));
    return NextResponse.json({ students: classStudents, grades });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("GET practice grades error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { studentId, classId, subjectId, practice1, practice2, semester } = await req.json();
    if (!studentId || !classId || !subjectId) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

    const activeYear = await db.select().from(academicYears).where(eq(academicYears.isActive, true)).limit(1).then(r => r[0]);
    if (!activeYear) return NextResponse.json({ error: "Tidak ada tahun ajaran aktif. Hubungi admin." }, { status: 400 });
    const sem = semester || 1;

    const existing = await db.select().from(practiceGrades).where(
      and(
        eq(practiceGrades.studentId, studentId),
        eq(practiceGrades.teacherId, session.id),
        eq(practiceGrades.subjectId, subjectId),
        eq(practiceGrades.classId, classId),
        eq(practiceGrades.academicYearId, activeYear.id),
        eq(practiceGrades.semester, sem)
      )
    ).limit(1).then(r => r[0]);

    if (existing) {
      await db.update(practiceGrades).set({ practice1, practice2 }).where(eq(practiceGrades.id, existing.id));
    } else {
      await db.insert(practiceGrades).values({
        studentId, teacherId: session.id, subjectId, classId,
        practice1, practice2, semester: sem, academicYearId: activeYear.id,
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("POST practice grades error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
