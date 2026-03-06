"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center p-4 bg-white border-b fixed w-full top-0 z-30">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
          <Menu size={24} />
        </button>
        <span className="ml-4 font-bold text-slate-800">TUSMO ADMIN</span>
      </div>

      {/* Sidebar-ka */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content Area - Waxaan ku darnay w-full iyo max-w-full si uu shaashadda u buuxiyo */}
      <main className="flex-1 w-full mt-16 md:mt-0 p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-full">
           {children}
        </div>
      </main>
    </div>
  );
}