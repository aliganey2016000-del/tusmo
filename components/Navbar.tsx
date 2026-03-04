"use client"; 

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation"; 
import { Button } from "@/components/ui/button";
// XALKA: Hubi in halkan ay ku qoran tahay lucide-react (MA AHA lucide-center)
import { GraduationCap, LogOut, LayoutDashboard } from "lucide-react"; 

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Haddii URL-ku uu yahay Dashboard, ha muujin Navbar-ka weyn
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const getDashboardLink = () => {
    const role = (session?.user as any)?.role;
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "TEACHER") return "/dashboard/teacher";
    return "/dashboard/student";
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-700 p-2 rounded-lg group-hover:bg-blue-800 transition">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-black text-blue-900 leading-none tracking-tight uppercase">
                  TUSMO
                </span>
                <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">
                  Primary & Secondary
                </span>
              </div>
            </Link>
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-700">Home</Link>
            <Link href="/courses" className="text-sm font-semibold text-gray-600 hover:text-blue-700">Courses</Link>

            {status === "authenticated" && (
              <Link href={getDashboardLink()} className="text-sm font-bold text-blue-700 flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {status === "loading" ? (
              <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-full"></div>
            ) : status === "authenticated" ? (
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex flex-col items-end text-right">
                  <span className="text-sm font-bold text-gray-900 leading-none">
                    {session.user?.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium uppercase">
                    {(session.user as any)?.role}
                  </span>
                </div>
                <Button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="outline" 
                  className="text-red-600 border-red-100 hover:bg-red-50 gap-2 rounded-full font-bold"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/signin"><Button variant="ghost">Sign In</Button></Link>
                <Link href="/signup"><Button className="bg-blue-700 text-white rounded-full px-6">Sign Up</Button></Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}