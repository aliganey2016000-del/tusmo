import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, User, Calendar, MessageSquare } from "lucide-react";

export default async function InboxPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 space-y-6 text-left">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Fariimaha (Inbox)</h1>
          <p className="text-slate-500 text-sm italic">Waxaad halkan ku arki kartaa dadka kula soo xiriiray.</p>
        </div>
        <div className="bg-blue-50 px-6 py-2 rounded-2xl border border-blue-100 text-blue-700 font-bold text-sm">
          {messages.length} Fariimood
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black py-5 pl-10 uppercase text-[10px] tracking-widest text-slate-800">Qofka Soo Diray</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-800">Ujeedada</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-800">Fariinta</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-800">Taariikhda</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id} className="hover:bg-slate-50/50 transition-all">
                <TableCell className="py-6 pl-10 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <User size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 capitalize text-sm">{msg.name}</span>
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} className="text-blue-500" /> {msg.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-blue-600 text-xs bg-blue-50 px-3 py-1 rounded-lg">
                    {msg.subject}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-slate-600 line-clamp-1">{msg.message}</p>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
                    <Calendar size={14} className="text-slate-300" />
                    {new Date(msg.createdAt).toLocaleDateString('so-SO')}
                  </span>
                </TableCell>
              </TableRow>
            ))}

            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-40">
                  <div className="flex flex-col items-center gap-4 text-slate-300">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                      <MessageSquare size={40} />
                    </div>
                    <p className="text-lg font-black text-slate-400 tracking-tight">Inbox-kaagu waa faaruq</p>
                    <p className="text-sm font-medium">Ma jiraan fariimo cusub oo hadda ku soo dhacay.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}