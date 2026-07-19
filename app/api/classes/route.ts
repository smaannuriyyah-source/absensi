export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/dal";

export async function GET() {
  try {
    await requireAuth();
    const allClasses = await prisma.class.findMany();
    return NextResponse.json(allClasses);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("GET classes error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Nama kelas wajib diisi" }, { status: 400 });
    const result = await prisma.class.create({ data: { name } });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST classes error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
