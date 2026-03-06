'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addTeacher(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const phone = formData.get("phone") as string;

  await prisma.teacher.create({
    data: { name, email, subject, phone, status: "Active" }
  });
  revalidatePath("/dashboard/admin/teacher");
}

export async function updateTeacher(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const phone = formData.get("phone") as string;

  await prisma.teacher.update({
    where: { id },
    data: { name, email, subject, phone }
  });
  revalidatePath("/dashboard/admin/teacher");
}

export async function deleteTeacher(id: string) {
  await prisma.teacher.delete({ where: { id } });
  revalidatePath("/dashboard/admin/teacher");
}