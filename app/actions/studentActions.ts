'use server';

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getLatestStudentId() {
  try {
    const lastStudent = await db.student.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { grade: true }
    });
    return lastStudent?.grade || "0";
  } catch { return "0"; }
}

export async function checkExistingStudents(identifiers: {sid: string, email: string}[]) {
  try {
    const existing = await db.student.findMany({
      where: {
        OR: [
          { grade: { in: identifiers.map(i => i.sid) } },
          { email: { in: identifiers.map(i => i.email) } }
        ]
      },
      select: { grade: true, email: true }
    });
    return existing;
  } catch { return []; }
}

export async function addStudent(formData: FormData) {
  try {
    const studentId = (formData.get("studentId") as string).trim();
    const email = (formData.get("email") as string).trim().toLowerCase();

    const existingId = await db.student.findFirst({ where: { grade: studentId } });
    if (existingId) throw new Error(`Student ID: ${studentId} horey ayaa loo isticmaalay.`);

    await db.student.create({
      data: {
        name: (formData.get("name") as string).trim(),
        email,
        gender: formData.get("gender") as string,
        phone: formData.get("phone") as string,
        parentName: formData.get("parentName") as string,
        parentPhone: formData.get("parentPhone") as string,
        status: "Active",
        grade: studentId,
        classId: formData.get("classId") as string || null,
      },
    });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Cillad keydinta ah");
  }
}

export async function updateStudent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    await db.student.update({
      where: { id },
      data: {
        name: (formData.get("name") as string).trim(),
        email: (formData.get("email") as string).trim().toLowerCase(),
        gender: formData.get("gender") as string,
        phone: formData.get("phone") as string,
        parentName: formData.get("parentName") as string,
        parentPhone: formData.get("parentPhone") as string,
        grade: formData.get("studentId") as string,
        classId: formData.get("classId") as string || null,
      },
    });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Cillad");
  }
}

export async function deleteStudent(id: string) {
  try {
    await db.student.delete({ where: { id } });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch { return { success: false }; }
}

export async function toggleStudentStatus(id: string, currentStatus: string) {
  try {
    await db.student.update({
      where: { id },
      data: { status: currentStatus === "Active" ? "Inactive" : "Active" },
    });
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch { return { success: false }; }
}

export async function importStudents(rows: (string | number | null | undefined)[][]) {
  try {
    const allClasses = await db.class.findMany();
    for (const row of rows) {
      const [sid, name, email, phone, cName, gen, pName, pPhone] = row;
      if (!name || !email) continue;
      const targetClass = allClasses.find(c => c.name.toLowerCase() === cName?.toString().toLowerCase());
      await db.student.create({
        data: {
          grade: sid?.toString() || "N/A",
          name: name.toString().trim(),
          email: email.toString().toLowerCase(),
          phone: phone?.toString() || "",
          classId: targetClass?.id || null,
          gender: gen?.toString() || "Male",
          parentName: pName?.toString() || "",
          parentPhone: pPhone?.toString() || "",
          status: "Active"
        }
      });
    }
    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch { throw new Error("Import failed"); }
}