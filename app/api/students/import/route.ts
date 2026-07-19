export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { students, classes } from "@/lib/schema";
import { requireAdmin } from "@/lib/dal";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { students: importData } = await req.json();
    if (!importData || !Array.isArray(importData) || importData.length === 0) {
      return NextResponse.json({ error: "Data siswa tidak valid" }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;

    for (const item of importData) {
      const { name, className } = item;
      if (!name) continue;

      let classRecord = await db.select().from(classes).where(eq(classes.name, className)).limit(1).then(r => r[0]);
      if (!classRecord) {
        const newClass = await db.insert(classes).values({ name: className }).returning();
        classRecord = newClass[0];
      }

      const existing = await db.select().from(students).where(
        and(eq(students.name, name), eq(students.classId, classRecord.id))
      ).limit(1);
      if (existing.length > 0) { skipped++; continue; }

      await db.insert(students).values({ name, classId: classRecord.id });
      imported++;
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      message: skipped > 0
        ? `Berhasil import ${imported} siswa. ${skipped} siswa dilewati (duplikat).`
        : `Berhasil import ${imported} siswa.`,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("Import students error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
