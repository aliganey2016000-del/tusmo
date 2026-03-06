'use server';

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Qeex Type-ka saxda ah si looga fogaado 'any'
interface AttendanceRecord {
  studentId: string;
  classId: string;
  teacherId: string;
  subject: string;
  status: string;
  date: string | Date;
}

export async function saveAttendance(attendanceList: AttendanceRecord[]) {
  try {
    // Batch create iyadoo la isticmaalayo $transaction
    await db.$transaction(
      attendanceList.map((record) =>
        db.attendance.create({
          data: {
            date: new Date(record.date),
            status: record.status,
            subject: record.subject,
            teacherId: record.teacherId,
            studentId: record.studentId,
            classId: record.classId,
          },
        })
      )
    );

    revalidatePath("/dashboard/admin/attendance");
    return { success: true };
  } catch (error: unknown) {
    // 2. Maareynta Error-ka si nadiif ah (Clean catch)
    if (error instanceof Error) {
        console.error("DETAILED ATTENDANCE ERROR:", error.message);
        return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}