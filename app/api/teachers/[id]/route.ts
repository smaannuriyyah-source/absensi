export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teachers, teacherSubjects } from "@/lib/schema";
import { requireAdmin } from "@/lib/dal";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const teacher = await db.select().from(teachers).where(eq(teachers.id, parseInt(params.id))).limit(1).then(r => r[0]);
    if (!teacher) return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    const { passwordHash, ...teacherData } = teacher;
    return NextResponse.json(teacherData);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = parseInt(params.id);
    const { name, subjectIds } = await req.json();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (Object.keys(updateData).length > 0) {
      await db.update(teachers).set(updateData).where(eq(teachers.id, id));
    }

    if (subjectIds !== undefined) {
      await db.delete(teacherSubjects).where(eq(teacherSubjects.teacherId, id));
      if (subjectIds.length > 0) {
        await db.insert(teacherSubjects).values(
          subjectIds.map((subjectId: number) => ({ teacherId: id, subjectId }))
        );
      }
    }

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
    await db.delete(teachers).where(eq(teachers.id, parseInt(params.id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
