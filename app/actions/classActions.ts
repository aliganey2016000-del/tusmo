'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addClass(formData: FormData) {
  const name = formData.get("name") as string;
  const room = formData.get("room") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  
  // Soo qabo dhammaan IDs-ka macallimiinta
  const teacherIds = formData.getAll("teacherIds") as string[];

  await prisma.class.create({
    data: { 
      name, 
      room, 
      capacity, 
      teachers: {
        connect: teacherIds.map(id => ({ id })) // Isku xir macallimiinta
      }
    }
  });

  revalidatePath("/dashboard/admin/classes");
}

export async function updateClass(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const room = formData.get("room") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const teacherIds = formData.getAll("teacherIds") as string[];

  await prisma.class.update({
    where: { id },
    data: { 
      name, 
      room, 
      capacity, 
      teachers: {
        set: teacherIds.map(id => ({ id })) // Update garee liiska macallimiinta
      }
    }
  });

  revalidatePath("/dashboard/admin/classes");
}

export async function deleteClass(id: string) {
  await prisma.class.delete({ where: { id } });
  revalidatePath("/dashboard/admin/classes");
}