'use client';

import { useState, useCallback, useEffect } from "react";
import { Student, Class } from "@prisma/client";
import {
  addStudent,
  deleteStudent,
  updateStudent,
  toggleStudentStatus
} from "@/app/actions/studentActions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Trash2, Pencil, Loader2, 
  Plus, BookOpen, Users, ChevronDown, Check, Activity
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface StudentWithClass extends Student {
  class?: Class | null;
}

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  icon: React.ElementType;
}

export default function StudentsPage() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Active"]);
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<StudentWithClass[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const levels = ["Primary", "Middle", "Secondary"];
  const statuses = ["Active", "Inactive", "Pending"];

  const fetchStudents = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevels.length > 0) params.append("levels", selectedLevels.join(","));
      if (selectedStatuses.length > 0) params.append("statuses", selectedStatuses.join(","));
      if (query) params.append("query", query);

      const res = await fetch(`/api/students?${params.toString()}`, { signal });
      if (res.ok) setStudents(await res.json());
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedLevels, selectedStatuses, query]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/classes', { signal: controller.signal })
      .then(res => res.json())
      .then(setClasses)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Ma hubtaa?")) {
      try {
        await deleteStudent(id);
        fetchStudents();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Cillad");
      }
    }
  };

  const handleToggleStatus = async (id: string, status: string) => {
    try {
      await toggleStudentStatus(id, status);
      fetchStudents();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Cillad");
    }
  };

  const toggleFilter = (item: string, state: string[], setState: (v: string[]) => void) => {
    setState(state.includes(item) ? state.filter(i => i !== item) : [...state, item]);
  };

  const StudentFormFields = ({ student }: { student?: StudentWithClass }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-black text-left">
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Magaca</Label>
        <Input name="name" defaultValue={student?.name} required className="rounded-xl h-12 bg-slate-50 border-none font-black" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Email</Label>
        <Input name="email" type="email" defaultValue={student?.email} required className="rounded-xl h-12 bg-slate-50 border-none font-black" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Fasalka</Label>
        <select name="classId" defaultValue={student?.classId || ""} required className="w-full h-12 rounded-xl bg-slate-50 px-3 text-sm font-black outline-none">
          <option value="">-- Dooro --</option>
          {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">Jinsiga</Label>
        <select name="gender" defaultValue={student?.gender || "Male"} className="w-full h-12 rounded-xl bg-slate-50 px-3 text-sm font-black outline-none">
          <option value="Male">Lab</option>
          <option value="Female">Dhedig</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-black uppercase">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="text-left">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Maamulka Ardayda</h1>
          <p className="text-slate-400 text-[10px] tracking-widest mt-1">Enterprise Database</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 px-8 font-black text-white shadow-lg active:scale-95 transition-all"><Plus size={18} /> Ku dar Arday</Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl font-black text-left">
            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b"><DialogTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">Diiwaangeli</DialogTitle></DialogHeader>
            <form onSubmit={async (e) => { 
              e.preventDefault(); setIsSubmitting(true);
              try { await addStudent(new FormData(e.currentTarget)); setIsAddOpen(false); fetchStudents(); } 
              finally { setIsSubmitting(false); }
            }} className="space-y-6 pt-4 font-black">
              <StudentFormFields />
              <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 h-14 rounded-2xl font-black text-white shadow-xl shadow-blue-100">{isSubmitting ? <Loader2 className="animate-spin" /> : "Keydi"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTERS */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-[2.2rem] border border-slate-100 shadow-xl flex flex-wrap items-center gap-4 sticky top-4 z-40">
        <MultiSelectDropdown label="Heerarka" options={levels} selected={selectedLevels} onToggle={(v) => toggleFilter(v, selectedLevels, setSelectedLevels)} icon={BookOpen} />
        <MultiSelectDropdown label="Xaaladda" options={statuses} selected={selectedStatuses} onToggle={(v) => toggleFilter(v, selectedStatuses, setSelectedStatuses)} icon={Activity} />
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Raadi..." className="pl-11 rounded-2xl h-12 bg-slate-50 border-none font-black text-xs" />
        </div>
        <Button onClick={() => fetchStudents()} disabled={loading} className="h-12 px-10 rounded-2xl bg-slate-900 text-white font-black flex gap-2 shadow-lg">{loading ? <Loader2 className="animate-spin" /> : <Search size={18} />}<span>Sifeey</span></Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {!hasSearched ? (
          <div className="py-32 text-center space-y-6 font-black"><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto animate-bounce"><Users size={40} className="text-slate-200" /></div><p className="text-slate-400 text-[10px] uppercase">Dooro miiraha si aad u bilowdo</p></div>
        ) : loading ? (
          <div className="p-10 space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 w-full bg-slate-50 animate-pulse rounded-2xl" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-black">
              <thead className="bg-slate-50/50">
                <tr className="border-b border-slate-100">
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest font-black">Ardayga</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest text-center font-black">Fasalka</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest text-center font-black">Status</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest text-right font-black">Ficil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 font-black">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg font-black uppercase">{student.name.charAt(0)}</div>
                        <div className="flex flex-col text-left"><span className="text-sm text-slate-800 font-black">{student.name}</span><span className="text-[9px] text-slate-400 lowercase">{student.email}</span></div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <Badge className="bg-blue-50 text-blue-700 border-none text-[10px] font-black uppercase">{student.class?.name || "N/A"}</Badge>
                    </td>
                    <td className="p-6 text-center font-black">
                      <Badge className={`border-none font-black text-[9px] px-3 py-1 uppercase ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{student.status}</Badge>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Button onClick={() => handleToggleStatus(student.id, student.status)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-amber-50 text-slate-400 hover:text-amber-600"><Activity size={18} /></Button>
                        <Dialog>
                          <DialogTrigger asChild><Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 font-black"><Pencil size={18} /></Button></DialogTrigger>
                          <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl font-black text-left">
                            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
                              <DialogTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">Cusboonaysii</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={async (e) => { 
                                e.preventDefault(); setIsSubmitting(true);
                                try { await updateStudent(new FormData(e.currentTarget)); fetchStudents(); } 
                                finally { setIsSubmitting(false); }
                              }} className="space-y-6 pt-4 font-black">
                              <input type="hidden" name="id" value={student.id} />
                              <StudentFormFields student={student} />
                              <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 h-14 rounded-2xl font-black text-white">Badal</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={() => handleDelete(student.id)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600"><Trash2 size={18} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MultiSelectDropdown({ label, options, selected, onToggle, icon: Icon }: MultiSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-12 w-full md:w-60 justify-between rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase tracking-widest px-6 shadow-sm">
          <div className="flex items-center gap-2"><Icon size={14} className="text-slate-400" /><span className="text-slate-400 font-black">{label}:</span><span className="text-blue-600 font-black">{selected.length > 0 ? `${selected.length} la doortay` : "Dhammaan"}</span></div>
          <ChevronDown size={14} className="text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2 rounded-[1.5rem] border-slate-100 shadow-2xl z-50 font-black">
        <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-hide font-black">
          {options.map((opt) => (
            <div key={opt} onClick={() => onToggle(opt)} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all group font-black">
              <span className={`text-[11px] font-black uppercase ${selected.includes(opt) ? 'text-blue-600' : 'text-slate-600'}`}>{opt}</span>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected.includes(opt) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white'}`}>{selected.includes(opt) && <Check size={12} />}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}