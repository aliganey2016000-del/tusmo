"use client"; 

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, LayoutDashboard, Menu, X } from "lucide-react"; 

type UserWithRole = {
  name?: string;
  role?: "ADMIN" | "TEACHER" | "STUDENT" | string;
  [key: string]: unknown;
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const getDashboardLink = () => {
    const role = (session?.user as UserWithRole)?.role;
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "TEACHER") return "/dashboard/teacher";
    return "/dashboard/student";
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="shrink-0 flex items-center">
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

          {/* Menu Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-700">Home</Link>
            <Link href="/courses" className="text-sm font-semibold text-gray-600 hover:text-blue-700">Courses</Link>
            <Link href="/become-instructor" className="text-sm font-semibold text-gray-600 hover:text-blue-700">Become an Instructor</Link>

            {status === "authenticated" && (
              <Link href={getDashboardLink()} className="text-sm font-bold text-blue-700 flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-3">
               {status === "authenticated" ? (
                 <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline" className="text-red-600 border-red-100 rounded-full font-bold">
                   <LogOut className="h-4 w-4 mr-2" /> Logout
                 </Button>
               ) : (
                 <>
                   <Link href="/signin"><Button variant="ghost">Sign In</Button></Link>
                   <Link href="/signup"><Button className="bg-blue-700 text-white rounded-full px-6">Sign Up</Button></Link>
                 </>
               )}
            </div>

            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Link href="/" onClick={closeMenu} className="block text-base font-semibold text-gray-700">Home</Link>
          <Link href="/courses" onClick={closeMenu} className="block text-base font-semibold text-gray-700">Courses</Link>
          <Link href="/become-instructor" onClick={closeMenu} className="block text-base font-semibold text-gray-700">Become an Instructor</Link>
          
          {status === "authenticated" && (
            <Link href={getDashboardLink()} onClick={closeMenu} className="flex items-center gap-2 text-base font-bold text-blue-700">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
          )}

          <hr />

          <div className="flex flex-col gap-3 pt-2">
            {status === "authenticated" ? (
              <Button onClick={() => { signOut({ callbackUrl: "/" }); closeMenu(); }} variant="outline" className="text-red-600 w-full">
                Logout
              </Button>
            ) : (
              <>
                <Link href="/signin" onClick={closeMenu}><Button variant="outline" className="w-full">Sign In</Button></Link>
                <Link href="/signup" onClick={closeMenu}><Button className="bg-blue-700 text-white w-full">Sign Up</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}