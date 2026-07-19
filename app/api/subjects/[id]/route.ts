export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subjects } from "@/lib/schema";
import { requireAdmin } from "@/lib/dal";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    await db.update(subjects).set({ name }).where(eq(subjects.id, parseInt(params.id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await db.delete(subjects).where(eq(subjects.id, parseInt(params.id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
