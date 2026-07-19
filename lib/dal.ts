import { prisma } from "./prisma";
import { getSession } from "./auth";

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
  return prisma.teacher.findUnique({ where: { id: teacherId } });
}

export async function getTeacherSubjects(teacherId: number) {
  const result = await prisma.teacherSubject.findMany({
    where: { teacherId },
    include: { subject: { select: { id: true, name: true } } },
  });
  return result.map((ts) => ts.subject);
}

export async function getAllClasses() {
  return prisma.class.findMany();
}

export async function getAllSubjects() {
  return prisma.subject.findMany();
}

export async function getStudentsByClass(classId: number) {
  return prisma.student.findMany({ where: { classId } });
}

export async function getActiveAcademicYear() {
  return prisma.academicYear.findFirst({ where: { isActive: true } });
}

export async function getTodayJournals(teacherId: number, date: string) {
  return prisma.teachingJournal.findMany({
    where: { teacherId, date },
  });
}
