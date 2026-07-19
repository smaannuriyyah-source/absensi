export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admins, teachers } from "@/lib/schema";
import { createSession } from "@/lib/auth";
import { autoSeed } from "@/lib/auto-seed";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, username, password, accessCode } = body;

    if (type === "password") {
      // Try admin login
      let admin = await db.select().from(admins).where(eq(admins.username, username)).limit(1).then(r => r[0]);

      // If no admin exists, run auto-seed first
      if (!admin) {
        await autoSeed();
        admin = await db.select().from(admins).where(eq(admins.username, username)).limit(1).then(r => r[0]);
      }

      if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
        await createSession({ id: admin.id, role: "admin", username: admin.username });
        return NextResponse.json({ success: true, role: "admin" });
      }

      const teacher = await db.select().from(teachers).where(eq(teachers.username, username)).limit(1).then(r => r[0]);
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

      const teacher = await db.select().from(teachers).where(eq(teachers.accessCode, accessCode)).limit(1).then(r => r[0]);
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
