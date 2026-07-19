export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const classId = req.nextUrl.searchParams.get("classId");
    const date = req.nextUrl.searchParams.get("date");
    if (!classId || !date) return NextResponse.json({ error: "Kelas dan tanggal wajib diisi" }, { status: 400 });

    const activeYear = await prisma.academicYear.findFirst({ where: { isActive: true } });
    const where: any = { classId: parseInt(classId), date };
    if (activeYear) where.academicYearId = activeYear.id;

    const journals = await prisma.teachingJournal.findMany({
      where,
      include: {
        teacher: { select: { name: true } },
        class: { select: { name: true } },
        subject: { select: { name: true } },
      },
    });
    const result = journals.map((j) => ({
      id: j.id, teacherName: j.teacher.name, className: j.class.name,
      subjectName: j.subject.name, hour: j.hour, material: j.material, date: j.date,
    }));
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("GET journals rekap error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
