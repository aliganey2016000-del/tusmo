"use server"

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTeacher(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const phone = formData.get("phone") as string;

  try {
    await prisma.teacher.create({
      data: {
        name,
        email,
        subject,
        phone,
        status: "Active",
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Email-kan horay ayaa loo isticmaalay!" };
  }

  // Dib u cusboonaysii bogga macalimiinta si xogta cusub u soo baxdo
  revalidatePath("/dashboard/admin/teachers");
  redirect("/dashboard/admin/teachers");
}