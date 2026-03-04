"use server"

import { prisma } from "@/lib/db"; // Waxaan u bedelnay db maadaama uu magaca file-kaagu saas yahay
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

/**
 * Function-kan wuxuu qabannayaa diiwaangelinta ardayda cusub
 */
export async function registerUser(formData: FormData) {
  // 1. Ka soo saar xogta Form-ka
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // 2. Hubi haddii password-yada ay is leeyihiin
  if (password !== confirmPassword) {
    return { error: "Password-yadu ma is laha! Fadlan iska hubi." };
  }

  try {
    // 3. Hubi haddii Email-ka ama Username-ka horay loo isticmaalay
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return { error: "Email-kan ama Username-kan horay ayaa loo qaatay!" };
    }

    // 4. Hash gareey Password-ka (Amniga dartiis)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Ku keydi Database-ka (Role-ka default waa STUDENT)
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role: "STUDENT", // Iskiis ayuu STUDENT u noqonayaa marka hore
      },
    });

  } catch (err) {
    console.error("Signup Error:", err);
    return { error: "Cillad farsamo ayaa dhacday. Fadlan mar kale isku day." };
  }

  // 6. Markuu guulaysto, u dir bogga Login-ka
  redirect("/signin");
}