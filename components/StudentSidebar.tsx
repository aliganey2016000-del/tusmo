"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  LogOut,
  GraduationCap
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function StudentSidebar() {
  const pathname = usePathname();

  // Menu-yada ardayga
  const menuItems = [
    { name: "My Profile", icon: <User size={20} />, href: "/dashboard/student" },
    { name: "My Courses", icon: <BookOpen size={20} />, href: "/dashboard/student/courses" },
    { name: "Exams", icon: <FileText size={20} />, href: "/dashboard/student/exams" },
    { name: "Results", icon: <CheckCircle size={20} />, href: "/dashboard/student/results" },
  ];

  return (
    <div className="w-72 bg-white h-screen border-r border-slate-100 flex flex-col p-6 sticky top-0 z-40 font-sans">
      
      {/* 1. LOGO SECTION */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-100">
          <GraduationCap size={24} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-800 leading-tight tracking-tighter uppercase">
            TUSMO STUDENT
          </h1>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Learning Portal
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION MENU */}
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">
          Student Menu
        </p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold transition-all duration-200 group ${
                isActive 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                  : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
            >
              <span className={`${isActive ? "text-white" : "group-hover:scale-110 transition-transform"}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. LOGOUT SECTION */}
      <div className="pt-6 border-t border-slate-50">
        <button 
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 w-full font-bold transition-all duration-200 group"
        >
          <div className="group-hover:rotate-12 transition-transform">
            <LogOut size={20} />
          </div>
          <span className="text-sm font-black uppercase tracking-wider">Logout</span>
        </button>
      </div>
    </div>
  );
}