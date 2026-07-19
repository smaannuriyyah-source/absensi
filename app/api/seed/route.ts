import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: adminUsername },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Database already seeded", seeded: false });
    }

    console.log("🌱 Seeding database...");

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminHash = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({
      data: { username: adminUsername, passwordHash: adminHash },
    });

    const defaultSubjects = [
      "Matematika", "Bahasa Indonesia", "Bahasa Inggris",
      "IPA", "IPS", "PKN", "Agama", "PJOK", "Seni Budaya", "Informatika",
    ];
    for (const name of defaultSubjects) {
      const existing = await prisma.subject.findFirst({ where: { name } });
      if (!existing) await prisma.subject.create({ data: { name } });
    }

    const existingYear = await prisma.academicYear.findFirst();
    if (!existingYear) {
      await prisma.academicYear.create({
        data: { year: "2024/2025", isActive: true },
      });
    }

    const defaultClasses = ["X.1", "X.2", "XI.1", "XI.2", "XII.1", "XII.2"];
    for (const name of defaultClasses) {
      const existing = await prisma.class.findFirst({ where: { name } });
      if (!existing) await prisma.class.create({ data: { name } });
    }

    console.log("✅ Seed completed");
    return NextResponse.json({ message: "Database seeded successfully", seeded: true });
  } catch (error) {
    console.error("❌ Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
