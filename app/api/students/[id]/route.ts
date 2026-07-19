export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { students } from "@/lib/schema";
import { requireAdmin } from "@/lib/dal";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const { name, classId } = await req.json();
    const data: any = {};
    if (name) data.name = name;
    if (classId) data.classId = parseInt(classId);
    await db.update(students).set(data).where(eq(students.id, parseInt(params.id)));
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
    await db.delete(students).where(eq(students.id, parseInt(params.id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
