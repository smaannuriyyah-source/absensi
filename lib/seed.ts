import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

async function seed() {
  console.log("🌱 Seeding database...");

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.admin.findFirst({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: { username: adminUsername, passwordHash: adminHash },
    });
    console.log("✅ Admin created:", adminUsername);
  } else {
    console.log("ℹ️  Admin already exists");
  }

  const defaultSubjects = [
    "Matematika", "Bahasa Indonesia", "Bahasa Inggris",
    "IPA", "IPS", "PKN", "Agama", "PJOK", "Seni Budaya", "Informatika",
  ];
  for (const name of defaultSubjects) {
    const existing = await prisma.subject.findFirst({ where: { name } });
    if (!existing) await prisma.subject.create({ data: { name } });
  }
  console.log("✅ Default subjects created");

  const existingYear = await prisma.academicYear.findFirst();
  if (!existingYear) {
    await prisma.academicYear.create({
      data: { year: "2024/2025", isActive: true },
    });
    console.log("✅ Default academic year created: 2024/2025");
  }

  const defaultClasses = ["X.1", "X.2", "XI.1", "XI.2", "XII.1", "XII.2"];
  for (const name of defaultClasses) {
    const existing = await prisma.class.findFirst({ where: { name } });
    if (!existing) await prisma.class.create({ data: { name } });
  }
  console.log("✅ Default classes created");

  console.log("🎉 Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
