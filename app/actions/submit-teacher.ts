"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function submitTeacherApplication(formData: FormData) {
  try {
    await prisma.teacherApplication.create({
      data: {
        fullName: formData.get("full_name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string || "",
        subject: formData.get("subject") as string,
        experience: formData.get("experience") as string,
      },
    });
    return { success: true, message: "Codsigaaga si guul leh ayaa loo diray!" };
  } catch { // Waxaad ka saartay (_)
    return { success: false, message: "Khalad ayaa dhacay, fadlan mar kale isku day." };
  }
}