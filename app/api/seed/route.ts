export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { admins, subjects, academicYears, classes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get("secret");
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const validSecret = process.env.SEED_SECRET || process.env.SESSION_SECRET;

    // Check if admin exists
    const existingAdmin = await db.select().from(admins).where(eq(admins.username, adminUsername)).limit(1);

    // If admin exists and no valid secret, skip
    if (existingAdmin.length > 0 && secret !== validSecret) {
      return NextResponse.json({
        message: "Database already seeded",
        seeded: false,
      });
    }

    if (existingAdmin.length > 0) {
      return NextResponse.json({
        message: "Database already seeded",
        seeded: false,
      });
    }

    // Seed data
    console.log("🌱 Seeding database...");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminHash = await bcrypt.hash(adminPassword, 10);

    await db.insert(admins).values({ username: adminUsername, passwordHash: adminHash });

    const defaultSubjects = [
      "Matematika", "Bahasa Indonesia", "Bahasa Inggris",
      "IPA", "IPS", "PKN", "Agama", "PJOK", "Seni Budaya", "Informatika",
    ];
    for (const name of defaultSubjects) {
      const existing = await db.select().from(subjects).where(eq(subjects.name, name)).limit(1);
      if (existing.length === 0) await db.insert(subjects).values({ name });
    }

    const existingYear = await db.select().from(academicYears).limit(1);
    if (existingYear.length === 0) {
      await db.insert(academicYears).values({ year: "2024/2025", isActive: true });
    }

    const defaultClasses = ["X.1", "X.2", "XI.1", "XI.2", "XII.1", "XII.2"];
    for (const name of defaultClasses) {
      const existing = await db.select().from(classes).where(eq(classes.name, name)).limit(1);
      if (existing.length === 0) await db.insert(classes).values({ name });
    }

    console.log("✅ Seed completed");
    return NextResponse.json({
      message: "Database seeded successfully",
      seeded: true,
      admin: { username: adminUsername, password: adminPassword },
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
