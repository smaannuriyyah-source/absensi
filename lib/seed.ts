import bcrypt from "bcryptjs";
import { db } from "./db";
import { admins, subjects, academicYears, classes } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await db.select().from(admins).where(eq(admins.username, adminUsername)).limit(1);

  if (existingAdmin.length === 0) {
    await db.insert(admins).values({ username: adminUsername, passwordHash: adminHash });
    console.log("✅ Admin created:", adminUsername);
  } else {
    console.log("ℹ️  Admin already exists");
  }

  const defaultSubjects = [
    "Matematika", "Bahasa Indonesia", "Bahasa Inggris",
    "IPA", "IPS", "PKN", "Agama", "PJOK", "Seni Budaya", "Informatika",
  ];
  for (const name of defaultSubjects) {
    const existing = await db.select().from(subjects).where(eq(subjects.name, name)).limit(1);
    if (existing.length === 0) await db.insert(subjects).values({ name });
  }
  console.log("✅ Default subjects created");

  const existingYear = await db.select().from(academicYears).limit(1);
  if (existingYear.length === 0) {
    await db.insert(academicYears).values({ year: "2024/2025", isActive: true });
    console.log("✅ Default academic year created: 2024/2025");
  }

  const defaultClasses = ["X.1", "X.2", "XI.1", "XI.2", "XII.1", "XII.2"];
  for (const name of defaultClasses) {
    const existing = await db.select().from(classes).where(eq(classes.name, name)).limit(1);
    if (existing.length === 0) await db.insert(classes).values({ name });
  }
  console.log("✅ Default classes created");

  console.log("🎉 Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
