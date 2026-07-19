export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getTeacherSubjects } from "@/lib/dal";
import { generateUniqueAccessCode } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await requireAdmin();
    const allTeachers = await prisma.teacher.findMany();
    const teachersWithSubjects = await Promise.all(
      allTeachers.map(async (teacher) => {
        const subjects = await getTeacherSubjects(teacher.id);
        return { ...teacher, passwordHash: undefined, subjects };
      })
    );
    return NextResponse.json(teachersWithSubjects);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("GET teachers error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { username, password, name } = await req.json();
    if (!username || !password) return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });

    const existing = await prisma.teacher.findFirst({ where: { username } });
    if (existing) return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 10);
    const accessCode = await generateUniqueAccessCode();
    const result = await prisma.teacher.create({
      data: { username, passwordHash, accessCode, name: name || "", profileComplete: false },
    });
    return NextResponse.json({ ...result, passwordHash: undefined });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST teachers error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
