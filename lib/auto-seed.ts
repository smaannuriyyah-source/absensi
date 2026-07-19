import bcrypt from "bcryptjs";
import { db } from "./db";
import { admins, subjects, academicYears, classes } from "./schema";
import { eq } from "drizzle-orm";

let isSeeding = false;
let seeded = false;

export async function autoSeed() {
  if (seeded || isSeeding) return;
  isSeeding = true;

  try {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const existingAdmin = await db.select().from(admins).where(eq(admins.username, adminUsername)).limit(1);

    if (existingAdmin.length > 0) {
      seeded = true;
      return;
    }

    console.log("🌱 First run detected, seeding database...");

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

    console.log("✅ Auto-seed completed");
    seeded = true;
  } catch (error) {
    console.error("⚠️ Auto-seed failed (non-fatal):", error);
    isSeeding = false;
  }
}
