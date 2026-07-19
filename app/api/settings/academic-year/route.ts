import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/dal";

export async function GET() {
  try {
    await requireAuth();
    const years = await prisma.academicYear.findMany();
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

    const existing = await prisma.academicYear.findFirst({ where: { year } });
    if (existing) return NextResponse.json({ error: "Tahun ajaran sudah ada" }, { status: 400 });

    const result = await prisma.academicYear.create({ data: { year, isActive: false } });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST academic year error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
