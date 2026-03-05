import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck, 
  TrendingUp, 
  Plus,
  UserCheck
} from "lucide-react";
import Link from "next/link";

export default async function TeacherOverviewPage() {
  // 1. Get real session user
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "Teacher";

  // 2. FETCH REAL DATA FROM DATABASE
  const totalTeachers = await prisma.teacher.count(); // Tirada guud
  const recentTeachers = await prisma.teacher.findMany({
    take: 5, // Soo qaad 5-tii u dambeeyey
    orderBy: { createdAt: "desc" },
  });

  // Stats setup (Using real count for Teachers)
  const stats = [
    { name: "Total Staff", value: totalTeachers.toString(), icon: UserCheck, color: "text-blue-600", bg: "bg-blue-100/50" },
    { name: "My Classes", value: "Available soon", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-100/50" },
    { name: "Lessons Taught", value: "0", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100/50" },
    { name: "Pending Tasks", value: "0", icon: ClipboardCheck, color: "text-rose-600", bg: "bg-rose-100/50" },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Here is the real-time status of your management system.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/dashboard/teachers/new" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
             <Plus size={18} />
             Add New Teacher
           </Link>
        </div>
      </div>

      {/* Stats Grid - Using Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <TrendingUp size={12} /> Live
              </span>
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.name}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Teachers Table - FROM DATABASE */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
            <h3 className="font-extrabold text-slate-800">Recently Added Staff</h3>
            <Link href="/dashboard/teachers" className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline transition-all">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Teacher Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Subject</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTeachers.length > 0 ? (
                  recentTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {teacher.name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">{teacher.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-semibold font-sans uppercase">{teacher.subject}</td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-200">Active</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 text-right font-medium">
                        {new Date(teacher.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-medium">
                      No staff members found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Static Info or Schedule Placeholder */}
        <div className="bg-white rounded-[2rem] border border-slate-50 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-extrabold text-slate-800">System Activity</h3>
            <div className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Notice</p>
               <p className="text-sm font-bold text-slate-700 tracking-tight">
                 Database is connected and syncing real-time data.
               </p>
            </div>
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
               <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Update</p>
               <p className="text-sm font-bold text-slate-700 tracking-tight">
                 You have {totalTeachers} registered teachers in the system.
               </p>
            </div>
          </div>
          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all mt-8 uppercase tracking-widest">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}