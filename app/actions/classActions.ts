'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Qeexidda noocyada xogta (Types)
type HeerkaWaxbarasho = "Primary" | "Middle" | "Secondary";
type XilligaFasalka = "Morning" | "Afternoon" | "Evening";

/**
 * 1. Abuurista Fasal Cusub
 */
export async function addClass(formData: FormData) {
  const name = formData.get("name") as string;
  const room = formData.get("room") as string;
  const capacity = parseInt(formData.get("capacity") as string) || 30;
  const level = formData.get("level") as HeerkaWaxbarasho;
  const shift = formData.get("shift") as XilligaFasalka;
  const teacherIds = formData.getAll("teacherIds") as string[];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma.class as any).create({
      data: {
        name: name.trim(),
        room: room.trim(),
        capacity: capacity,
        level: level,
        shift: shift,
        teachers: {
          connect: teacherIds.map((id) => ({ id })),
        },
      },
    });
    
    revalidatePath("/dashboard/admin/classes");
  } catch (error) {
    console.error("Cillad ka timid abuurista fasalka:", error);
    throw new Error("Laguma guuleysan in la keydiyo fasalka cusub. Hubi xogta aad gelisay.");
  }
}

/**
 * 2. Cusboonaysiinta Xogta Fasalka
 */
export async function updateClass(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const room = formData.get("room") as string;
  const capacity = parseInt(formData.get("capacity") as string) || 30;
  const level = formData.get("level") as HeerkaWaxbarasho;
  const shift = formData.get("shift") as XilligaFasalka;
  const teacherIds = formData.getAll("teacherIds") as string[];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma.class as any).update({
      where: { id },
      data: {
        name: name.trim(),
        room: room.trim(),
        capacity: capacity,
        level: level,
        shift: shift,
        teachers: {
          set: teacherIds.map((id) => ({ id })),
        },
      },
    });
    
    revalidatePath("/dashboard/admin/classes");
  } catch (error) {
    console.error("Cillad ka timid cusboonaysiinta:", error);
    throw new Error("Laguma guuleysan in la beddelo xogta fasalka.");
  }
}

/**
 * 3. Tirtirista Fasalka
 */
export async function deleteClass(id: string) {
  try {
    await prisma.class.delete({
      where: { id },
    });
    
    revalidatePath("/dashboard/admin/classes");
  } catch (error) {
    console.error("Cillad ka timid tirtirista fasalka:", error);
    throw new Error("Laguma guuleysan in la tirtiro fasalka.");
  }
}