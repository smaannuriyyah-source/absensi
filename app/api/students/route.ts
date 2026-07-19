export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { students, classes } from "@/lib/schema";
import { requireAdmin, requireAuth } from "@/lib/dal";
import { eq, SQL } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const classId = req.nextUrl.searchParams.get("classId");

    const whereClause = classId ? eq(students.classId, parseInt(classId)) : undefined;

    const result = await db
      .select({ id: students.id, name: students.name, classId: students.classId, className: classes.name })
      .from(students)
      .innerJoin(classes, eq(students.classId, classes.id))
      .where(whereClause);

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("GET students error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { name, classId } = await req.json();
    if (!name || !classId) return NextResponse.json({ error: "Nama dan kelas wajib diisi" }, { status: 400 });
    const result = await db.insert(students).values({ name, classId: parseInt(classId) }).returning();
    return NextResponse.json(result[0]);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST students error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
