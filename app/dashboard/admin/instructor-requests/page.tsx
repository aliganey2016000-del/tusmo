'use client';

import { useState, useEffect, useCallback } from "react";
import { InstructorApplication } from "@prisma/client";
import { approveInstructor, rejectInstructor } from "@/app/actions/instructorActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye } from "lucide-react"; // Waxaan ka saarnay CheckCircle iyo XCircle maadaama aan la isticmaalin
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function InstructorRequests() {
  const [apps, setApps] = useState<InstructorApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. fetchApps oo la dhisay (memoized)
  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/instructor-applications');
      const data = await res.json();
      setApps(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. useEffect oo sax ah
  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  return (
    <div className="p-6 space-y-6 text-left">
      <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
        <h1 className="text-2xl font-black text-slate-800">Codsiyada Macallimiinta</h1>
        <p className="text-slate-500 text-sm">Maamul dadka raba inay macallimiin noqdaan.</p>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-600" />
            <p className="text-slate-400 font-bold">Waa la rarayaa...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold py-5 pl-10 text-[10px] uppercase text-left">Codsadaha</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-left">Maadada</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-left">Status</TableHead>
                <TableHead className="text-right pr-10 font-bold text-[10px] uppercase">Tallaabo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="py-5 pl-10 text-left">
                    <p className="font-bold text-slate-800">{app.fullName}</p>
                    <p className="text-[11px] text-slate-400">{app.email}</p>
                  </TableCell>
                  <TableCell className="text-left">
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none font-bold uppercase text-[9px]">
                      {app.specialty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className={`text-[10px] font-black uppercase ${app.status === 'PENDING' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    <div className="flex justify-end gap-2 text-left">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Eye size={18} /></Button>
                        </DialogTrigger>
                        <DialogContent className="text-left rounded-[2rem]">
                          <DialogHeader>
                            <DialogTitle className="text-left">Xogta Codsadaha</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4 text-left">
                            <div className="bg-slate-50 p-4 rounded-xl">
                              <p className="text-xs font-bold text-slate-400 uppercase">Bio / Sharaxaad</p>
                              {/* CALAAMADAHA " " OO LA SAXAY (Escaped) */}
                              <p className="text-sm italic">&ldquo;{app.bio || "Ma jiro"}&rdquo;</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase">Phone</p>
                                <p className="font-bold">{app.phone || "N/A"}</p>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase">Experience</p>
                                <p className="font-bold">{app.experience || "Lama sheegin"}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {app.status === "PENDING" && (
                        <>
                          <Button 
                            onClick={async () => { if(confirm("Ma aqbashaa?")) { await approveInstructor(app.id); fetchApps(); } }} 
                            className="bg-emerald-600 hover:bg-emerald-700 h-8 text-[10px] font-bold px-3 rounded-lg"
                          >
                            Approve
                          </Button>
                          <Button 
                            onClick={async () => { if(confirm("Ma diiddaa?")) { await rejectInstructor(app.id); fetchApps(); } }} 
                            className="bg-rose-500 hover:bg-rose-600 h-8 text-[10px] font-bold px-3 rounded-lg"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}