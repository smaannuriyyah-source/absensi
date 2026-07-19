export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teachers, classes, students, academicYears, teachingJournals } from "@/lib/schema";
import { requireAdmin } from "@/lib/dal";
import { eq, and, count } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const today = new Date().toISOString().split("T")[0];

    const [totalTeachers, totalClasses, totalStudents] = await Promise.all([
      db.select({ value: count() }).from(teachers).then(r => r[0].value),
      db.select({ value: count() }).from(classes).then(r => r[0].value),
      db.select({ value: count() }).from(students).then(r => r[0].value),
    ]);

    const activeYear = await db.select().from(academicYears).where(eq(academicYears.isActive, true)).limit(1).then(r => r[0]);

    let todayJournals = 0;
    if (activeYear) {
      todayJournals = await db.select({ value: count() }).from(teachingJournals).where(
        and(eq(teachingJournals.date, today), eq(teachingJournals.academicYearId, activeYear.id))
      ).then(r => r[0].value);
    }

    return NextResponse.json({ totalTeachers, totalClasses, totalStudents, todayJournals });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("GET stats error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
