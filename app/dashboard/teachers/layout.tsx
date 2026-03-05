import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import LogoutButton from "./LogoutButton";

import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  Settings, 
  Bell, 
  Search,
  GraduationCap, 
  FileText, 
  CheckCircle2
} from "lucide-react";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "Teacher";
  
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const menuGroups = [
    {
      group: "Main Menu",
      items: [
        { name: "Overview", icon: LayoutDashboard, href: "/dashboard/teachers", color: "text-blue-500" },
        { name: "My Classes", icon: GraduationCap, href: "/dashboard/teachers/classes", color: "text-indigo-500" },
        { name: "Students", icon: Users, href: "/dashboard/teachers/students", color: "text-emerald-500" },
      ]
    },
    {
      group: "Academic Tools",
      items: [
        { name: "Attendance", icon: CheckCircle2, href: "/dashboard/teachers/attendance", color: "text-amber-500" },
        { name: "Lessons", icon: BookOpen, href: "/dashboard/teachers/lessons", color: "text-sky-500" },
        { name: "Assignments", icon: FileText, href: "/dashboard/teachers/assignments", color: "text-rose-500" },
        { name: "Exams & Grades", icon: ClipboardCheck, href: "/dashboard/teachers/exams", color: "text-purple-500" },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white hidden lg:flex flex-col border-r border-slate-100 shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-2xl shadow-lg shadow-indigo-100">
            <GraduationCap className="text-white" size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-800 leading-none">Tusmo Edu</span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-1">Teacher Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-6 overflow-y-auto py-4 space-y-8 custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.group}>
              <p className="text-[11px] uppercase font-bold text-slate-400 px-3 mb-4 tracking-[1.5px]">{group.group}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link key={item.name} href={item.href} className="flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-slate-50 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-all">
                         <item.icon size={18} className={item.color} />
                      </div>
                      <span className="font-semibold text-[14.5px] text-slate-600 group-hover:text-indigo-600">{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50 bg-slate-50/50">
           <Link href="/dashboard/teachers/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-semibold mb-2">
             <Settings size={18} /> Settings
           </Link>
           <LogoutButton /> 
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Teacher Dashboard</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academic Year: 2024/2025 • Term 1</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <input type="text" placeholder="Search..." className="pl-12 pr-6 py-2.5 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none text-sm w-80 transition-all" />
            </div>

            <button className="relative p-3 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-10 w-px bg-slate-100"></div>

            <div className="flex items-center gap-4 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer">
              {/* FIXED: bg-linear-to-tr instead of bg-gradient-to-tr */}
              <div className="h-10 w-10 bg-linear-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md uppercase">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{userName}</p>
                {/* FIXED: Removed duplicate tracking-widest */}
                <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-widest">Authorized Teacher</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}