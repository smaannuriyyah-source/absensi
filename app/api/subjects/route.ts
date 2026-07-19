import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/dal";

export async function GET() {
  try {
    await requireAuth();
    const allSubjects = await prisma.subject.findMany();
    return NextResponse.json(allSubjects);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("GET subjects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Nama mapel wajib diisi" }, { status: 400 });
    const result = await prisma.subject.create({ data: { name } });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST subjects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
