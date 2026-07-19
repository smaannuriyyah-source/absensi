export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/dal";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const classId = req.nextUrl.searchParams.get("classId");
    const subjectId = req.nextUrl.searchParams.get("subjectId");
    const date = req.nextUrl.searchParams.get("date");

    const where: any = {};
    if (classId) where.classId = parseInt(classId);
    if (subjectId) where.subjectId = parseInt(subjectId);
    if (date) where.date = date;
    if (session.role === "teacher") where.teacherId = session.id;

    const records = await prisma.attendance.findMany({
      where,
      include: {
        student: { select: { name: true } },
        class: { select: { name: true } },
        subject: { select: { name: true } },
      },
    });
    const result = records.map((r) => ({
      id: r.id, studentId: r.studentId, studentName: r.student.name,
      className: r.class.name, subjectName: r.subject.name,
      date: r.date, status: r.status, evidence: r.evidence,
    }));
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
      await prisma.attendance.deleteMany({
        where: { classId: first.classId, subjectId: first.subjectId, date: first.date, teacherId: session.id },
      });
    }

    await prisma.attendance.createMany({
      data: records.map((r: any) => ({
        studentId: r.studentId, teacherId: session.id, subjectId: r.subjectId,
        classId: r.classId, date: r.date, status: r.status, evidence: r.evidence || null,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("POST attendance error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
