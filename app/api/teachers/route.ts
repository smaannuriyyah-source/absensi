export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teachers } from "@/lib/schema";
import { requireAdmin, getTeacherSubjects } from "@/lib/dal";
import { generateUniqueAccessCode } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const allTeachers = await db.select().from(teachers);
    const teachersWithSubjects = await Promise.all(
      allTeachers.map(async (teacher) => {
        const subjectList = await getTeacherSubjects(teacher.id);
        const { passwordHash, ...rest } = teacher;
        return { ...rest, subjects: subjectList };
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

    const existing = await db.select().from(teachers).where(eq(teachers.username, username)).limit(1);
    if (existing.length > 0) return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 10);
    const accessCode = await generateUniqueAccessCode();
    const result = await db.insert(teachers).values({
      username, passwordHash, accessCode, name: name || "", profileComplete: false,
    }).returning();
    const { passwordHash: _, ...teacherData } = result[0];
    return NextResponse.json(teacherData);
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("POST teachers error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
