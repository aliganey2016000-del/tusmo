"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * 1. KU DARISTA ARDAYGA (ADD)
 */
export async function addStudent(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const grade = formData.get("grade") as string;
    const gender = formData.get("gender") as string;
    const phone = formData.get("phone") as string;           // CUSUB
    const parentName = formData.get("parentName") as string;   // CUSUB
    const parentPhone = formData.get("parentPhone") as string; // CUSUB

    await db.student.create({
      data: {
        name,
        email,
        grade,
        gender,
        phone,
        parentName,
        parentPhone,
        status: "Active",
      },
    });

    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error adding student:", error);
    return { success: false };
  }
}

/**
 * 2. WAX KA BEDDELKA ARDAYGA (UPDATE)
 */
export async function updateStudent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const grade = formData.get("grade") as string;
    const gender = formData.get("gender") as string;
    const phone = formData.get("phone") as string;           // CUSUB
    const parentName = formData.get("parentName") as string;   // CUSUB
    const parentPhone = formData.get("parentPhone") as string; // CUSUB

    await db.student.update({
      where: { id },
      data: {
        name,
        email,
        grade,
        gender,
        phone,
        parentName,
        parentPhone,
      },
    });

    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error updating student:", error);
    return { success: false };
  }
}

/**
 * 3. TIRTIRISTA ARDAYGA (DELETE)
 */
export async function deleteStudent(id: string) {
  try {
    await db.student.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false };
  }
}