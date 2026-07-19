import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { db } from "./db";
import { teachers } from "./schema";
import { eq } from "drizzle-orm";

export type SessionData = {
  id: number;
  role: "admin" | "teacher";
  username: string;
};

export const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "absensi-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function createSession(data: SessionData) {
  const session = await getSession();
  session.id = data.id;
  session.role = data.role;
  session.username = data.username;
  await session.save();
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
}

export async function generateUniqueAccessCode(): Promise<string> {
  let code: string;
  let exists: boolean;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    const existing = await db.select().from(teachers).where(eq(teachers.accessCode, code)).limit(1);
    exists = existing.length > 0;
  } while (exists);
  return code;
}
