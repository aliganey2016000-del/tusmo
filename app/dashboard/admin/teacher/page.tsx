import db from "@/lib/db";
import { Plus, Search, Mail, Phone, MoreVertical, GraduationCap } from "lucide-react";
import Link from "next/link";

export default async function AdminTeachersPage() {
  // 1. Ka soo qaad dhamaan macalimiinta Database-ka
  const teachers = await db.teacher.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <GraduationCap className="text-blue-600" /> Maamulka Macalimiinta
          </h1>
          <p className="text-slate-500 text-sm">Waxaad halkan ku arki kartaa dhamaan macalimiinta diiwaangashan ({teachers.length})</p>
        </div>
        <Link href="/dashboard/admin/teachers/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100">
            <Plus size={20} /> Ku dar Macalin Cusub
          </button>
        </Link>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search teachers by name, email or subject..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* TEACHERS TABLE */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-slate-400 text-xs uppercase tracking-widest">
              <th className="px-8 py-5 font-bold">Macalinka</th>
              <th className="px-8 py-5 font-bold">Maadada</th>
              <th className="px-8 py-5 font-bold">Xiriirka</th>
              <th className="px-8 py-5 font-bold">Status</th>
              <th className="px-8 py-5 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{teacher.name}</p>
                      <p className="text-xs text-slate-400">ID: {teacher.id.substring(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold">
                    {teacher.subject}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail size={12} /> {teacher.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone size={12} /> {teacher.phone}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    {teacher.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-slate-300 hover:text-slate-600 p-2 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {teachers.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-300 border-2 border-dashed border-slate-200">
               <GraduationCap size={40} />
            </div>
            <p className="text-slate-400 font-medium">Ma jiraan macalimiin weli la diiwaangeliyey.</p>
            <Link href="/dashboard/admin/teachers/add" className="text-blue-600 font-bold text-sm hover:underline underline-offset-4">
               Hadda bilow diiwaangelinta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}