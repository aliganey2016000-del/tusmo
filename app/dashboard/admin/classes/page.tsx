'use client';

import { useState, useEffect, ChangeEvent } from "react";
import { Class, Teacher } from "@prisma/client";
import { addClass, updateClass, deleteClass } from "@/app/actions/classActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  School, DoorOpen, Trash2, Pencil, Plus, 
  Loader2, Search, BookOpen, Inbox, Users
} from "lucide-react";

interface ExtendedClass extends Class {
  teachers: Teacher[];
  _count: { students: number };
  level: string;
  shift: string;
}

export default function ClassesPage() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  
  const [classes, setClasses] = useState<ExtendedClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Xulashooyinka Miiraha (Filter Options)
  const levels = ["Primary", "Middle", "Secondary"];
  const shifts = ["Morning", "Afternoon", "Evening"];
  const allGrades = {
    Primary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4"],
    Middle: ["Grade 5", "Grade 6", "Grade 7", "Grade 8"],
    Secondary: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
  };

  const availableGrades = selectedLevels.length > 0 
    ? selectedLevels.flatMap(l => allGrades[l as keyof typeof allGrades])
    : Object.values(allGrades).flat();

  useEffect(() => {
    fetch('/api/teachers').then(res => res.json()).then(setTeachers);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevels.length) params.append("levels", selectedLevels.join(","));
      if (selectedGrades.length) params.append("grades", selectedGrades.join(","));
      if (selectedShifts.length) params.append("shifts", selectedShifts.join(","));

      const res = await fetch(`/api/classes?${params.toString()}`);
      if (res.ok) setClasses(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (item: string, state: string[], setState: (v: string[]) => void) => {
    setState(state.includes(item) ? state.filter(i => i !== item) : [...state, item]);
  };

  const ClassForm = ({ cls }: { cls?: ExtendedClass }) => {
    const [fLevel, setFLevel] = useState(cls?.level || "Primary");
    const [fGrade, setFGrade] = useState(cls?.name.split('-')[0] || "Grade 1");
    const [fSuffix, setFSuffix] = useState(cls?.name.split('-')[1] || "A");

    return (
      <div className="space-y-6 text-left font-bold">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-slate-400 ml-1 font-black tracking-widest">1. Heerka</Label>
            <select name="level" value={fLevel} onChange={(e: ChangeEvent<HTMLSelectElement>) => { const val = e.target.value as keyof typeof allGrades; setFLevel(val); setFGrade(allGrades[val][0]); }} className="w-full h-12 rounded-2xl bg-white border-none px-3 text-sm font-bold shadow-sm">
              <option value="Primary">Primary (Hoose)</option>
              <option value="Middle">Middle (Dhexe)</option>
              <option value="Secondary">Secondary (Sare)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-slate-400 ml-1 font-black tracking-widest">2. Fasalka</Label>
            <select value={fGrade} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFGrade(e.target.value)} className="w-full h-12 rounded-2xl bg-white border-none px-3 text-sm font-bold shadow-sm">
              {allGrades[fLevel as keyof typeof allGrades].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-slate-400 ml-1 font-black tracking-widest">3. Sumadda</Label>
            <select value={fSuffix} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFSuffix(e.target.value)} className="w-full h-12 rounded-2xl bg-white border-none px-3 text-sm font-bold shadow-sm">
              {["A", "B", "C", "D", "E"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <input type="hidden" name="name" value={`${fGrade}-${fSuffix}`} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-slate-400 ml-1 font-black tracking-widest">Qolka (Room)</Label>
            <Input name="room" defaultValue={cls?.room} required className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-slate-400 ml-1 font-black tracking-widest">Bedka (Capacity)</Label>
            <Input name="capacity" type="number" defaultValue={cls?.capacity} required className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label className="text-[10px] uppercase text-slate-400 ml-1 font-black tracking-widest">Xilliga (Shift)</Label>
            <select name="shift" defaultValue={cls?.shift || "Morning"} className="w-full h-12 rounded-2xl bg-slate-50 border-none px-3 text-sm font-bold shadow-sm">
              {shifts.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-3">
          <Label className="text-[10px] uppercase text-blue-600 font-black tracking-widest">Dooro Macallimiinta</Label>
          <div className="border rounded-[2rem] overflow-hidden bg-white max-h-[200px] overflow-y-auto shadow-sm">
              <table className="w-full text-sm">
                <tbody className="divide-y font-bold">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 w-10"><input type="checkbox" name="teacherIds" value={t.id} defaultChecked={cls?.teachers?.some(at => at.id === t.id)} className="w-5 h-5 rounded-lg border-slate-200 text-blue-600" /></td>
                      <td className="p-4 uppercase text-xs text-slate-700">{t.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left font-bold">
      {/* HEADER SECTION */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight text-left">Maamulka Fasallada</h1>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1 italic">Habee, abuur, oo maamul dhammaan fasallada dugsiga</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 px-8 font-black text-white flex gap-2 shadow-lg active:scale-95 transition-all">
              <Plus size={18} /> Ku dar Fasal
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
              <DialogTitle className="text-2xl font-black text-slate-800 uppercase text-left">Abuur Fasal Cusub</DialogTitle>
            </DialogHeader>
            <form onSubmit={async (e) => { e.preventDefault(); await addClass(new FormData(e.currentTarget)); setIsAddOpen(false); handleSearch(); }} className="space-y-4 pt-4">
              <ClassForm />
              <Button type="submit" className="w-full bg-blue-600 h-14 rounded-[1.5rem] font-black text-lg text-white shadow-xl shadow-blue-100">Keydi Fasalka</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* MULTI-FILTER BAR */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-[2.2rem] border shadow-xl flex flex-wrap items-end gap-4 ring-1 ring-slate-100 sticky top-4 z-40">
        <div className="flex-1 min-w-[200px] space-y-1.5 text-left">
          <Label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest">1. Heerarka (Dhowr)</Label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-2xl border-none h-auto min-h-[44px]">
             {levels.map(l => (
               <button key={l} onClick={() => toggleFilter(l, selectedLevels, setSelectedLevels)} className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-all ${selectedLevels.includes(l) ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 hover:bg-slate-100'}`}>
                 {l}
               </button>
             ))}
             {selectedLevels.length === 0 && <span className="text-[10px] text-slate-300 ml-2 mt-1">Dhammaan Heerarka</span>}
          </div>
        </div>

        <div className="flex-1 min-w-[200px] space-y-1.5 text-left">
          <Label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest">2. Fasallada (Dhowr)</Label>
          <div className="flex gap-2 bg-slate-50 rounded-2xl px-4 h-11 items-center overflow-x-auto custom-scrollbar">
            <select className="bg-transparent border-none font-bold text-xs w-full outline-none" onChange={(e) => { if(e.target.value) toggleFilter(e.target.value, selectedGrades, setSelectedGrades); e.target.value = ""; }}>
              <option value="">+ Ku dar Fasal</option>
              {availableGrades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="flex gap-1">
              {selectedGrades.map(g => (
                <Badge key={g} className="bg-blue-100 text-blue-700 text-[8px] font-black rounded-lg cursor-pointer hover:bg-rose-50 hover:text-rose-600 uppercase" onClick={() => toggleFilter(g, selectedGrades, setSelectedGrades)}>{g}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[200px] space-y-1.5 text-left">
          <Label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest">3. Xilliyada (Dhowr)</Label>
          <div className="flex gap-1.5 p-2 bg-slate-50 rounded-2xl h-11 items-center px-3">
             {shifts.map(s => (
               <button key={s} onClick={() => toggleFilter(s, selectedShifts, setSelectedShifts)} className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase transition-all ${selectedShifts.includes(s) ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 hover:bg-slate-100'}`}>
                 {s.charAt(0)}
               </button>
             ))}
          </div>
        </div>

        <Button onClick={handleSearch} disabled={loading} className="h-11 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black flex gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200">
          {loading ? <Loader2 className="animate-spin text-white" size={18} /> : <Search size={18} />}
          <span className="text-white uppercase">Raadi</span>
        </Button>
      </div>

      {/* RESULTS GRID */}
      <div className="min-h-[400px]">
        {!hasSearched ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-700">
            <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center relative">
               <School size={100} className="text-slate-200" />
               <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-full animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Fadlan dooro xogta aad rabto inaad aragto</h2>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[2.5rem] border animate-pulse" />)}</div>
        ) : classes.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300 text-center uppercase animate-in fade-in duration-500"><Inbox size={80} /><p className="text-xl mt-4 font-black">Wax xog ah lama helin!</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls) => (
              <div key={cls.id} className="group bg-white rounded-[2.8rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden text-left">
                <div className="flex justify-between items-start relative z-10 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl font-black text-2xl uppercase tracking-tighter">
                      {cls.name.charAt(cls.name.indexOf('-') + 1) || cls.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-xl tracking-tight uppercase leading-none">{cls.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] uppercase px-2 font-black">{cls.shift}</Badge>
                        <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1 font-black"><DoorOpen size={12} className="text-blue-500" /> Qolka {cls.room}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <Dialog><DialogTrigger asChild><Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Pencil size={18} /></Button></DialogTrigger><DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl overflow-hidden"><DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b text-left"><DialogTitle className="text-2xl font-black text-slate-800 uppercase">Cusboonaysii Fasalka</DialogTitle></DialogHeader><form onSubmit={async (e) => { e.preventDefault(); await updateClass(new FormData(e.currentTarget)); handleSearch(); }} className="space-y-4 pt-4 text-left"><input type="hidden" name="id" value={cls.id} /><ClassForm cls={cls} /><Button type="submit" className="w-full bg-blue-600 h-14 rounded-[1.5rem] font-black text-lg text-white shadow-lg">Keydi Isbeddellada</Button></form></DialogContent></Dialog>
                    <Button onClick={async () => { if (confirm(`Ma hubtaa inaad tirtirto fasalka ${cls.name}?`)) { await deleteClass(cls.id); handleSearch(); } }} variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600"><Trash2 size={18} /></Button>
                  </div>
                </div>
                <div className="space-y-6 relative z-10 text-left">
                  <div className="bg-slate-50 p-5 rounded-[2rem] space-y-4 border border-slate-100 shadow-inner"><div className="flex items-center justify-between font-black"><span className="text-[10px] text-slate-400 uppercase tracking-widest">Macallimiinta</span><BookOpen size={14} className="text-blue-500" /></div><div className="flex flex-wrap gap-2">{cls.teachers.map(t => (<div key={t.id} className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span className="text-[10px] font-black text-slate-700 uppercase">{t.name}</span></div>))}</div></div>
                  <div className="space-y-3"><div className="flex justify-between items-end font-black"><div className="flex items-center gap-2 text-[10px] uppercase text-slate-500 tracking-widest"><Users size={14} className="text-blue-500" /> Ardayda</div><span className="text-xs text-slate-800 font-black">{cls._count.students} / {cls.capacity}</span></div><div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner"><div className={`h-full rounded-full transition-all duration-1000 shadow-sm ${(cls._count.students / (cls.capacity || 1)) > 0.9 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} style={{ width: `${(cls._count.students / (cls.capacity || 1)) * 100}%` }} /></div></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}