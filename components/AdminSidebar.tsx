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
  CreditCard, 
  X,
  Mail,
  UserCheck
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard/admin" },
    { name: "Students", icon: <Users size={20} />, href: "/dashboard/admin/students" },
    { name: "Teachers", icon: <GraduationCap size={20} />, href: "/dashboard/admin/teachers" },
    { name: "Instructor Requests", icon: <UserCheck size={20} />, href: "/dashboard/admin/instructor-requests" },
    { name: "Inbox", icon: <Mail size={20} />, href: "/dashboard/admin/inbox" },
    { name: "Classes", icon: <School size={20} />, href: "/dashboard/admin/classes" },
    { name: "Attendance", icon: <Calendar size={20} />, href: "/dashboard/admin/attendance" },
    { name: "Fees/Finance", icon: <CreditCard size={20} />, href: "/dashboard/admin/finance" },
    { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/admin/settings" },
  ];

  return (
    <>
      {/* 1. Overlay Optimized: Mobile only */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* 2. Sidebar Container: Added flex-shrink-0 and aside semantic tag */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white h-screen border-r border-slate-200 
        flex flex-col p-6 transition-transform duration-300 ease-in-out flex-shrink-0
        md:translate-x-0 md:static 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* Close Button (Mobile only) - Added tactile feedback */}
        <button 
          onClick={onClose} 
          className="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
        >
          <X size={24} />
        </button>

        {/* LOGO AREA */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-800 leading-tight tracking-tighter uppercase">TUSMO ADMIN</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-nowrap">School Management</span>
          </div>
        </div>

        {/* NAVIGATION MENU - Optimized Scroll & Performance */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-hide">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Main Menu</p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={onClose}
                // transition-colors duration-200 iyo active:scale-95 ayaa lagu daray
                className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold transition-all duration-200 active:scale-[0.98] ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span className={`${isActive ? "text-white" : "text-slate-400"}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT SECTION - Redesigned for focus */}
        <div className="pt-6 border-t border-slate-100">
          <button 
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 w-full font-bold transition-all duration-200 active:scale-95 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-black uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}