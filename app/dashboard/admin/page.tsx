import db from "@/lib/db";
import { 
  Users, GraduationCap, School, Mail, 
  ArrowUpRight, TrendingUp, UserPlus, 
  MessageSquare, Clock 
} from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default async function AdminDashboard() {
  // 1. Kasoo saar tirooyinka guud database-ka
  const [studentCount, teacherCount, classCount, pendingApps, newMessages] = await Promise.all([
    db.student.count(),
    db.teacher.count(),
    db.class.count(),
    db.instructorApplication.count({ where: { status: "PENDING" } }),
    db.contactMessage.count({ where: { status: "UNREAD" } }),
  ]);

  // 2. Kasoo saar ardaydii ugu dambaysay ee ku soo biirtay (5-tii u dambaysay)
  const recentStudents = await db.student.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  const stats = [
    { label: "Ardayda", value: studentCount, icon: <Users size={24} />, bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Macallimiinta", value: teacherCount, icon: <GraduationCap size={24} />, bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "Fasallada", value: classCount, icon: <School size={24} />, bg: "bg-orange-50", text: "text-orange-600" },
    { label: "Codsiyada New", value: pendingApps, icon: <Clock size={24} />, bg: "bg-rose-50", text: "text-rose-600" },
  ];

  return (
    <div className="space-y-10 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 italic">Welcome back! Halkan waa warbixinta guud ee dugsiga.</p>
        </div>
        
        <div className="flex gap-3">
            <div className="bg-white px-6 py-3 rounded-2xl border shadow-sm flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-sm font-bold text-slate-600">Nidaamku waa Online</span>
            </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className={`${stat.bg} ${stat.text} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-full text-slate-300">
               <TrendingUp size={16} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* RECENT STUDENTS TABLE */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Ardayda Cusub</h3>
            <Link href="/dashboard/admin/students" className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          
          <div className="overflow-hidden">
             <Table>
                <TableBody>
                   {recentStudents.map((student) => (
                     <TableRow key={student.id} className="hover:bg-slate-50 border-none transition-colors">
                        <TableCell className="py-4 font-bold text-slate-700 capitalize">{student.name}</TableCell>
                        <TableCell className="py-4 text-slate-400 text-sm font-medium">{student.grade}</TableCell>
                        <TableCell className="py-4 text-right">
                           <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-lg uppercase">
                              {student.status}
                           </span>
                        </TableCell>
                     </TableRow>
                   ))}
                   {recentStudents.length === 0 && (
                     <p className="text-center py-10 text-slate-400 font-medium italic">Wali arday lama diwaangelin.</p>
                   )}
                </TableBody>
             </Table>
          </div>
        </div>

        {/* SIDE ACTIONS & MESSAGES */}
        <div className="space-y-6">
          {/* QUICK ACTIONS */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
            <h3 className="font-black text-lg mb-6 tracking-tight">Quick Actions</h3>
            <div className="space-y-3">
               <Link href="/dashboard/admin/students" className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all">
                  <UserPlus size={18} className="text-blue-400" />
                  <span className="text-sm font-bold">Add New Student</span>
               </Link>
               <Link href="/dashboard/admin/inbox" className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all">
                  <Mail size={18} className="text-emerald-400" />
                  <span className="text-sm font-bold">Check Messages</span>
                  {newMessages > 0 && <span className="ml-auto bg-rose-500 text-[10px] px-2 py-0.5 rounded-full">{newMessages}</span>}
               </Link>
            </div>
          </div>

          {/* NOTIFICATION CARD */}
          <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem]">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-500 text-white p-2 rounded-lg">
                   <MessageSquare size={16} />
                </div>
                <h3 className="font-black text-orange-900">Notifications</h3>
             </div>
             <p className="text-orange-700/70 text-sm leading-relaxed font-medium">
                {pendingApps > 0 
                  ? `Waxaa jira ${pendingApps} codsi oo ka yimid macallimiin raba inay ku soo biiraan.` 
                  : "Ma jiraan ogeysiisyo cusub oo muhiim ah xilligan."}
             </p>
             {pendingApps > 0 && (
                <Link href="/dashboard/admin/instructor-requests" className="mt-4 block text-sm font-black text-orange-900 underline">
                   Eeg Codsiyada
                </Link>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}