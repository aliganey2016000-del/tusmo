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
  Mail,      // Icon-ka Inbox
  UserCheck  // Icon-ka Instructor Requests
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard/admin" },
    { name: "Students", icon: <Users size={20} />, href: "/dashboard/admin/students" },
    { name: "Teachers", icon: <GraduationCap size={20} />, href: "/dashboard/admin/teachers" },
    
    // --- LABADAAN AYAA CUSUB ---
    { name: "Instructor Requests", icon: <UserCheck size={20} />, href: "/dashboard/admin/instructor-requests" },
    { name: "Inbox", icon: <Mail size={20} />, href: "/dashboard/admin/inbox" },
    // --------------------------

    { name: "Classes", icon: <School size={20} />, href: "/dashboard/admin/classes" },
    { name: "Attendance", icon: <Calendar size={20} />, href: "/dashboard/admin/attendance" },
    { name: "Fees/Finance", icon: <CreditCard size={20} />, href: "/dashboard/admin/finance" },
    { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/admin/settings" },
  ];

  return (
    <>
      {/* Overlay: Mobile only */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white h-screen border-r border-slate-100 flex flex-col p-6 transition-transform duration-300 md:translate-x-0 md:static ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Close Button (Mobile only) */}
        <button onClick={onClose} className="md:hidden absolute top-4 right-4 p-2 text-slate-500">
          <X size={24} />
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-100">
            <GraduationCap size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-800 leading-tight tracking-tighter uppercase">TUSMO ADMIN</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">School Management</span>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} onClick={onClose}
                className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold transition-all ${
                  isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="pt-6 border-t border-slate-50">
          <button onClick={() => signOut({ callbackUrl: "/signin" })}
            className="flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 w-full font-bold transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-black uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}