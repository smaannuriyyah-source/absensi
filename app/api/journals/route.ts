export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/dal";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const date = req.nextUrl.searchParams.get("date");
    if (!date) return NextResponse.json({ error: "Tanggal wajib diisi" }, { status: 400 });

    const activeYear = await prisma.academicYear.findFirst({ where: { isActive: true } });
    const where: any = { teacherId: session.id, date };
    if (activeYear) where.academicYearId = activeYear.id;

    const journals = await prisma.teachingJournal.findMany({
      where,
      include: { subject: { select: { name: true } }, class: { select: { name: true } } },
    });
    const result = journals.map((j) => ({
      id: j.id, hour: j.hour, subjectId: j.subjectId, subjectName: j.subject.name,
      material: j.material, classId: j.classId, className: j.class.name, date: j.date,
    }));
    return NextResponse.json(result);
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
      const teacher = await prisma.teacher.findUnique({ where: { id: session.id } });
      if (!teacher?.profileComplete) return NextResponse.json({ error: "Lengkapi profil terlebih dahulu" }, { status: 400 });
    }

    const { classId, subjectId, date, hour, material } = await req.json();
    if (!classId || !subjectId || !date || !hour || !material) return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });

    const activeYear = await prisma.academicYear.findFirst({ where: { isActive: true } });
    if (!activeYear) return NextResponse.json({ error: "Tidak ada tahun ajaran aktif. Hubungi admin." }, { status: 400 });

    const existing = await prisma.teachingJournal.findFirst({
      where: { teacherId: session.id, date, hour, academicYearId: activeYear.id },
    });

    if (existing) {
      await prisma.teachingJournal.update({ where: { id: existing.id }, data: { classId, subjectId, material } });
      return NextResponse.json({ success: true, updated: true });
    }

    const result = await prisma.teachingJournal.create({
      data: { teacherId: session.id, classId, subjectId, date, hour, material, academicYearId: activeYear.id },
    });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("POST journals error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
