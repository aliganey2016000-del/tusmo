"use server"

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const grade = formData.get("grade") as string;

  // username fallback
  const username = (formData.get("username") as string) || email.split('@')[0];

  if (password !== confirmPassword) {
    return { error: "Password-yadu ma is laha!" };
  }

  try {
    // 1. Hubi haddii uu jiro USER (Login account) leh email-kan
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return { error: "Email-kan horay ayaa loogu samaysay akoon. Fadlan soo gal (Sign In)." };
    }

    // 2. Hubi haddii uu jiro STUDENT (oo Admin-ku geliyay) leh email-kan
    let studentRecord = await prisma.student.findUnique({
      where: { email: email }
    });

    // 3. Haddii uusan Student-ku jirin, dhis mid cusub (Pending)
    if (!studentRecord) {
      studentRecord = await prisma.student.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: email,
          grade: grade || "N/A",
          status: "Pending",
        },
      });
    }

    // 4. Hash gareey Password-ka
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Dhis User-ka oo ku xir Student-ka (ha ahaado kii hore ama kan cusub)
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role: "STUDENT",
        isApproved: false, 
        studentId: studentRecord.id, // ISKU XIRKII
      },
    });

    // Success!
  } catch (err) {
    console.error("Signup Error:", err);
    return { error: "Cillad farsamo ayaa dhacday. Fadlan mar kale isku day." };
  }

  redirect("/signin");
}