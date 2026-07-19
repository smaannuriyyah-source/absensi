export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { academicYears } from "@/lib/schema";
import { requireAdmin, requireAuth } from "@/lib/dal";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    await requireAuth();
    const years = await db.select().from(academicYears);
    return NextResponse.json(years);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("GET academic years error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { year } = await req.json();
    if (!year) return NextResponse.json({ error: "Tahun ajaran wajib diisi" }, { status: 400 });

    const existing = await db.select().from(academicYears).where(eq(academicYears.year, year)).limit(1);
    if (existing.length > 0) return NextResponse.json({ error: "Tahun ajaran sudah ada" }, { status: 400 });

    const result = await db.insert(academicYears).values({ year, isActive: false }).returning();
    return NextResponse.json(result[0]);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST academic year error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
