import db from "@/lib/db";
import { 
  Users, GraduationCap, School, Mail, 
  TrendingUp, UserPlus, 
  MessageSquare, Clock, ShieldCheck, Activity,
  Plus 
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  // 1. Kasoo saar tirooyinka guud (Sequential await to avoid timeout)
  const teacherCount = await db.teacher.count();
  const classCount = await db.class.count();
  const pendingApps = await db.instructorApplication.count({ where: { status: "PENDING" } });
  const newMessagesCount = await db.contactMessage.count({ where: { status: "UNREAD" } });

  // 2. Tirinta Ardayda Active-ka ah (Total Active)
  const totalActiveStudents = await db.student.count({
    where: { status: "Active" }
  });

  // 3. Tirinta heerarka (Active Only) - Hubi in database-ka uu xogtan leeyahay
  const hooseActive = await db.student.count({
    where: { 
      status: "Active", 
      grade: { in: ["1", "2", "3", "4", "Grade 1", "Grade 2", "Grade 3", "Grade 4"] } 
    }
  });

  const dhaxeActive = await db.student.count({
    where: { 
      status: "Active", 
      grade: { in: ["5", "6", "7", "8", "Grade 5", "Grade 6", "Grade 7", "Grade 8"] } 
    }
  });

  const sareActive = await db.student.count({
    where: { 
      status: "Active", 
      grade: { in: ["9", "10", "11", "12", "Grade 9", "Grade 10", "Grade 11", "Grade 12"] } 
    }
  });

  const totalForBar = hooseActive + dhaxeActive + sareActive || 1;

  const stats = [
    { label: "Ardayda Active", value: totalActiveStudents, icon: <Users size={22} />, color: "from-blue-600 to-indigo-600", shadow: "shadow-blue-100", percentage: "Live" },
    { label: "Macallimiinta", value: teacherCount, icon: <GraduationCap size={22} />, color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-100", percentage: "Total" },
    { label: "Fasallada", value: classCount, icon: <School size={22} />, color: "from-orange-500 to-amber-600", shadow: "shadow-orange-100", percentage: "Stable" },
    { label: "Codsiyada New", value: pendingApps, icon: <Clock size={22} />, color: "from-rose-500 to-pink-600", shadow: "shadow-rose-100", percentage: "New" },
  ];

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border shadow-sm text-left">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <ShieldCheck size={20} className="text-blue-600" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 font-medium text-sm">Ku soo dhawaad, nidaamkaagu wuxuu u shaqaynayaa si heer sare ah.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
           <div className="flex -space-x-3 ml-2 uppercase">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black tracking-tighter">AD</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black tracking-tighter">US</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black tracking-tighter">MN</div>
           </div>
           <div className="h-8 w-[1px] bg-slate-200 mx-2" />
           <div className="pr-4 text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none tracking-widest">Status</p>
              <div className="flex items-center gap-1.5 mt-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Online</span>
              </div>
           </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:${stat.shadow} hover:shadow-2xl transition-all duration-500 group relative overflow-hidden text-left`}>
            <div className="relative z-10 flex flex-col gap-4">
               <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                 {stat.icon}
               </div>
               <div>
                  <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                       <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${i === 3 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                       {stat.percentage}
                    </span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* CENTER VISUAL: GUUD AHAAN DUGSIGA */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden h-full text-left">
              <div className="relative z-10 text-left">
                <div className="flex justify-between items-center mb-10 text-left">
                   <div className="text-left">
                      <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Guud ahaan Dugsiga</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Qaybinta Ardayda Active-ka ah heerarkooda</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-2xl text-blue-600">
                      <Activity size={20} />
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 text-left">
                   <div className="space-y-8 text-left">
                      <div className="space-y-3">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span className="flex items-center gap-2 text-blue-600 font-black"><div className="w-2 h-2 rounded-full bg-blue-600" /> Hoose (1-4)</span>
                            <span>{hooseActive} Arday</span>
                         </div>
                         <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${(hooseActive / totalForBar) * 100}%` }} />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span className="flex items-center gap-2 text-emerald-600 font-black"><div className="w-2 h-2 rounded-full bg-emerald-600" /> Dhaxe (5-8)</span>
                            <span>{dhaxeActive} Arday</span>
                         </div>
                         <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full transition-all duration-1000" style={{ width: `${(dhaxeActive / totalForBar) * 100}%` }} />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span className="flex items-center gap-2 text-orange-500 font-black"><div className="w-2 h-2 rounded-full bg-orange-500" /> Sare (9-12)</span>
                            <span>{sareActive} Arday</span>
                         </div>
                         <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${(sareActive / totalForBar) * 100}%` }} />
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-center items-center text-center relative overflow-hidden shadow-2xl">
                      <div className="relative z-10 text-center">
                         <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <TrendingUp size={40} className="text-emerald-400" />
                         </div>
                         <p className="text-5xl font-black tracking-tighter mb-2">{totalActiveStudents}</p>
                         <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Active Students</p>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* SIDE ACTIONS */}
        <div className="space-y-6 text-left">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
            <h3 className="font-black text-slate-800 text-lg mb-6 tracking-tight flex items-center gap-2 uppercase">
               <Plus size={20} className="text-blue-600" /> Quick Actions
            </h3>
            <div className="space-y-3">
               <Link href="/dashboard/admin/students" className="group w-full flex items-center gap-4 bg-slate-50 hover:bg-blue-600 p-4 rounded-2xl transition-all duration-300">
                  <div className="bg-white p-2 rounded-xl group-hover:bg-blue-500 transition-colors">
                     <UserPlus size={18} className="text-blue-600 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-black text-slate-700 group-hover:text-white uppercase tracking-tight">Add Student</span>
               </Link>
               <Link href="/dashboard/admin/inbox" className="group w-full flex items-center gap-4 bg-slate-50 hover:bg-emerald-600 p-4 rounded-2xl transition-all duration-300 relative">
                  <div className="bg-white p-2 rounded-xl group-hover:bg-emerald-500 transition-colors">
                     <Mail size={18} className="text-emerald-600 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-black text-slate-700 group-hover:text-white uppercase tracking-tight">Inbox Messages</span>
                  {newMessagesCount > 0 && <span className="absolute right-4 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{newMessagesCount}</span>}
               </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden text-left">
             <div className="relative z-10 text-left">
                <div className="flex items-center gap-3 mb-4 text-left">
                   <div className="bg-white/10 p-2 rounded-xl">
                      <MessageSquare size={16} className="text-blue-400" />
                   </div>
                   <h3 className="font-black tracking-tight text-lg">System Health</h3>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mt-6 text-left">
                   <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                      {pendingApps > 0 
                        ? `Attention: Waxaa jira ${pendingApps} codsi oo u baahan oggolaansho.` 
                        : "Dhammaan codsiyada iyo ogeysiisyada waa la xalliyay."}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}