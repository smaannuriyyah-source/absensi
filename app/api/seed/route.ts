export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { execSync } from "child_process";

async function pushSchema() {
  try {
    execSync("npx prisma db push --skip-generate", {
      timeout: 60000,
      stdio: "pipe",
    });
    return true;
  } catch (error) {
    console.error("Prisma db push failed:", error);
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get("secret");
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const validSecret = process.env.SEED_SECRET || process.env.SESSION_SECRET;

    // Step 1: Push schema first
    console.log("📦 Pushing database schema...");
    const schemaPushed = await pushSchema();

    if (!schemaPushed) {
      return NextResponse.json(
        { error: "Failed to push database schema" },
        { status: 500 }
      );
    }

    // Step 2: Check if admin exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: adminUsername },
    });

    // If admin exists and no valid secret, skip
    if (existingAdmin && secret !== validSecret) {
      return NextResponse.json({
        message: "Database already seeded",
        seeded: false,
        schemaPushed: true,
      });
    }

    if (existingAdmin) {
      return NextResponse.json({
        message: "Database already seeded",
        seeded: false,
        schemaPushed: true,
      });
    }

    // Step 3: Seed data
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
    return NextResponse.json({
      message: "Database seeded successfully",
      seeded: true,
      schemaPushed: true,
      admin: { username: adminUsername, password: adminPassword },
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
