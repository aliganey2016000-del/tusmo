'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitInstructorApplication(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const specialty = formData.get("specialty") as string;

    // ✅ BEDEL KAN: Waa inuu ahaadaa instructorApplication (sidii schema-daada)
    await prisma.instructorApplication.create({
      data: {
        fullName: fullName,
        email: email,
        phone: phone,
        specialty: specialty,
        // Haddii aad experience iyo bio ku dartay foomka, halkan ku dar:
        experience: (formData.get("experience") as string) || "",
        bio: (formData.get("bio") as string) || "",
      },
    });

    revalidatePath("/admin/instructor-requests");
    return { success: true };
  } catch (error) {
    console.error("Error submitting application:", error);
    return { success: false, error: "Codsiga lama diri karin." };
  }
}