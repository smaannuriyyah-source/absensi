export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance, students, classes, subjects } from "@/lib/schema";
import { requireAuth } from "@/lib/dal";
import { eq, and, SQL } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const classId = req.nextUrl.searchParams.get("classId");
    const subjectId = req.nextUrl.searchParams.get("subjectId");
    const date = req.nextUrl.searchParams.get("date");

    const conditions: SQL[] = [];
    if (classId) conditions.push(eq(attendance.classId, parseInt(classId)));
    if (subjectId) conditions.push(eq(attendance.subjectId, parseInt(subjectId)));
    if (date) conditions.push(eq(attendance.date, date));
    if (session.role === "teacher") conditions.push(eq(attendance.teacherId, session.id));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: attendance.id,
        studentId: attendance.studentId,
        studentName: students.name,
        className: classes.name,
        subjectName: subjects.name,
        date: attendance.date,
        status: attendance.status,
        evidence: attendance.evidence,
      })
      .from(attendance)
      .innerJoin(students, eq(attendance.studentId, students.id))
      .innerJoin(classes, eq(attendance.classId, classes.id))
      .innerJoin(subjects, eq(attendance.subjectId, subjects.id))
      .where(whereClause);

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("GET attendance error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { records } = await req.json();
    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: "Data absensi tidak valid" }, { status: 400 });
    }

    for (const record of records) {
      if ((record.status === "sakit" || record.status === "izin") && (!record.evidence || !record.evidence.trim())) {
        record.status = "alpha";
      }
    }

    if (records.length > 0) {
      const first = records[0];
      await db
        .delete(attendance)
        .where(
          and(
            eq(attendance.classId, first.classId),
            eq(attendance.subjectId, first.subjectId),
            eq(attendance.date, first.date),
            eq(attendance.teacherId, session.id)
          )
        );
    }

    await db.insert(attendance).values(
      records.map((r: any) => ({
        studentId: r.studentId,
        teacherId: session.id,
        subjectId: r.subjectId,
        classId: r.classId,
        date: r.date,
        status: r.status,
        evidence: r.evidence || null,
      }))
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("POST attendance error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
