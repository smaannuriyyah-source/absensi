import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

export async function GET() {
  try {
    await requireAdmin();
    const today = new Date().toISOString().split("T")[0];

    const [totalTeachers, totalClasses, totalStudents, activeYear] = await Promise.all([
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.student.count(),
      prisma.academicYear.findFirst({ where: { isActive: true } }),
    ]);

    let todayJournals = 0;
    if (activeYear) {
      todayJournals = await prisma.teachingJournal.count({
        where: { date: today, academicYearId: activeYear.id },
      });
    }

    return NextResponse.json({ totalTeachers, totalClasses, totalStudents, todayJournals });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("GET stats error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
