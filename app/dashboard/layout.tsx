"use client"; // Waa muhiim in kani uu ahaado Client Component

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar"; // Hubi path-kan inuu sax yahay
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Mobile Menu Button: Ka muuqda kaliya mobilka */}
      <div className="md:hidden flex items-center p-4 bg-white border-b fixed w-full top-0 z-30">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 font-bold text-slate-800">TUSMO ADMIN</span>
      </div>

      {/* Sidebar: Wuxuu qaadanayaa state-ka aan abuurnay */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 mt-16 md:mt-0 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}