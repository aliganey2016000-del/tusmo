import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import StudentSidebar from "@/components/StudentSidebar";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // SECURITY: Haddii uusan ahayn STUDENT, u diid meeshaan!
  if (!session || (session.user as any).role !== "STUDENT") {
    redirect("/dashboard/admin");
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <StudentSidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}