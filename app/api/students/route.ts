export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/dal";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const classId = req.nextUrl.searchParams.get("classId");
    const where = classId ? { classId: parseInt(classId) } : {};
    const allStudents = await prisma.student.findMany({
      where,
      include: { class: { select: { name: true } } },
    });
    const result = allStudents.map((s) => ({ id: s.id, name: s.name, classId: s.classId, className: s.class.name }));
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
    const result = await prisma.student.create({ data: { name, classId: parseInt(classId) } });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST students error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
