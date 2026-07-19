export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subjects } from "@/lib/schema";
import { requireAdmin, requireAuth } from "@/lib/dal";

export async function GET() {
  try {
    await requireAuth();
    const allSubjects = await db.select().from(subjects);
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
    const result = await db.insert(subjects).values({ name }).returning();
    return NextResponse.json(result[0]);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST subjects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
