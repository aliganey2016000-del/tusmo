'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { Teacher } from "@prisma/client";
import { addTeacher, updateTeacher, deleteTeacher } from "@/app/actions/teacherActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, Trash2, Pencil, Plus, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types for better safety
interface Assignment {
  subject: string;
  grade: string;
}

interface ClassData {
  id: string;
  name: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [dbClasses, setDbClasses] = useState<ClassData[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        fetch('/api/teachers'),
        fetch('/api/classes') 
      ]);
      
      if (tRes.ok) setTeachers(await tRes.json());
      if (cRes.ok) setDbClasses(await cRes.json());
    } catch {
      console.error("Xogta lama soo heli karo");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const uniqueSubjects = useMemo(() => {
    const subs = new Set<string>();
    teachers.forEach(t => {
      if (!t.subject) return;
      try {
        const parsed = JSON.parse(t.subject);
        if (Array.isArray(parsed)) {
          parsed.forEach((s: Assignment) => {
            if (s.subject) subs.add(s.subject.trim().toUpperCase());
          });
        }
      } catch {
        subs.add(t.subject.trim().toUpperCase());
      }
    });
    return Array.from(subs).sort();
  }, [teachers]);

  const TeacherForm = ({ teacher }: { teacher?: Teacher }) => {
    const getInitialAssignments = (): Assignment[] => {
      if (!teacher?.subject) return [{ subject: '', grade: '' }];
      try {
        if (teacher.subject.startsWith('[') || teacher.subject.startsWith('{')) return JSON.parse(teacher.subject);
        return [{ subject: teacher.subject, grade: '' }];
      } catch {
        return [{ subject: teacher?.subject || '', grade: '' }];
      }
    };

    const [assignments, setAssignments] = useState<Assignment[]>(getInitialAssignments());

    const addRow = () => setAssignments([...assignments, { subject: '', grade: '' }]);
    const removeRow = (index: number) => setAssignments(assignments.filter((_, i) => i !== index));
    
    const updateRow = (index: number, field: keyof Assignment, value: string) => {
      const newArr = [...assignments];
      newArr[index][field] = field === 'subject' ? value.toUpperCase() : value;
      setAssignments(newArr);
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          <div className="space-y-1.5">
            <Label className="font-bold text-xs uppercase text-slate-500">Magaca Macallinka</Label>
            <Input name="name" defaultValue={teacher?.name} required className="rounded-xl h-12 bg-slate-50 border-none font-bold" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-xs uppercase text-slate-500">Email-ka</Label>
            <Input name="email" type="email" defaultValue={teacher?.email} required className="rounded-xl h-12 bg-slate-50 border-none font-bold" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-xs uppercase text-slate-500">Taleefanka</Label>
            <Input name="phone" defaultValue={teacher?.phone} required className="rounded-xl h-12 bg-slate-50 border-none font-bold" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-xs uppercase text-slate-500">Heerka (Status)</Label>
            <select name="status" defaultValue={teacher?.status || "Active"} className="w-full rounded-xl h-12 bg-slate-50 border-none px-3 text-sm font-bold">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2">
               <BookOpen size={16} className="text-blue-600" />
               <Label className="font-black text-[10px] uppercase text-blue-600 tracking-widest">Maadooyinka & Fasallada</Label>
            </div>
            <Button type="button" onClick={addRow} variant="ghost" size="sm" className="text-blue-600 font-black text-[10px] uppercase hover:bg-blue-100">
              <Plus size={14} className="mr-1" /> Row Cusub
            </Button>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-left">
            {assignments.map((row, index) => (
              <div key={index} className="flex gap-3 items-end p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 group animate-in fade-in slide-in-from-top-2">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Maadada</Label>
                  <Input 
                    list="all-subjects-list"
                    placeholder="Qor maado..." 
                    value={row.subject} 
                    onChange={(e) => updateRow(index, 'subject', e.target.value)}
                    className="rounded-xl bg-white border-slate-200 h-11 text-sm font-bold shadow-sm"
                    required
                  />
                </div>
                <div className="w-[180px] space-y-1.5">
                  <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Fasalka</Label>
                  <select 
                    value={row.grade} 
                    onChange={(e) => updateRow(index, 'grade', e.target.value)}
                    className="w-full rounded-xl h-11 bg-white border border-slate-200 px-3 text-sm font-bold shadow-sm"
                    required
                  >
                    <option value="">Dooro Fasal</option>
                    {dbClasses.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {assignments.length > 1 && (
                  <Button type="button" onClick={() => removeRow(index)} variant="ghost" size="icon" className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 h-11 w-11 rounded-xl">
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <datalist id="all-subjects-list">
            {uniqueSubjects.map(s => <option key={s} value={s} />)}
          </datalist>
          <input type="hidden" name="subjects" value={JSON.stringify(assignments)} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 text-left">
      <div className="bg-white p-8 rounded-[2rem] border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Maamulka Macallimiinta</h1>
          <p className="text-slate-500 text-sm font-bold italic mt-1">Waxaa kuu diwaangashan {teachers.length} macallin.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 px-8 font-bold flex gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
              <Plus size={18} /> Ku dar Macallin
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl">
            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b text-left">
              <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">Diiwaangeli Macallin</DialogTitle>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                await addTeacher(new FormData(e.currentTarget));
                setIsAddOpen(false);
                fetchData();
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4 pt-4">
              <TeacherForm />
              <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 h-14 rounded-[1.2rem] font-black text-lg shadow-lg shadow-blue-100">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Keydi Macallinka"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4 text-slate-400 font-bold"><Loader2 className="animate-spin text-blue-600" /> Waa la rarayaa...</div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="py-6 pl-10 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 text-left">Macallinka</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 text-left">Maadooyinka & Fasallada</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 text-left">Xiriirka</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 text-center">Status</TableHead>
                <TableHead className="text-right pr-10 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Tallaabo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((t) => {
                let subs: Assignment[] = [];
                try {
                  subs = t.subject && (t.subject.startsWith('[') || t.subject.startsWith('{')) 
                    ? JSON.parse(t.subject) 
                    : [{ subject: t.subject, grade: 'N/A' }];
                } catch {
                  subs = [{ subject: t.subject, grade: 'N/A' }];
                }

                return (
                  <TableRow key={t.id} className="group hover:bg-slate-50/50 border-slate-100 transition-colors">
                    <TableCell className="py-6 pl-10 text-left">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-[1.1rem] bg-gradient-to-br from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-base shadow-lg shadow-blue-100 uppercase">
                          {t.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-sm uppercase tracking-tight">{t.name}</span>
                          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 uppercase leading-none mt-1"><Mail size={12} /> {t.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex flex-wrap gap-2">
                        {subs.map((s, i) => (
                          <div key={i} className="bg-white border border-slate-200 text-[10px] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                            <span className="text-slate-800 font-black uppercase tracking-tight">{s.subject}</span>
                            {s.grade && s.grade !== 'N/A' && (
                              <span className="bg-blue-50 text-blue-600 font-black px-1.5 py-0.5 rounded-md text-[9px]">
                                {s.grade}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs bg-slate-100/50 w-fit px-3 py-1.5 rounded-xl">
                           <Phone size={14} className="text-emerald-500" />
                           {t.phone}
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        t.status === 'Active' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20 shadow-sm' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {t.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <Dialog open={isEditOpen === t.id} onOpenChange={(open) => setIsEditOpen(open ? t.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Pencil size={18} /></Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl overflow-hidden">
                            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b text-left">
                              <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">Cusboonaysii Xogta</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={async (e) => {
                              e.preventDefault();
                              setIsSubmitting(true);
                              try {
                                await updateTeacher(new FormData(e.currentTarget));
                                setIsEditOpen(null);
                                fetchData();
                              } finally {
                                setIsSubmitting(false);
                              }
                            }} className="space-y-4 pt-4">
                              <input type="hidden" name="id" value={t.id} />
                              <TeacherForm teacher={t} />
                              <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 h-14 rounded-[1.2rem] font-black text-lg shadow-lg shadow-blue-100">Cusboonaysii</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={async () => {
                          if (confirm(`Ma hubtaa inaad tirtirto macallin ${t.name}?`)) {
                            await deleteTeacher(t.id);
                            fetchData();
                          }
                        }} variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={18} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}