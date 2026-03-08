'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type HeerkaWaxbarasho = "Primary" | "Middle" | "Secondary";
type XilligaFasalka = "Morning" | "Afternoon" | "Evening";

export async function addClass(formData: FormData) {
  const name = formData.get("name") as string;
  const room = formData.get("room") as string;
  const capacity = parseInt(formData.get("capacity") as string) || 30;
  const level = formData.get("level") as HeerkaWaxbarasho;
  const shift = formData.get("shift") as XilligaFasalka;

  try {
    await prisma.class.create({
      data: {
        name: name.trim(),
        room: room.trim(),
        capacity,
        level,
        shift,
      },
    });
    revalidatePath("/dashboard/admin/classes");
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Laguma guuleysan in la keydiyo fasalka.");
  }
}

export async function updateClass(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const room = formData.get("room") as string;
  const capacity = parseInt(formData.get("capacity") as string) || 30;
  const level = formData.get("level") as HeerkaWaxbarasho;
  const shift = formData.get("shift") as XilligaFasalka;

  try {
    await prisma.class.update({
      where: { id },
      data: {
        name: name.trim(),
        room: room.trim(),
        capacity,
        level,
        shift,
      },
    });
    revalidatePath("/dashboard/admin/classes");
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Laguma guuleysan in la beddelo xogta.");
  }
}

export async function deleteClass(id: string) {
  try {
    // Maadaama aad haysato Cascade Delete, prisma ayaa tirtiraysa Attendance-ka
    await prisma.class.delete({
      where: { id },
    });
    
    revalidatePath("/dashboard/admin/classes");
    return { success: true };
  } catch (error: unknown) {
    console.error("Database Delete Error:", error);
    throw new Error("Laguma guuleysan in la tirtiro fasalka.");
  }
}