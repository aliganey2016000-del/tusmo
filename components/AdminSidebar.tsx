"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  School, 
  Calendar, 
  Settings, 
  LogOut,
  CreditCard
} from "lucide-react"; // HUBI INAY TAHAY lucide-react
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();

  // Menu-yada dhanka bidix ee maamulka
  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard/admin" },
    { name: "Students", icon: <Users size={20} />, href: "/dashboard/admin/students" },
    { name: "Teachers", icon: <GraduationCap size={20} />, href: "/dashboard/admin/teachers" },
    { name: "Classes", icon: <School size={20} />, href: "/dashboard/admin/classes" },
    { name: "Attendance", icon: <Calendar size={20} />, href: "/dashboard/admin/attendance" },
    { name: "Fees/Finance", icon: <CreditCard size={20} />, href: "/dashboard/admin/finance" },
    { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/admin/settings" },
  ];

  return (
    <div className="w-72 bg-white h-screen border-r border-slate-100 flex flex-col p-6 sticky top-0 z-40 font-sans">
      
      {/* 1. LOGO SECTION */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-100">
          <GraduationCap size={24} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-800 leading-tight tracking-tighter uppercase">
            TUSMO ADMIN
          </h1>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            School Management
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION MENU */}
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">
          Main Menu
        </p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
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