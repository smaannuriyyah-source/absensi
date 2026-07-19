export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

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

      let classRecord = await prisma.class.findFirst({ where: { name: className } });
      if (!classRecord) {
        classRecord = await prisma.class.create({ data: { name: className } });
      }

      const existing = await prisma.student.findFirst({
        where: { name, classId: classRecord.id },
      });
      if (existing) { skipped++; continue; }

      await prisma.student.create({ data: { name, classId: classRecord.id } });
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
