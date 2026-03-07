"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Header - Fixed for mobile only */}
      <div className="md:hidden flex items-center p-4 bg-white border-b fixed w-full top-0 z-30 shadow-sm">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 font-black text-slate-800 tracking-tight uppercase">TUSMO ADMIN</span>
      </div>

      {/* Sidebar-ka (Component-kaaga hadda jira) */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      {/* 1. p-4 (mobile), md:p-8 (tablet), lg:p-10 (desktop) si uu u yeesho neefsasho (spacing) */}
      <main className="flex-1 w-full mt-16 md:mt-0 p-4 md:p-8 lg:p-10 overflow-y-auto h-screen">
        
        {/* 2. Max-width Container - Tani waxay dammaanad qaadaysaa in dashboard-ku uusan aad u fidsan screens-ka waaweyn (Ultra-wide) */}
        <div className="max-w-[1600px] mx-auto w-full">
           {children}
        </div>
        
      </main>
    </div>
  );
}