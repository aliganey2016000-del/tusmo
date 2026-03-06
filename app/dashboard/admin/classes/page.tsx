'use client';

import { useState, useEffect, useCallback } from "react";
import { Class, Teacher } from "@prisma/client";
import { addClass, updateClass, deleteClass } from "@/app/actions/classActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { School, DoorOpen, Users, Trash2, Pencil, Plus, Loader2 } from "lucide-react";

type ExtendedClass = Class & {
  teachers: Teacher[];
  _count: { students: number };
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<ExtendedClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [classRes, teacherRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/teachers')
      ]);
      setClasses(await classRes.json());
      setTeachers(await teacherRes.json());
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const ClassForm = ({ cls }: { cls?: ExtendedClass }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
      <div className="space-y-1.5">
        <Label className="font-bold text-xs uppercase">Magaca Fasalka</Label>
        <Input name="name" defaultValue={cls?.name} placeholder="Grade 10A" required className="rounded-xl h-12 bg-slate-50 border-none font-bold" />
      </div>
      <div className="space-y-1.5">
        <Label className="font-bold text-xs uppercase">Room</Label>
        <Input name="room" defaultValue={cls?.room} placeholder="Room 204" required className="rounded-xl h-12 bg-slate-50 border-none font-bold" />
      </div>
      <div className="space-y-1.5">
        <Label className="font-bold text-xs uppercase">Capacity</Label>
        <Input name="capacity" type="number" defaultValue={cls?.capacity} required className="rounded-xl h-12 bg-slate-50 border-none font-bold" />
      </div>
      
      {/* MULTIPLE TEACHERS SELECTION */}
      <div className="space-y-1.5 col-span-full">
        <Label className="font-bold text-xs uppercase text-slate-400 tracking-widest">Dooro Macallimiinta</Label>
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-2xl max-h-40 overflow-y-auto border border-slate-100">
          {teachers.map(t => (
            <label key={t.id} className="flex items-center gap-2 p-2 hover:bg-white rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-100">
              <input 
                type="checkbox" 
                name="teacherIds" 
                value={t.id} 
                defaultChecked={cls?.teachers?.some(at => at.id === t.id)}
                className="w-4 h-4 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-bold text-slate-700">{t.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 text-left">
      <div className="bg-white p-8 rounded-[2rem] border shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Maamulka Fasallada</h1>
          <p className="text-slate-500 text-sm italic">Hadda waxaad u dooran kartaa macallimiin badan hal fasal.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 px-6 font-bold flex gap-2 shadow-lg shadow-blue-100"><Plus size={18} /> Ku dar Fasal</Button></DialogTrigger>
          <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl overflow-hidden">
            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b"><DialogTitle className="text-2xl font-black text-slate-800 text-left">Abuur Fasal</DialogTitle></DialogHeader>
            <form onSubmit={async (e) => { e.preventDefault(); await addClass(new FormData(e.currentTarget)); setIsAddOpen(false); fetchData(); }} className="space-y-4 pt-4"><ClassForm /><Button type="submit" className="w-full bg-blue-600 h-14 rounded-xl font-black text-lg">Keydi Fasalka</Button></form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden font-bold">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4"><Loader2 className="animate-spin text-blue-600" /><p className="text-slate-400">Waa la rarayaa...</p></div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black py-5 pl-10 text-[10px] uppercase tracking-widest text-slate-800 text-left">Fasalka</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-800 text-left">Macallimiinta</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-800 text-left">Ardayda</TableHead>
                <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-widest text-slate-800">Tallaabo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id} className="hover:bg-slate-50/50 transition-all border-slate-100">
                  <TableCell className="py-6 pl-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black"><School size={20} /></div>
                      <div className="text-left">
                        <p className="font-black text-slate-800 capitalize text-sm">{cls.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1.5"><DoorOpen size={12} /> {cls.room}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {cls.teachers.length > 0 ? cls.teachers.map(t => (
                        <Badge key={t.id} variant="secondary" className="bg-emerald-50 text-emerald-700 border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">{t.name}</Badge>
                      )) : <span className="text-[11px] text-slate-300 italic">Lama xirin</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-300" />
                      <span className="text-xs text-slate-500 font-bold">{cls._count.students} / {cls.capacity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    <div className="flex justify-end gap-2 text-left">
                      <Dialog>
                        <DialogTrigger asChild><Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Pencil size={18} /></Button></DialogTrigger>
                        <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl overflow-hidden text-left">
                          <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b"><DialogTitle className="text-2xl font-black text-slate-800">Cusboonaysii Fasalka</DialogTitle></DialogHeader>
                          <form onSubmit={async (e) => { e.preventDefault(); await updateClass(new FormData(e.currentTarget)); fetchData(); }} className="space-y-4 pt-4"><input type="hidden" name="id" value={cls.id} /><ClassForm cls={cls} /><Button type="submit" className="w-full bg-blue-600 h-14 rounded-xl font-black text-lg">Badal Xogta</Button></form>
                        </DialogContent>
                      </Dialog>
                      <Button onClick={async () => { if (confirm(`Ma tirtirtaa ${cls.name}?`)) { await deleteClass(cls.id); fetchData(); } }} variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 rounded-xl transition-all"><Trash2 size={18} /></Button>
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