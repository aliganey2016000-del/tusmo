import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  const teacherId = searchParams.get("teacherId");
  const subject = searchParams.get("subject");
  const date = searchParams.get("date");

  if (!classId || !teacherId || !subject || !date) {
    return NextResponse.json({ exists: false });
  }

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: {
      classId,
      teacherId,
      subject,
      date: {
        gte: attendanceDate,
        lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  return NextResponse.json({ exists: !!existing });
}