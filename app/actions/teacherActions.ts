'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addTeacher(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const status = formData.get("status") as string;
  // Xogta dhowrka maado iyo fasallada oo ah JSON string
  const subjects = formData.get("subjects") as string; 

  try {
    await prisma.teacher.create({
      data: { 
        name, 
        email, 
        phone, 
        status: status || "Active",
        // Halkan waxaan ku kaydinaynaa JSON-ka dhowrka maado ah
        subject: subjects // Haddii schema-gaaga uu yahay 'subject', halkan ku hay
      }
    });
    
    revalidatePath("/dashboard/admin/teachers");
  } catch (error) {
    console.error("Error adding teacher:", error);
    throw new Error("Wuu ku guuldareystay kudarista macallinka.");
  }
}

export async function updateTeacher(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const status = formData.get("status") as string;
  const subjects = formData.get("subjects") as string;

  try {
    await prisma.teacher.update({
      where: { id },
      data: { 
        name, 
        email, 
        phone, 
        status,
        subject: subjects 
      }
    });
    
    revalidatePath("/dashboard/admin/teachers");
  } catch (error) {
    console.error("Error updating teacher:", error);
    throw new Error("Wuu ku guuldareystay cusboonaysiinta.");
  }
}

export async function deleteTeacher(id: string) {
  try {
    await prisma.teacher.delete({ where: { id } });
    revalidatePath("/dashboard/admin/teachers");
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw new Error("Wuu ku guuldareystay tirtirista.");
  }
}