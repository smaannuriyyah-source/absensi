export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teachingJournals, academicYears, teachers, classes, subjects } from "@/lib/schema";
import { requireAdmin } from "@/lib/dal";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const classId = req.nextUrl.searchParams.get("classId");
    const date = req.nextUrl.searchParams.get("date");
    if (!classId || !date) return NextResponse.json({ error: "Kelas dan tanggal wajib diisi" }, { status: 400 });

    const activeYear = await db.select().from(academicYears).where(eq(academicYears.isActive, true)).limit(1).then(r => r[0]);
    const conditions: any[] = [eq(teachingJournals.classId, parseInt(classId)), eq(teachingJournals.date, date)];
    if (activeYear) conditions.push(eq(teachingJournals.academicYearId, activeYear.id));

    const journals = await db
      .select({
        id: teachingJournals.id,
        teacherName: teachers.name,
        className: classes.name,
        subjectName: subjects.name,
        hour: teachingJournals.hour,
        material: teachingJournals.material,
        date: teachingJournals.date,
      })
      .from(teachingJournals)
      .innerJoin(teachers, eq(teachingJournals.teacherId, teachers.id))
      .innerJoin(classes, eq(teachingJournals.classId, classes.id))
      .innerJoin(subjects, eq(teachingJournals.subjectId, subjects.id))
      .where(and(...conditions));

    return NextResponse.json(journals);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("GET journals rekap error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
