import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, username, password, accessCode } = body;

    if (type === "password") {
      const admin = await prisma.admin.findFirst({ where: { username } });
      if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
        await createSession({ id: admin.id, role: "admin", username: admin.username });
        return NextResponse.json({ success: true, role: "admin" });
      }

      const teacher = await prisma.teacher.findFirst({ where: { username } });
      if (teacher && (await bcrypt.compare(password, teacher.passwordHash))) {
        await createSession({ id: teacher.id, role: "teacher", username: teacher.username });
        return NextResponse.json({ success: true, role: "teacher" });
      }

      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    if (type === "access_code") {
      if (!accessCode || accessCode.length !== 6) {
        return NextResponse.json({ error: "Kode akses harus 6 digit" }, { status: 400 });
      }

      const teacher = await prisma.teacher.findFirst({ where: { accessCode } });
      if (!teacher) {
        return NextResponse.json({ error: "Kode akses tidak valid" }, { status: 401 });
      }

      await createSession({ id: teacher.id, role: "teacher", username: teacher.username });
      return NextResponse.json({ success: true, role: "teacher" });
    }

    return NextResponse.json({ error: "Tipe login tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
