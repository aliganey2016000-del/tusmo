'use server';

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * 1. KU DARISTA ARDAYGA (ADMIN ADD)
 * Hadda wuxuu isticmaalayaa classId si uu ugu xirmo fasalka dhabta ah
 */
export async function addStudent(formData: FormData) {
  try {
    const classId = formData.get("classId") as string;

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      gender: formData.get("gender") as string,
      phone: formData.get("phone") as string,
      parentName: formData.get("parentName") as string,
      parentPhone: formData.get("parentPhone") as string,
      status: "Active",
      // KAN AYAA SAXAYA TIRADA FASALKA (0/40 -> 1/40):
      classId: classId || null, 
      grade: "", // Grade hadda muhiim maahan laakiin schema-daada ayaan u deynay
    };

    await db.student.create({ data });
    
    // Cusboonaysii labada bogba si tiradu u dhabowdo
    revalidatePath("/dashboard/admin/students");
    revalidatePath("/dashboard/admin/classes"); 
    
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
    const classId = formData.get("classId") as string;

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      gender: formData.get("gender") as string,
      phone: formData.get("phone") as string, // <--- KAN AYAA LAGU DARAY SI UU U SHAQEEYO EDIT-KA
      parentName: formData.get("parentName") as string,
      parentPhone: formData.get("parentPhone") as string,
      // KAN AYAA SAXAYA TIRADA FASALKA:
      classId: classId || null,
    };

    await db.student.update({ 
      where: { id }, 
      data 
    });

    revalidatePath("/dashboard/admin/students");
    revalidatePath("/dashboard/admin/classes");
    
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
    revalidatePath("/dashboard/admin/classes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false };
  }
}

/**
 * 4. ANSINTA ARDAYGA (APPROVE)
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
    revalidatePath("/dashboard/admin/classes");
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
    revalidatePath("/dashboard/admin/classes");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting student:", error);
    return { success: false };
  }
}

/**
 * 6. AUTO-REJECT (3 DAYS LOGIC)
 */
export async function autoRejectOldStudents() {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

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

export async function toggleStudentStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    
    await db.student.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/admin/students");
    revalidatePath("/dashboard/admin/classes");
    return { success: true };
  } catch (error) {
    console.error("Error toggling status:", error);
    return { success: false };
  }
}