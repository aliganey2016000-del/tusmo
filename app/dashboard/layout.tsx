export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Waxaan ka saarnay Sidebar-ka iyo State-ka halkan si aysan ugu dhex jirin admin/layout.tsx mar labaad
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}