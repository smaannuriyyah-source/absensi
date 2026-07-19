export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teachingJournals, academicYears, subjects, classes, teachers } from "@/lib/schema";
import { requireAuth } from "@/lib/dal";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const date = req.nextUrl.searchParams.get("date");
    if (!date) return NextResponse.json({ error: "Tanggal wajib diisi" }, { status: 400 });

    const activeYear = await db.select().from(academicYears).where(eq(academicYears.isActive, true)).limit(1).then(r => r[0]);
    const conditions: any[] = [eq(teachingJournals.teacherId, session.id), eq(teachingJournals.date, date)];
    if (activeYear) conditions.push(eq(teachingJournals.academicYearId, activeYear.id));

    const journals = await db
      .select({
        id: teachingJournals.id,
        hour: teachingJournals.hour,
        subjectId: teachingJournals.subjectId,
        subjectName: subjects.name,
        material: teachingJournals.material,
        classId: teachingJournals.classId,
        className: classes.name,
        date: teachingJournals.date,
      })
      .from(teachingJournals)
      .innerJoin(subjects, eq(teachingJournals.subjectId, subjects.id))
      .innerJoin(classes, eq(teachingJournals.classId, classes.id))
      .where(and(...conditions));

    return NextResponse.json(journals);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("GET journals error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (session.role === "teacher") {
      const teacher = await db.select().from(teachers).where(eq(teachers.id, session.id)).limit(1).then(r => r[0]);
      if (!teacher?.profileComplete) return NextResponse.json({ error: "Lengkapi profil terlebih dahulu" }, { status: 400 });
    }

    const { classId, subjectId, date, hour, material } = await req.json();
    if (!classId || !subjectId || !date || !hour || !material) return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });

    const activeYear = await db.select().from(academicYears).where(eq(academicYears.isActive, true)).limit(1).then(r => r[0]);
    if (!activeYear) return NextResponse.json({ error: "Tidak ada tahun ajaran aktif. Hubungi admin." }, { status: 400 });

    const existing = await db.select().from(teachingJournals).where(
      and(
        eq(teachingJournals.teacherId, session.id),
        eq(teachingJournals.date, date),
        eq(teachingJournals.hour, hour),
        eq(teachingJournals.academicYearId, activeYear.id)
      )
    ).limit(1).then(r => r[0]);

    if (existing) {
      await db.update(teachingJournals).set({ classId, subjectId, material }).where(eq(teachingJournals.id, existing.id));
      return NextResponse.json({ success: true, updated: true });
    }

    const result = await db.insert(teachingJournals).values({
      teacherId: session.id, classId, subjectId, date, hour, material, academicYearId: activeYear.id,
    }).returning();
    return NextResponse.json(result[0]);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("POST journals error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
