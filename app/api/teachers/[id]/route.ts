export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const teacher = await prisma.teacher.findUnique({ where: { id: parseInt(params.id) } });
    if (!teacher) return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ ...teacher, passwordHash: undefined });
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
      await prisma.teacher.update({ where: { id }, data: updateData });
    }

    if (subjectIds !== undefined) {
      await prisma.teacherSubject.deleteMany({ where: { teacherId: id } });
      if (subjectIds.length > 0) {
        await prisma.teacherSubject.createMany({
          data: subjectIds.map((subjectId: number) => ({ teacherId: id, subjectId })),
        });
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
    await prisma.teacher.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
