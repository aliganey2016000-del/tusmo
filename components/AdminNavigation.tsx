"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminNavigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Header - Fixed for mobile only */}
      <div className="md:hidden flex items-center p-4 bg-white border-b fixed w-full top-0 z-30 shadow-sm">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          // Isticmaalka transition-colors iyo duration-200 si uu u dareemo Instant
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors duration-200 active:scale-95"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 font-black text-slate-800 tracking-tight uppercase">TUSMO ADMIN</span>
      </div>

      {/* Sidebar-ka */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  );
}