import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(teachers);
  } catch {
    return NextResponse.json({ error: "Xogta lama helin" }, { status: 500 });
  }
}