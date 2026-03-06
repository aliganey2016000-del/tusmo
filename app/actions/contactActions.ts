'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function sendContactMessage(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // A. KEYDI FARIINTA (Tani mar hore ayay kuu shaqaysay)
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // B. KEYDI CODSIGA MACALLINKA (Halkan ayaa kuu dhiman)
    // Waxaan ku dhex abuuraynaa InstructorApplication model-ka
    await prisma.instructorApplication.create({
      data: {
        fullName: name,      // 'name' foomka ka yimid
        email: email,       // 'email' foomka ka yimid
        specialty: subject,   // 'subject' foomka ka yimid
        bio: message,        // Fariinta uu qoray u isticmaal Bio ahaan
        status: "PENDING",
      },
    });

    // C. CUSBOONAYSII BOGAGGA ADMIN-KA
    revalidatePath("/dashboard/admin/instructor-requests");
    revalidatePath("/dashboard/admin/inbox");

    return { success: true };
  } catch (error) {
    console.error("DATABASE ERROR:", error); // Terminal-ka ka eeg haddii qalad jiro
    return { success: false, error: "Xogta lama keydin karo xilligan." };
  }
}