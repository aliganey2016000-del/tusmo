'use server';

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * 1. KU DARISTA ARDAYGA (ADMIN ADD)
 */
export async function addStudent(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      grade: formData.get("grade") as string,
      gender: formData.get("gender") as string,
      phone: formData.get("phone") as string,
      parentName: formData.get("parentName") as string,
      parentPhone: formData.get("parentPhone") as string,
      status: "Active", // Admin-ku markuu daro waa Active toos ah
    };

    await db.student.create({ data });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error adding student:", error);
    return { success: false };
  }
}

/**
 * 2. WAX KA BEDDELKA ARDAYGA
 */
export async function updateStudent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      grade: formData.get("grade") as string,
      gender: formData.get("gender") as string,
      parentName: formData.get("parentName") as string,
      parentPhone: formData.get("parentPhone") as string,
    };

    await db.student.update({ where: { id }, data });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error updating student:", error);
    return { success: false };
  }
}

/**
 * 3. TIRTIRISTA ARDAYGA
 */
export async function deleteStudent(id: string) {
  try {
    await db.student.delete({ where: { id } });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false };
  }
}

/**
 * 4. ANSINTA ARDAYGA (APPROVE)
 * Waxay ka dhigaysaa Active, waxayna u oggolaanaysaa Login
 */
export async function approveStudent(studentId: string) {
  try {
    const student = await db.student.update({
      where: { id: studentId },
      data: { status: "Active" },
    });

    if (student.email) {
      await db.user.update({
        where: { email: student.email },
        data: { isApproved: true }
      });
    }

    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error approving student:", error);
    return { success: false };
  }
}

/**
 * 5. DIIDMADA ARDAYGA (REJECT)
 */
export async function rejectStudent(studentId: string, reason: string) {
  try {
    const student = await db.student.update({
      where: { id: studentId },
      data: { 
        status: "Rejected",
        rejectionReason: reason 
      },
    });

    if (student.email) {
      await db.user.update({
        where: { email: student.email },
        data: { isApproved: false }
      });
    }

    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting student:", error);
    return { success: false };
  }
}

/**
 * 6. AUTO-REJECT (3 DAYS LOGIC)
 * Shaqadan waxay si automatic ah u diidaysaa qof kasta oo 3 bari ka badan Pending ahaa
 */
export async function autoRejectOldStudents() {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // 1. U beddel status-ka dadka duugoobay "Rejected"
    await db.student.updateMany({
      where: {
        status: "Pending",
        createdAt: { lt: threeDaysAgo }
      },
      data: { 
        status: "Rejected",
        rejectionReason: "System Auto-Reject: 3 maalmood gudahood looma ansixin."
      }
    });

    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Auto-reject error:", error);
    return { success: false };
  }
}