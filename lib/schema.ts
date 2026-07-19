import { int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ── Admin ─────────────────────────────────────────────
export const admins = sqliteTable("admins", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

// ── Teacher ───────────────────────────────────────────
export const teachers = sqliteTable("teachers", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  accessCode: text("access_code").notNull().unique(),
  name: text().notNull().default(""),
  profileComplete: int("profile_complete", { mode: "boolean" }).notNull().default(false),
});

// ── Subject ───────────────────────────────────────────
export const subjects = sqliteTable("subjects", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

// ── TeacherSubject (junction) ─────────────────────────
export const teacherSubjects = sqliteTable(
  "teacher_subjects",
  {
    teacherId: int("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    subjectId: int("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("teacher_subjects_unique").on(t.teacherId, t.subjectId)]
);

// ── Class ─────────────────────────────────────────────
export const classes = sqliteTable("classes", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

// ── Student ───────────────────────────────────────────
export const students = sqliteTable("students", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  classId: int("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
});

// ── AcademicYear ──────────────────────────────────────
export const academicYears = sqliteTable("academic_years", {
  id: int().primaryKey({ autoIncrement: true }),
  year: text().notNull(),
  isActive: int("is_active", { mode: "boolean" }).notNull().default(false),
});

// ── TeachingJournal ───────────────────────────────────
export const teachingJournals = sqliteTable("teaching_journals", {
  id: int().primaryKey({ autoIncrement: true }),
  teacherId: int("teacher_id")
    .notNull()
    .references(() => teachers.id),
  classId: int("class_id")
    .notNull()
    .references(() => classes.id),
  date: text().notNull(),
  hour: int().notNull(),
  subjectId: int("subject_id")
    .notNull()
    .references(() => subjects.id),
  material: text().notNull(),
  academicYearId: int("academic_year_id")
    .notNull()
    .references(() => academicYears.id),
  createdAt: text("created_at").notNull().default(""),
});

// ── Attendance ────────────────────────────────────────
export const attendance = sqliteTable("attendance", {
  id: int().primaryKey({ autoIncrement: true }),
  studentId: int("student_id")
    .notNull()
    .references(() => students.id),
  teacherId: int("teacher_id")
    .notNull()
    .references(() => teachers.id),
  subjectId: int("subject_id")
    .notNull()
    .references(() => subjects.id),
  classId: int("class_id")
    .notNull()
    .references(() => classes.id),
  date: text().notNull(),
  status: text().notNull().default("hadir"),
  evidence: text(),
});

// ── KnowledgeGrade ────────────────────────────────────
export const knowledgeGrades = sqliteTable("knowledge_grades", {
  id: int().primaryKey({ autoIncrement: true }),
  studentId: int("student_id")
    .notNull()
    .references(() => students.id),
  teacherId: int("teacher_id")
    .notNull()
    .references(() => teachers.id),
  subjectId: int("subject_id")
    .notNull()
    .references(() => subjects.id),
  classId: int("class_id")
    .notNull()
    .references(() => classes.id),
  uh1: int(),
  uh2: int(),
  uh3: int(),
  uts: int(),
  uas: int(),
  semester: int().notNull().default(1),
  academicYearId: int("academic_year_id")
    .notNull()
    .references(() => academicYears.id),
});

// ── PracticeGrade ─────────────────────────────────────
export const practiceGrades = sqliteTable("practice_grades", {
  id: int().primaryKey({ autoIncrement: true }),
  studentId: int("student_id")
    .notNull()
    .references(() => students.id),
  teacherId: int("teacher_id")
    .notNull()
    .references(() => teachers.id),
  subjectId: int("subject_id")
    .notNull()
    .references(() => subjects.id),
  classId: int("class_id")
    .notNull()
    .references(() => classes.id),
  practice1: int(),
  practice2: int(),
  semester: int().notNull().default(1),
  academicYearId: int("academic_year_id")
    .notNull()
    .references(() => academicYears.id),
});

// ── Relations ─────────────────────────────────────────
export const teacherRelations = relations(teachers, ({ many }) => ({
  subjects: many(teacherSubjects),
  journals: many(teachingJournals),
  attendances: many(attendance),
  knowledgeGrades: many(knowledgeGrades),
  practiceGrades: many(practiceGrades),
}));

export const subjectRelations = relations(subjects, ({ many }) => ({
  teachers: many(teacherSubjects),
  journals: many(teachingJournals),
  attendances: many(attendance),
  knowledgeGrades: many(knowledgeGrades),
  practiceGrades: many(practiceGrades),
}));

export const teacherSubjectRelations = relations(teacherSubjects, ({ one }) => ({
  teacher: one(teachers, { fields: [teacherSubjects.teacherId], references: [teachers.id] }),
  subject: one(subjects, { fields: [teacherSubjects.subjectId], references: [subjects.id] }),
}));

export const classRelations = relations(classes, ({ many }) => ({
  students: many(students),
  journals: many(teachingJournals),
  attendances: many(attendance),
  knowledgeGrades: many(knowledgeGrades),
  practiceGrades: many(practiceGrades),
}));

export const studentRelations = relations(students, ({ one, many }) => ({
  class: one(classes, { fields: [students.classId], references: [classes.id] }),
  attendances: many(attendance),
  knowledgeGrades: many(knowledgeGrades),
  practiceGrades: many(practiceGrades),
}));

export const academicYearRelations = relations(academicYears, ({ many }) => ({
  journals: many(teachingJournals),
  knowledgeGrades: many(knowledgeGrades),
  practiceGrades: many(practiceGrades),
}));

export const teachingJournalRelations = relations(teachingJournals, ({ one }) => ({
  teacher: one(teachers, { fields: [teachingJournals.teacherId], references: [teachers.id] }),
  class: one(classes, { fields: [teachingJournals.classId], references: [classes.id] }),
  subject: one(subjects, { fields: [teachingJournals.subjectId], references: [subjects.id] }),
  academicYear: one(academicYears, { fields: [teachingJournals.academicYearId], references: [academicYears.id] }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, { fields: [attendance.studentId], references: [students.id] }),
  teacher: one(teachers, { fields: [attendance.teacherId], references: [teachers.id] }),
  subject: one(subjects, { fields: [attendance.subjectId], references: [subjects.id] }),
  class: one(classes, { fields: [attendance.classId], references: [classes.id] }),
}));

export const knowledgeGradeRelations = relations(knowledgeGrades, ({ one }) => ({
  student: one(students, { fields: [knowledgeGrades.studentId], references: [students.id] }),
  teacher: one(teachers, { fields: [knowledgeGrades.teacherId], references: [teachers.id] }),
  subject: one(subjects, { fields: [knowledgeGrades.subjectId], references: [subjects.id] }),
  class: one(classes, { fields: [knowledgeGrades.classId], references: [classes.id] }),
  academicYear: one(academicYears, { fields: [knowledgeGrades.academicYearId], references: [academicYears.id] }),
}));

export const practiceGradeRelations = relations(practiceGrades, ({ one }) => ({
  student: one(students, { fields: [practiceGrades.studentId], references: [students.id] }),
  teacher: one(teachers, { fields: [practiceGrades.teacherId], references: [teachers.id] }),
  subject: one(subjects, { fields: [practiceGrades.subjectId], references: [subjects.id] }),
  class: one(classes, { fields: [practiceGrades.classId], references: [classes.id] }),
  academicYear: one(academicYears, { fields: [practiceGrades.academicYearId], references: [academicYears.id] }),
}));
