import db from "@/lib/db";
import { Users, GraduationCap, School, CreditCard, ArrowUpRight, TrendingUp } from "lucide-react";


export default async function AdminDashboard() {
  const studentCount = await db.student.count();
  const teacherCount = await db.teacher.count();
  const classCount = await db.class.count();

  const stats = [
    { label: "Students", value: studentCount, icon: <Users />, color: "bg-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Teachers", value: teacherCount, icon: <GraduationCap />, color: "bg-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "Classes", value: classCount, icon: <School />, color: "bg-orange-600", bg: "bg-orange-50", text: "text-orange-600" },
    { label: "Revenue", value: "$12,450", icon: <CreditCard />, color: "bg-indigo-600", bg: "bg-indigo-50", text: "text-indigo-600" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Halkan waa warbixinta guud ee dugsiga.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} ${stat.text} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-full text-slate-300">
               <TrendingUp size={16} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-800">Recent Students</h3>
            <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          {/* Table logic halkan geli hadhow */}
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 font-medium">
             Charts & Graphs will appear here
          </div>
        </div>

        {/* SIDE ACTIONS */}
        <div className="space-y-6">
          <div className="bg-linear-to-br from-blue-700 to-indigo-800 p-8 rounded-[2rem] text-white shadow-lg shadow-blue-200">
            <h3 className="font-bold text-xl mb-2">School Calendar</h3>
            <p className="text-blue-100 text-sm mb-6">Imtixaanka bisha koowaad wuxuu bilaabanayaa 15-ka March.</p>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md py-3 rounded-xl font-bold transition-colors">
              View Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}