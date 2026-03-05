"use server"

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Function-ka lagu darayo macalinka
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

  // Dib u cusboonaysii bogga (Hubi in path-kaagu yahay kan saxda ah)
  revalidatePath("/dashboard/teachers");
  redirect("/dashboard/teachers");
}

// 2. Function-ka lagu tirtirayo macalinka (KANI AYAA MAQNAA)
// ADOON KAN KU DARIN VERCEL MA AQBALAYO
export async function deleteTeacher(id: string) {
  try {
    await prisma.teacher.delete({
      where: { id },
    });
    revalidatePath("/dashboard/teachers");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Wuu diiday inuu tirtirmo" };
  }
}