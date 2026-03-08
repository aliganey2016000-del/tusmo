'use server';

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addStudent(formData: FormData) {
  try {
    const classId = formData.get("classId") as string;
    await db.student.create({
      data: {
        name: (formData.get("name") as string).trim(),
        email: (formData.get("email") as string).trim(),
        gender: formData.get("gender") as string,
        phone: formData.get("phone") as string,
        parentName: formData.get("parentName") as string,
        parentPhone: formData.get("parentPhone") as string,
        status: "Active",
        grade: "",
        classId: classId || null,
      },
    });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch {
    throw new Error("Laguma guuleysan in la keydiyo ardayga.");
  }
}

export async function updateStudent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const classId = formData.get("classId") as string;
    await db.student.update({
      where: { id },
      data: {
        name: (formData.get("name") as string).trim(),
        email: (formData.get("email") as string).trim(),
        gender: formData.get("gender") as string,
        phone: formData.get("phone") as string,
        parentName: formData.get("parentName") as string,
        parentPhone: formData.get("parentPhone") as string,
        classId: classId || null,
      },
    });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch {
    throw new Error("Laguma guuleysan in la cusboonaysiiyo.");
  }
}

export async function deleteStudent(id: string) {
  try {
    await db.student.delete({ where: { id } });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch {
    throw new Error("Ma tirtiri kartid ardaygan.");
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
    return { success: true };
  } catch {
    throw new Error("Laguma guuleysan in la beddelo xaaladda.");
  }
}