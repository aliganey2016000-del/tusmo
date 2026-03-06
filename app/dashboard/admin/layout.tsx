"use client"; // Tani waa muhiim maadaama aan isticmaalayno useState

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Samee state-ka si aad u xakameyso sidebar-ka
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* 2. Halkan ayaan ku gudbinaynaa props-ka looga baahan yahay sidebar-ka */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}