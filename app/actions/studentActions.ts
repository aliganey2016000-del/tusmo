'use server';

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

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
      status: "Active",
    };

    await db.student.create({ data });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error adding student:", error);
    return { success: false };
  }
}

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