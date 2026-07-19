export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teachers } from "@/lib/schema";
import { requireAdmin } from "@/lib/dal";
import { generateUniqueAccessCode } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const accessCode = await generateUniqueAccessCode();
    await db.update(teachers).set({ accessCode }).where(eq(teachers.id, parseInt(params.id)));
    return NextResponse.json({ accessCode });
  } catch (error: any) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
