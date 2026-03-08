import AdminNavigation from "@/components/AdminNavigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden text-slate-900">
      
      {/* 1. Logic-ga Client-ka (Sidebar & Mobile Menu) */}
      <AdminNavigation />
      
      {/* 2. Main Content Area */}
      {/* scrollbar-hide: waxay ka dhigaysaa in interface-ku nadiif u ekaado */}
      <main className="flex-1 w-full mt-16 md:mt-0 overflow-y-auto h-screen scrollbar-hide">
        
        {/* 3. Max-width Container (max-w-7xl = 1280px) 
            Tani waxay ka ilaalinaysaa dashboard-ka inuu aad u fidsado shaashadaha waaweyn */}
        <div className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-10">
           {children}
        </div>
        
      </main>
    </div>
  );
}