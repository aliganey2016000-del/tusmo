'use client';

import { useState, ChangeEvent } from "react";
import { Class, Teacher, EducationLevel } from "@prisma/client";
import { addClass, updateClass, deleteClass } from "@/app/actions/classActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  School, DoorOpen, Trash2, Pencil, Plus, 
  Loader2, Search, BookOpen, Inbox, Users, ChevronDown, Check
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// 1. Interfaces
interface ExtendedClass extends Class {
  teachers: Teacher[];
  _count: { students: number };
}

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  icon: React.ElementType;
}

export default function ClassesPage() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  
  const [classes, setClasses] = useState<ExtendedClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

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

  // RAADINTA (Fixed 'any' error)
  const handleSearch = async (signal?: AbortSignal) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevels.length) params.append("levels", selectedLevels.join(","));
      if (selectedGrades.length) params.append("grades", selectedGrades.join(","));
      if (selectedShifts.length) params.append("shifts", selectedShifts.join(","));

      const res = await fetch(`/api/classes?${params.toString()}`, { signal });
      if (res.ok) setClasses(await res.json());
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Fetch error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // TIRTIRISTA (Fixed 'any' error)
  const handleDelete = async (id: string) => {
    if (confirm("Ma hubtaa inaad tirtirto fasalkan?")) {
      try {
        const result = await deleteClass(id);
        if (result?.success) handleSearch();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Cillad ayaa dhacday";
        alert(message);
      }
    }
  };

  const toggleFilter = (item: string, state: string[], setState: (v: string[]) => void) => {
    setState(state.includes(item) ? state.filter(i => i !== item) : [...state, item]);
  };

  const ClassForm = ({ cls }: { cls?: ExtendedClass }) => {
    const [fLevel, setFLevel] = useState<EducationLevel>((cls?.level as EducationLevel) || "Primary");
    const [fGrade, setFGrade] = useState(cls?.name.split('-')[0] || "Grade 1");
    const [fSuffix, setFSuffix] = useState(cls?.name.split('-')[1] || "A");

    return (
      <div className="space-y-6 font-black text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100 shadow-inner">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-slate-400 tracking-widest font-black">1. Heerka</Label>
            <select name="level" value={fLevel} onChange={(e: ChangeEvent<HTMLSelectElement>) => { 
              const val = e.target.value as EducationLevel; 
              setFLevel(val); 
              setFGrade(allGrades[val][0]); 
            }} className="w-full h-12 rounded-2xl bg-white px-3 text-sm font-black shadow-sm outline-none">
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 font-black">
            <Label className="text-[10px] uppercase text-slate-400 tracking-widest">2. Fasalka</Label>
            <select value={fGrade} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFGrade(e.target.value)} className="w-full h-12 rounded-2xl bg-white px-3 text-sm font-black shadow-sm outline-none">
              {allGrades[fLevel as keyof typeof allGrades].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 font-black">
            <Label className="text-[10px] uppercase text-slate-400 tracking-widest">3. Sumadda</Label>
            <select value={fSuffix} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFSuffix(e.target.value)} className="w-full h-12 rounded-2xl bg-white px-3 text-sm font-black shadow-sm outline-none">
              {["A", "B", "C", "D", "E", "F", "G"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <input type="hidden" name="name" value={`${fGrade}-${fSuffix}`} />
        <div className="grid grid-cols-2 gap-4 font-black">
          <div className="space-y-1.5"><Label className="text-[10px] uppercase text-slate-400 tracking-widest">Room</Label><Input name="room" defaultValue={cls?.room} required className="rounded-2xl h-12 bg-slate-50 border-none font-black" /></div>
          <div className="space-y-1.5"><Label className="text-[10px] uppercase text-slate-400 tracking-widest">Capacity</Label><Input name="capacity" type="number" defaultValue={cls?.capacity} required className="rounded-2xl h-12 bg-slate-50 border-none font-black" /></div>
          <div className="space-y-1.5 col-span-2 text-left font-black">
            <Label className="text-[10px] uppercase text-slate-400 tracking-widest">Shift</Label>
            <select name="shift" defaultValue={cls?.shift || "Morning"} className="w-full h-12 rounded-2xl bg-slate-50 px-3 text-sm font-black shadow-sm outline-none">
              {shifts.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-black uppercase">
      {/* HEADER SECTION */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left font-black">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Maamulka Fasallada</h1>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Professional Class Management</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 px-8 font-black text-white flex gap-2 shadow-lg transition-all active:scale-95">
              <Plus size={18} /> Ku dar Fasal
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl max-h-[90vh] overflow-y-auto text-left font-black">
             <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b">
               <DialogTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">Abuur Fasal Cusub</DialogTitle>
             </DialogHeader>
             <form onSubmit={async (e) => { 
                e.preventDefault(); setIsSubmitting(true); 
                try { await addClass(new FormData(e.currentTarget)); setIsAddOpen(false); handleSearch(); } 
                finally { setIsSubmitting(false); } 
              }} className="space-y-6 pt-4 font-black">
                <ClassForm />
                <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 h-14 rounded-2xl font-black text-white text-lg shadow-xl shadow-blue-100">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Keydi Fasalka"}
                </Button>
             </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-[2.2rem] border border-slate-100 shadow-xl flex flex-wrap items-center gap-4 sticky top-4 z-40">
        <MultiSelectDropdown label="Heerarka" options={levels} selected={selectedLevels} onToggle={(v: string) => toggleFilter(v, selectedLevels, setSelectedLevels)} icon={BookOpen} />
        <MultiSelectDropdown label="Fasallada" options={availableGrades} selected={selectedGrades} onToggle={(v: string) => toggleFilter(v, selectedGrades, setSelectedGrades)} icon={School} />
        <MultiSelectDropdown label="Shifts" options={shifts} selected={selectedShifts} onToggle={(v: string) => toggleFilter(v, selectedShifts, setSelectedShifts)} icon={Users} />
        <Button onClick={() => handleSearch()} disabled={loading} className="ml-auto h-12 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black flex gap-2 transition-all active:scale-95 shadow-lg">
          {loading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
          <span>Raadi</span>
        </Button>
      </div>

      {/* RESULTS AREA */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {!hasSearched ? (
          <div className="py-32 text-center space-y-6">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto animate-bounce"><School size={40} className="text-slate-200" /></div>
             <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Raadi fasallada aad rabto</p>
          </div>
        ) : loading ? (
          <div className="p-10 space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 w-full bg-slate-50 animate-pulse rounded-xl" />)}
          </div>
        ) : classes.length === 0 ? (
          <div className="py-32 text-center text-slate-300 font-black">
             <Inbox size={80} className="mx-auto" />
             <p className="mt-4 text-xs uppercase tracking-widest">Ma jiro fasal la helay!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-black">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest">Fasalka</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest text-center font-black">Xilliga</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest text-center font-black">Room</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest">Macallimiinta</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest text-center font-black">Ardayda</th>
                  <th className="p-6 text-[10px] text-slate-400 uppercase tracking-widest text-right">Ficil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-left font-black">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 font-black">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">{cls.name.charAt(0)}</div>
                        <div className="flex flex-col"><span className="text-sm text-slate-800">{cls.name}</span><span className="text-[9px] text-slate-400">{cls.level}</span></div>
                      </div>
                    </td>
                    <td className="p-6 text-center font-black"><Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] px-2.5 py-1 uppercase">{cls.shift}</Badge></td>
                    <td className="p-6 text-center text-[11px] text-slate-500 uppercase font-black"><div className="flex justify-center gap-1.5"><DoorOpen size={14} className="text-blue-500" /> {cls.room}</div></td>
                    <td className="p-6">
                       <div className="flex -space-x-3 hover:space-x-1 transition-all">
                        {cls.teachers.map((t, i) => (
                          <div key={i} title={t.name} className="w-9 h-9 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-[8px] text-blue-600 shadow-sm uppercase cursor-help">{t.name.substring(0,2)}</div>
                        ))}
                       </div>
                    </td>
                    <td className="p-6 font-black text-center">
                       <span className="text-[10px] text-slate-700">{cls._count.students} / {cls.capacity}</span>
                    </td>
                    <td className="p-6 text-right font-black">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all font-black">
                        <Dialog>
                          <DialogTrigger asChild><Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Pencil size={18} /></Button></DialogTrigger>
                          <DialogContent className="rounded-[2.5rem] max-w-2xl border-none shadow-2xl max-h-[90vh] overflow-y-auto font-black text-left">
                             <DialogHeader className="bg-slate-50 -m-6 p-8 mb-4 border-b font-black"><DialogTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">Cusboonaysii</DialogTitle></DialogHeader>
                             <form onSubmit={async (e) => { e.preventDefault(); setIsSubmitting(true); try { await updateClass(new FormData(e.currentTarget)); handleSearch(); } finally { setIsSubmitting(false); } }} className="space-y-6 pt-4 font-black"><input type="hidden" name="id" value={cls.id} /><ClassForm cls={cls} /><Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 h-14 rounded-2xl font-black text-white text-lg">Keydi Isbeddellada</Button></form>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={() => handleDelete(cls.id)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></Button>
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
        <Button variant="outline" className="h-12 w-full md:w-64 justify-between rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase tracking-widest px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Icon size={14} className="text-slate-400" />
            <span className="text-slate-400 font-black">{label}:</span>
            <span className="text-blue-600 truncate max-w-[80px] font-black">{selected.length > 0 ? `${selected.length} la doortay` : "Dhammaan"}</span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 rounded-[1.5rem] border-slate-100 shadow-2xl z-50 font-black">
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