'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. In la aqbalo Macallinka (Approve)
export async function approveInstructor(id: string) {
  try {
    // A. Soo hel codsigii uu soo diray
    const application = await prisma.instructorApplication.findUnique({
      where: { id }
    });

    if (!application) return { success: false, error: "Codsiga lama helin" };

    // B. U samee Macallin (Teacher Model)
    await prisma.teacher.create({
      data: {
        name: application.fullName,
        email: application.email,
        phone: application.phone || "",
        subject: application.specialty,
        status: "Active"
      }
    });

    // C. Update garee xaaladda codsiga (Status -> APPROVED)
    await prisma.instructorApplication.update({
      where: { id },
      data: { status: "APPROVED" }
    });

    revalidatePath("/admin/instructor-requests");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

// 2. In la diido Macallinka (Reject)
export async function rejectInstructor(id: string) {
  try {
    await prisma.instructorApplication.update({
      where: { id },
      data: { status: "REJECTED" }
    });
    revalidatePath("/admin/instructor-requests");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}