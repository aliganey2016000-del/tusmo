import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

type SessionUser = {
  role?: string;
  [key: string]: unknown;
};

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);

  // 1. Haddii uusan qofku soo gelin, u dir bogga login-ka
  if (!session) {
    redirect("/signin");
  }

  // 2. Soo saar role-ka qofka
  const role = (session.user as SessionUser).role;

  // 3. U kala dir hadba meesha uu ku habboon yahay
  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } 
  
  if (role === "TEACHER") {
    redirect("/dashboard/teachers");
  }

  if (role === "STUDENT") {
    redirect("/dashboard/student");
  }
  
  // Haddii role-ka la waayo ama uu khaldan yahay
  redirect("/signin");
}