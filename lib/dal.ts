import { db } from "./db";
import { getSession } from "./auth";
import { teachers, teacherSubjects, classes, subjects, students, academicYears, teachingJournals } from "./schema";
import { eq } from "drizzle-orm";

export async function requireAuth() {
  const session = await getSession();
  if (!session.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function requireTeacher() {
  const session = await requireAuth();
  if (session.role !== "teacher") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function getTeacherProfile(teacherId: number) {
  return db.select().from(teachers).where(eq(teachers.id, teacherId)).limit(1).then(r => r[0]);
}

export async function getTeacherSubjects(teacherId: number) {
  const result = await db
    .select({ id: subjects.id, name: subjects.name })
    .from(teacherSubjects)
    .innerJoin(subjects, eq(teacherSubjects.subjectId, subjects.id))
    .where(eq(teacherSubjects.teacherId, teacherId));
  return result;
}

export async function getAllClasses() {
  return db.select().from(classes);
}

export async function getAllSubjects() {
  return db.select().from(subjects);
}

export async function getStudentsByClass(classId: number) {
  return db.select().from(students).where(eq(students.classId, classId));
}

export async function getActiveAcademicYear() {
  return db.select().from(academicYears).where(eq(academicYears.isActive, true)).limit(1).then(r => r[0]);
}

export async function getTodayJournals(teacherId: number, date: string) {
  return db
    .select()
    .from(teachingJournals)
    .where(eq(teachingJournals.teacherId, teacherId))
    .then(journals => journals.filter(j => j.date === date));
}
