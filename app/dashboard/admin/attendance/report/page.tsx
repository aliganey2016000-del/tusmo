import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen, School, ClipboardList } from "lucide-react";

export default async function AttendanceReportPage() {
  // Soo saar dhammaan imaanshaha adoo isku daraya magacyada
  const history = await prisma.attendance.findMany({
    include: {
      student: true,
      class: true,
      teacher: true,
    },
    orderBy: { date: 'desc' },
    take: 50 // 50-kii u dambeeyay
  });

  return (
    <div className="p-6 space-y-6 text-left font-bold">
      {/* HEADER SECTION */}
      <div className="bg-white p-8 rounded-[2rem] border shadow-sm flex justify-between items-center">
         <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
               <ClipboardList size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-800 tracking-tight">Warbixinta Imaanshaha</h1>
               <p className="text-slate-400 text-sm italic font-medium">Taariikhda iyo faahfaahinta xaadiriska casharka.</p>
            </div>
         </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden text-left">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="py-5 pl-10 text-[10px] uppercase font-black tracking-widest text-slate-500">Taariikhda</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-500">Ardayga</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-500">Fasalka / Maaddada</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-500">Macallinka</TableHead>
              <TableHead className="text-center text-[10px] uppercase font-black tracking-widest text-slate-500">Xaaladda</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((record) => (
              <TableRow key={record.id} className="border-slate-50 hover:bg-slate-50/50 transition-all text-left">
                <TableCell className="py-5 pl-10 text-left">
                   <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Calendar size={14} className="text-blue-500" />
                      {new Date(record.date).toLocaleDateString('so-SO')}
                   </div>
                </TableCell>
                <TableCell className="text-left">
                   <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="font-black text-slate-800 capitalize">{record.student.name}</span>
                   </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-blue-600 text-xs uppercase font-black">
                       <School size={12} /> {record.class.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                       <BookOpen size={10} /> {record.subject}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                   <span className="text-slate-500 text-xs font-bold capitalize">{record.teacher.name}</span>
                </TableCell>
                <TableCell>
                   <div className="flex justify-center">
                      <Badge className={`font-black text-[10px] uppercase px-3 py-1 rounded-lg border-none shadow-sm ${
                        record.status === 'Present' 
                        ? 'bg-emerald-500 text-white' 
                        : record.status === 'Absent' 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-amber-500 text-white'
                      }`}>
                        {record.status}
                      </Badge>
                   </div>
                </TableCell>
              </TableRow>
            ))}

            {history.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-40 text-slate-300 font-bold">
                   Ma jiraan wax xog ah oo la keydiyay xilligan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}