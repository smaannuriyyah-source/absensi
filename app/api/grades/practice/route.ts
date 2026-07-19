import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/dal";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const classId = req.nextUrl.searchParams.get("classId");
    const subjectId = req.nextUrl.searchParams.get("subjectId");
    const semester = req.nextUrl.searchParams.get("semester") || "1";
    if (!classId || !subjectId) return NextResponse.json({ error: "Kelas dan mapel wajib diisi" }, { status: 400 });

    const classStudents = await prisma.student.findMany({ where: { classId: parseInt(classId) } });
    const activeYear = await prisma.academicYear.findFirst({ where: { isActive: true } });
    if (!activeYear) return NextResponse.json({ error: "Tidak ada tahun ajaran aktif. Hubungi admin." }, { status: 400 });

    const where: any = {
      classId: parseInt(classId), subjectId: parseInt(subjectId),
      academicYearId: activeYear.id, semester: parseInt(semester),
    };
    if (session.role === "teacher") where.teacherId = session.id;

    const grades = await prisma.practiceGrade.findMany({ where });
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

    const activeYear = await prisma.academicYear.findFirst({ where: { isActive: true } });
    if (!activeYear) return NextResponse.json({ error: "Tidak ada tahun ajaran aktif. Hubungi admin." }, { status: 400 });
    const sem = semester || 1;

    const existing = await prisma.practiceGrade.findFirst({
      where: { studentId, teacherId: session.id, subjectId, classId, academicYearId: activeYear.id, semester: sem },
    });

    if (existing) {
      await prisma.practiceGrade.update({ where: { id: existing.id }, data: { practice1, practice2 } });
    } else {
      await prisma.practiceGrade.create({
        data: { studentId, teacherId: session.id, subjectId, classId, practice1, practice2, semester: sem, academicYearId: activeYear.id },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("POST practice grades error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
